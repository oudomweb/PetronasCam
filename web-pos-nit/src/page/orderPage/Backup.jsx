

import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Checkbox,
} from "antd";
import { formatDateClient, formatDateServer, isPermission, request } from "../../util/helper";
import MainPage from "../../component/layout/MainPage";
import Style from "../../page/orderPage/OrderPage.module.css";
import { configStore } from "../../store/configStore";
import { GrFormView } from "react-icons/gr";
import dayjs from "dayjs";
import { BsSearch } from "react-icons/bs";
import { LuUserRoundSearch } from "react-icons/lu";
import { getProfile } from "../../store/profile.store";
import { FaMoneyBillWave, FaGasPump, FaChartLine, FaPiggyBank, FaPercentage, FaFileInvoice } from "react-icons/fa";

// In-memory checkbox store for Order completion
const orderCheckboxStore = {
  states: new Map(),

  setState(orderId, isCompleted) {
    this.states.set(orderId, isCompleted);
  },

  getState(orderId) {
    return this.states.get(orderId);
  },

  hasState(orderId) {
    return this.states.has(orderId);
  },

  clearStates() {
    this.states.clear();
  }
};

function OrderPage() {
  const { config } = configStore();
  const [formRef] = Form.useForm();
  const [list, setList] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [summary, setSummary] = useState({
    total_amount: 0,
    total_order: 0,
    oil_expense_total: 0
  });
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    description: "",
    status: "",
    parentId: null,
    txtSearch: "",
  });
  const [filter, setFilter] = useState({
    from_date: dayjs(),
    to_date: dayjs(),
    user_id: "",
    timeRange: "1_day",
  });

  const [financeSummary, setFinanceSummary] = useState({
    total_revenue: 0,
    total_cost: 0,
    total_profit: 0,
    total_invoices: 0,
    profit_margin: 0,
    oil_expense_total: 0,
    completed_orders: 0 // New field for completed orders count
  });

  const formatCurrencyString = (value) => {
    const num = parseFloat(value || "0");
    return isNaN(num) ? "0.00" : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "0.00";
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  useEffect(() => {
    const user = getProfile();
    const now = dayjs();
    setFilter({
      from_date: now.startOf("day"),
      to_date: now.endOf("day"),
      user_id: user.id,
      timeRange: "1_day"
    });
  }, []);

  useEffect(() => {
    getList();
  }, [filter.user_id, filter.from_date, filter.to_date]);

  const getList = async () => {
    setLoading(true);
    try {
      const user = getProfile();
      const param = {
        txtSearch: state.txtSearch,
        from_date: formatDateServer(filter.from_date),
        to_date: formatDateServer(filter.to_date),
        user_id: filter.user_id || user.id,
      };

      const res = await request(`order`, "get", param);
      const oilRes = await request(`oil_expense_total/${param.user_id}`, "get", {
        from_date: param.from_date,
        to_date: param.to_date
      });

      const oilExpenseTotal = parseFloat(oilRes?.oil_expense_total || 0);

      if (res && res.list) {
        const orderList = res.list || [];

        // Merge with local checkbox state (prioritize server data)
        const mergedOrders = orderList.map(order => {
          const hasLocalState = orderCheckboxStore.hasState(order.id);
          const localState = orderCheckboxStore.getState(order.id);
          
          return {
            ...order,
            is_completed: hasLocalState ? localState : Boolean(order.is_completed)
          };
        });

        setSummary({
          ...(res.summary || {}),
          oil_expense_total: oilExpenseTotal
        });

        setList(mergedOrders);

        // Clear local state after successful fetch
        orderCheckboxStore.clearStates();

        const totalRevenue = mergedOrders.reduce(
          (sum, order) => sum + parseFloat(order.total_amount || 0),
          0
        );
        const completedCount = mergedOrders.filter(order => order.is_completed).length;
        const otherCosts = totalRevenue * 0.5;
        const totalCost = otherCosts + oilExpenseTotal;
        const profit = totalRevenue - totalCost;
        const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

        setFinanceSummary({
          total_revenue: totalRevenue,
          total_cost: totalCost,
          total_profit: profit,
          total_invoices: mergedOrders.length,
          profit_margin: margin,
          oil_expense_total: oilExpenseTotal,
          completed_orders: completedCount
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch order data");
    } finally {
      setLoading(false);
    }
  };
const handleOrderCheckboxChange = async (orderId, checked) => {
  try {
    orderCheckboxStore.setState(orderId, checked);
    setList(prevList =>
      prevList.map(order =>
        order.id === orderId
          ? { ...order, is_completed: checked }
          : order
      )
    );
    setFinanceSummary(prev => ({
      ...prev,
      completed_orders: checked ? prev.completed_orders + 1 : prev.completed_orders - 1
    }));
    
    // ✅ FIXED: Changed route from 'order/checkBox/completion' to 'order/completion'
    const response = await request('order/completion', 'post', {
      order_id: orderId,
      is_completed: checked
    });
    
    if (!response?.success) {
      // Rollback on failure
      orderCheckboxStore.setState(orderId, !checked);
      setList(prevList =>
        prevList.map(order =>
          order.id === orderId
            ? { ...order, is_completed: !checked }
            : order
        )
      );
      setFinanceSummary(prev => ({
        ...prev,
        completed_orders: checked ? prev.completed_orders - 1 : prev.completed_orders + 1
      }));
      message.error('Failed to update order completion status');
    } else {
      message.success(checked ? 'Order marked as completed' : 'Order marked as incomplete');
    }
  } catch (error) {
    console.error('Order checkbox update error:', error);
    // Rollback on error
    orderCheckboxStore.setState(orderId, !checked);
    setList(prevList =>
      prevList.map(order =>
        order.id === orderId
          ? { ...order, is_completed: !checked }
          : order
      )
    );
    setFinanceSummary(prev => ({
      ...prev,
      completed_orders: checked ? prev.completed_orders - 1 : prev.completed_orders + 1
    }));
    message.error('Failed to update order completion status');
  }
};
  const handleRefreshFromServer = () => {
    orderCheckboxStore.clearStates();
    getList();
    message.info('Refreshed order states from server');
  };
  const handleSearch = () => {
    getList();
  };
  const getOrderDetail = async (data) => {
    setLoading(true);
    try {
      const res = await request("order_detail/" + data.id, "get");
      if (res) {
        setOrderDetail(res.list || []);
        setSelectedOrder(data);
        setState({
          ...state,
          visibleModal: true,
        });
      }
    } catch (error) {
      console.error("Error fetching order details: ", error);
      message.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };
  const onCloseModal = () => {
    formRef.resetFields();
    setState({
      ...state,
      visibleModal: false,
      id: null,
    });
    setSelectedOrder(null);
  };
  const getRowClassName = (record, index) => {
    const baseClass = index % 2 === 0 ? 'even-row' : 'odd-row';
    const isChecked = record.is_completed;
    return isChecked ? `${baseClass} checked-row` : baseClass;
  };
  const columns = [
    {
      key: "No",
      title: <div className="khmer-text1">ល.រ</div>,
      render: (text, record, index) => index + 1,
      width: 60
    },
    {
      key: "order_no",
      title: (
        <div className="table-header">
          <div className="khmer-text">លេខបញ្ជាទិញ</div>
          <div className="english-text">Order No</div>
        </div>
      ),
      dataIndex: "order_no",
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    {
      key: "customer",
      title: (
        <div className={Style.tableHeaderGroup}>
          <div className="khmer-text">អតិថិជន</div>
          <div className={Style.englishText}>Customer</div>
        </div>
      ),
      dataIndex: "customer_name",
      render: (value, data) => (
        <div className={Style.customerCell}>
          <div className={Style.customerName}>{data.customer_name}</div>
          <div className={Style.customerTel}>{data.customer_tel}</div>
          <div className={Style.customerAddress}>{data.customer_address}</div>
        </div>
      )
    },
    {
      key: "Total",
      title: (
        <div className="table-header">
          <div className="khmer-text">សរុប</div>
          <div className="english-text">Total</div>
        </div>
      ),
      dataIndex: "total_amount",
      render: (value) => `$${formatCurrencyString(value)}`,
    },
    {
      key: "Paid",
      title: (
        <div className="table-header">
          <div className="khmer-text">បានបង់</div>
          <div className="english-text">Paid</div>
        </div>
      ),
      dataIndex: "paid_amount",
      render: (value) => (
        <div style={{ color: "green", fontWeight: "bold" }}>
          ${formatCurrencyString(value)}
        </div>
      ),
    },
    {
      key: "Due",
      title: (
        <div className="table-header">
          <div className="khmer-text">នៅសល់</div>
          <div className="english-text">Due</div>
        </div>
      ),
      dataIndex: "Due",
      render: (value, data) => {
        const total = parseFloat(String(data.total_amount || "0").replace(/,/g, ''));
        const paid = parseFloat(String(data.paid_amount || "0").replace(/,/g, ''));
        const due = total - paid;
        return <Tag color="red">${formatCurrency(due)}</Tag>;
      },
    },
    {
      key: "PaymentMethod",
      title: (
        <div className="table-header">
          <div className="khmer-text">វិធីបង់ប្រាក់</div>
          <div className="english-text">Payment Method</div>
        </div>
      ),
      dataIndex: "payment_method",
      render: (value) => <Tag color="green">{value}</Tag>,
    },
    {
      key: "Remark",
      title: (
        <div className="table-header">
          <div className="khmer-text">កំណត់សម្គាល់</div>
          <div className="english-text">Remark</div>
        </div>
      ),
      dataIndex: "remark",
    },
    {
      key: "User",
      title: (
        <div className="table-header">
          <div className="khmer-text">អ្នកប្រើប្រាស់</div>
          <div className="english-text">User</div>
        </div>
      ),
      dataIndex: "create_by",
      render: (value) => <Tag color="pink">{value}</Tag>,
    },
    {
      key: "Order_Date",
      title: (
        <div className="table-header">
          <div className="khmer-text">ថ្ងែទីបញ្ជាទិញ</div>
          <div className="english-text">Order Date</div>
        </div>
      ),
      dataIndex: "order_date",
      render: (value) => formatDateClient(value, "DD/MM/YYYY"),
    },
    {
      key: "delivery_date",
      title: (
        <div className="table-header">
          <div className="khmer-text">ថ្ងៃទីប្រគល់ទំនិញ</div>
          <div className="english-text">Delivery Date</div>
        </div>
      ),
      dataIndex: "delivery_date",
      render: (value) => formatDateClient(value, "DD/MM/YYYY"),
    },
    ...(isPermission("customer.update") ? [{
      key: "completed",
      title: (
        <div className="table-header">
          <div className="khmer-text">បានបញ្ចប់</div>
          <div className="english-text">Completed</div>
        </div>
      ),
      render: (_, record) => (
        <Checkbox
          checked={Boolean(record.is_completed)}
          onChange={(e) =>
            handleOrderCheckboxChange(record.id, e.target.checked)
          }
        />
      ),
      width: 100,
    }] : []),
    {
      key: "Action",
      title: (
        <div className="table-header">
          <div className="khmer-text">សកម្មភាព</div>
          <div className="english-text">Action</div>
        </div>
      ),
      align: "center",
      render: (item, data) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="primary"
              icon={<GrFormView />}
              onClick={() => getOrderDetail(data)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const detailColumns = [
    {
      key: "product_name",
      title: "Product",
      dataIndex: "product_name",
      render: (text, data) => (
        <div style={{ padding: "10px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
          <div style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}>
            {data.product_name}
          </div>
          <div style={{ color: "#777", fontSize: 12 }}>
            {data.category_name}
          </div>
          <div style={{ color: "#777", fontSize: 12, marginTop: 4 }}>
            Unit: {data.unit}
          </div>
        </div>
      )
    },
    {
      key: "total_quantity",
      title: "Qty",
      dataIndex: "total_quantity",
      width: 80,
      render: (text) => (
        <div style={{ textAlign: "center", fontWeight: "bold" }}>
          <Tag color="green">{text}</Tag>
        </div>
      ),
    },
    {
      key: "unit_price",
      title: "Unit Price",
      dataIndex: "price",
      width: 120,
      render: (text) => (
        <div style={{ textAlign: "right", fontWeight: "bold" }}>
          <Tag color="pink">${formatCurrencyString(text)}</Tag>
        </div>
      ),
    },
    {
      key: "grand_total",
      title: "Total",
      dataIndex: "grand_total",
      width: 120,
      render: (text) => (
        <div style={{ textAlign: "right", fontWeight: "bold", color: "#333" }}>
          <Tag color="blue">${formatCurrencyString(text)}</Tag>
        </div>
      ),
    }
  ];

  return (
    <MainPage loading={loading}>
      <div className="pageHeader">
        <Space>
          <div className={Style.summaryContainer}>
            <div className={Style.summaryCard}>
              <div className={Style.summaryIcon}><FaMoneyBillWave /></div>
              <div className={Style.summaryTitle}>ចំណូលសរុប</div>
              <div className={`${Style.summaryValue} ${Style.summaryPositive}`}>
                ${formatCurrencyString(financeSummary.total_revenue)}
              </div>
            </div>

            <div className={Style.summaryCard}>
              <div className={Style.summaryIcon}><FaGasPump /></div>
              <div className={Style.summaryTitle}>ចំណាយប្រេង</div>
              <div className={`${Style.summaryValue} ${Style.summaryNegative}`}>
                ${formatCurrencyString(financeSummary.oil_expense_total)}
              </div>
            </div>

            <div className={Style.summaryCard}>
              <div className={Style.summaryIcon}><FaChartLine /></div>
              <div className={Style.summaryTitle}>ចំណាយសរុប</div>
              <div className={`${Style.summaryValue} ${Style.summaryNegative}`}>
                ${formatCurrencyString(financeSummary.total_cost)}
              </div>
            </div>

            <div className={Style.summaryCard}>
              <div className={Style.summaryIcon}><FaPiggyBank /></div>
              <div className={Style.summaryTitle}>ចំណេញសរុប</div>
              <div className={`${Style.summaryValue} ${Style.summaryPositive}`}>
                ${formatCurrencyString(financeSummary.total_profit)}
              </div>
            </div>

            <div className={Style.summaryCard}>
              <div className={Style.summaryIcon}><FaPercentage /></div>
              <div className={Style.summaryTitle}>អត្រាចំណេញ</div>
              <div className={`${Style.summaryValue} ${Style.summaryNeutral}`}>
                {financeSummary.profit_margin.toFixed(2)}%
              </div>
            </div>

            <div className={Style.summaryCard}>
              <div className={Style.summaryIcon}><FaFileInvoice /></div>
              <div className={Style.summaryTitle}>ចំនួនវិក័យប័ត្រ</div>
              <div className={`${Style.summaryValue} ${Style.summaryNeutral}`}>
                {financeSummary.total_invoices}
              </div>
            </div>

            {isPermission("customer.update") && (
              <div className={Style.summaryCard}>
                <div className={Style.summaryIcon}>✓</div>
                <div className={Style.summaryTitle}>បានបញ្ចប់</div>
                <div className={`${Style.summaryValue} ${Style.summaryNeutral}`}>
                  {financeSummary.completed_orders} / {financeSummary.total_invoices}
                </div>
              </div>
            )}
          </div>
        </Space>

        <Tooltip title="ជ្រើសរើសរយៈពេលដើម្បីស្វែងរកព័ត៌មាន">
          <Select
            style={{ width: 180 }}
            value={filter.timeRange}
            onChange={(value) => {
              const now = dayjs();
              const from = value === "1_week"
                ? now.startOf("day").subtract(6, "day")
                : now.startOf("day");

              const to = now.endOf("day");

              setFilter((prev) => ({
                ...prev,
                timeRange: value,
                from_date: from,
                to_date: to,
              }));
            }}
            placeholder="ជ្រើសរើសរយៈពេល"
          >
            <Select.Option value="1_day">📅 ថ្ងៃនេះ</Select.Option>
            <Select.Option value="1_week">🗓 ៧ថ្ងៃចុងក្រោយ</Select.Option>
          </Select>
        </Tooltip>
      </div>

      <div>
        <Space>
          <Input.Search
            onChange={(e) => setState((p) => ({ ...p, txtSearch: e.target.value }))}
            allowClear
            onSearch={handleSearch}
            placeholder="Search"
          />
          {isPermission("customer.create") && (
            <DatePicker.RangePicker
              allowClear={false}
              value={[filter.from_date, filter.to_date]}
              format={"DD/MM/YYYY"}
              onChange={(value) => {
                if (value && value.length === 2) {
                  setFilter((prev) => ({
                    ...prev,
                    timeRange: "",
                    from_date: value[0].startOf("day"),
                    to_date: value[1].endOf("day")
                  }));
                }
              }}
            />
          )}

          {isPermission("customer.create") && (
            <Select
              style={{ width: 300 }}
              allowClear
              placeholder="Select User"
              value={filter.user_id}
              options={
                (config?.user || []).map((user, index) => ({
                  label: `${index + 1}. ${user.label}`,
                  value: user.value,
                }))
              }
              onChange={(value) => {
                setFilter((prev) => ({
                  ...prev,
                  user_id: value,
                }));
              }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase()) ||
                option?.label?.toLowerCase().includes(input)
              }
              suffixIcon={<LuUserRoundSearch />}
            />
          )}

          <Button type="primary" onClick={handleSearch} icon={<BsSearch />}>
            Filter
          </Button>

          {isPermission("customer.getone") && (
            <Button
              onClick={handleRefreshFromServer}
              danger
              size="small"
            >
              Refresh From Server
            </Button>
          )}
        </Space>
      </div>

      <div className={Style.tableContent}>
        <Table
          dataSource={list}
          columns={columns}
          pagination={false}
          rowKey="id"
          rowClassName={getRowClassName}
          style={{ marginTop: "20px" }}
          summary={(pageData) => {
            let totalAmount = 0;
            pageData.forEach(({ total_amount }) => {
              const value = parseFloat(String(total_amount).replace(/,/g, ''));
              totalAmount += isNaN(value) ? 0 : value;
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    Total Amount:
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} style={{ textAlign: 'left', fontWeight: 'bold' }}>
                    <Tag color="blue">${formatCurrencyString(totalAmount)}</Tag>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} colSpan={8} />
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </div>

      <Modal
        open={state.visibleModal}
        title="Invoice Details"
        footer={[
          <Button key="close" onClick={onCloseModal}>
            Close
          </Button>
        ]}
        onCancel={onCloseModal}
        width={800}
        centered={true}
        destroyOnClose={true}
      >
        <Table
          dataSource={orderDetail}
          columns={detailColumns}
          pagination={false}
          rowKey="id"
          style={{ marginTop: "20px" }}
          rowClassName="table-row-hover"
          summary={(pageData) => {
            let totalAmount = 0;
            pageData.forEach(({ grand_total }) => {
              const value = parseFloat(String(grand_total).replace(/,/g, ''));
              totalAmount += isNaN(value) ? 0 : value;
            });

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    Grand Total:
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} style={{ textAlign: 'right' }}>
                    <Tag color="blue" style={{ fontSize: '16px', padding: '4px 8px' }}>
                      ${formatCurrencyString(totalAmount)}
                    </Tag>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
          bordered
          scroll={{ x: 'max-content' }}
          loading={!orderDetail || orderDetail.length === 0}
        />

        {selectedOrder && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p>
                  <strong>Order No:</strong> {selectedOrder.order_no}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {formatDateClient(selectedOrder.create_at, "DD/MM/YYYY H:mm A")}
                </p>
              </div>
              <div>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  <Tag color="green">{selectedOrder.payment_method}</Tag>
                </p>
                <p>
                  <strong>Paid Amount:</strong>{" "}
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    ${formatCurrencyString(selectedOrder.paid_amount)}
                  </span>
                </p>
                <p>
                  <strong>Due Amount:</strong>{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    $
                    {formatCurrencyString(
                      parseFloat(
                        String(selectedOrder.total_amount || "0").replace(/,/g, "")
                      ) -
                      parseFloat(
                        String(selectedOrder.paid_amount || "0").replace(/,/g, "")
                      )
                    )}
                  </span>
                </p>
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <p>
                <strong>Customer:</strong> {selectedOrder.customer_name}
              </p>
              <p>
                <strong>Tel:</strong> {selectedOrder.customer_tel}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.customer_address}
              </p>
              {selectedOrder.remark && (
                <p>
                  <strong>Remark:</strong> {selectedOrder.remark}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </MainPage>
  );
}

export default OrderPage;
import { useEffect, useState } from "react";
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
} from "antd";
import { formatDateClient, formatDateServer, isPermission, request } from "../../util/helper";
import MainPage from "../../component/layout/MainPage";
import Style from "../../page/orderPage/OrderPage.module.css"
import { configStore } from "../../store/configStore";
import { GrFormView } from "react-icons/gr";
import dayjs from "dayjs";
import { BsSearch } from "react-icons/bs";
import { LuUserRoundSearch } from "react-icons/lu";
import { getProfile } from "../../store/profile.store";

function OrderPage() {
  const { config } = configStore();
  const [formRef] = Form.useForm();
  const [list, setList] = useState([]);
  const [orderDetail, seOrderDetail] = useState([]);
  const [summary, setSummary] = useState({ total_amount: 0, total_order: 0 });
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    descriptoin: "",
    status: "",
    parentId: null,
    txtSearch: "",
  });
  const [filter, setFilter] = useState({
    from_date: dayjs(),
    to_date: dayjs(),
    user_id: "", // Default empty
  });

  // This function fetches the orders list
  // const getList = async () => {
  //   setLoading(true);
  //   try {
  //     // Prepare query parameters for API call
  //     const param = {
  //       txtSearch: state.txtSearch,
  //       from_date: formatDateServer(filter.from_date),
  //       to_date: formatDateServer(filter.to_date),
  //       user_id: filter.user_id || "",  // Send the selected user_id (if any)
  //     };

  //     console.log("API Request Params:", param);
  //     const { id } = getProfile();
  //           if (!id) return;
  //     // Make a single API call to the orders endpoint - use a generic endpoint
  //     // Your backend will handle the authorization logic
  //     const res = await request(`order/${id}`, "get", param);

  //     if (res) {
  //       setList(res.list || []);
  //       setSummary(res.summary || { total_amount: 0, total_order: 0 });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching list: ", error);
  //     message.error("Failed to fetch order data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const getList = async () => {
    setLoading(true);
    try {
      // Prepare query parameters for API call
      const param = {
        txtSearch: state.txtSearch,
        from_date: formatDateServer(filter.from_date),
        to_date: formatDateServer(filter.to_date),
        user_id: filter.user_id || getProfile().id, // Use selected user_id or default to logged-in user
      };


      const res = await request(`order/${param.user_id}`, "get", param);

      if (res) {
        setList(res.list || []);
        setSummary(res.summary || { total_amount: 0, total_order: 0 });
      }
    } catch (error) {
      console.error("Error fetching list: ", error);
      message.error("Failed to fetch order data");
    } finally {
      setLoading(false);
    }
  };


  // Fetch data when filter changes
  useEffect(() => {
    getList();
  }, [filter.user_id, filter.from_date, filter.to_date]);

  // Fetch data when search text changes and search button is clicked
  const handleSearch = () => {
    getList();
  };

  const getOderdetail = async (data) => {
    setLoading(true);
    try {
      const res = await request("order_detail/" + data.id, "get");
      if (res) {
        seOrderDetail(res.list || []);
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
  };

  return (
    <MainPage loading={loading}>
      <div className="pageHeader">
        <Space>
          <div>
            <div style={{ fontWeight: "bold" }}>Order</div>
            <div>Total:
              <Tag color="green">
                {summary?.total_order ?? 0} order
              </Tag>
              <Tag color="blue">
                {summary?.total_amount ?? 0}$
              </Tag>
            </div>
          </div>
          <Input.Search
            onChange={(value) =>
              setState((p) => ({ ...p, txtSearch: value.target.value }))
            }
            allowClear
            onSearch={handleSearch}
            placeholder="Search"
          />
          {isPermission("customer.create") && (
            <DatePicker.RangePicker
              allowClear={false}
              defaultValue={[
                dayjs(filter.from_date, "DD/MM/YYYY"),
                dayjs(filter.to_date, "DD/MM/YYYY")
              ]}
              format={"DD/MM/YYYY"}
              onChange={(value) => {
                if (value && value.length === 2) {
                  setFilter((prev) => ({
                    ...prev,
                    from_date: value[0],
                    to_date: value[1]
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
              options={config?.user || []} // Assuming config.user has list of users
              onChange={(value) => {
                console.log("Selected user ID:", value);
                setFilter((prev) => ({
                  ...prev,
                  user_id: value,
                }));
              }}
              suffixIcon={<LuUserRoundSearch />}
            />

          )}
          <Button type="primary" onClick={handleSearch} icon={<BsSearch />}>
            Filter
          </Button>
        </Space>
      </div>
      <Modal
        open={state.visibleModal}
        title="Invoice Details"
        footer={null}
        onCancel={onCloseModal}
        width={800}
        centered={true}
        destroyOnClose={true}
      >
        <Table
          dataSource={orderDetail}
          columns={[
            {
              key: "product_name",
              title: "Product",
              dataIndex: "product_name",
              render: (text, data) => (
                <div style={{ padding: "10px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                  <div style={{ fontWeight: "bold", fontSize: "16px", color: "#333" }} className="khmer-text">
                    {data.product_name}
                  </div>
                  <div style={{ color: "#777", fontSize: 12 }} className="khmer-text">
                    {data.category_name}
                  </div>
                  <div style={{ color: "#777", fontSize: 12, marginTop: 4 }} className="khmer-text">
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
              dataIndex: "unit_price",
              width: 120,
              render: (text) => {
                const formattedValue = parseFloat(text).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                return (
                  <div style={{ textAlign: "right", fontWeight: "bold" }}>
                    <Tag color="pink">${formattedValue}</Tag>
                  </div>
                );
              },
            },
            // {
            //   key: "discount",
            //   title: "Discount",
            //   dataIndex: "discount",
            //   width: 100,
            //   render: (text) => (
            //     <div style={{ textAlign: "right" }}>
            //       <Tag color="red">{text > 0 ? `${text}%` : '-'}</Tag>
            //     </div>
            //   ),
            // },
            {
              key: "grand_total",
              title: "Total",
              dataIndex: "grand_total",
              width: 120,
              render: (text) => {
                const roundedValue = Math.round(parseFloat(text) || 0);
                const formattedValue = roundedValue.toLocaleString();
                return (
                  <div style={{ textAlign: "right", fontWeight: "bold", color: "#333" }}>
                    <Tag color="blue">${formattedValue}</Tag>
                  </div>
                );
              },
            }
          ]}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
          rowKey="id"
          style={{ marginTop: "20px" }}
          rowClassName="table-row-hover"
          summary={(pageData) => {
            let totalAmount = 0;
            pageData.forEach(({ grand_total }) => {
              totalAmount += parseFloat(grand_total || 0);
            });

            const roundedTotal = Math.round(totalAmount);

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                    Grand Total:
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} style={{ textAlign: 'right' }}>
                    <Tag color="blue" style={{ fontSize: '16px', padding: '4px 8px' }}>
                      ${roundedTotal.toLocaleString()}
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
      </Modal>
      <div>
        <Tag className={Style.Tag_Style}>
          <Table
            dataSource={list}
            columns={[
              {
                key: "order_no",
                title: (
                  <div className="table-header">
                    <div className="khmer-text">លេខបញ្ជា</div>
                    <div className="english-text">Order No</div>
                  </div>
                ),
                dataIndex: "order_no",
                render: (value) => (
                  <div>
                    <Tag color="blue">{value}</Tag>
                  </div>
                ),
              },
              {
                key: "customer",
                title: (
                  <div className="table-header">
                    <div className="khmer-text">អតិថិជន</div>
                    <div className="english-text">Customer</div>
                  </div>
                ),
                dataIndex: "customer_name",
                render: (value, data) => (
                  <>
                    <div style={{ fontWeight: "bold" }}>{data.customer_name}</div>
                    <div>{data.customer_tel}</div>
                    <div>{data.customer_address}</div>
                  </>
                ),
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
                render: (value) => `$${Number(value).toFixed(2)}`,
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
                    ${Number(value).toFixed(2)}
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
                render: (value, data) => (
                  <Tag color="red">
                    ${((Number(data.total_amount) - Number(data.paid_amount)) || 0).toFixed(2)}
                  </Tag>
                ),
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
                render: (value) => (
                  <div style={{ textAlign: "center" }}>
                    <Tag color="green">{value}</Tag>
                  </div>
                ),
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
                render: (value) => (
                  <div>
                    <Tag color="pink">{value}</Tag>
                  </div>
                ),
              },
              {
                key: "Order_Date",
                title: (
                  <div className="table-header">
                    <div className="khmer-text">កាលបរិច្ឆេទបញ្ជាទិញ</div>
                    <div className="english-text">Order Date</div>
                  </div>
                ),
                dataIndex: "create_at",
                render: (value) => formatDateClient(value, "DD/MM/YYYY H:m A"),
              },
              {
                key: "Action",
                title: (
                  <div className="table-header">
                    <div className="khmer-text">សកម្មភាព</div>
                    <div className="english-text">Action</div>
                  </div>
                ),
                align: "center",
                render: (item, data, index) => (
                  <Space>
                    <Button
                      type="primary"
                      icon={<GrFormView />}
                      onClick={() => getOderdetail(data, index)}
                    />
                  </Space>
                ),
              },
            ]}
          />
        </Tag>
      </div>
    </MainPage>
  );
}

export default OrderPage;
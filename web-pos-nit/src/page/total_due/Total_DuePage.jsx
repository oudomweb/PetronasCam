import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { formatDateClient, isPermission, request } from "../../util/helper";
import { MdDelete, MdEdit, MdPayment } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import * as XLSX from "xlsx/xlsx.mjs";
import { BsSearch } from "react-icons/bs";
import { IoIosBook } from "react-icons/io";
import { getProfile } from "../../store/profile.store";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function Total_DuePage() {
  const { config } = configStore();
  const [form] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [createByOptions, setCreateByOptions] = useState([]);
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    visibleModal: false,
    visiblePaymentModal: false,
    is_list_all: false,
    editingRecord: null,
    payingRecord: null,
  });
  const refPage = React.useRef(1);
  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
    customer_id: "",
    selectedCustomer: null,
  });
  const [paymentMethods] = useState([
    { value: 'cash', label: 'Cash' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'mobile_payment', label: 'Mobile Payment' }
  ]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Get current user profile once
  const profile = getProfile();
  const userId = profile?.id;

  useEffect(() => {
    getList();
    // Pre-load customers with dues for payment processing
    loadCustomersWithDues();
  }, []);

  // Function to load customers with dues
  const loadCustomersWithDues = () => {
    // Customer data already loaded via configStore
    // We don't need to do anything else here
  };

  const getList = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const { id } = getProfile();
      if (!id) return;

      // Format the request params correctly
      const requestParams = {
        page: refPage.current,
        search: filter.txt_search,
        category_id: filter.category_id,
        brand: filter.brand,
        customer_id: filter.customer_id
      };

      const res = await request(`gettotal_due/${id}`, "get", requestParams);

      if (res && !res.error) {
        setState((prev) => ({
          ...prev,
          list: res.list,
          total: refPage.current === 1 ? res.total : prev.total,
          loading: false,
        }));
      } else {
        message.error(res?.error || "Failed to fetch data");
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("An error occurred while fetching data");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const onFilter = () => {
    refPage.current = 1;
    getList();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDueAmount = (amount) => {
    try {
      if (amount === null || amount === undefined) return '0.00';
      const num = Number(amount);
      return isNaN(num) ? '0.00' : num.toFixed(2);
    } catch (error) {
      return '0.00';
    }
  };

  const ExportToExcel = (dataList) => {
    if (!dataList || dataList.length === 0) {
      message.warning("No data available to export.");
      return;
    }

    const hideLoadingMessage = message.loading("Exporting...", 0);

    setTimeout(async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Product");




      const titleRow = worksheet.getRow(2); // Start from row 2
      worksheet.mergeCells('B2:S2');
      titleRow.getCell(2).value = 'របាយការណ៍លំអិតបំណុល :';
      titleRow.getCell(2).font = { size: 20, bold: true, family: 'Khmer UI' };
      titleRow.getCell(2).alignment = { horizontal: 'center' };
      const titleSecond = worksheet.getRow(3);
      worksheet.mergeCells('B3:S3');
      titleSecond.getCell(2).value = 'សម្រាប់ថ្ងៃ' + 'ដល់ថ្ងៃ';
      titleSecond.height = 30;

      worksheet.mergeCells('C5:K5');
      worksheet.getCell('C5').value = 'កំនើនកុងត្រា';

      worksheet.mergeCells('B5:B7');
      worksheet.getCell('B5').value = 'ថ្ងៃ​ខែឆ្នាំ';
      worksheet.getColumn('B').width = 20;
      worksheet.getColumn('C').width = 45;
      worksheet.getRow(5).height = 45
      worksheet.getRow(6).height = 45
      worksheet.getRow(7).height = 45
      worksheet.getRow(8).height = 45

      worksheet.mergeCells('C6:C7');
      worksheet.getCell('C6').value = 'លេខប័ណ្ណ';
      worksheet.mergeCells('D6:D7');
      worksheet.getCell('D6').value = 'អ្នកកាន់បូម';
      worksheet.getColumn('D').width = 25;
      worksheet.getColumn('E').width = 25;
      worksheet.mergeCells('E6:E7');
      worksheet.getCell('E6').value = 'ប្រភេទប្រេង';
      worksheet.mergeCells('F6:F7');
      worksheet.getCell('F6').value = 'បរិមាណ';
      worksheet.mergeCells('G6:H6');
      worksheet.getCell('G6').value = 'តម្លៃឯក្កតា';
      worksheet.getCell('G7').value = 'លីត្រ';
      worksheet.getCell('H7').value = 'តោន';
      worksheet.mergeCells('I6:K6');
      worksheet.getCell('I6').value = 'ទឹកប្រាក់សរុប';
      worksheet.getCell('I7').value = 'រៀល';
      worksheet.getCell('J7').value = 'ដុល្លារ';
      worksheet.getCell('K7').value = 'បាត';

      worksheet.getCell('L5').value = 'សងកុងត្រា';



      for (let row = 5; row <= 7; row++) {  // Extend to row 7
        for (let col = 2; col <= 19; col++) {  // Columns B (2) to S (19)
          const cell = worksheet.getCell(row, col);
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' }  // Very light gray color
          };
          cell.border = {
            top: { style: 'thin', color: { argb: 'd2d2d2' } },
            left: { style: 'thin', color: { argb: 'd2d2d2' } },
            bottom: { style: 'thin', color: { argb: 'd2d2d2' } },
            right: { style: 'thin', color: { argb: 'd2d2d2' } }
          };
        }
      }


      for (let rowNum = 1; rowNum <= 30; rowNum++) {
        const row = worksheet.getRow(rowNum);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
      }

      for (let rowNum = 1; rowNum <= 30; rowNum++) {
        worksheet.getRow(rowNum).height = 30;
      }
      titleRow.height = 55;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "Product_Data.xlsx");

      hideLoadingMessage();
      message.success("Export completed successfully!");
    }, 2000);
  };

  // Find customer information by customer name or ID
  const findCustomerByRecord = (record) => {
    if (!record) return null;

    // Try to find the customer in the config
    const customersWithDue = config.customers_with_due || [];

    // First check if there's a direct match by customer_id
    if (record.customer_id) {
      const customer = customersWithDue.find(c => c.value === record.customer_id);
      if (customer) {
        return {
          value: customer.value,
          label: customer.label,
          totalDue: customer.total_due,
          customerName: customer.label
        };
      }
    }

    // If no direct match by ID, try matching by name
    if (record.customer_name) {
      const customer = customersWithDue.find(c => c.label === record.customer_name);
      if (customer) {
        return {
          value: customer.value,
          label: customer.label,
          totalDue: customer.total_due || record.due_amount,
          customerName: customer.label
        };
      }
    }

    // If no match found, create a temporary customer object using the record data
    return {
      value: record.customer_id || '',
      label: record.customer_name || 'Unknown Customer',
      totalDue: record.due_amount || 0,
      customerName: record.customer_name || 'Unknown Customer'
    };
  };

  const onClickPay = (record) => {
    // Find the customer information from the record
    const customerInfo = findCustomerByRecord(record);

    setState((prev) => ({
      ...prev,
      visiblePaymentModal: true,
      payingRecord: record,
    }));

    // Set the selected customer regardless of filter state
    setFilter(prev => ({
      ...prev,
      selectedCustomer: customerInfo
    }));

    paymentForm.setFieldsValue({
      paid_amount: record.due_amount || 0,
      payment_method: 'cash' // Default payment method
    });
  };

  const handlePaymentSubmit = async () => {
    try {
      setPaymentLoading(true);
      const values = await paymentForm.validateFields();
      const { payingRecord } = state;
      const { selectedCustomer } = filter;


      if (!payingRecord) {
        message.error("Please select a record to pay");
        setPaymentLoading(false);
        return;
      }

      // Use the customer from the record if filter.selectedCustomer is not available
      const customer = selectedCustomer || findCustomerByRecord(payingRecord);
      if (!customer || !customer.value) {
        message.error("Customer information is missing");
        setPaymentLoading(false);
        return;
      }

      const paymentData = {
        customer_id: customer.value,
        order_id: payingRecord.id,
        amount: values.paid_amount,
        payment_method: values.payment_method,
        remaining_balance: (customer.totalDue || payingRecord.due_amount) - values.paid_amount,
        notes: values.notes || ''
      };

      const res = await request("order/process-payment", "post", paymentData);
      if (res && !res.error) {
        message.success("Payment processed successfully!");

        setState(prev => ({
          ...prev,
          visiblePaymentModal: false,
          payingRecord: null
        }));
        paymentForm.resetFields();
        getList();
      } else {
        message.error(res?.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      message.error("Failed to process payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePaymentModalCancel = () => {
    setState((prev) => ({
      ...prev,
      visiblePaymentModal: false,
      payingRecord: null,
    }));
    paymentForm.resetFields();
  };

  const paymentModalFooter = [
    <Button key="back" onClick={handlePaymentModalCancel}>
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      loading={paymentLoading}
      onClick={handlePaymentSubmit}
    >
      Process Payment
    </Button>,
  ];

  return (
    <MainPage loading={state.loading}>
      <div className="pageHeader">
        <Space>
          <div>Total Due: {state.total}</div>
          <Input.Search
            onChange={(event) =>
              setFilter((p) => ({ ...p, txt_search: event.target.value }))
            }
            onSearch={onFilter}
            allowClear
            placeholder="Search by name, phone, or order #"
            style={{ width: 300 }}
          />
          <Select
            allowClear
            showSearch
            style={{ width: 300 }}
            placeholder="Select Customer (Name - Due Amount)"
            options={(config.customers_with_due || []).map(customer => ({
              value: customer.value,
              label: `${customer.label} - Due: $${formatDueAmount(customer.total_due)}`,
              totalDue: customer.total_due,
              customerName: customer.label
            }))}
            onChange={(value, option) => {
              setFilter(prev => ({
                ...prev,
                customer_id: value,
                selectedCustomer: option
              }));
              refPage.current = 1;
              getList();
            }}
            onClear={() => {
              setFilter(prev => ({
                ...prev,
                customer_id: "",
                selectedCustomer: null
              }));
              refPage.current = 1;
              getList();
            }}
            filterOption={(input, option) =>

              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="label"
            notFoundContent={<div>No customers with dues found</div>}
          />
          <Button onClick={onFilter} type="primary" icon={<BsSearch />}>
            Filter
          </Button>
        </Space>
        <Button onClick={ExportToExcel} type="primary" icon={<IoIosBook />}>
          Export to Excel
        </Button>
      </div>

      <Table
        className="custom-table"
        rowClassName={() => "pos-row"}
        dataSource={state.list}
        columns={[
          {
            key: "no",
            title: (
              <div>
                <div className="khmer-text">ល.រ</div>
                <div className="english-text">No</div>
              </div>
            ),
            render: (_, __, index) => index + 1,
            width: 60,
          },
          {
            key: "INV_NUMBER",
            title: (
              <div>
                <div className="khmer-text">លេខបញ្ជាទិញ</div>
                <div className="english-text">INV NUMBER</div>
              </div>
            ),
            dataIndex: "INV_NUMBER",
            fixed: 'left',
            width: 150,
          },
          {
            key: "customer_name",
            title: (
              <div>
                <div className="khmer-text">ឈ្មោះអតិថិជន</div>
                <div className="english-text">Customer Name</div>
              </div>
            ),
            dataIndex: "customer_name",
            render: (text) => (
              <div className="truncate-text" title={text || ""}>
                {text || "N/A"}
              </div>
            ),
            width: 200,
          },
          {
            key: "branch_name",
            title: (
              <div>
                <div className="khmer-text">អាសយដ្ឋាន</div>
                <div className="english-text">Address</div>
              </div>
            ),
            dataIndex: "branch_name",
            width: 200,
          },
          {
            key: "tel",
            title: (
              <div>
                <div className="khmer-text">លេខទូរស័ព្ទ</div>
                <div className="english-text">Tel</div>
              </div>
            ),
            dataIndex: "tel",
            width: 120,
          },
          {
            key: "order_date",
            title: (
              <div>
                <div className="khmer-text">កាលបរិច្ឆេទ</div>
                <div className="english-text">Order Date</div>
              </div>
            ),
            dataIndex: "order_date",
            render: (value) => formatDateClient(value, "DD/MM/YYYY H:m A"),
            width: 180,
          },
          {
            key: "due_amount",
            title: (
              <div>
                <div className="khmer-text">តម្លៃជំពាក់</div>
                <div className="english-text">Due Amount</div>
              </div>
            ),
            dataIndex: "due_amount",
            render: (value) => <Tag color="red">{formatCurrency(value)}</Tag>,
            width: 150,
          },
          {
            key: "payment_status",
            title: (
              <div>
                <div className="khmer-text">ស្ថានភាព</div>
                <div className="english-text">Status</div>
              </div>
            ),
            dataIndex: "payment_status",
            render: (status) => {
              let color = 'default';
              let khmerStatus = '';

              if (status === 'Paid') {
                color = 'green';
                khmerStatus = 'បានបង់';
              } else if (status === 'Partial') {
                color = 'orange';
                khmerStatus = 'បង់ខ្លះ';
              } else if (status === 'Unpaid') {
                color = 'red';
                khmerStatus = 'មិនទាន់បង់';
              } else {
                khmerStatus = status; // Fallback for unknown statuses
              }

              return (
                <Tag color={color}>
                  <span className="khmer-text">{khmerStatus}</span>
                  <span className="english-text" style={{ display: 'none' }}>{status}</span>
                </Tag>
              );
            },
            width: 120,
          },
          {

            key: "create_by",
            title: (
              <div>
                <div className="khmer-text">បង្កើតដោយ</div>
                <div className="english-text">Created By</div>
              </div>
            ),
            dataIndex: "create_by",
            width: 150,
          },
          {
            key: "action",
            title: (
              <div className="table-header">
                <div className="khmer-text">សកម្មភាព</div>
                <div className="english-text">Action</div>
              </div>
            ),
            align: "center",
            fixed: 'right',
            width: 100,
            render: (_, record) => (
              <Space>
                <Button
                  type="primary"
                  icon={<MdPayment />}
                  onClick={() => onClickPay(record)}
                />
              </Space>
            ),
          },
        ]}
        scroll={{ x: 1500 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `Total ${total} items`,
          onChange: (page) => {
            refPage.current = page;
            getList();
          }
        }}
        rowKey="id"
        loading={state.loading}
      />

      <Modal
        title={`Payment for ${state.payingRecord?.customer_name || 'Customer'}`}
        visible={state.visiblePaymentModal}
        onOk={handlePaymentSubmit}
        onCancel={handlePaymentModalCancel}
        footer={paymentModalFooter}
        width={600}
      >
        <Form form={paymentForm} layout="vertical">
          <Form.Item label="Order Number">
            <Input
              value={state.payingRecord?.INV_NUMBER || ''}
              disabled
            />
          </Form.Item>

          <Form.Item label="Customer Name">
            <Input
              value={state.payingRecord?.customer_name || ''}
              disabled
            />
          </Form.Item>

          <Form.Item label="Due Amount">
            <Input
              value={formatCurrency(state.payingRecord?.due_amount || 0)}
              disabled
            />
          </Form.Item>

          <Form.Item
            label="Payment Method"
            name="payment_method"
            rules={[{ required: true, message: 'Please select payment method' }]}
          >
            <Select
              placeholder="Select payment method"
              showSearch
              optionFilterProp="label"
            >
              {paymentMethods.map(method => (
                <Select.Option
                  key={method.value}
                  value={method.value}
                >
                  {method.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Amount to Pay"
            name="paid_amount"
            rules={[
              { required: true, message: 'Please enter payment amount' },
              {
                validator: (_, value) => {
                  const maxAmount = Number(state.payingRecord?.due_amount) || 0;
                  if (value <= 0) {
                    return Promise.reject('Amount must be greater than 0');
                  }
                  if (value > maxAmount) {
                    return Promise.reject(`Amount cannot exceed ${formatCurrency(maxAmount)}`);
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0.01}
              max={Number(state.payingRecord?.due_amount) || 0}
              precision={2}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>


          <Form.Item
            label="Notes"
            name="notes"
          >
            <Input.TextArea rows={2} placeholder="Additional payment notes" />
          </Form.Item>
        </Form>
      </Modal>
    </MainPage>
  );
}

export default Total_DuePage;



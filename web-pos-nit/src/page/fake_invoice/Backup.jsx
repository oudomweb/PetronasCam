// import React, { useEffect, useState, useRef, useCallback } from "react";
// import {
//   Button,
//   Form,
//   Input,
//   message,
//   Modal,
//   Select,
//   Space,
//   Table,
//   Tag,
//   DatePicker,
//   InputNumber,
//   Divider,
//   Row,
//   Col,
//   Card,
//   Statistic
// } from "antd";
// import moment from 'moment';
// import dayjs from 'dayjs';
// import { formatDateClient, formatDateServer, isPermission, request } from "../../util/helper";
// import {
//   MdAdd,
//   MdDelete,
//   MdEdit,
//   MdOutlineCreateNewFolder,
//   MdPrint,
//   MdReceipt,
// } from "react-icons/md";
// import MainPage from "../../component/layout/MainPage";
// import { configStore } from "../../store/configStore";
// import "./FakeInvoicePage.css";
// import { getProfile } from "../../store/profile.store";
// import FakeInvoicePrint from "../../component/pos/FakeInvoicePrint";
// import { useReactToPrint } from 'react-to-print';

// function FakeInvoicePage() {
//   const { config } = configStore();
//   const [form] = Form.useForm();
//   const printRef = useRef();

//   // States
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [isPrinting, setIsPrinting] = useState(false);
//   const [printData, setPrintData] = useState(null);
//   const [categoryLoading, setCategoryLoading] = useState(false);
//   const [statistics, setStatistics] = useState({
//     totalInvoices: 0,
//     totalAmount: 0,
//     paidAmount: 0,
//     unpaidAmount: 0,
//     partialAmount: 0
//   });

//   const [state, setState] = useState({
//     visibleModal: false,
//     id: null,
//     txtSearch: "",
//   });

//   // Load all data on mount
//   useEffect(() => {
//     loadAllData();
//   }, []);

//   // Load all required data
//   const loadAllData = async () => {
//     setLoading(true);
//     try {
//       await Promise.allSettled([
//         loadCategories(),
//         loadCustomers(),
//         getList()
//       ]);
//     } catch (error) {
//       message.error("មិនអាចទាញយកទិន្នន័យបានទេ! សូមព្យាយាមម្តងទៀត");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get invoice list
//   const getList = async () => {
//     try {
//       const res = await request("fakeinvoice/group", "get");
//       if (res && !res.error) {
//         setList(res.list || []);
//         calculateStatistics(res.list || []);
//       } else {
//         message.error("មិនអាចទាញយកបញ្ជីវិក្កយបត្របានទេ");
//       }
//     } catch (error) {
//       message.error("កំហុសក្នុងការទាញយកទិន្នន័យ");
//     }
//   };

//   const calculateStatistics = (invoices = []) => {
//     // ✅ group by order_no
//     const grouped = Object.values(invoices.reduce((acc, item) => {
//       const key = item.order_no;
//       if (!acc[key]) {
//         acc[key] = {
//           ...item,
//           total_amount: 0,
//           paid_amount: 0,
//           total_due: 0
//         };
//       }

//       acc[key].total_amount += parseFloat(item.total_amount || 0);
//       acc[key].paid_amount += parseFloat(item.paid_amount || 0);
//       acc[key].total_due += parseFloat(item.total_due || 0);

//       return acc;
//     }, {}));

//     const stats = grouped.reduce((acc, invoice) => {
//       acc.totalInvoices += 1;
//       acc.totalAmount += invoice.total_amount;

//       switch (invoice.payment_status) {
//         case 'Paid':
//           acc.paidAmount += invoice.total_amount;
//           break;
//         case 'Partial':
//           acc.partialAmount += invoice.paid_amount;
//           acc.unpaidAmount += invoice.total_due;
//           break;
//         case 'Unpaid':
//         default:
//           acc.unpaidAmount += invoice.total_amount;
//           break;
//       }

//       return acc;
//     }, {
//       totalInvoices: 0,
//       totalAmount: 0,
//       paidAmount: 0,
//       unpaidAmount: 0,
//       partialAmount: 0
//     });

//     setStatistics(stats);
//   };


//   // Load categories
//   const loadCategories = async () => {
//     setCategoryLoading(true);
//     try {
//       const res = await request(`category/my-group`, "get");
//       if (res && !res.error) {
//         setCategories(res.list || []);
//       }
//     } catch (error) {
//     } finally {
//       setCategoryLoading(false);
//     }
//   };

//   // Load customers
//   const loadCustomers = async () => {
//     try {
//       const res = await request(`customer/my-group`, "get");
//       if (res && !res.error) {
//         setCustomers(res.list || []);
//       }
//     } catch (error) {
//     }
//   };

//   // Handle print functionality
//   const handlePrint = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: `Invoice-${printData?.order_no || 'Unknown'}`,
//     onBeforeGetContent: () => {
//       return new Promise((resolve) => {
//         setIsPrinting(true);
//         setTimeout(() => resolve(), 100);
//       });
//     },
//     onAfterPrint: () => {
//       setIsPrinting(false);
//       setPrintData(null);
//     },
//   });

//   const onClickEdit = async (data) => {
//     setState(prev => ({
//       ...prev,
//       visibleModal: true,
//       id: data.id,
//     }));

//     try {
//       const res = await request(`fakeinvoice/detail/${data.id}`, "get");

//       if (res && res.success && res.items) {
//         const items = res.items.map((item) => ({
//           category_id: item.category_id,
//           quantity: item.quantity,
//           unit_price: item.unit_price,
//           actual_price: item.actual_price
//         }));

//         // Safe date parsing specifically for Ant Design DatePicker
//         const parseDate = (dateString) => {
//           if (!dateString || typeof dateString !== "string" || dateString === "0000-00-00") return null;

//           const clean = dateString.trim();

//           // Try parsing with moment (for Ant Design DatePicker compatibility)
//           try {
//             const parsed = moment(clean);
//             if (parsed.isValid()) {
//               return parsed;
//             }
//           } catch (error) {
//           }

//           return null;
//         };


//         // Get invoice info
//         const invoiceInfo = res.invoice || res.items[0] || data;

//         // Prepare form data with safe date parsing
//         const formData = {
//           id: data.id,
//           order_no: invoiceInfo.order_no || data.order_no,
//           customer_id: invoiceInfo.customer_id || data.customer_id,
//           items,
//           total_amount: invoiceInfo.total_amount || data.total_amount,
//           paid_amount: invoiceInfo.paid_amount || data.paid_amount,
//           payment_method: invoiceInfo.payment_method || data.payment_method,
//           remark: invoiceInfo.remark || data.remark,
//           create_by: invoiceInfo.create_by || data.create_by,
//           total_due: invoiceInfo.total_due || data.total_due,
//           payment_status: invoiceInfo.payment_status || data.payment_status,
//           additional_notes: invoiceInfo.additional_notes || data.additional_notes || "",
//           destination: invoiceInfo.destination || data.destination || "",
//         };

//         // Parse dates safely
//         const dates = {
//           order_date: parseDate(invoiceInfo.order_date || data.order_date),
//           delivery_date: parseDate(invoiceInfo.delivery_date || data.delivery_date),
//           due_date: parseDate(invoiceInfo.due_date || data.due_date),
//           receive_date: parseDate(invoiceInfo.receive_date || data.receive_date),
//         };

//         // Add dates to form data
//         Object.assign(formData, dates);

//         // Set form values
//         form.setFieldsValue(formData);

//       } else {
//         message.error("មិនអាចទាញយកទំនិញសម្រាប់កែប្រែបានទេ!");
//       }

//     } catch (error) {
//       message.error("កំហុសក្នុងការទាញទិន្នន័យ: " + error.message);
//     }
//   };
//   const onClickDelete = async (data) => {
//     Modal.confirm({
//       title: <span className="invoice-khmer-title">លុបវិក្កយបត្រ</span>,
//       content: "តើអ្នកពិតជាចង់លុបវិក្កយបត្រនេះមែនទេ?",
//       okText: <span className="khmer-text">យល់ព្រម</span>,
//       cancelText: <span className="khmer-text">បោះបង់</span>,
//       onOk: async () => {
//         try {
//           const res = await request("fakeinvoice", "delete", {
//             order_no: data.order_no, // 🔄 send order_no instead of id
//           });

//           if (res && !res.error) {
//             message.success("បានលុបដោយជោគជ័យ");
//             // 🔄 remove by order_no
//             setList((prev) => prev.filter((item) => item.order_no !== data.order_no));
//             calculateStatistics();
//           } else {
//             message.error("មិនអាចលុបបានទេ");
//           }
//         } catch (error) {
//           message.error("កំហុសក្នុងការលុប");
//         }
//       },
//     });
//   };


//   const groupedInvoices = Object.values(
//     list.reduce((acc, item) => {
//       const key = item.order_no;

//       if (!acc[key]) {
//         acc[key] = {
//           ...item,
//           quantity: 0,
//           total_amount: 0,
//           paid_amount: 0,
//           total_due: 0,
//           detail_ids: [],
//         };
//       }

//       acc[key].quantity += Number(item.quantity || 0);
//       acc[key].total_amount += parseFloat(item.total_amount || 0);
//       acc[key].paid_amount += parseFloat(item.paid_amount || 0);
//       acc[key].total_due += parseFloat(item.total_due || 0);
//       acc[key].detail_ids.push(item.id);

//       return acc;
//     }, {})
//   );



//   const onCloseModal = () => {
//     form.resetFields();
//     setState(prev => ({
//       ...prev,
//       visibleModal: false,
//       id: null,
//     }));
//   };
//   const modalFooter = (
//     <Space style={{ float: 'right' }}>
//       <Button onClick={onCloseModal}>
//         <span className="invoice-button-text">បោះបង់</span>
//       </Button>
//       <Button
//         type="primary"
//         onClick={() => form.submit()}
//         loading={loading}
//       >
//         <span className="invoice-button-text">
//           {state.id ? "កែសម្រួល" : "រក្សាទុក"}
//         </span>
//       </Button>
//     </Space>
//   );
//   // ✅ Updated onClickPrint function to work with the fixed API
//  // ✅ Fixed onClickPrint function
// const onClickPrint = async (data) => {
//   try {
//     setIsPrinting(true);

//     const customer = customers.find(c => c.id === data.customer_id) || {};

//     const res = await request(`fakeinvoice/detail/${data.id}`, "get");

//     if (res && res.success && res.items) {
//       const items = res.items;

//       // ✅ FINAL FIX: Based on your database showing actual_price = 0.86
//       const cart_list = items.map((item) => {
//         const quantity = parseFloat(item.quantity) || 0;
//         const unit_price = parseFloat(item.unit_price) || 0;
//         const actual_price = parseFloat(item.actual_price);
        
//         // ✅ For your case: 9000 * 0.86 = 7740 (simple multiplication)
//         let line_total = quantity * unit_price;
        
//         // ✅ Handle edge cases to prevent infinity
//         if (!isFinite(line_total) || isNaN(line_total)) {
//           line_total = 0;
//         }

//         // ✅ Debug log to verify calculation
//         console.log(`Item: ${item.category_name}`, {
//           quantity,
//           unit_price, 
//           actual_price,
//           line_total,
//           isFinite: isFinite(line_total)
//         });

//         return {
//           category_name: item.category_name || "Product",
//           cart_qty: quantity,
//           unit_price: unit_price,
//           actual_price: actual_price || 0,
//           line_total: line_total
//         };
//       });

//       // ✅ Calculate totals from the corrected line totals
//       const calculated_total = cart_list.reduce((sum, item) => sum + item.line_total, 0);
//       const total_qty = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

//       const invoiceInfo = res.invoice || items[0] || {};

//       const objSummary = {
//         sub_total: calculated_total,
//         total_qty: total_qty,
//         save_discount: 0,
//         tax: 0,
//         total: invoiceInfo.total_amount || calculated_total,
//         total_paid: invoiceInfo.paid_amount || 0,
//         total_due: invoiceInfo.total_due || (invoiceInfo.total_amount - invoiceInfo.paid_amount),
//         customer_name: invoiceInfo.customer_name || customer.name || data.customer_name || "N/A",
//         customer_address: invoiceInfo.customer_address || customer.address || data.customer_address || "N/A",
//         customer_tel: invoiceInfo.customer_tel || customer.tel || data.customer_tel || "N/A",
//         user_name: invoiceInfo.create_by || data.create_by || getProfile()?.name || "N/A",
//         order_no: invoiceInfo.order_no || data.order_no || "N/A",
//         order_date: invoiceInfo.order_date ? new Date(invoiceInfo.order_date) : new Date(),
//         delivery_date: invoiceInfo.delivery_date ? new Date(invoiceInfo.delivery_date) : null,
//         receive_date: invoiceInfo.receive_date ? new Date(invoiceInfo.receive_date) : null,
//         destination: invoiceInfo.destination || data.destination || "N/A",
//         payment_method: invoiceInfo.payment_method || data.payment_method || "N/A",
//         payment_status: invoiceInfo.payment_status || data.payment_status || "Unpaid",
//         remark: invoiceInfo.remark || data.remark || "N/A",
//         additional_notes: invoiceInfo.additional_notes || data.additional_notes || "N/A"
//       };

//       setPrintData({
//         objSummary,
//         cart_list,
//         selectedLocations: [],
//         ...data
//       });

//       setTimeout(() => handlePrint(), 200);

//     } else {
//       message.error("មិនអាចរកឃើញទិន្នន័យផលិតផលសម្រាប់វិក្កយបត្រនេះទេ");
//       setIsPrinting(false);
//     }

//   } catch (error) {
//     message.error("មិនអាចរៀបចំការបោះពុម្ពបានទេ: " + error.message);
//     setIsPrinting(false);
//   }
// };

//   const onClickAddBtn = () => {
//     setState(prev => ({
//       ...prev,
//       visibleModal: true,
//       id: null,
//     }));
//     form.resetFields();
//     form.setFieldsValue({
//       order_no: "",
//       payment_status: "Unpaid",
//       order_date: moment(), // Current date as moment object
//       delivery_date: null,  // Explicitly null
//       due_date: null,       // Explicitly null
//       receive_date: null,   // Explicitly null
//       items: [{ quantity: 1, unit_price: 0 }],
//       total_amount: 0,
//       paid_amount: 0,
//       total_due: 0,
//       additional_notes: "",
//       destination: "",
//       payment_method: "",
//       remark: "",
//     });
//   };


//   const onFinish = async (values) => {
//     try {
//       const user_id = getProfile()?.id;
//       if (!values.order_no) {
//         message.error("សូមបញ្ចូលលេខវិក្កយបត្រ");
//         return;
//       }

//       if (!values.customer_id) {
//         message.error("សូមជ្រើសរើសអតិថិជន");
//         return;
//       }

//       if (!values.items || values.items.length === 0) {
//         message.error("សូមបន្ថែមមុខទំនិញយ៉ាងហោចណាស់មួយ");
//         return;
//       }

//       for (let i = 0; i < values.items.length; i++) {
//         const item = values.items[i];
//         if (!item.category_id || !item.quantity || !item.unit_price) {
//           message.error(`សូមបំពេញព័ត៌មានពេញលេញសម្រាប់មុខទំនិញទី ${i + 1}`);
//           return;
//         }
//       }

//       const items = values.items.map((item) => {
//         const category = categories.find(cat => cat.id === item.category_id);
//         if (!category) {
//           throw new Error(`ប្រភេទមុខទំនិញមិនត្រូវបានរកឃើញ: ${item.category_id}`);
//         }
//         const actual_price = category.actual_price || 0; // ✅ Default to 0, not 1
//         return {
//           category_id: item.category_id,
//           category_name: category.name || "Product",
//           quantity: parseInt(item.quantity) || 0,
//           unit_price: parseFloat(item.unit_price) || 0,
//           actual_price,
//         };
//       });

//       const total_amount = parseFloat(values.total_amount) || 0;
//       const paid_amount = parseFloat(values.paid_amount) || 0;

//       let payment_status = "Unpaid";
//       if (paid_amount >= total_amount && total_amount > 0) {
//         payment_status = "Paid";
//       } else if (paid_amount > 0) {
//         payment_status = "Partial";
//       }

//       const payload = {
//         order_no: values.order_no,
//         customer_id: values.customer_id,
//         items,
//         total_amount,
//         paid_amount,
//         payment_status,
//         payment_method: values.payment_method || "",
//         remark: values.remark || "",
//         create_by: values.create_by || getProfile()?.name || "",
//         order_date: formatDateServer(values.order_date),
//         delivery_date: formatDateServer(values.delivery_date),
//         due_date: formatDateServer(values.due_date),
//         receive_date: formatDateServer(values.receive_date),
//         destination: values.destination || "",
//         additional_notes: values.additional_notes || "",
//         user_id
//       };

//       if (state.id) {
//         payload.id = state.id;
//       }

//       const method = payload.id ? "put" : "post";
//       const res = await request("fakeinvoice", method, payload);

//       if (res && res.success && !res.error) {
//         message.success(res.message || "បានរក្សាទុកដោយជោគជ័យ");
//         await getList(); // Refresh the list
//         onCloseModal();
//       } else {
//         message.error(res?.message || res?.error || "មិនអាចរក្សាទុកបានទេ");
//       }
//     } catch (error) {
//       message.error("កំហុសក្នុងការរក្សាទុក: " + error.message);
//     }
//   };


//   const DatePickerComponent = ({ name, label, placeholder }) => (
//     <Form.Item
//       name={name}
//       label={<div className="invoice-form-label">{label}</div>}
//     >
//       <DatePicker
//         style={{ width: '100%' }}
//         format="DD/MM/YYYY"
//         placeholder={placeholder}
//         allowClear
//         showToday
//         disabledDate={() => false}
//       />
//     </Form.Item>
//   );
//   const calculateTotalAmount = useCallback(() => {
//     const items = form.getFieldValue('items') || [];
//     let totalAmount = 0;

//     items.forEach((item, index) => {
//       if (item && item.quantity && item.unit_price && item.category_id) {
//         const category = categories.find(cat => cat.id === item.category_id);
//         const actualPrice = category?.actual_price || 0; // Default to 0, not 1

//         let itemTotal;

//         // ✅ Match the backend logic exactly
//         if (actualPrice === 0) {
//           // Simple case: quantity × unit_price
//           itemTotal = item.quantity * item.unit_price;
//         } else {
//           // Conversion case: (quantity × unit_price) ÷ actual_price
//           itemTotal = (item.quantity * item.unit_price) / actualPrice;
//         }

//         totalAmount += itemTotal;
//       }
//     });

//     const paidAmount = form.getFieldValue('paid_amount') || 0;
//     const totalDue = totalAmount - paidAmount;

//     let paymentStatus = "Unpaid";
//     if (paidAmount >= totalAmount && totalAmount > 0) {
//       paymentStatus = "Paid";
//     } else if (paidAmount > 0) {
//       paymentStatus = "Partial";
//     }

//     form.setFieldsValue({
//       total_amount: parseFloat(totalAmount.toFixed(2)),
//       total_due: parseFloat(totalDue.toFixed(2)),
//       payment_status: paymentStatus
//     });
//   }, [form, categories]);




//   return (
//     <MainPage loading={loading}>
//       {/* Hidden print component */}
//       <div style={{ display: "none" }}>
//         {printData && (
//           <FakeInvoicePrint
//             ref={printRef}
//             objSummary={printData.objSummary}
//             cart_list={printData.cart_list}
//             selectedLocations={printData.selectedLocations}
//           />
//         )}
//       </div>

//       {/* Header */}
//       <div className="pageHeader">
//         <Space>
//           <div className="invoice-khmer-title">បញ្ជីវិក្កយបត្រ</div>
//           <Input.Search
//             onChange={(e) => setState(prev => ({ ...prev, txtSearch: e.target.value }))}
//             allowClear
//             onSearch={getList}
//             placeholder="ស្វែងរកតាមលេខវិក្កយបត្រ ឬ ឈ្មោះអតិថិជន..."
//             className="invoice-input"
//             style={{ width: 300 }}
//           />
//         </Space>
//         <Button type="primary" onClick={onClickAddBtn} icon={<MdOutlineCreateNewFolder />}>
//           វិក្កយបត្រថ្មី
//         </Button>
//       </div>
//       <Modal
//         open={state.visibleModal}
//         title={<div className="invoice-modal-title">{state.id ? "កែសម្រួលវិក្កយបត្រ" : "វិក្កយបត្រថ្មី"}</div>}
//         footer={modalFooter} // Use the footer from the artifact
//         onCancel={onCloseModal}
//         width={1000}
//         destroyOnClose
//       >
//         <Form layout="vertical" onFinish={onFinish} form={form}>
//           <Form.Item name="id" hidden>
//             <Input />
//           </Form.Item>

//           {/* Basic Info */}
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="order_no"
//                 label={<div className="invoice-form-label">លេខវិក្កយបត្រ</div>}
//                 rules={[{ required: true, message: "សូមបញ្ចូលលេខវិក្កយបត្រ!" }]}
//               >
//                 <Input
//                   placeholder="បញ្ចូលលេខវិក្កយបត្រ"
//                   className="invoice-input"
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="customer_id"
//                 label={<div className="invoice-form-label">អតិថិជន</div>}
//                 rules={[{ required: true, message: "សូមជ្រើសរើសអតិថិជន!" }]}
//               >
//                 <Select
//                   placeholder="ជ្រើសរើសអតិថិជន"
//                   showSearch
//                   optionFilterProp="children"
//                   className="invoice-select"
//                   options={customers.map((customer, index) => ({
//                     label: `${index + 1}. ${customer.name}`,
//                     value: customer.id
//                   }))}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>
//           <Divider orientation="left">
//             <div className="invoice-form-label">ព័ត៌មានផលិតផល</div>
//           </Divider>

//           <Form.List name="items">
//             {(fields, { add, remove }) => (
//               <>
//                 {fields.map(({ key, name, ...restField }) => (
//                   <Row gutter={16} key={key} style={{ marginBottom: 16 }}>
//                     <Col span={8}>
//                       <Form.Item
//                         {...restField}
//                         name={[name, 'category_id']}
//                         label="ប្រភេទផលិតផល"
//                         rules={[{ required: true, message: 'ជ្រើសរើសប្រភេទ' }]}
//                       >
//                         <Select
//                           placeholder="ជ្រើសរើសប្រភេទ"
//                           options={categories.map((c) => ({
//                             label: c.name,
//                             value: c.id
//                           }))}
//                           onChange={(value) => {
//                             const selected = categories.find(cat => cat.id === value);
//                             if (selected?.actual_price) {
//                               form.setFieldValue(['items', name, 'actual_price'], selected.actual_price);
//                             }
//                             calculateTotalAmount();
//                           }}
//                         />
//                       </Form.Item>
//                     </Col>

//                     <Col span={4}>
//                       <Form.Item
//                         {...restField}
//                         name={[name, 'quantity']}
//                         label="បរិមាណ"
//                         rules={[{ required: true, message: 'បញ្ចូលបរិមាណ' }]}
//                       >
//                         <InputNumber
//                           min={1}
//                           style={{ width: '100%' }}
//                           onChange={calculateTotalAmount}
//                         />
//                       </Form.Item>
//                     </Col>

//                     <Col span={4}>
//                       <Form.Item
//                         {...restField}
//                         name={[name, 'unit_price']}
//                         label="តម្លៃតោន"
//                         rules={[{ required: true, message: 'បញ្ចូលតម្លៃ' }]}
//                       >
//                         <InputNumber
//                           min={0}
//                           style={{ width: '100%' }}
//                           onChange={calculateTotalAmount}
//                         />
//                       </Form.Item>
//                     </Col>

//                     <Col span={4}>
//                       <Form.Item
//                         {...restField}
//                         name={[name, 'actual_price']}
//                         label="មេចែក"
//                       >
//                         <InputNumber disabled style={{ width: '100%' }} />
//                       </Form.Item>
//                     </Col>

//                     <Col span={4}>
//                       <Button
//                         danger
//                         onClick={() => {
//                           remove(name);
//                           calculateTotalAmount();
//                         }}
//                         style={{ marginTop: 30 }}
//                       >
//                         លុប
//                       </Button>
//                     </Col>
//                   </Row>
//                 ))}
//                 <Form.Item>
//                   <Button type="dashed" onClick={() => add()} block>
//                     បន្ថែមមុខទំនិញ
//                   </Button>
//                 </Form.Item>
//               </>
//             )}
//           </Form.List>
//           <Row>
//           </Row>
//           <Row gutter={16}>
//             <Col span={12}>
//               <DatePickerComponent
//                 name="order_date"
//                 label="ថ្ងៃបញ្ជាទិញ"
//                 placeholder="ជ្រើសរើសថ្ងៃបញ្ជាទិញ"
//               />
//             </Col>
//             <Col span={12}>
//               <DatePickerComponent
//                 name="delivery_date"
//                 label="ថ្ងៃប្រគល់ទំនិញ"
//                 placeholder="ជ្រើសរើសថ្ងៃដឹកជញ្ជូន"
//               />
//             </Col>
//           </Row>




//           <Row gutter={16}>


//             <Col span={12}>
//               <Form.Item
//                 name="destination"
//                 label={<div className="invoice-form-label">គោលដៅ</div>}
//                 tooltip="បញ្ចូលទីតាំងគោលដៅ ដឹកជញ្ជូន"
//               >
//                 <Input placeholder="ឧ. រោងចក្រ A / ផ្ទះលេខ xx" className="invoice-input" />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item name="remark" label={<div className="invoice-form-label">កំណត់ចំណាំ</div>}>
//                 <Input.TextArea placeholder="Enter remarks" rows={3} className="invoice-input" />
//               </Form.Item>


//             </Col>

//           </Row>

//         </Form>

//       </Modal>

//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={6}>
//           <Card>
//             <Statistic
//               title={<div className="invoice-khmer-title">វិក្កយបត្រសរុប</div>}
//               value={statistics.totalInvoices}
//               prefix={<MdReceipt />}
//             />
//           </Card>
//         </Col>
//         <Col span={6}>
//           <Card>
//             <Statistic
//               title={<div className="invoice-khmer-title">ចំនួនសរុប</div>}
//               value={statistics.totalAmount}
//               precision={2}
//               prefix="$"
//               valueStyle={{ color: '#3f8600' }}
//             />
//           </Card>
//         </Col>

//       </Row>

//       <Table
//         dataSource={groupedInvoices.filter(item => {
//           const text = state.txtSearch.toLowerCase();
//           return (
//             item.order_no?.toLowerCase().includes(text) ||
//             item.customer_name?.toLowerCase().includes(text)
//           );
//         })}

//         rowKey="id"
//         scroll={{ x: 1400 }}
//         pagination={false}
//         loading={loading}
//         columns={[
//           {
//             key: "No",
//             title: <div className="delivery-table-header">លេខ</div>,
//             render: (item, data, index) => index + 1,
//             width: 70,
//             fixed: 'left'
//           },
//           {
//             key: "order_no",
//             title: <div className="delivery-table-header">លេខវិក្កយបត្រ</div>,
//             dataIndex: "order_no",
//             width: 150,
//             fixed: 'left'
//           },
//           {
//             key: "customer_name",
//             title: <div className="delivery-table-header">អតិថិជន</div>,
//             dataIndex: "customer_name",
//             render: (text) => <div className="khmer-text">{text}</div>,
//             width: 150,
//           },
//           {
//             key: "customer_address",
//             title: <div className="delivery-table-header">អាសយដ្ឋាន</div>,
//             dataIndex: "customer_address",
//             render: (text) => <div className="invoice-khmer-text">{text}</div>,
//             width: 150,
//           },
//           {
//             key: "customer_tel",
//             title: <div className="delivery-table-header">លេខទូរស័ព្ទ</div>,
//             dataIndex: "customer_tel",
//             render: (text) => <div className="delivery-khmer-text">{text}</div>,
//             width: 150,
//           },



//           {
//             key: "total_amount",
//             title: <div className="delivery-table-header">ចំនួនសរុប</div>,
//             dataIndex: "total_amount",
//             render: (amount) =>
//               `$${parseFloat(amount || 0).toLocaleString(undefined, {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//               })}`,
//             width: 120,
//           }
//           ,

//           {
//             key: "order_date",
//             title: <div className="delivery-table-header">ថ្ងៃបញ្ជាទិញ</div>,
//             dataIndex: "order_date",
//             render: (date) => date ? formatDateClient(date, "DD/MM/YYYY") : "",
//             width: 120,
//           },
//           {
//             key: "delivery_date",
//             title: <div className="delivery-table-header">ថ្ងៃដឹកជញ្ជូន</div>,
//             dataIndex: "delivery_date",
//             render: (date) => date ? formatDateClient(date, "DD/MM/YYYY") : "",
//             width: 120,
//           },
//           {
//             key: "create_by",
//             title: <div className="delivery-table-header">អ្នកបង្កើត</div>,
//             dataIndex: "create_by",
//             render: (text) => (
//               <Tag color="blue" className="delivery-khmer-text">
//                 {text}
//               </Tag>
//             ),
//             width: 120,
//           }
//           ,
//           {
//             key: "additional_notes",
//             title: <div className="delivery-table-header">ចំណាំពិសេស</div>,
//             dataIndex: "additional_notes",
//             render: (text) => <div className="khmer-text">{text}</div>,
//             width: 150,
//           },
//           {
//             key: "action",
//             title: <div className="delivery-table-header">សកម្មភាព</div>,
//             render: (item, data) => (
//               <Space>
//                 {isPermission("customer.getone") && (
//                   <Button
//                     size="small"
//                     type="primary"
//                     icon={<MdEdit />}
//                     onClick={() => onClickEdit(data)}
//                     title="Edit Invoice"
//                   />
//                 )}

//                 <Button
//                   size="small"
//                   type="default"
//                   icon={<MdPrint />}
//                   onClick={() => onClickPrint(data)}
//                   loading={isPrinting}
//                   title="Print Invoice"
//                   style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' }}
//                 />

//                 {isPermission("customer.getone") && (
//                   <Button
//                     size="small"
//                     danger
//                     icon={<MdDelete />}
//                     onClick={() => onClickDelete(data)}
//                     title="Delete Invoice"
//                   />
//                 )}
//               </Space>
//             ),
//             width: 200,
//             fixed: 'right',
//           },
//         ]}

//         summary={(pageData) => {
//           const totalAmount = pageData.reduce((sum, record) => sum + parseFloat(record.total_amount || 0), 0);
//           const totalPaid = pageData.reduce((sum, record) => sum + parseFloat(record.paid_amount || 0), 0);
//           const totalDue = pageData.reduce((sum, record) => sum + parseFloat(record.total_due || 0), 0);

//           return (
//             <Table.Summary fixed>
//               <Table.Summary.Row>


//               </Table.Summary.Row>
//             </Table.Summary>
//           );
//         }}
//       />
//     </MainPage>
//   );
// }

// export default FakeInvoicePage;
























// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Table,
//   Tag,
//   DatePicker,
//   Space,
//   Input,
//   Card,
//   Typography,
//   Descriptions,
//   Modal,
//   Select,
//   message,
//   Image,
//   List,
//    Row, Col
// } from "antd";
// import { PrinterOutlined } from '@ant-design/icons';
// import moment from 'moment';
// import { IoEyeOutline } from 'react-icons/io5';
// import { formatDateClient, request } from "../../util/helper";
// import MainPage from "../../component/layout/MainPage";
// import { getProfile } from "../../store/profile.store";
// import './PaymentHistoryPage.css';
// import { Config } from "../../util/config";

// const { RangePicker } = DatePicker;
// const { Title } = Typography;
// const { Option } = Select;
// const khmerStyles = `
//   @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@300;400;500;600;700&display=swap');
  
//   .khmer-font {
//     font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
//     font-weight: 400;
//   }
  
//   .khmer-font-bold {
//     font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
//     font-weight: 600;
//   }
  
//   .payment-history-container .ant-table-thead > tr > th {
//     font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
//     font-weight: 600;
//   }
  
//   .payment-history-container .ant-table-tbody > tr > td {
//     font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
//   }
  
//   .payment-history-container .ant-btn {
//     font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
//   }
  
//   .payment-history-container .ant-input {
//     font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
//   }
  
//   .payment-history-container .ant-select-selection-item {
//     font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
//   }
  
//   .payment-history-container .ant-tag {
//     font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
//   }
  
//   .payment-history-container .ant-modal-title {
//     font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
//     font-weight: 600;
//   }
  
//   .payment-history-container .ant-descriptions-item-label {
//     font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
//     font-weight: 500;
//   }
  
//   .payment-history-container .ant-descriptions-item-content {
//     font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
//   }
// `;

// function PaymentHistoryPage() {
//   const [state, setState] = useState({
//     payments: [],
//     consolidatedCustomers: [],
//     loading: false,
//     total: 0,
//     error: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState({
//     search: "",
//     dateRange: null,
//     payment_method: ""
//   });
//   useEffect(() => {
//     const styleElement = document.createElement('style');
//     styleElement.textContent = khmerStyles;
//     document.head.appendChild(styleElement);

//     return () => {
//       document.head.removeChild(styleElement);
//     };
//   }, []);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//   });

//   const profile = getProfile();
//   const userId = profile?.id;

//   useEffect(() => {
//     getPaymentHistory();

//     // Set default date range to last 30 days using moment
//     const defaultEndDate = moment();
//     const defaultStartDate = moment().subtract(30, 'days');

//     setFilter(prev => ({
//       ...prev,
//       dateRange: [defaultStartDate, defaultEndDate]
//     }));
//   }, []);

//   // Fixed Function to consolidate customers by name, phone, or email
//   const consolidateCustomers = (payments) => {
//     const customerMap = new Map();

//     payments.forEach(payment => {
//       const key = `${payment.customer_name || ''}-${payment.customer_phone || ''}-${payment.customer_email || ''}`;

//       if (customerMap.has(key)) {
//         const existing = customerMap.get(key);
//         existing.payments.push(payment);
//         existing.totalAmount += parseFloat(payment.amount || 0);
//         existing.paymentCount = existing.payments.length; // Fixed: properly count payments
//       } else {
//         customerMap.set(key, {
//           customer_name: payment.customer_name,
//           customer_phone: payment.customer_phone,
//           customer_email: payment.customer_email,
//           payments: [payment],
//           totalAmount: parseFloat(payment.amount || 0),
//           paymentCount: 1
//         });
//       }
//     });

//     return Array.from(customerMap.values());
//   };

//   const getPaymentHistory = async () => {
//     try {
//       setState(prev => ({ ...prev, loading: true, error: null }));

//       const params = {
//         page: pagination.current,
//         limit: pagination.pageSize,
//         search: filter.search,
//         payment_method: filter.payment_method,
//         ...(filter.dateRange && {
//           from_date: filter.dateRange[0]?.format('YYYY-MM-DD'),
//           to_date: filter.dateRange[1]?.format('YYYY-MM-DD')
//         })
//       };

//       const res = await request(`payment/history/my-group`, "get", params);

//       if (res?.success) {
//         const consolidatedCustomers = consolidateCustomers(res.data.list);

//         setState({
//           payments: res.data.list,
//           consolidatedCustomers: consolidatedCustomers,
//           loading: false,
//           total: res.data.pagination.total,
//           error: null
//         });
//       } else {
//         throw new Error(res?.error || "Failed to load payment history");
//       }
//     } catch (error) {
//       console.error("Error loading payment history:", error);
//       setState(prev => ({
//         ...prev,
//         loading: false,
//         error: error.message
//       }));
//       message.error(error.message);
//     }
//   };

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(value || 0);
//   };

//   const handleTableChange = (pagination) => {
//     setPagination(pagination);
//     getPaymentHistory();
//   };

//   // Enhanced Print function for customer payment history with Khmer translations
//   const printCustomerPaymentReport = (customerData) => {
//     const { customer_name, customer_phone, customer_email, payments } = customerData;
//     const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);



//     const printContent = `
//     <html>
//       <head>
//         <title>របាយការណ៍ការទូទាត់អតិថិជន</title>
//         <style>
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }
          
//           body { 
//             font-family: 'Khmer OS Siemreap', 'Khmer OS', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//             line-height: 1.4;
//             color: #333;
//             background: white !important;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }

//           .print-container {
//             max-width: 800px;
//             margin: 0 auto;
//             padding: 20px;
//             background: white !important;
//           }

//           .header { 
//             text-align: center; 
//             border-bottom: 3px solid #2c3e50;
//             padding-bottom: 20px; 
//             margin-bottom: 30px;
//             background: white !important;
//           }

//           .header h1 {
//             font-size: 28px;
//             color: #2c3e50;
//             margin-bottom: 8px;
//             font-weight: 600;
//           }

//           .header .subtitle {
//             font-size: 14px;
//             color: #7f8c8d;
//             font-weight: normal;
//           }

//           .customer-section {
//             margin-bottom: 30px;
//             background: white !important;
//           }

//           .section-title {
//             font-size: 18px;
//             font-weight: 600;
//             color: #2c3e50;
//             margin-bottom: 15px;
//             padding-bottom: 8px;
//             border-bottom: 2px solid #ecf0f1;
//           }

//           .customer-grid {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 15px;
//             margin-bottom: 20px;
//           }

//           .info-item {
//             display: flex;
//             align-items: center;
//           }

//           .info-label {
//             font-weight: 600;
//             color: #34495e;
//             min-width: 120px;
//             margin-right: 10px;
//           }

//           .info-value {
//             color: #2c3e50;
//             flex: 1;
//           }

//           .payments-section {
//             margin-top: 30px;
//             background: white !important;
//           }

//           .payment-card {
//             border: 1px solid #ddd;
//             margin-bottom: 20px;
//             border-radius: 8px;
//             overflow: hidden;
//             background: white !important;
//             box-shadow: none !important;
//           }

//           .payment-header {
//             background: #34495e !important;
//             color: white !important;
//             padding: 12px 16px;
//             font-weight: 600;
//             font-size: 14px;
//           }

//           .payment-body {
//             padding: 16px;
//             background: white !important;
//           }

//           .payment-grid {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 12px;
//             margin-bottom: 12px;
//           }

//           .payment-row {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 6px 0;
//             border-bottom: 1px dotted #ddd;
//           }

//           .payment-row:last-child {
//             border-bottom: none;
//             margin-top: 8px;
//             padding-top: 12px;
//           }

//           .payment-label {
//             font-weight: 500;
//             color: #7f8c8d;
//             font-size: 13px;
//           }

//           .payment-value {
//             font-weight: 500;
//             color: #2c3e50;
//             text-align: right;
//           }

//           .amount-highlight {
//             font-size: 16px !important;
//             font-weight: 700 !important;
//             color: #27ae60 !important;
//           }

//           .method-tag {
//             display: inline-block;
//             padding: 4px 8px;
//             border-radius: 4px;
//             font-size: 11px;
//             font-weight: 600;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//           }

//           .method-cash { 
//             background: #d5f4e6 !important; 
//             color: #27ae60 !important; 
//             border: 1px solid #27ae60;
//           }
          
//           .method-card { 
//             background: #dae8fc !important; 
//             color: #3498db !important; 
//             border: 1px solid #3498db;
//           }
          
//           .method-transfer { 
//             background: #fdeaa7 !important; 
//             color: #f39c12 !important; 
//             border: 1px solid #f39c12;
//           }

//           .summary-section {
//             margin-top: 30px;
//             padding: 20px;
//             border: 2px solid #34495e;
//             border-radius: 8px;
//             background: white !important;
//           }

//           .summary-grid {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 15px;
//             margin-top: 15px;
//           }

//           .summary-item {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 8px 0;
//           }

//           .summary-label {
//             font-weight: 600;
//             color: #34495e;
//           }

//           .summary-value {
//             font-weight: 700;
//             color: #2c3e50;
//           }

//           .total-amount {
//             font-size: 20px !important;
//             color: #27ae60 !important;
//           }

//           .footer {
//             margin-top: 40px;
//             text-align: center;
//             color: #95a5a6;
//             font-size: 12px;
//             border-top: 1px solid #ecf0f1;
//             padding-top: 20px;
//           }

//           /* Print-specific styles */
//           @media print {
//             body { 
//               margin: 0 !important;
//               background: white !important;
//               -webkit-print-color-adjust: exact !important;
//               print-color-adjust: exact !important;
//             }
            
//             * {
//               background: white !important;
//               box-shadow: none !important;
//             }
            
//             .print-container {
//               max-width: none;
//               margin: 0;
//               padding: 15px;
//             }
            
//             .payment-header {
//               background: #34495e !important;
//               color: white !important;
//             }
            
//             .method-cash { 
//               background: #d5f4e6 !important; 
//               color: #27ae60 !important; 
//             }
            
//             .method-card { 
//               background: #dae8fc !important; 
//               color: #3498db !important; 
//             }
            
//             .method-transfer { 
//               background: #fdeaa7 !important; 
//               color: #f39c12 !important; 
//             }

//             .no-print { 
//               display: none !important; 
//             }

//             .page-break {
//               page-break-before: always;
//             }
//           }

//           @page {
//             margin: 1cm;
//             size: A4;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="print-container">
//           <div class="header">
//             <h1>របាយការណ៍ការទូទាត់អតិថិជន</h1>
//             <div class="subtitle">បង្កើតនៅថ្ងៃទី ${moment().format('DD/MM/YYYY HH:mm')}</div>
//           </div>
          
//           <div class="customer-section">
//             <div class="section-title">ព័ត៌មានអតិថិជន</div>
//             <div class="customer-grid">
//               <div class="info-item">
//                 <span class="info-label">ឈ្មោះ៖</span>
//                 <span class="info-value">${customer_name || 'មិនមាន'}</span>
//               </div>
//               <div class="info-item">
//                 <span class="info-label">លេខទូរស័ព្ទ៖</span>
//                 <span class="info-value">${customer_phone || 'មិនមាន'}</span>
//               </div>
//               <div class="info-item">
//                 <span class="info-label">អ៊ីមែល៖</span>
//                 <span class="info-value">${customer_email || 'មិនមាន'}</span>
//               </div>
//               <div class="info-item">
//                 <span class="info-label">ចំនួនទូទាត់៖</span>
//                 <span class="info-value">${payments.length} ប្រតិបត្តិការ</span>
//               </div>
//             </div>
//           </div>

//           <div class="payments-section">
//             <div class="section-title">ប្រវត្តិការទូទាត់ (${payments.length} ការទូទាត់)</div>
            
//             ${payments.map((payment, index) => `
//               <div class="payment-card">
//                 <div class="payment-header">
//                   ការទូទាត់ #${index + 1} - វិក្កយបត្រ ${payment.order_no ? payment.order_no.toString().padStart(4, '0') : 'មិនមាន'}
//                 </div>
//                 <div class="payment-body">
//                   <div class="payment-grid">
//                     <div class="payment-row">
//                       <span class="payment-label">កាលបរិច្ឆេទ៖</span>
//                       <span class="payment-value">${formatDateClient(payment.payment_date)}</span>
//                     </div>
//                     <div class="payment-row">
//                       <span class="payment-label">ចំនួនទឹកប្រាក់៖</span>
//                       <span class="payment-value amount-highlight">${formatCurrency(payment.amount)}</span>
//                     </div>
//                     <div class="payment-row">
//                       <span class="payment-label">វិធីសាស្ត្រ៖</span>
//                       <span class="payment-value">
//                         <span class="method-tag method-${payment.payment_method === 'cash' ? 'cash' : payment.payment_method === 'credit_card' ? 'card' : 'transfer'}">
//                           ${payment.payment_method === 'cash' ? 'សាច់ប្រាក់' :
//         payment.payment_method === 'credit_card' ? 'កាតឥណទាន' :
//           payment.payment_method === 'bank_transfer' ? 'ប្រេវេសប្រាក់' : 'មិនមាន'}
//                         </span>
//                       </span>
//                     </div>
//                     <div class="payment-row">
//                       <span class="payment-label">ប្រមូលដោយ៖</span>
//                       <span class="payment-value">${payment.collected_by || 'មិនមាន'}</span>
//                     </div>
//                     <div class="payment-row">
//                       <span class="payment-label">ប្រភេទ៖</span>
//                       <span class="payment-value">${payment.category_name || 'មិនមាន'}</span>
//                     </div>
//                     ${payment.notes ? `
//                       <div class="payment-row">
//                         <span class="payment-label">កំណត់ចំណាំ៖</span>
//                         <span class="payment-value">${payment.notes}</span>
//                       </div>
//                     ` : ''}
//                   </div>
//                 </div>
//               </div>
//             `).join('')}
//           </div>

//           <div class="summary-section">
//             <div class="section-title">សង្ខេប</div>
//             <div class="summary-grid">
//               <div class="summary-item">
//                 <span class="summary-label">ការទូទាត់សរុប៖</span>
//                 <span class="summary-value">${payments.length}</span>
//               </div>
//               <div class="summary-item">
//                 <span class="summary-label">ចំនួនទឹកប្រាក់សរុប៖</span>
//                 <span class="summary-value total-amount">${formatCurrency(totalAmount)}</span>
//               </div>
//             </div>
//           </div>

//           <div class="footer">
//             <p>សូមអរគុណសម្រាប់ការធ្វើអាជីវកម្មរបស់អ្នក!</p>
//             <p>នេះជារបាយការណ៍ដែលបង្កើតដោយកុំព្យូទ័រ។</p>
//           </div>
//         </div>
//       </body>
//     </html>
//   `;

//     const printWindow = window.open('', '_blank');
//     printWindow.document.open();
//     printWindow.document.write(printContent);
//     printWindow.document.close();

//     // Ensure styles and content are fully loaded before printing
//     printWindow.onload = () => {
//       printWindow.focus();
//       printWindow.print();
//       printWindow.close();
//     };
//   };

//   // Enhanced Print function for single payment receipt with Khmer translations
//   const printSinglePaymentReport = (payment) => {
//     const printContent = `
//     <html>
//       <head>
//         <title>បង្កាន់ដៃការទូទាត់</title>
//         <style>
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }
          
//           body { 
//             font-family: 'Khmer OS Siemreap', 'Khmer OS', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//             line-height: 1.5;
//             color: #333;
//             background: white !important;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }

//           .receipt-container {
//             max-width: 600px;
//             margin: 0 auto;
//             padding: 20px;
//             background: white !important;
//           }

//           .receipt-header { 
//             text-align: center; 
//             border-bottom: 3px solid #2c3e50;
//             padding-bottom: 20px; 
//             margin-bottom: 30px;
//             background: white !important;
//           }

//           .receipt-header h1 {
//             font-size: 32px;
//             color: #2c3e50;
//             margin-bottom: 8px;
//             font-weight: 700;
//           }

//           .receipt-header h2 {
//             font-size: 20px;
//             color: #3498db;
//             margin-bottom: 8px;
//             font-weight: 600;
//           }

//           .receipt-header .date {
//             font-size: 14px;
//             color: #7f8c8d;
//             font-weight: normal;
//           }

//           .receipt-body {
//             background: white !important;
//             border: 1px solid #ddd;
//             border-radius: 8px;
//             overflow: hidden;
//             margin-bottom: 25px;
//           }

//           .info-section {
//             padding: 20px;
//             background: white !important;
//           }

//           .info-row {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 12px 0;
//             border-bottom: 1px dotted #ddd;
//           }

//           .info-row:last-child {
//             border-bottom: none;
//           }

//           .info-label {
//             font-weight: 600;
//             color: #34495e;
//             min-width: 180px;
//             font-size: 14px;
//           }

//           .info-value {
//             text-align: right;
//             flex: 1;
//             font-weight: 500;
//             color: #2c3e50;
//             font-size: 14px;
//           }

//           .amount-section {
//             background: #ecf0f1 !important;
//             padding: 25px;
//             text-align: center;
//             border-top: 3px solid #3498db;
//             margin: 25px 0;
//             border-radius: 8px;
//           }

//           .amount-section h2 {
//             color: #2c3e50;
//             margin-bottom: 10px;
//             font-size: 18px;
//             font-weight: 600;
//           }

//           .amount-section .amount {
//             font-size: 36px;
//             font-weight: 700;
//             color: #27ae60;
//             margin: 0;
//           }

//           .method-tag {
//             display: inline-block;
//             padding: 6px 12px;
//             border-radius: 6px;
//             font-size: 12px;
//             font-weight: 600;
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//           }

//           .method-cash { 
//             background: #d5f4e6 !important; 
//             color: #27ae60 !important; 
//             border: 1px solid #27ae60;
//           }
          
//           .method-card { 
//             background: #dae8fc !important; 
//             color: #3498db !important; 
//             border: 1px solid #3498db;
//           }
          
//           .method-transfer { 
//             background: #fdeaa7 !important; 
//             color: #f39c12 !important; 
//             border: 1px solid #f39c12;
//           }

//           .receipt-footer {
//             text-align: center;
//             margin-top: 40px;
//             color: #95a5a6;
//             font-size: 12px;
//             border-top: 1px solid #ecf0f1;
//             padding-top: 20px;
//           }

//           .receipt-footer p {
//             margin-bottom: 5px;
//           }

//           /* Print-specific styles */
//           @media print {
//             body { 
//               margin: 0 !important;
//               background: white !important;
//               -webkit-print-color-adjust: exact !important;
//               print-color-adjust: exact !important;
//             }
            
//             * {
//               background: white !important;
//               box-shadow: none !important;
//             }
            
//             .receipt-container {
//               max-width: none;
//               margin: 0;
//               padding: 15px;
//             }
            
//             .amount-section {
//               background: #ecf0f1 !important;
//             }
            
//             .method-cash { 
//               background: #d5f4e6 !important; 
//               color: #27ae60 !important; 
//             }
            
//             .method-card { 
//               background: #dae8fc !important; 
//               color: #3498db !important; 
//             }
            
//             .method-transfer { 
//               background: #fdeaa7 !important; 
//               color: #f39c12 !important; 
//             }

//             .no-print { 
//               display: none !important; 
//             }
//           }

//           @page {
//             margin: 1cm;
//             size: A4;
//           }
//         </style>
//       </head>
//       <body style="margin:0;padding:0;">
//         <div class="receipt-container" style="page-break-inside: avoid;">
//           <div class="receipt-header">
//             <h1>បង្កាន់ដៃការទូទាត់</h1>
//             <h2>វិក្កយបត្រ #${payment.order_no ? payment.order_no.toString().padStart(4, '0') : 'មិនមាន'}</h2>
//             <div class="date">បង្កើតនៅថ្ងៃទី ${moment().format('DD/MM/YYYY HH:mm')}</div>
//           </div>
          
//           <div class="receipt-body">
//             <div class="info-section">
//               <div class="info-row">
//                 <span class="info-label">កាលបរិច្ឆេទទូទាត់៖</span>
//                 <span class="info-value">${payment.payment_date ? formatDateClient(payment.payment_date) : 'មិនមាន'}</span>
//               </div>
//               <div class="info-row">
//                 <span class="info-label">ឈ្មោះអតិថិជន៖</span>
//                 <span class="info-value">${payment.customer_name || 'មិនមាន'}</span>
//               </div>
//               <div class="info-row">
//                 <span class="info-label">លេខទូរស័ព្ទអតិថិជន៖</span>
//                 <span class="info-value">${payment.customer_phone || 'មិនមាន'}</span>
//               </div>
//               <div class="info-row">
//                 <span class="info-label">អ៊ីមែលអតិថិជន៖</span>
//                 <span class="info-value">${payment.customer_email || 'មិនមាន'}</span>
//               </div>
//               <div class="info-row">
//                 <span class="info-label">វិធីសាស្ត្រទូទាត់៖</span>
//                 <span class="info-value">
//                   <span class="method-tag method-${payment.payment_method === 'cash' ? 'cash' : payment.payment_method === 'credit_card' ? 'card' : 'transfer'}">
//                     ${payment.payment_method === 'cash' ? 'សាច់ប្រាក់' :
//         payment.payment_method === 'credit_card' ? 'កាតឥណទាន' :
//           payment.payment_method === 'bank_transfer' ? 'ប្រេវេសប្រាក់' : 'មិនមាន'}
//                   </span>
//                 </span>
//               </div>
//               <div class="info-row">
//                 <span class="info-label">ប្រមូលដោយ៖</span>
//                 <span class="info-value">${payment.collected_by || 'មិនមាន'}</span>
//               </div>
//               <div class="info-row">
//                 <span class="info-label">ប្រភេទ៖</span>
//                 <span class="info-value">${payment.category_name || 'មិនមាន'}</span>
//               </div>
//               ${payment.notes ? `
//                 <div class="info-row">
//                   <span class="info-label">កំណត់ចំណាំ៖</span>
//                   <span class="info-value">${payment.notes}</span>
//                 </div>
//               ` : ''}
//             </div>
//           </div>

//           <div class="amount-section">
//             <h2>ចំនួនទឹកប្រាក់សរុបដែលបានទូទាត់</h2>
//             <div class="amount">${formatCurrency(payment.amount)}</div>
//           </div>

//           <div class="receipt-footer">
//             <p><strong>សូមអរគុណសម្រាប់ការទូទាត់របស់អ្នក!</strong></p>
//             <p>នេះជាបង្កាន់ដៃដែលបង្កើតដោយកុំព្យូទ័រ។</p>
//             <p>សូមរក្សាបង្កាន់ដៃនេះសម្រាប់កំណត់ត្រារបស់អ្នក។</p>
//           </div>
//         </div>
//       </body>
//     </html>
//   `;

//     const printWindow = window.open('', '_blank');
//     printWindow.document.open();
//     printWindow.document.write(printContent);
//     printWindow.document.close();

//     // Ensure styles and content are fully loaded before printing
//     printWindow.onload = () => {
//       printWindow.focus();
//       printWindow.print();
//       printWindow.close();
//     };
//   };

//   // Columns for consolidated customer view with Khmer translations
//   const customerColumns = [
//     {
//       title: 'ឈ្មោះអតិថិជន',
//       dataIndex: 'customer_name',
//       key: 'customer_name',
//       render: (text) => text || 'មិនមាន'
//     },
//     {
//       title: 'លេខទូរស័ព្ទ',
//       dataIndex: 'customer_phone',
//       key: 'customer_phone',
//       render: (text) => text || 'មិនមាន'
//     },
//     {
//       title: 'អ៊ីមែល',
//       dataIndex: 'customer_email',
//       key: 'customer_email',
//       render: (text) => text || 'មិនមាន'
//     },
//     {
//       title: 'ចំនួនការទូទាត់',
//       dataIndex: 'paymentCount',
//       key: 'paymentCount',
//       render: (count) => (
//         <Tag color="blue">{count} ការទូទាត់</Tag>
//       )
//     },
//     {
//       title: 'ចំនួនទឹកប្រាក់សរុប',
//       dataIndex: 'totalAmount',
//       key: 'totalAmount',
//       render: (amount) => (
//         <span style={{ fontWeight: 'bold', color: '#27ae60' }}>
//           {formatCurrency(amount)}
//         </span>
//       )
//     },
//     {
//       title: 'សកម្មភាព',
//       key: 'actions',
//       render: (_, record) => (
//         <Space>
//           <Button
//             type="link"
//             icon={<IoEyeOutline />}
//             onClick={() => showCustomerDetails(record)}
//             size="small"
//           >
//             មើលលម្អិត
//           </Button>
//           <Button
//             type="link"
//             icon={<PrinterOutlined />}
//             onClick={() => printCustomerPaymentReport(record)}
//             size="small"
//           >
//             បោះពុម្ព
//           </Button>
//         </Space>
//       )
//     }
//   ];

//   const paymentColumns = [
//     {
//       title: <span className="khmer-font-bold">លេខវិក្កយបត្រ</span>,
//       dataIndex: 'order_no',
//       key: 'order_no',
//       render: (text) => <span className="khmer-font">{text ? `#${text.toString().padStart(4, '0')}` : 'មិនមាន'}</span>
//     },
//     {
//       title: <span className="khmer-font-bold">កាលបរិច្ឆេទ</span>,
//       dataIndex: 'payment_date',
//       key: 'payment_date',
//       render: (date) => <span className="khmer-font">{formatDateClient(date)}</span>
//     },
//     {
//       title: <span className="khmer-font-bold">ឈ្មោះអតិថិជន</span>,
//       dataIndex: 'customer_name',
//       key: 'customer_name',
//       render: (text) => <span className="khmer-font">{text || 'មិនមាន'}</span>
//     },
//     {
//       title: <span className="khmer-font-bold">ចំនួនទឹកប្រាក់</span>,
//       dataIndex: 'amount',
//       key: 'amount',
//       render: (amount) => (
//         <span style={{ fontWeight: 'bold', color: '#27ae60' }} className="khmer-font">
//           {formatCurrency(amount)}
//         </span>
//       )
//     },
//     {
//       title: <span className="khmer-font-bold">វិធីសាស្ត្រ</span>,
//       dataIndex: 'payment_method',
//       key: 'payment_method',
//       render: (method) => {
//         const methodMap = {
//           'cash': { text: 'សាច់ប្រាក់', color: 'green' },
//           'credit_card': { text: 'កាតឥណទាន', color: 'blue' },
//           'bank_transfer': { text: 'ប្រេវេសប្រាក់', color: 'orange' }
//         };
//         const methodInfo = methodMap[method] || { text: 'មិនមាន', color: 'default' };
//         return <Tag color={methodInfo.color} className="khmer-font">{methodInfo.text}</Tag>;
//       }
//     },
//     {
//       title: <span className="khmer-font-bold">ប្រមូលដោយ</span>,
//       dataIndex: 'collected_by',
//       key: 'collected_by',
//       render: (text) => <span className="khmer-font">{text || 'មិនមាន'}</span>
//     },
//     {
//       title: <span className="khmer-font-bold">សកម្មភាព</span>,
//       key: 'actions',
//       render: (_, record) => (
//         <Space>
//           <Button
//             type="link"
//             icon={<IoEyeOutline />}
//             onClick={() => showPaymentDetails(record)}
//             size="small"
//             className="khmer-font"
//           >
//             មើលលម្អិត
//           </Button>
//           <Button
//             type="link"
//             icon={<PrinterOutlined />}
//             onClick={() => printSinglePaymentReport(record)}
//             size="small"
//             className="khmer-font"
//           >
//             បោះពុម្ព
//           </Button>
//         </Space>
//       )
//     }
//   ];

//   // Modal states
//   const [customerDetailModal, setCustomerDetailModal] = useState({
//     visible: false,
//     data: null
//   });

//   const [paymentDetailModal, setPaymentDetailModal] = useState({
//     visible: false,
//     data: null
//   });

//   const [viewMode, setViewMode] = useState('customer'); // 'customer' or 'payment'

//   const showCustomerDetails = (customerData) => {
//     setCustomerDetailModal({
//       visible: true,
//       data: customerData
//     });
//   };

//   const showPaymentDetails = (paymentData) => {
//     setPaymentDetailModal({
//       visible: true,
//       data: paymentData
//     });
//   };

//   const handleSearch = () => {
//     setPagination({ ...pagination, current: 1 });
//     getPaymentHistory();
//   };

//   const handleReset = () => {
//     setFilter({
//       search: "",
//       dateRange: null,
//       payment_method: ""
//     });
//     setPagination({ ...pagination, current: 1 });
//   };

//   useEffect(() => {
//     if (filter.search === "" && !filter.dateRange && filter.payment_method === "") {
//       getPaymentHistory();
//     }
//   }, [filter]);

//   return (
//     <MainPage loading={loading}>
//       <div className="payment-history-container">
//         <Card>
//           <div style={{ marginBottom: 24 }}>
//             <Title level={2} className="khmer-font-bold">ប្រវត្តិការទូទាត់</Title>

//             {/* Filter Section */}
//             <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
//               <Input.Search
//                 placeholder="ស្វែងរកតាមឈ្មោះ ទូរស័ព្ទ ឬអ៊ីមែល..."
//                 value={filter.search}
//                 onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
//                 onSearch={handleSearch}
//                 style={{ width: 300 }}
//                 enterButton={<span className="khmer-font">ស្វែងរក</span>}
//                 className="khmer-font"
//               />

//               <RangePicker
//                 value={filter.dateRange}
//                 onChange={(dates) => setFilter(prev => ({ ...prev, dateRange: dates }))}
//                 format="DD/MM/YYYY"
//                 placeholder={['ចាប់ពីថ្ងៃ', 'ដល់ថ្ងៃ']}
//                 style={{ width: 250 }}
//                 className="khmer-font"
//               />

//               <Select
//                 placeholder="វិធីសាស្ត្រទូទាត់"
//                 value={filter.payment_method}
//                 onChange={(value) => setFilter(prev => ({ ...prev, payment_method: value }))}
//                 style={{ width: 150 }}
//                 allowClear
//                 className="khmer-font"
//               >
//                 <Option value="cash" className="khmer-font">សាច់ប្រាក់</Option>
//                 <Option value="credit_card" className="khmer-font">កាតឥណទាន</Option>
//                 <Option value="bank_transfer" className="khmer-font">ប្រេវេសប្រាក់</Option>
//               </Select>

//               <Button onClick={handleSearch} type="primary" className="khmer-font">
//                 ស្វែងរក
//               </Button>

//               <Button onClick={handleReset} className="khmer-font">
//                 សម្អាត
//               </Button>
//             </div>

//             {/* View Mode Toggle */}
//             <div style={{ marginBottom: 16 }}>
//               <Space>
//                 <span className="khmer-font">មើលតាម៖</span>
//                 <Button
//                   type={viewMode === 'customer' ? 'primary' : 'default'}
//                   onClick={() => setViewMode('customer')}
//                   className="khmer-font"
//                 >
//                   អតិថិជន ({state.consolidatedCustomers.length})
//                 </Button>
//                 <Button
//                   type={viewMode === 'payment' ? 'primary' : 'default'}
//                   onClick={() => setViewMode('payment')}
//                   className="khmer-font"
//                 >
//                   ការទូទាត់ ({state.payments.length})
//                 </Button>
//               </Space>
//             </div>
//           </div>

//           {/* Statistics Cards */}
//           <div style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
//             <Card size="small">
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
//                   {state.consolidatedCustomers.length}
//                 </div>
//                 <div style={{ color: '#666' }} className="khmer-font">អតិថិជនសរុប</div>
//               </div>
//             </Card>

//             <Card size="small">
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
//                   {state.payments.length}
//                 </div>
//                 <div style={{ color: '#666' }} className="khmer-font">ការទូទាត់សរុប</div>
//               </div>
//             </Card>

//             <Card size="small">
//               <div style={{ textAlign: 'center' }}>
//                 <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>
//                   {formatCurrency(state.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0))}
//                 </div>
//                 <div style={{ color: '#666' }} className="khmer-font">ចំនួនទឹកប្រាក់សរុប</div>
//               </div>
//             </Card>
//           </div>

//           {/* Error Display */}
//           {state.error && (
//             <div style={{ marginBottom: 16, color: 'red', textAlign: 'center' }} className="khmer-font">
//               កំហុស៖ {state.error}
//             </div>
//           )}

//           {/* Data Table */}
//           <Table
//             columns={viewMode === 'customer' ? customerColumns : paymentColumns}
//             dataSource={viewMode === 'customer' ? state.consolidatedCustomers : state.payments}
//             loading={state.loading}
//             pagination={false}
//             onChange={handleTableChange}
//             rowKey={(record, index) => viewMode === 'customer' ?
//               `${record.customer_name}-${record.customer_phone}-${index}` :
//               `${record.id || index}`
//             }
//             scroll={{ x: 'max-content' }}
//           />
//         </Card>

//         {/* Customer Details Modal */}
//        <Modal
//   title={<span className="khmer-font-bold">ព័ត៌មានលម្អិតអតិថិជន - {customerDetailModal.data?.customer_name || 'មិនមាន'}</span>}
//   open={customerDetailModal.visible}
//   onCancel={() => setCustomerDetailModal({ visible: false, data: null })}
//   footer={[
//     <Button key="print" icon={<PrinterOutlined />} onClick={() => printCustomerPaymentReport(customerDetailModal.data)} className="khmer-font">
//       បោះពុម្ពរបាយការណ៍
//     </Button>,
//     <Button key="close" onClick={() => setCustomerDetailModal({ visible: false, data: null })} className="khmer-font">
//       បិទ
//     </Button>
//   ]}
//   width={1400}
// >
//   {customerDetailModal.data && (
//     <div>
//       <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
//         <Descriptions.Item label={<span className="khmer-font-bold">ឈ្មោះ</span>}>
//           <span className="khmer-font">{customerDetailModal.data.customer_name || 'មិនមាន'}</span>
//         </Descriptions.Item>
//         <Descriptions.Item label={<span className="khmer-font-bold">លេខទូរស័ព្ទ</span>}>
//           <span className="khmer-font">{customerDetailModal.data.customer_phone || 'មិនមាន'}</span>
//         </Descriptions.Item>
//         <Descriptions.Item label={<span className="khmer-font-bold">អ៊ីមែល</span>}>
//           <span className="khmer-font">{customerDetailModal.data.customer_email || 'មិនមាន'}</span>
//         </Descriptions.Item>
//         <Descriptions.Item label={<span className="khmer-font-bold">ចំនួនការទូទាត់</span>}>
//           <Tag color="blue" className="khmer-font">{customerDetailModal.data.paymentCount}</Tag>
//         </Descriptions.Item>
//         <Descriptions.Item label={<span className="khmer-font-bold">ចំនួនទឹកប្រាក់សរុប</span>} span={2}>
//           <span style={{ fontSize: 18, fontWeight: 'bold', color: '#27ae60' }} className="khmer-font">
//             {formatCurrency(customerDetailModal.data.totalAmount)}
//           </span>
//         </Descriptions.Item>
//       </Descriptions>

//       <Title level={4} className="khmer-font-bold">ប្រវត្តិការទូទាត់</Title>
      
//       {/* Payment History as Individual Rows */}
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//         {customerDetailModal.data.payments.map((payment, index) => (
//           <Card 
//             key={index}
//             size="small"
//             style={{ 
//               border: '1px solid #d9d9d9',
//               borderRadius: '8px',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//             }}
//             extra={
//               <Button
//                 size="small"
//                 icon={<PrinterOutlined />}
//                 onClick={() => printSinglePaymentReport(payment)}
//                 className="khmer-font"
//               >
//                 បោះពុម្ព
//               </Button>
//             }
//           >
//             <Row gutter={[16, 8]}>
//               <Col span={24}>
//                 <div style={{ 
//                   fontSize: '16px', 
//                   fontWeight: 'bold', 
//                   marginBottom: '8px',
//                   color: '#1890ff'
//                 }} className="khmer-font">
//                   ការទូទាត់ #{index + 1} - វិក្កយបត្រ {payment.order_no ? payment.order_no.toString().padStart(4, '0') : 'មិនមាន'}
//                 </div>
//               </Col>
              
//               <Col span={6}>
//                 <div className="khmer-font">
//                   <strong>កាលបរិច្ឆេទ៖</strong>
//                   <br />
//                   {formatDateClient(payment.payment_date)}
//                 </div>
//               </Col>
              
//               <Col span={6}>
//                 <div className="khmer-font">
//                   <strong>ចំនួនទឹកប្រាក់៖</strong>
//                   <br />
//                   <span style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '16px' }}>
//                     {formatCurrency(payment.amount)}
//                   </span>
//                 </div>
//               </Col>
              
//               <Col span={6}>
//                 <div className="khmer-font">
//                   <strong>វិធីសាស្ត្រ៖</strong>
//                   <br />
//                   {payment.payment_method === 'cash' ? 'សាច់ប្រាក់' :
//                    payment.payment_method === 'credit_card' ? 'កាតឥណទាន' :
//                    payment.payment_method === 'bank_transfer' ? 'ប្រេវេសប្រាក់' : 'មិនមាន'}
//                 </div>
//               </Col>
              
//               <Col span={6}>
//                 <div className="khmer-font">
//                   <strong>កំណត់ចំណាំ៖</strong>
//                   <br />
//                   {payment.notes || 'មិនមាន'}
//                 </div>
//               </Col>
              
//               {payment.slips?.length > 0 && (
//                 <Col span={24}>
//                   <div className="khmer-font" style={{ marginTop: '8px' }}>
//                     <strong>Payment Slips:</strong>
//                     <div style={{ 
//                       display: 'flex', 
//                       flexWrap: 'wrap', 
//                       gap: '8px', 
//                       marginTop: '8px' 
//                     }}>
//                       {payment.slips.map((imagePath, slipIndex) => {
//                         const isBase64 = imagePath.startsWith('data:image');
//                         const fullImageUrl = isBase64 ? imagePath : Config.getFullImagePath(imagePath);

//                         return (
//                           <Image
//                             key={slipIndex}
//                             src={fullImageUrl}
//                             alt={`Slip ${slipIndex + 1}`}
//                             width={80}
//                             height={80}
//                             style={{
//                               borderRadius: '8px',
//                               objectFit: 'cover',
//                               border: '2px solid #d9d9d9',
//                             }}
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = '/path/to/placeholder.png';
//                             }}
//                             preview={{
//                               mask: <IoEyeOutline size={16} />
//                             }}
//                           />
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </Col>
//               )}
//             </Row>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )}
// </Modal>

//         {/* Payment Details Modal */}
//         <Modal
//           title={<span className="khmer-font-bold">ព័ត៌មានលម្អិតការទូទាត់ - វិក្កយបត្រ #{paymentDetailModal.data?.order_no?.toString().padStart(4, '0') || 'មិនមាន'}</span>}
//           open={paymentDetailModal.visible}
//           onCancel={() => setPaymentDetailModal({ visible: false, data: null })}
//           footer={[
//             <Button key="print" icon={<PrinterOutlined />} onClick={() => printSinglePaymentReport(paymentDetailModal.data)} className="khmer-font">
//               បោះពុម្ពបង្កាន់ដៃ
//             </Button>,
//             <Button key="close" onClick={() => setPaymentDetailModal({ visible: false, data: null })} className="khmer-font">
//               បិទ
//             </Button>
//           ]}
//           width={600}
//         >
//           {paymentDetailModal.data && (
//             <Descriptions bordered column={1}>
//               <Descriptions.Item label={<span className="khmer-font-bold">កាលបរិច្ឆេទទូទាត់</span>}>
//                 <span className="khmer-font">{formatDateClient(paymentDetailModal.data.payment_date)}</span>
//               </Descriptions.Item>
//               <Descriptions.Item label={<span className="khmer-font-bold">ឈ្មោះអតិថិជន</span>}>
//                 <span className="khmer-font">{paymentDetailModal.data.customer_name || 'មិនមាន'}</span>
//               </Descriptions.Item>
//               <Descriptions.Item label={<span className="khmer-font-bold">លេខទូរស័ព្ទ</span>}>
//                 <span className="khmer-font">{paymentDetailModal.data.customer_phone || 'មិនមាន'}</span>
//               </Descriptions.Item>
//               <Descriptions.Item label={<span className="khmer-font-bold">អ៊ីមែល</span>}>
//                 <span className="khmer-font">{paymentDetailModal.data.customer_email || 'មិនមាន'}</span>
//               </Descriptions.Item>
//               <Descriptions.Item label={<span className="khmer-font-bold">ចំនួនទឹកប្រាក់</span>}>
//                 <span style={{ fontSize: 18, fontWeight: 'bold', color: '#27ae60' }} className="khmer-font">
//                   {formatCurrency(paymentDetailModal.data.amount)}
//                 </span>
//               </Descriptions.Item>
//               <Descriptions.Item label={<span className="khmer-font-bold">វិធីសាស្ត្រទូទាត់</span>}>
//                 <Tag color={
//                   paymentDetailModal.data.payment_method === 'cash' ? 'green' :
//                     paymentDetailModal.data.payment_method === 'credit_card' ? 'blue' : 'orange'
//                 } className="khmer-font">
//                   {paymentDetailModal.data.payment_method === 'cash' ? 'សាច់ប្រាក់' :
//                     paymentDetailModal.data.payment_method === 'credit_card' ? 'កាតឥណទាន' :
//                       paymentDetailModal.data.payment_method === 'bank_transfer' ? 'ប្រេវេសប្រាក់' : 'មិនមាន'}
//                 </Tag>
//               </Descriptions.Item>
//               <Descriptions.Item label={<span className="khmer-font-bold">ប្រមូលដោយ</span>}>
//                 <span className="khmer-font">{paymentDetailModal.data.collected_by || 'មិនមាន'}</span>
//               </Descriptions.Item>
//               <Descriptions.Item label={<span className="khmer-font-bold">ប្រភេទ</span>}>
//                 <span className="khmer-font">{paymentDetailModal.data.category_name || 'មិនមាន'}</span>
//               </Descriptions.Item>
//               {paymentDetailModal.data.notes && (
//                 <Descriptions.Item label={<span className="khmer-font-bold">កំណត់ចំណាំ</span>}>
//                   <span className="khmer-font">{paymentDetailModal.data.notes}</span>
//                 </Descriptions.Item>
//               )}

//             </Descriptions>
//           )}
//         </Modal>
//       </div>
//     </MainPage>
//   );
// }

// export default PaymentHistoryPage;
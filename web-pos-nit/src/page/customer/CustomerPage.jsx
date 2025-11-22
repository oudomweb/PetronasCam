
// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Input,
//   Modal,
//   Space,
//   Tag,
//   Select,
//   Checkbox,
//   Drawer,
//   Descriptions,
//   Avatar,
//   Empty,
//   Spin,
//   Form,
//   Col,
//   Row,
//   DatePicker,
//   message
// } from "antd";
// import {
//   Search,
//   Plus,
//   UserPlus,
//   Shield,
//   Edit,
//   Trash2,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   Users,
//   CreditCard,
//   User,
//   Eye
// } from "lucide-react";
// import { formatDateClient, isPermission, request } from "../../util/helper";
// import MainPage from "../../component/layout/MainPage";
// import { getProfile } from "../../store/profile.store";
// import { configStore } from "../../store/configStore";
// import dayjs from "dayjs";
// import "./customer.css";

// function CustomerPage() {
//   const { config } = configStore();
//   const [form] = Form.useForm();
//   const [assignForm] = Form.useForm();
//   const [list, setList] = useState([]);
//   const [filteredCustomers, setFilteredCustomers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [permissionsLoaded, setPermissionsLoaded] = useState(false);
//   const [profile, setProfile] = useState(null);
//   const [deletePermissionModalVisible, setDeletePermissionModalVisible] = useState(false);
//   const [filterType, setFilterType] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const [blockedUserIds, setBlockedUserIds] = useState(() => {
//     const saved = localStorage.getItem("blocked_user_ids");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [selectedPermissionType, setSelectedPermissionType] = useState("delete");
//   const [blockedPermissions, setBlockedPermissions] = useState(() => {
//     const saved = localStorage.getItem("blocked_permissions");
//     return saved ? JSON.parse(saved) : { delete: [], create: [] };
//   });

//   const [state, setState] = useState({
//     visibleModal: false,
//     id: null,
//     txtSearch: "",
//     user_id: null,
//     isEditing: false,
//     visibleAssignModal: false,
//   });

//   const [detailDrawer, setDetailDrawer] = useState({ visible: false, customer: null });
//   const [customerStats, setCustomerStats] = useState({});

//   // Load profile data once on mount
//   useEffect(() => {
//     const profileData = getProfile();
//     if (profileData && profileData.id) {
//       setProfile(profileData);
//       setState((prev) => ({ ...prev, user_id: profileData.id }));
//       setPermissionsLoaded(true);
//     } else {
//       message.error("មិនមានលេខសម្គាល់អ្នកប្រើប្រាស់។ សូមចូលម្តងទៀត។");
//     }
//   }, []);

//   useEffect(() => {
//     if (state.user_id) {
//       getList();
//     }
//   }, [state.user_id]);

//   // Fetch customer statistics (orders count, total amount, rating)
//   useEffect(() => {
//     if (list.length > 0) {
//       fetchCustomerStats();
//     }
//   }, [list]);

//   const fetchCustomerStats = async () => {
//     try {
//       // Fetch order statistics for all customers
//       const customerIds = list.map(c => c.id).join(',');
//       const res = await request(`order/customer-stats?customer_ids=${customerIds}`, "get");

//       if (res?.success && res?.data) {
//         // Convert array to object with customer_id as key
//         const statsMap = {};
//         res.data.forEach(stat => {
//           statsMap[stat.customer_id] = {
//             totalOrders: stat.total_orders || 0,
//             totalAmount: stat.total_amount || 0,
//             lastOrderDate: stat.last_order_date,
//             rating: calculateRating(stat.total_orders, stat.total_amount)
//           };
//         });
//         setCustomerStats(statsMap);
//       }
//     } catch (error) {
//       console.error("Error fetching customer stats:", error);
//       // Set empty stats if API fails
//       const emptyStats = {};
//       list.forEach(c => {
//         emptyStats[c.id] = { totalOrders: 0, totalAmount: 0, rating: 0 };
//       });
//       setCustomerStats(emptyStats);
//     }
//   };

//   // Calculate customer rating based on orders (1-5 stars)
//   const calculateRating = (totalOrders, totalAmount) => {
//     if (totalOrders === 0) return 0;

//     // Rating algorithm:
//     // - 1-5 orders: 1 star
//     // - 6-15 orders: 2 stars
//     // - 16-30 orders: 3 stars
//     // - 31-50 orders: 4 stars
//     // - 50+ orders: 5 stars
//     // Also consider total amount spent

//     let rating = 0;
//     if (totalOrders >= 50) rating = 5;
//     else if (totalOrders >= 31) rating = 4;
//     else if (totalOrders >= 16) rating = 3;
//     else if (totalOrders >= 6) rating = 2;
//     else if (totalOrders >= 1) rating = 1;

//     // Bonus: If total amount is very high, increase rating
//     if (totalAmount > 100000 && rating < 5) rating += 0.5;
//     if (totalAmount > 50000 && rating < 4) rating += 0.5;

//     return Math.min(5, rating);
//   };

// // Replace the renderStars function in your CustomerPage component (around line 150)

// const renderStars = (rating) => {
//   const stars = [];
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = (rating % 1) >= 0.5;
//   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
//   for (let i = 0; i < fullStars; i++) {
//     stars.push(
//       <span key={`full-${i}`} className="text-yellow-400" style={{ fontSize: '18px' }}>
//         ★
//       </span>
//     );
//   }
//   if (hasHalfStar) {
//     stars.push(
//       <span 
//         key="half" 
//         style={{ 
//           position: 'relative',
//           display: 'inline-block',
//           fontSize: '18px',
//           lineHeight: 1
//         }}
//       >
//         <span style={{ color: '#D1D5DB' }}>★</span>
//         <span 
//           style={{ 
//             position: 'absolute',
//             left: 0,
//             top: 0,
//             width: '50%',
//             overflow: 'hidden',
//             color: '#FBBF24'
//           }}
//         >
//           ★
//         </span>
//       </span>
//     );
//   }
//   for (let i = 0; i < emptyStars; i++) {
//     stars.push(
//       <span key={`empty-${i}`} className="text-gray-300" style={{ fontSize: '18px' }}>
//         ★
//       </span>
//     );
//   }

//   return <div className="flex items-center gap-0.5">{stars}</div>;
// };



//   // Filter customers based on search and filters
//   useEffect(() => {
//     let filtered = list;

//     if (state.txtSearch) {
//       filtered = filtered.filter(c => 
//         c.name?.toLowerCase().includes(state.txtSearch.toLowerCase()) ||
//         c.tel?.includes(state.txtSearch) ||
//         c.email?.toLowerCase().includes(state.txtSearch.toLowerCase())
//       );
//     }

//     if (filterType !== "all") {
//       filtered = filtered.filter(c => c.type === filterType);
//     }

//     if (filterStatus !== "all") {
//       filtered = filtered.filter(c => c.status === parseInt(filterStatus));
//     }

//     setFilteredCustomers(filtered);
//   }, [state.txtSearch, filterType, filterStatus, list]);

//   const getList = async () => {
//     if (!state.user_id) {
//       message.error("តម្រូវឱ្យមានលេខសម្គាល់អ្នកប្រើប្រាស់!");
//       return;
//     }
//     const param = {
//       txtSearch: state.txtSearch || "",
//     };
//     try {
//       setLoading(true);
//       const { id } = getProfile();
//       if (!id) return;
//       const res = await request(`customer/my-group`, "get", param);
//       setLoading(false);
//       if (res?.success) {
//         setList(res.list || []);
//       } else {
//         message.error(res?.message || "បរាជ័យក្នុងការទាញយកបញ្ជីអតិថិជន");
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error("Error fetching customer list:", error);
//       message.error("បរាជ័យក្នុងការទាញយកបញ្ជីអតិថិជន");
//     }
//   };

//   const handleCheckboxChange = (checkedValues) => {
//     const updated = {
//       ...blockedPermissions,
//       [selectedPermissionType]: checkedValues
//     };
//     setBlockedPermissions(updated);
//     localStorage.setItem("blocked_permissions", JSON.stringify(updated));
//   };

//   const onClickAddBtn = () => {
//     setState((prev) => ({
//       ...prev,
//       visibleModal: true,
//       isEditing: false,
//       id: null,
//     }));
//     form.resetFields();
//   };

//   const phoneValidationRules = [
//     { required: true, message: "តម្រូវឱ្យមានលេខទូរស័ព្ទ" },
//     { 
//       pattern: /^[0-9+\-\s()]+$/, 
//       message: "លេខទូរស័ព្ទត្រូវតែជាលេខ" 
//     },
//     {
//       min: 8,
//       max: 15,
//       message: "លេខទូរស័ព្ទត្រូវតែមានពី 8 ដល់ 15 ខ្ទង់"
//     }
//   ];

//   const onClickEdit = (record) => {
//     const formData = {
//       ...record,
//       id_card_expiry: record.id_card_expiry ? dayjs(record.id_card_expiry) : undefined
//     };

//     setState((prev) => ({
//       ...prev,
//       visibleModal: true,
//       isEditing: true,
//       id: record.id,
//     }));
//     form.setFieldsValue(formData);
//   };

//   const onClickDelete = (record) => {
//     if (!record.id) {
//       message.error("មិនមានលេខសម្គាល់អតិថិជន!");
//       return;
//     }
//     Modal.confirm({
//       title: "លុបអតិថិជន",
//       content: "តើអ្នកពិតជាចង់លុបអតិថិជននេះមែនទេ?",
//       onOk: async () => {
//         try {
//           const res = await request(`customer/${record.id}`, "delete");
//           if (res && !res.error) {
//             message.success(res.message);
//             getList();
//           } else {
//             message.error(res.message || "អតិថិជននេះកំពុងប្រើប្រាស់និងមិនអាចលុបបានទេ!");
//           }
//         } catch (error) {
//           console.error("Delete Error:", error);
//           message.error("មានបញ្ហាកើតឡើងខណៈពេលលុបអតិថិជន។");
//         }
//       },
//     });
//   };

//   const handleModalSubmit = async () => {
//     try {
//       const values = await form.validateFields();

//       if (values.id_card_expiry) {
//         values.id_card_expiry = values.id_card_expiry.format('YYYY-MM-DD');
//       }

//       const { id, isEditing } = state;
//       if (isEditing) {
//         const res = await request(`customer/${id}`, "put", values);
//         if (res && res.success && !res.error) {
//           message.success("អតិថិជនត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!");
//           setState((prev) => ({ ...prev, visibleModal: false }));
//           getList();
//         } else {
//           message.error(res?.message || "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពអតិថិជន។");
//         }
//       } else {
//         const res = await request("customer", "post", values);
//         if (res && res.success && !res.error) {
//           message.success("អតិថិជនត្រូវបានបង្កើតដោយជោគជ័យ!");
//           setState((prev) => ({ ...prev, visibleModal: false }));
//           getList();
//         } else {
//           message.error(res?.message || "លេខទូរស័ព្ទនេះមានរួចហើយ។ សូមប្រើលេខផ្សេង។");
//         }
//       }
//     } catch (error) {
//       console.error("Validation or API error:", error);
//       message.error("មានបញ្ហាកើតឡើងក្នុងការរក្សាទុកទិន្នន័យ។");
//     }
//   };

//   const handleModalCancel = () => {
//     setState((prev) => ({ ...prev, visibleModal: false }));
//     form.resetFields();
//   };

//   const onClickAssignToUser = () => {
//     setState((prev) => ({
//       ...prev,
//       visibleAssignModal: true,
//     }));
//     assignForm.resetFields();
//   };

//   const handleAssignToUserSubmit = async () => {
//     try {
//       const values = await assignForm.validateFields();

//       if (!values.customer_id || !values.assigned_user_id) {
//         message.error("តម្រូវឱ្យមានអតិថិជននិងអ្នកប្រើប្រាស់!");
//         return;
//       }

//       const res = await request("customer/user", "post", {
//         customer_id: values.customer_id,
//         assigned_user_id: values.assigned_user_id
//       });

//       if (res && res.success) {
//         message.success("អតិថិជនត្រូវបានកំណត់ដោយជោគជ័យ!");
//         setState((prev) => ({ ...prev, visibleAssignModal: false }));
//         assignForm.resetFields();
//         getList();
//       } else {
//         message.error(res?.message || "បរាជ័យក្នុងការកំណត់អតិថិជន។");
//       }
//     } catch (error) {
//       console.error("Validation or API error:", error);
//       message.error("មានបញ្ហាកើតឡើងខណៈពេលកំណត់អតិថិជន។");
//     }
//   };

//   const handleAssignModalCancel = () => {
//     setState((prev) => ({ ...prev, visibleAssignModal: false }));
//     assignForm.resetFields();
//   };

//   const canCreateCustomer = permissionsLoaded &&
//     isPermission("customer.create") &&
//     !blockedPermissions.create.includes(profile?.id);

//   const handleViewDetail = (customer) => {
//     setDetailDrawer({ visible: true, customer });
//   };

//   const renderCustomerForm = () => (
//     <Form form={form} layout="vertical">
//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item
//             label="ឈ្មោះ"
//             name="name"
//             rules={[{ required: true, message: "តម្រូវឱ្យមានឈ្មោះ" }]}
//           >
//             <Input />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item
//             label="ភេទ"
//             name="gender"
//             rules={[{ required: true, message: "តម្រូវឱ្យមានភេទ" }]}
//           >
//             <Select placeholder="ជ្រើសរើសភេទ">
//               <Select.Option value="Male">ប្រុស</Select.Option>
//               <Select.Option value="Female">ស្រី</Select.Option>
//               <Select.Option value="Other">ផ្សេងៗ</Select.Option>
//             </Select>
//           </Form.Item>
//         </Col>
//       </Row>

//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item
//             label="អ៊ីមែល"
//             name="email"
//             rules={[{ required: true, message: "តម្រូវឱ្យមានអ៊ីមែល" }]}
//           >
//             <Input />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item
//             label="ទូរស័ព្ទ"
//             name="tel"
//             rules={phoneValidationRules}
//           >
//             <Input />
//           </Form.Item>
//         </Col>
//       </Row>

//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item label="លេខអត្តសញ្ញាណបណ្ណ" name="id_card_number">
//             <Input />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item label="កាលបរិច្ឆេទផុតកំណត់អត្តសញ្ញាណបណ្ណ" name="id_card_expiry">
//             <DatePicker style={{ width: '100%' }} />
//           </Form.Item>
//         </Col>
//       </Row>

//       <Row gutter={16}>
//         <Col span={24}>
//           <Form.Item label="អាសយដ្ឋាន" name="address">
//             <Input.TextArea rows={3} />
//           </Form.Item>
//         </Col>
//       </Row>

//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item label="ឈ្មោះប្តី/ប្រពន្ធ" name="spouse_name">
//             <Input />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item label="លេខទូរស័ព្ទប្តី/ប្រពន្ធ" name="spouse_tel">
//             <Input />
//           </Form.Item>
//         </Col>
//       </Row>

//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item label="ឈ្មោះអ្នកធានា" name="guarantor_name">
//             <Input />
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item label="លេខទូរស័ព្ទអ្នកធានា" name="guarantor_tel">
//             <Input />
//           </Form.Item>
//         </Col>
//       </Row>

//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item label="ស្ថានភាព" name="status" initialValue={1}>
//             <Select>
//               <Select.Option value={1}>សកម្ម (Active)</Select.Option>
//               <Select.Option value={0}>អសកម្ម (Inactive)</Select.Option>
//             </Select>
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item
//             label="ប្រភេទអតិថិជន"
//             name="type"
//             rules={[{ required: true, message: "តម្រូវឱ្យមានប្រភេទអតិថិជន" }]}
//           >
//             <Select>
//               <Select.Option value="regular">អតិថិជនធម្មតា (Regular)</Select.Option>
//               <Select.Option value="special">អតិថិជនពិសេស (Special)</Select.Option>
//             </Select>
//           </Form.Item>
//         </Col>
//       </Row>
//     </Form>
//   );

//   const renderAssignForm = () => (
//     <Form form={assignForm} layout="vertical">
//       <Form.Item
//         label="អតិថិជន"
//         name="customer_id"
//         rules={[{ required: true, message: "តម្រូវឱ្យមានអតិថិជន" }]}
//       >
//         <Select placeholder="ជ្រើសរើសអតិថិជន">
//           {list.map((customer) => (
//             <Select.Option key={customer.id} value={customer.id}>
//               {customer.name} - {customer.tel || ""}
//             </Select.Option>
//           ))}
//         </Select>
//       </Form.Item>
//       <Form.Item
//         label="អ្នកប្រើប្រាស់"
//         name="assigned_user_id"
//         rules={[{ required: true, message: "តម្រូវឱ្យមានអ្នកប្រើប្រាស់" }]}
//       >
//         <Select
//           style={{ width: '100%' }}
//           allowClear
//           placeholder="ជ្រើសរើសអ្នកប្រើប្រាស់"
//           options={config?.user?.map(user => ({
//             value: user.value,
//             label: user.label
//           })) || []}
//         />
//       </Form.Item>
//     </Form>
//   );

//   return (
//     <MainPage loading={loading}>
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-800">ការគ្រប់គ្រងអតិថិជន</h1>
//               <p className="text-slate-500 mt-1">Customer Management</p>
//             </div>

//             <div className="flex gap-3">
//               {permissionsLoaded && isPermission("customer.getone") && (
//                 <Button
//                   type="primary"
//                   icon={<UserPlus size={18} />}
//                   onClick={onClickAssignToUser}
//                   className="bg-emerald-600 hover:bg-emerald-700 border-0"
//                 >
//                   បង្កើតអតិថិជនទៅអ្នកប្រើប្រាស់
//                 </Button>
//               )}
//               {canCreateCustomer && (
//                 <Button
//                   type="primary"
//                   icon={<Plus size={18} />}
//                   onClick={onClickAddBtn}
//                   className="bg-blue-600 hover:bg-blue-700 border-0"
//                 >
//                   បង្កើតថ្មី
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <Input
//                 prefix={<Search size={18} className="text-slate-400" />}
//                 placeholder="ស្វែងរកតាមឈ្មោះ, លេខទូរស័ព្ទ, អ៊ីមែល..."
//                 value={state.txtSearch}
//                 onChange={(e) => setState(prev => ({ ...prev, txtSearch: e.target.value }))}
//                 allowClear
//                 className="h-11"
//               />

//               <Select
//                 value={filterType}
//                 onChange={setFilterType}
//                 className="w-full h-11"
//               >
//                 <Select.Option value="all">ប្រភេទទាំងអស់</Select.Option>
//                 <Select.Option value="regular">អតិថិជនធម្មតា</Select.Option>
//                 <Select.Option value="special">អតិថិជនពិសេស</Select.Option>
//               </Select>

//               <Select
//                 value={filterStatus}
//                 onChange={setFilterStatus}
//                 className="w-full h-11"
//               >
//                 <Select.Option value="all">ស្ថានភាពទាំងអស់</Select.Option>
//                 <Select.Option value="1">សកម្ម</Select.Option>
//                 <Select.Option value="0">អសកម្ម</Select.Option>
//               </Select>

//               {permissionsLoaded && isPermission("customer.getone") && (
//                 <Button
//                   icon={<Shield size={18} />}
//                   onClick={() => setDeletePermissionModalVisible(true)}
//                   className="h-11"
//                 >
//                   កំណត់សិទ្ធ
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-500 text-sm">សរុបអតិថិជន</p>
//                 <p className="text-2xl font-bold text-slate-800 mt-1">{list.length}</p>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <Users size={24} className="text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-500 text-sm">សកម្ម</p>
//                 <p className="text-2xl font-bold text-emerald-600 mt-1">
//                   {list.filter(c => c.status === 1).length}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
//                 <User size={24} className="text-emerald-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-500 text-sm">អតិថិជនពិសេស</p>
//                 <p className="text-2xl font-bold text-purple-600 mt-1">
//                   {list.filter(c => c.type === "special").length}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <CreditCard size={24} className="text-purple-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-slate-500 text-sm">អតិថិជនធម្មតា</p>
//                 <p className="text-2xl font-bold text-amber-600 mt-1">
//                   {list.filter(c => c.type === "regular").length}
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
//                 <User size={24} className="text-amber-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Customer Cards */}
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <Spin size="large" />
//           </div>
//         ) : filteredCustomers.length === 0 ? (
//           <Empty description="គ្មានអតិថិជន" className="my-16" />
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredCustomers.map((customer) => {
//               const stats = customerStats[customer.id] || { totalOrders: 0, totalAmount: 0, rating: 0 };

//               return (
//               <div
//                 key={customer.id}
//                 className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200"
//               >
//                 {/* Card Header */}
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="relative">
//                       <Avatar
//                         size={48}
//                         className="bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0"
//                       >
//                         {customer.name?.charAt(0) || "?"}
//                       </Avatar>
//                       {/* Rating Badge */}
//                       {stats.rating > 0 && (
//                         <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
//                           {stats.rating.toFixed(1)}
//                         </div>
//                       )}
//                     </div>
//                     <div className="min-w-0">
//                       <h3 className="font-semibold text-slate-800 text-lg truncate">
//                         {customer.name}
//                       </h3>
//                       <p className="text-slate-500 text-sm">{customer.gender}</p>
//                       {/* Star Rating */}
//                       {stats.rating > 0 && (
//                         <div className="flex items-center gap-0.5 mt-1">
//                           {renderStars(stats.rating)}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-2">
//                     <Tag color={customer.type === "special" ? "purple" : "green"} className="m-0">
//                       {customer.type === "special" ? "ពិសេស" : "ធម្មតា"}
//                     </Tag>
//                     <Tag color={customer.status === 1 ? "success" : "error"} className="m-0">
//                       {customer.status === 1 ? "សកម្ម" : "អសកម្ម"}
//                     </Tag>
//                   </div>
//                 </div>

//                 {/* Purchase Stats */}
//                 {stats.totalOrders > 0 && (
//                   <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <p className="text-xs text-slate-500 mb-1">ចំនួនការទិញ</p>
//                         <p className="text-lg font-bold text-blue-600">{stats.totalOrders}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-500 mb-1">ទឹកប្រាក់សរុប</p>
//                         <p className="text-lg font-bold text-purple-600">
//                           ${stats.totalAmount.toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Contact Info */}
//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center gap-2 text-slate-600">
//                     <Phone size={16} className="text-slate-400 flex-shrink-0" />
//                     <span className="text-sm truncate">{customer.tel}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-slate-600">
//                     <Mail size={16} className="text-slate-400 flex-shrink-0" />
//                     <span className="text-sm truncate">{customer.email}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-slate-600">
//                     <MapPin size={16} className="text-slate-400 flex-shrink-0" />
//                     <span className="text-sm truncate">{customer.address}</span>
//                   </div>
//                 </div>

//                 {/* Quick Info */}
//                 <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
//                   <div className="flex items-center gap-1">
//                     <CreditCard size={14} />
//                     <span>{customer.id_card_number || "-"}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Calendar size={14} />
//                     <span>{customer.create_at ? dayjs(customer.create_at).format("YYYY-MM-DD") : "-"}</span>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2">
//                   <Button
//                     type="default"
//                     icon={<Eye size={16} />}
//                     onClick={() => handleViewDetail(customer)}
//                     className="flex-1"
//                   >
//                     មើលលម្អិត
//                   </Button>
//                   {permissionsLoaded && isPermission("customer.update") && (
//                     <Button
//                       type="primary"
//                       icon={<Edit size={16} />}
//                       onClick={() => onClickEdit(customer)}
//                       className="bg-blue-600 hover:bg-blue-700 border-0"
//                     />
//                   )}
//                   {permissionsLoaded &&
//                     isPermission("customer.update") &&
//                     !blockedPermissions.delete.includes(profile?.id) && (
//                       <Button
//                         danger
//                         icon={<Trash2 size={16} />}
//                         onClick={() => onClickDelete(customer)}
//                       />
//                     )
//                   }
//                 </div>
//               </div>
//             );
//           })}
//           </div>
//         )}

//         {/* Detail Drawer */}
//         <Drawer
//           title={
//             <div className="flex items-center gap-3">
//               <Avatar size={40} className="bg-gradient-to-br from-blue-500 to-purple-500">
//                 {detailDrawer.customer?.name?.charAt(0) || "?"}
//               </Avatar>
//               <div>
//                 <div className="font-semibold text-lg">{detailDrawer.customer?.name}</div>
//                 <div className="text-sm text-slate-500">ព័ត៌មានលម្អិតអតិថិជន</div>
//               </div>
//             </div>
//           }
//           placement="right"
//           width={600}
//           open={detailDrawer.visible}
//           onClose={() => setDetailDrawer({ visible: false, customer: null })}
//         >
//           {detailDrawer.customer && (
//             <div className="space-y-6">
//               <Descriptions bordered column={1} size="small">
//                 <Descriptions.Item label="ឈ្មោះ">{detailDrawer.customer.name}</Descriptions.Item>
//                 <Descriptions.Item label="ភេទ">{detailDrawer.customer.gender}</Descriptions.Item>
//                 <Descriptions.Item label="ប្រភេទ">
//                   <Tag color={detailDrawer.customer.type === "special" ? "purple" : "green"}>
//                     {detailDrawer.customer.type === "special" ? "អតិថិជនពិសេស" : "អតិថិជនធម្មតា"}
//                   </Tag>
//                 </Descriptions.Item>
//                 <Descriptions.Item label="អ៊ីមែល">{detailDrawer.customer.email}</Descriptions.Item>
//                 <Descriptions.Item label="លេខទូរស័ព្ទ">{detailDrawer.customer.tel}</Descriptions.Item>
//                 <Descriptions.Item label="លេខអត្តសញ្ញាណបណ្ណ">{detailDrawer.customer.id_card_number || "-"}</Descriptions.Item>
//                 <Descriptions.Item label="កាលបរិច្ឆេទផុតកំណត់">
//                   {detailDrawer.customer.id_card_expiry ? dayjs(detailDrawer.customer.id_card_expiry).format("YYYY-MM-DD") : "-"}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="អាសយដ្ឋាន">{detailDrawer.customer.address}</Descriptions.Item>
//               </Descriptions>

//               {(detailDrawer.customer.spouse_name || detailDrawer.customer.spouse_tel) && (
//                 <>
//                   <div className="text-lg font-semibold text-slate-800 pt-4">ព័ត៌មានប្តី/ប្រពន្ធ</div>
//                   <Descriptions bordered column={1} size="small">
//                     <Descriptions.Item label="ឈ្មោះ">{detailDrawer.customer.spouse_name || "-"}</Descriptions.Item>
//                     <Descriptions.Item label="លេខទូរស័ព្ទ">{detailDrawer.customer.spouse_tel || "-"}</Descriptions.Item>
//                   </Descriptions>
//                 </>
//               )}

//               {(detailDrawer.customer.guarantor_name || detailDrawer.customer.guarantor_tel) && (
//                 <>
//                   <div className="text-lg font-semibold text-slate-800 pt-4">ព័ត៌មានអ្នកធានា</div>
//                   <Descriptions bordered column={1} size="small">
//                     <Descriptions.Item label="ឈ្មោះ">{detailDrawer.customer.guarantor_name || "-"}</Descriptions.Item>
//                     <Descriptions.Item label="លេខទូរស័ព្ទ">{detailDrawer.customer.guarantor_tel || "-"}</Descriptions.Item>
//                   </Descriptions>
//                 </>
//               )}

//               <div className="text-lg font-semibold text-slate-800 pt-4">ព័ត៌មានប្រព័ន្ធ</div>
//               <Descriptions bordered column={1} size="small">
//                 <Descriptions.Item label="កាលបរិច្ឆេទបង្កើត">
//                   {detailDrawer.customer.create_at ? dayjs(detailDrawer.customer.create_at).format("YYYY-MM-DD h:mm A") : "-"}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="បង្កើតដោយ">{detailDrawer.customer.create_by}</Descriptions.Item>
//                 <Descriptions.Item label="ស្ថានភាព">
//                   <Tag color={detailDrawer.customer.status === 1 ? "success" : "error"}>
//                     {detailDrawer.customer.status === 1 ? "សកម្ម" : "អសកម្ម"}
//                   </Tag>
//                 </Descriptions.Item>
//               </Descriptions>
//             </div>
//           )}
//         </Drawer>

//         {/* Permission Settings Modal */}
//         <Modal
//           title="កំណត់សិទ្ធអ្នកប្រើប្រាស់"
//           open={deletePermissionModalVisible}
//           onOk={() => setDeletePermissionModalVisible(false)}
//           onCancel={() => setDeletePermissionModalVisible(false)}
//         >
//           <div className="mb-4">
//             <Select
//               style={{ width: "100%" }}
//               value={selectedPermissionType}
//               onChange={(value) => setSelectedPermissionType(value)}
//             >
//               <Select.Option value="delete">មិនអនុញ្ញាតឲ្យលុប</Select.Option>
//               <Select.Option value="create">មិនអនុញ្ញាតឲ្យបង្កើត</Select.Option>
//             </Select>
//           </div>

//           <Checkbox.Group
//             value={blockedPermissions[selectedPermissionType]}
//             onChange={handleCheckboxChange}
//           >
//             <div className="grid grid-cols-2 gap-y-4 gap-x-8">
//               {(config?.user || []).map((user) => {
//                 const [namePart, ...rest] = user.label.split(" - ");
//                 const subPart = rest.join(" - ");
//                 return (
//                   <Checkbox key={user.value} value={user.value}>
//                     <span className="font-medium">{namePart}</span>
//                     <span className="text-slate-500 text-sm block">{subPart}</span>
//                   </Checkbox>
//                 );
//               })}
//             </div>
//           </Checkbox.Group>
//         </Modal>

//         {/* Create/Edit Customer Modal */}
//         <Modal
//           title={state.isEditing ? "កែសម្រួលអតិថិជន" : "បង្កើតអតិថិជន"}
//           open={state.visibleModal}
//           onOk={handleModalSubmit}
//           onCancel={handleModalCancel}
//           width={700}
//         >
//           {renderCustomerForm()}
//         </Modal>

//         {/* Assign Customer to User Modal */}
//         <Modal
//           title="ចាត់ចែងអតិថិជនទៅអ្នកប្រើប្រាស់"
//           open={state.visibleAssignModal}
//           onOk={handleAssignToUserSubmit}
//           onCancel={handleAssignModalCancel}
//         >
//           {renderAssignForm()}
//         </Modal>
//       </div>
//     </MainPage>
//   );
// }

// export default CustomerPage;


import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  DatePicker,
  Checkbox,
  Tooltip
} from "antd";
import { CiSearch } from "react-icons/ci";
import { MdOutlineCreateNewFolder, MdSecurity } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { LuUserRoundSearch } from "react-icons/lu";
import { formatDateClient, isPermission, request } from "../../util/helper";
import MainPage from "../../component/layout/MainPage";
import { getProfile } from "../../store/profile.store";
import { configStore } from "../../store/configStore";
import dayjs from "dayjs";
import "./customer.css"

function CustomerPage() {
  const { config } = configStore();
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [deletePermissionModalVisible, setDeletePermissionModalVisible] = useState(false);

  const [filteredList, setFilteredList] = useState([]);
  const [blockedUserIds, setBlockedUserIds] = useState(() => {
    const saved = localStorage.getItem("blocked_user_ids");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedPermissionType, setSelectedPermissionType] = useState("delete");
  const [blockedPermissions, setBlockedPermissions] = useState(() => {
    const saved = localStorage.getItem("blocked_permissions");
    return saved ? JSON.parse(saved) : { delete: [], create: [] };
  });

  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    txtSearch: "",
    user_id: null,
    isEditing: false,
    visibleAssignModal: false,
    customerTypeFilter: null,
  });

  useEffect(() => {
    const profileData = getProfile();
    if (profileData && profileData.id) {
      setProfile(profileData);
      setState((prev) => ({ ...prev, user_id: profileData.id }));
      setPermissionsLoaded(true);
    } else {
      message.error("មិនមានលេខសម្គាល់អ្នកប្រើប្រាស់។ សូមចូលម្តងទៀត។");
    }
  }, []);

  useEffect(() => {
    if (state.user_id) {
      getList();
    }
  }, [state.user_id]);

  useEffect(() => {
    if (state.customerTypeFilter) {
      const filtered = list.filter(item => item.type === state.customerTypeFilter);
      setFilteredList(filtered);
    } else {
      setFilteredList(list);
    }
  }, [list, state.customerTypeFilter]);

  useEffect(() => {
    const saved = localStorage.getItem("blocked_user_ids");
    if (saved) {
      setBlockedUserIds(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("blocked_permissions");
    if (saved) {
      setBlockedPermissions(JSON.parse(saved));
    }
  }, []);

  const handleCheckboxChange = (checkedValues) => {
    const updated = {
      ...blockedPermissions,
      [selectedPermissionType]: checkedValues
    };
    setBlockedPermissions(updated);
    localStorage.setItem("blocked_permissions", JSON.stringify(updated));
  };

  const onChangeBlockedUsers = (checkedValues) => {
    setBlockedUserIds(checkedValues);
    localStorage.setItem("blocked_user_ids", JSON.stringify(checkedValues));
  };

  const getList = async () => {
    if (!state.user_id) {
      message.error("តម្រូវឱ្យមានលេខសម្គាល់អ្នកប្រើប្រាស់!");
      return;
    }
    const param = {
      txtSearch: state.txtSearch || "",
      type: state.customerTypeFilter || "",
    };
    try {
      setLoading(true);
      const { id } = getProfile();
      if (!id) return;
      const res = await request(`customer/my-group`, "get", param);
      setLoading(false);
      if (res?.success) {
        setList(res.list || []);
      } else {
        message.error(res?.message || "បរាជ័យក្នុងការទាញយកបញ្ជីអតិថិជន");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching customer list:", error);
      message.error("បរាជ័យក្នុងការទាញយកបញ្ជីអតិថិជន");
    }
  };

  const onClickAddBtn = () => {
    setState((prev) => ({
      ...prev,
      visibleModal: true,
      isEditing: false,
      id: null,
    }));
    form.resetFields();
  };

  const phoneValidationRules = [
    { required: true, message: "តម្រូវឱ្យមានលេខទូរស័ព្ទ" },
    {
      pattern: /^[0-9+\-\s()]+$/,
      message: "លេខទូរស័ព្ទត្រូវតែជាលេខ"
    },
    {
      min: 8,
      max: 15,
      message: "លេខទូរស័ព្ទត្រូវតែមានពី 8 ដល់ 15 ខ្ទង់"
    }
  ];

  const onClickEdit = (record) => {
    const formData = {
      ...record,
      id_card_expiry: record.id_card_expiry ? dayjs(record.id_card_expiry) : undefined
    };

    setState((prev) => ({
      ...prev,
      visibleModal: true,
      isEditing: true,
      id: record.id,
    }));
    form.setFieldsValue(formData);
  };

  const onClickDelete = (record) => {
    if (!record.id) {
      message.error("មិនមានលេខសម្គាល់អតិថិជន!");
      return;
    }
    Modal.confirm({
      title: "លុបអតិថិជន",
      content: "តើអ្នកពិតជាចង់លុបអតិថិជននេះមែនទេ?",
      onOk: async () => {
        try {
          const res = await request(`customer/${record.id}`, "delete");
          if (res && !res.error) {
            message.success(res.message);
            getList();
          } else {
            message.error(res.message || "អតិថិជននេះកំពុងប្រើប្រាស់និងមិនអាចលុបបានទេ!");
          }
        } catch (error) {
          console.error("Delete Error:", error);
          message.error("មានបញ្ហាកើតឡើងខណៈពេលលុបអតិថិជន។");
        }
      },
    });
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (values.id_card_expiry) {
        values.id_card_expiry = values.id_card_expiry.format('YYYY-MM-DD');
      }

      const { id, isEditing } = state;
      if (isEditing) {
        const res = await request(`customer/${id}`, "put", values);
        if (res && res.success && !res.error) {
          message.success("អតិថិជនត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!");
          setState((prev) => ({ ...prev, visibleModal: false }));
          getList();
        } else {
          message.error(res?.message || "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពអតិថិជន។");
        }
      } else {
        const res = await request("customer", "post", values);
        if (res && res.success && !res.error) {
          message.success("អតិថិជនត្រូវបានបង្កើតដោយជោគជ័យ!");
          setState((prev) => ({ ...prev, visibleModal: false }));
          getList();
        } else {
          message.error(res?.message || "លេខទូរស័ព្ទនេះមានរួចហើយ។ សូមប្រើលេខផ្សេង។");
        }
      }
    } catch (error) {
      console.error("Validation or API error:", error);
      message.error("មានបញ្ហាកើតឡើងក្នុងការរក្សាទុកទិន្នន័យ។");
    }
  };

  const handleModalCancel = () => {
    setState((prev) => ({ ...prev, visibleModal: false }));
    form.resetFields();
  };

  const onClickAssignToUser = () => {
    setState((prev) => ({
      ...prev,
      visibleAssignModal: true,
    }));
    assignForm.resetFields();
  };

  const handleAssignToUserSubmit = async () => {
    try {
      const values = await assignForm.validateFields();

      if (!values.customer_id || !values.assigned_user_id) {
        message.error("តម្រូវឱ្យមានអតិថិជននិងអ្នកប្រើប្រាស់!");
        return;
      }

      const res = await request("customer/user", "post", {
        customer_id: values.customer_id,
        assigned_user_id: values.assigned_user_id
      });

      if (res && res.success) {
        message.success("អតិថិជនត្រូវបានកំណត់ដោយជោគជ័យ!");
        setState((prev) => ({ ...prev, visibleAssignModal: false }));
        assignForm.resetFields();
        getList();
      } else {
        message.error(res?.message || "បរាជ័យក្នុងការកំណត់អតិថិជន។");
      }
    } catch (error) {
      console.error("Validation or API error:", error);
      message.error("មានបញ្ហាកើតឡើងខណៈពេលកំណត់អតិថិជន។");
    }
  };

  const handleAssignModalCancel = () => {
    setState((prev) => ({ ...prev, visibleAssignModal: false }));
    assignForm.resetFields();
  };

  const canCreateCustomer = permissionsLoaded &&
    isPermission("customer.create") &&
    !blockedPermissions.create.includes(profile?.id);

  // Table columns definition
  const columns = [
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
      key: "name",
      title: (
        <div>
          <div className="customer-table-header-main">ឈ្មោះ</div>
          <div className="customer-table-header-sub">NAME / GENDER / TYPE</div>
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 280,
      render: (text, record) => (
        <Tooltip 
          title={
            <div className="customer-tooltip-content">
              <div className="customer-tooltip-name">
                {text || "គ្មាន"}
              </div>
              <div className="customer-tooltip-details">
                {record.gender || "គ្មាន"} • {record.type === "special" ? "អតិថិជនពិសេស" : "អតិថិជនធម្មតា"}
              </div>
            </div>
          } 
          placement="topLeft"
          overlayStyle={{ maxWidth: '320px' }}
        >
          <div className="customer-name-cell">
            <div className="customer-name-main">
              {text || "គ្មាន"}
            </div>
            <div className="customer-name-details">
              <span className="customer-gender-text">
                {record.gender || "គ្មាន"}
              </span>
              <span className="customer-type-separator">•</span>
              <Tag
                color={record.type === "special" ? "blue" : "green"}
                className="customer-type-tag"
              >
                {record.type === "special" ? "ពិសេស" : "ធម្មតា"}
              </Tag>
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      key: "tel",
      title: (
        <div>
          <div className="customer-table-header-main">លេខទូរស័ព្ទ</div>
          <div className="customer-table-header-sub">TELEPHONE</div>
        </div>
      ),
      dataIndex: "tel",
      width: 140,
    },
    {
      key: "address",
      title: (
        <div>
          <div className="customer-table-header-main">អាសយដ្ឋាន</div>
          <div className="customer-table-header-sub">ADDRESS</div>
        </div>
      ),
      dataIndex: "address",
      width: 250,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <div className="customer-address-text">
            {text || "គ្មាន"}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "id_card_number",
      title: (
        <div>
          <div className="customer-table-header-main">លេខអត្តសញ្ញាណបណ្ណ</div>
          <div className="customer-table-header-sub">ID CARD NUMBER</div>
        </div>
      ),
      dataIndex: "id_card_number",
      width: 160,
    },
    {
      key: "spouse_name",
      title: (
        <div>
          <div className="customer-table-header-main">ឈ្មោះប្តី/ប្រពន្ធ</div>
          <div className="customer-table-header-sub">SPOUSE NAME</div>
        </div>
      ),
      dataIndex: "spouse_name",
      width: 150,
    },
    {
      key: "guarantor_name",
      title: (
        <div>
          <div className="customer-table-header-main">ឈ្មោះអ្នកធានា</div>
          <div className="customer-table-header-sub">GUARANTOR NAME</div>
        </div>
      ),
      dataIndex: "guarantor_name",
      width: 150,
    },
    {
      key: "create_by",
      title: (
        <div>
          <div className="customer-table-header-main">បង្កើតដោយ</div>
          <div className="customer-table-header-sub">CREATE BY / DATE</div>
        </div>
      ),
      dataIndex: "create_by",
      width: 200,
      render: (text, record) => (
        <div className="customer-create-info">
          <div className="customer-create-name">
            {text || "គ្មាន"}
          </div>
          <div className="customer-create-date">
            {record.create_at ? dayjs(record.create_at).format("DD-MM-YYYY h:mm A") : "-"}
          </div>
        </div>
      ),
    },
    {
      key: "action",
      title: (
        <div>
          <div className="customer-table-header-main">សកម្មភាព</div>
          <div className="customer-table-header-sub">ACTION</div>
        </div>
      ),
      align: "center",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          {permissionsLoaded && isPermission("customer.update") && (
            <Button
              type="primary"
              icon={<MdEdit />}
              onClick={() => onClickEdit(record)}
              size="small"
            />
          )}

          {permissionsLoaded &&
            isPermission("customer.update") &&
            !blockedPermissions.delete.includes(profile?.id) && (
              <Button
                type="primary"
                danger
                icon={<MdDelete />}
                onClick={() => onClickDelete(record)}
                size="small"
              />
            )
          }
        </Space>
      ),
    }
  ];

  const renderCustomerForm = () => (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">ឈ្មោះ</span>}
            name="name"
            rules={[{ required: true, message: "តម្រូវឱ្យមានឈ្មោះ" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">ភេទ</span>}
            name="gender"
            rules={[{ required: true, message: "តម្រូវឱ្យមានភេទ" }]}
          >
            <Select placeholder="ជ្រើសរើសភេទ">
              <Select.Option value="Male">ប្រុស</Select.Option>
              <Select.Option value="Female">ស្រី</Select.Option>
              <Select.Option value="Other">ផ្សេងៗ</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">អ៊ីមែល</span>}
            name="email"
            rules={[{ required: true, message: "តម្រូវឱ្យមានអ៊ីមែល" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">ទូរស័ព្ទ</span>}
            name="tel"
            rules={phoneValidationRules}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">លេខអត្តសញ្ញាណបណ្ណ</span>}
            name="id_card_number"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">កាលបរិច្ឆេទផុតកំណត់អត្តសញ្ញាណបណ្ណ</span>}
            name="id_card_expiry"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={<span className="customer-form-label">អាសយដ្ឋាន</span>}
            name="address"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">ឈ្មោះប្តី/ប្រពន្ធ</span>}
            name="spouse_name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">លេខទូរស័ព្ទប្តី/ប្រពន្ធ</span>}
            name="spouse_tel"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">ឈ្មោះអ្នកធានា</span>}
            name="guarantor_name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">លេខទូរស័ព្ទអ្នកធានា</span>}
            name="guarantor_tel"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">ស្ថានភាព</span>}
            name="status"
            initialValue={1}
          >
            <Select>
              <Select.Option value={1}>
                <span className="customer-btn-text">សកម្ម (Active)</span>
              </Select.Option>
              <Select.Option value={0}>
                <span className="customer-btn-text">អសកម្ម (Inactive)</span>
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<span className="customer-form-label">ប្រភេទអតិថិជន</span>}
            name="type"
            rules={[{ required: true, message: "តម្រូវឱ្យមានប្រភេទអតិថិជន" }]}
          >
            <Select>
              <Select.Option value="regular">
                <span className="customer-btn-text">អតិថិជនធម្មតា (Regular)</span>
              </Select.Option>
              <Select.Option value="special">
                <span className="customer-btn-text">អតិថិជនពិសេស (Special)</span>
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );

  const renderAssignForm = () => (
    <Form form={assignForm} layout="vertical">
      <Form.Item
        label={<span className="customer-form-label">អតិថិជន</span>}
        name="customer_id"
        rules={[{ required: true, message: "តម្រូវឱ្យមានអតិថិជន" }]}
      >
        <Select placeholder="ជ្រើសរើសអតិថិជន">
          {list.map((customer) => (
            <Select.Option key={customer.id} value={customer.id}>
              {customer.name} - {customer.tel || ""}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label={<span className="customer-form-label">អ្នកប្រើប្រាស់</span>}
        name="assigned_user_id"
        rules={[{ required: true, message: "តម្រូវឱ្យមានអ្នកប្រើប្រាស់" }]}
      >
        <Select
          style={{ width: '100%' }}
          allowClear
          placeholder="ជ្រើសរើសអ្នកប្រើប្រាស់"
          options={config?.user?.map(user => ({
            value: user.value,
            label: user.label
          })) || []}
          suffixIcon={<LuUserRoundSearch />}
        />
      </Form.Item>
    </Form>
  );

  return (
    <MainPage loading={loading}>
      {/* Page Header */}
      <div className="pageHeader">
        <Space>
          <div>
            <h1 className="customer-page-title">ការគ្រប់គ្រងអតិថិជន</h1>
            <p className="customer-page-subtitle">Customer Management</p>
          </div>
          <Input.Search
            className="customer-search-input"
            onChange={(e) =>
              setState((prev) => ({ ...prev, txtSearch: e.target.value }))
            }
            allowClear
            onSearch={getList}
            placeholder="ស្វែងរកតាមឈ្មោះ"
            style={{ width: 200 }}
          />
          <Select
            className="customer-type-filter"
            placeholder="ប្រភេទអតិថិជន"
            allowClear
            style={{ width: 180 }}
            value={state.customerTypeFilter}
            onChange={(value) => {
              setState((prev) => ({ ...prev, customerTypeFilter: value }));
            }}
          >
            <Select.Option value="regular">
              <span className="customer-btn-text">អតិថិជនធម្មតា</span>
            </Select.Option>
            <Select.Option value="special">
              <span className="customer-btn-text">អតិថិជនពិសេស</span>
            </Select.Option>
          </Select>
          <Button className="customer-btn-text" type="primary" onClick={getList} icon={<CiSearch />}>
            ស្វែងរក
          </Button>
          {permissionsLoaded && isPermission("customer.getone") && (
            <Button
              className="customer-btn-text"
              type="primary"
              icon={<MdSecurity />}
              onClick={() => setDeletePermissionModalVisible(true)}
            >
              កំណត់សិទ្ធ
            </Button>
          )}
        </Space>
        <div>
          {permissionsLoaded && isPermission("customer.getone") && (
            <Button
              className="customer-btn-text mr-2"
              type="primary"
              onClick={onClickAssignToUser}
              icon={<IoPersonAddSharp />}
            >
              បង្កើតអតិថិជនទៅអ្នកប្រើប្រាស់
            </Button>
          )}
          {canCreateCustomer && (
            <Button
              className="customer-btn-text"
              type="primary"
              onClick={onClickAddBtn}
              icon={<MdOutlineCreateNewFolder />}
            >
              បង្កើតថ្មី
            </Button>
          )}
        </div>
      </div>

      <Table
        rowClassName={() => "customer-table-row"}
        rowKey="id"
        dataSource={filteredList}
        columns={columns}
        pagination={false}
        scroll={{
          x: 1600,
          y: 'calc(100vh - 350px)'
        }}
        sticky={{
          offsetHeader: 0
        }}
      />

      {/* Permission Settings Modal */}
      <Modal
        title={<span className="customer-modal-title">កំណត់សិទ្ធអ្នកប្រើប្រាស់</span>}
        open={deletePermissionModalVisible}
        onOk={() => setDeletePermissionModalVisible(false)}
        onCancel={() => setDeletePermissionModalVisible(false)}
      >
        <div className="mb-4">
          <Select
            className="customer-type-filter"
            style={{ width: "100%" }}
            value={selectedPermissionType}
            onChange={(value) => setSelectedPermissionType(value)}
          >
            <Select.Option value="delete">មិនអនុញ្ញាតឲ្យលុប</Select.Option>
            <Select.Option value="create">មិនអនុញ្ញាតឲ្យបង្កើត</Select.Option>
          </Select>
        </div>

        <Checkbox.Group
          value={blockedPermissions[selectedPermissionType]}
          onChange={handleCheckboxChange}
        >
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            {(config?.user || []).map((user) => {
              const [namePart, ...rest] = user.label.split(" - ");
              const subPart = rest.join(" - ");
              return (
                <Checkbox key={user.value} value={user.value} className="customer-permission-checkbox">
                  <span className="customer-permission-label">{namePart}</span>
                  <span className="customer-permission-sub">{subPart}</span>
                </Checkbox>
              );
            })}
          </div>
        </Checkbox.Group>
      </Modal>

      {/* Create/Edit Customer Modal */}
      <Modal
        title={
          <span className="customer-modal-title">
            {state.isEditing ? "កែសម្រួលអតិថិជន" : "បង្កើតអតិថិជន"}
          </span>
        }
        open={state.visibleModal}
        onOk={handleModalSubmit}
        onCancel={handleModalCancel}
        width={700}
      >
        {renderCustomerForm()}
      </Modal>

      {/* Assign Customer to User Modal */}
      <Modal
        title={
          <span className="customer-modal-title">ចាត់ចែងអតិថិជនទៅអ្នកប្រើប្រាស់</span>
        }
        open={state.visibleAssignModal}
        onOk={handleAssignToUserSubmit}
        onCancel={handleAssignModalCancel}
      >
        {renderAssignForm()}
      </Modal>
    </MainPage>
  );
}

export default CustomerPage;
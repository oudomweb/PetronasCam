

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
  Checkbox
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
  const [assignForm] = Form.useForm(); // Separate form instance for assignment
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [deletePermissionModalVisible, setDeletePermissionModalVisible] = useState(false);

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
  });

  // Load profile data once on mount
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

  // Create new customer modal handlers
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

  const additionalColumns = [
  {
    key: "spouse_tel",
    title: (
      <div>
        <div className="khmer-text">លេខទូរស័ព្ទប្តី/ប្រពន្ធ</div>
        <div className="english-text">Spouse Tel</div>
      </div>
    ),
    dataIndex: "spouse_tel",
  },
  {
    key: "guarantor_tel", 
    title: (
      <div>
        <div className="khmer-text">លេខទូរស័ព្ទអ្នកធានា</div>
        <div className="english-text">Guarantor Tel</div>
      </div>
    ),
    dataIndex: "guarantor_tel",
  },
  {
    key: "id_card_expiry",
    title: (
      <div>
        <div className="khmer-text">កាលបរិច្ឆេទផុតកំណត់អត្តសញ្ញាណបណ្ណ</div>
        <div className="english-text">ID Card Expiry</div>
      </div>
    ),
    dataIndex: "id_card_expiry",
    render: (value) => value ? dayjs(value).format("YYYY-MM-DD") : "គ្មាន",
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

    // Convert the DatePicker value to ISO string format for API
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

  // Assign customer to user modal handlers
  const onClickAssignToUser = () => {
    setState((prev) => ({
      ...prev,
      visibleAssignModal: true,
    }));
    assignForm.resetFields();
  };

  const handleAssignToUserSubmit = async () => {
    try {
      // Use the dedicated assignForm instead of the main form
      const values = await assignForm.validateFields();

      // Make sure we have both required values
      if (!values.customer_id || !values.assigned_user_id) {
        message.error("តម្រូវឱ្យមានអតិថិជននិងអ្នកប្រើប្រាស់!");
        return;
      }

      // Call API to assign customer to user
      const res = await request("customer/user", "post", {
        customer_id: values.customer_id,
        assigned_user_id: values.assigned_user_id
      });

      if (res && res.success) {
        message.success("អតិថិជនត្រូវបានកំណត់ដោយជោគជ័យ!");
        setState((prev) => ({ ...prev, visibleAssignModal: false }));
        assignForm.resetFields();
        getList(); // Refresh the list
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

  // Check if current user can create customers
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
          <div className="khmer-text">ឈ្មោះ</div>
          <div className="english-text">Name</div>
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <div className="truncate-text" title={text || ""}>
          {text || "គ្មាន"}
        </div>
      ),
    },
    {
      key: "gender",
      title: (
        <div>
          <div className="khmer-text">ភេទ</div>
          <div className="english-text">Gender</div>
        </div>
      ),
      dataIndex: "gender",
      render: (text) => (
        <div className="truncate-text" title={text || ""}>
          {text || "គ្មាន"}
        </div>
      ),
    }
    ,
    {
      key: "type",
      title: (
        <div>
          <div className="khmer-text">ប្រភេទអតិថិជន</div>
          <div className="english-text">Customer Type</div>
        </div>
      ),
      dataIndex: "type",
      render: (type) => (
        <Tag color={type === "special" ? "blue" : "green"}>
          <div>
            <div className="khmer-text">{type === "special" ? "អតិថិជនពិសេស" : "អតិថិជនធម្មតា"}</div>
            <div className="english-text">{type === "special" ? "Special" : "Regular"}</div>
          </div>
        </Tag>
      ),
      filters: [
        {
          text: (
            <div>
              <div className="khmer-text">អតិថិជនពិសេស</div>
              <div className="english-text">Special</div>
            </div>
          ), value: "special"
        },
        {
          text: (
            <div>
              <div className="khmer-text">អតិថិជនធម្មតា</div>
              <div className="english-text">Regular</div>
            </div>
          ), value: "regular"
        },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      key: "email",
      title: (
        <div>
          <div className="khmer-text">អ៊ីមែល</div>
          <div className="english-text">Email</div>
        </div>
      ),
      dataIndex: "email",
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
    },
    {
      key: "id_card_number",
      title: (
        <div>
          <div className="khmer-text">លេខអត្តសញ្ញាណបណ្ណ</div>
          <div className="english-text">ID Card Number</div>
        </div>
      ),
      dataIndex: "id_card_number",
    },
    {
      key: "address",
      title: (
        <div>
          <div className="khmer-text">អាសយដ្ឋាន</div>
          <div className="english-text">Address</div>
        </div>
      ),
      dataIndex: "address",
      ellipsis: true,
    },
    {
      key: "spouse_name",
      title: (
        <div>
          <div className="khmer-text">ឈ្មោះប្តី/ប្រពន្ធ</div>
          <div className="english-text">Spouse Name</div>
        </div>
      ),
      dataIndex: "spouse_name",
    },
    {
      key: "guarantor_name",
      title: (
        <div>
          <div className="khmer-text">ឈ្មោះអ្នកធានា</div>
          <div className="english-text">Guarantor Name</div>
        </div>
      ),
      dataIndex: "guarantor_name",
    },
    {
      key: "created_at",
      title: (
        <div>
          <div className="khmer-text">កាលបរិច្ឆេទបង្កើត</div>
          <div className="english-text">Created Date</div>
        </div>
      ),
      dataIndex: "create_at",
      render: (value) => dayjs(value).format("YYYY-MM-DD h:mm A"),
    },
      {
      key: "create_by",
      title: (
        <div>
          <div className="khmer-text">បង្កើតដោយ</div>
          <div className="english-text">Create By</div>
        </div>
      ),
      dataIndex: "create_by",
    },
    {
      key: "status",
      title: (
        <div>
          <div className="khmer-text">ស្ថានភាព</div>
          <div className="english-text">Status</div>
        </div>
      ),
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === 1 ? "green" : "red"}>
          <div>
            <div className="khmer-text">{status === 1 ? "សកម្ម" : "អសកម្ម"}</div>
            <div className="english-text">{status === 1 ? "Active" : "Inactive"}</div>
          </div>
        </Tag>
      ),
      filters: [
        {
          text: (
            <div>
              <div className="khmer-text">សកម្ម</div>
              <div className="english-text">Active</div>
            </div>
          ), value: 1
        },
        {
          text: (
            <div>
              <div className="khmer-text">អសកម្ម</div>
              <div className="english-text">Inactive</div>
            </div>
          ), value: 0
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      key: "action",
      title: (
        <div>
          <div className="khmer-text">សកម្មភាព</div>
          <div className="english-text">Action</div>
        </div>
      ),
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          {/* កែសម្រួល */}
          {permissionsLoaded && isPermission("customer.update") && (
            <Button
              type="primary"
              icon={<MdEdit />}
              onClick={() => onClickEdit(record)}
              size="small"
            />
          )}

          {/* លុប តែបើមានសិទ្ធិ និងមិននៅក្នុង blockedPermissions.delete */}
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

  // Customer form fields
  const renderCustomerForm = () => (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">ឈ្មោះ</span></div>}
            name="name"
            rules={[{ required: true, message: "តម្រូវឱ្យមានឈ្មោះ" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>

          <Form.Item
            label={<div><span className="khmer-text">ភេទ</span></div>}
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
            label={<div><span className="khmer-text">អ៊ីមែល</span></div>}
            name="email"
            rules={[{ required: true, message: "តម្រូវឱ្យមានអ៊ីមែល" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>

         <Form.Item
  label={<div><span className="khmer-text">ទូរស័ព្ទ</span></div>}
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
            label={<div><span className="khmer-text">លេខអត្តសញ្ញាណបណ្ណ</span></div>}
            name="id_card_number"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">កាលបរិច្ឆេទផុតកំណត់អត្តសញ្ញាណបណ្ណ</span></div>}
            name="id_card_expiry"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={<div><span className="khmer-text">អាសយដ្ឋាន</span></div>}
            name="address"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">ឈ្មោះប្តី/ប្រពន្ធ</span></div>}
            name="spouse_name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">លេខទូរស័ព្ទប្តី/ប្រពន្ធ</span></div>}
            name="spouse_tel"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">ឈ្មោះអ្នកធានា</span></div>}
            name="guarantor_name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">លេខទូរស័ព្ទអ្នកធានា</span></div>}
            name="guarantor_tel"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">ស្ថានភាព</span></div>}
            name="status"
            initialValue={1}
          >
            <Select>
              <Select.Option value={1}>
                <div>
                  <span className="khmer-text">សកម្ម</span>
                  <span className="english-text"> (Active)</span>
                </div>
              </Select.Option>
              <Select.Option value={0}>
                <div>
                  <span className="khmer-text">អសកម្ម</span>
                  <span className="english-text"> (Inactive)</span>
                </div>
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>

          <Form.Item
            label={
              <div>
                <span className="khmer-text">ប្រភេទអតិថិជន</span>
                <span className="english-text"> (Customer Type)</span>
              </div>
            }
            name="type"
            rules={[{ required: true, message: "តម្រូវឱ្យមានប្រភេទអតិថិជន" }]}
          >
            <Select>
              <Select.Option value="regular">
                <div>
                  <span className="khmer-text">អតិថិជនធម្មតា</span>
                  <span className="english-text"> (Regular)</span>
                </div>
              </Select.Option>
              <Select.Option value="special">
                <div>
                  <span className="khmer-text">អតិថិជនពិសេស</span>
                  <span className="english-text"> (Special)</span>
                </div>
              </Select.Option>
            </Select>
          </Form.Item>

        </Col>
      </Row>
    </Form>
  );

  // Assign to user form with separate form instance
  const renderAssignForm = () => (
    <Form form={assignForm} layout="vertical">
      <Form.Item
        label={<div><span className="khmer-text">អតិថិជន</span></div>}
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
        label={<div><span className="khmer-text">អ្នកប្រើប្រាស់</span></div>}
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
            <h1 className="khmer-text">ការគ្រប់គ្រងអតិថិជន</h1>
            <p className="english-text">Customer Management</p>
          </div>
          <Input.Search
            onChange={(e) =>
              setState((prev) => ({ ...prev, txtSearch: e.target.value }))
            }
            allowClear
            onSearch={getList}
            placeholder="ស្វែងរកតាមឈ្មោះ"
          />
          <Button className="khmer-text" type="primary" onClick={getList} icon={<CiSearch />}>
            ស្វែងរក
          </Button>
          {permissionsLoaded && isPermission("customer.getone") && (
            <Button
              className="khmer-text"
              type="primary"
              icon={<MdSecurity />} // <-- add icon here
              onClick={() => setDeletePermissionModalVisible(true)}
            >
              កំណត់សិទ្ធ
            </Button>
          )}
        </Space>
        <div>
          {permissionsLoaded && isPermission("customer.getone") && (
            <Button
              className="khmer-text mr-2"
              type="primary"
              onClick={onClickAssignToUser}
              icon={<IoPersonAddSharp />}
            >
              បង្កើតអតិថិជនទៅអ្នកប្រើប្រាស់
            </Button>
          )}
          {canCreateCustomer && (
            <Button
              className="khmer-text"
              type="primary"
              onClick={onClickAddBtn}
              icon={<MdOutlineCreateNewFolder />}
            >
              បង្កើតថ្មី
            </Button>
          )}
        </div>
      </div>

      {/* Customer Table */}
      <Table
        rowClassName={() => "pos-row"}
        rowKey="id"
        dataSource={list}
        columns={columns}
        pagination={false}
      />

      {/* Permission Settings Modal */}
      <Modal
        title="កំណត់សិទ្ធអ្នកប្រើប្រាស់" className="khmer-text"
        open={deletePermissionModalVisible}
        onOk={() => setDeletePermissionModalVisible(false)}
        onCancel={() => setDeletePermissionModalVisible(false)}
      >
        {/* Select Permission Type */}
        <div className="mb-4">
          <Select
            style={{ width: "100%" }}
            value={selectedPermissionType}
            onChange={(value) => setSelectedPermissionType(value)}
          >
            <Select.Option value="delete">មិនអនុញ្ញាតឲ្យលុប</Select.Option>
            <Select.Option value="create">មិនអនុញ្ញាតឲ្យបង្កើត</Select.Option>
          </Select>
        </div>

        {/* Checkbox Group */}
        <Checkbox.Group
          value={blockedPermissions[selectedPermissionType]}
          onChange={handleCheckboxChange}
        >
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            {(config?.user || []).map((user) => {
              const [namePart, ...rest] = user.label.split(" - ");
              const subPart = rest.join(" - ");
              return (
                <Checkbox key={user.value} value={user.value} className="custom-checkbox-user">
                  <span className="custom-checkbox-label">{namePart}</span>
                  <span className="custom-checkbox-sub">{subPart}</span>
                </Checkbox>
              );
            })}
          </div>
        </Checkbox.Group>
      </Modal>

      {/* Create/Edit Customer Modal */}
      <Modal
        title={
          <div>
            <span className="khmer-text">
              {state.isEditing ? "កែសម្រួលអតិថិជន" : "បង្កើតអតិថិជន"}
            </span>
          </div>
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
          <div>
            <span className="khmer-text">ចាត់ចែងអតិថិជនទៅអ្នកប្រើប្រាស់</span>
          </div>
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





















///Backup 2





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
  const [assignForm] = Form.useForm(); // Separate form instance for assignment
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [deletePermissionModalVisible, setDeletePermissionModalVisible] = useState(false);

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
  });

  // Load profile data once on mount
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

  // Create new customer modal handlers
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

  const additionalColumns = [
  {
    key: "spouse_tel",
    title: (
      <div>
        <div className="khmer-text">លេខទូរស័ព្ទប្តី/ប្រពន្ធ</div>
        <div className="english-text">Spouse Tel</div>
      </div>
    ),
    dataIndex: "spouse_tel",
  },
  {
    key: "guarantor_tel", 
    title: (
      <div>
        <div className="khmer-text">លេខទូរស័ព្ទអ្នកធានា</div>
        <div className="english-text">Guarantor Tel</div>
      </div>
    ),
    dataIndex: "guarantor_tel",
  },
  {
    key: "id_card_expiry",
    title: (
      <div>
        <div className="khmer-text">កាលបរិច្ឆេទផុតកំណត់អត្តសញ្ញាណបណ្ណ</div>
        <div className="english-text">ID Card Expiry</div>
      </div>
    ),
    dataIndex: "id_card_expiry",
    render: (value) => value ? dayjs(value).format("YYYY-MM-DD") : "គ្មាន",
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

    // Convert the DatePicker value to ISO string format for API
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

  // Assign customer to user modal handlers
  const onClickAssignToUser = () => {
    setState((prev) => ({
      ...prev,
      visibleAssignModal: true,
    }));
    assignForm.resetFields();
  };

  const handleAssignToUserSubmit = async () => {
    try {
      // Use the dedicated assignForm instead of the main form
      const values = await assignForm.validateFields();

      // Make sure we have both required values
      if (!values.customer_id || !values.assigned_user_id) {
        message.error("តម្រូវឱ្យមានអតិថិជននិងអ្នកប្រើប្រាស់!");
        return;
      }

      // Call API to assign customer to user
      const res = await request("customer/user", "post", {
        customer_id: values.customer_id,
        assigned_user_id: values.assigned_user_id
      });

      if (res && res.success) {
        message.success("អតិថិជនត្រូវបានកំណត់ដោយជោគជ័យ!");
        setState((prev) => ({ ...prev, visibleAssignModal: false }));
        assignForm.resetFields();
        getList(); // Refresh the list
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

  // Check if current user can create customers
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
          <div className="khmer-text">ឈ្មោះ</div>
          <div className="english-text">Name</div>
        </div>
      ),
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <div className="truncate-text" title={text || ""}>
          {text || "គ្មាន"}
        </div>
      ),
    },
    {
      key: "gender",
      title: (
        <div>
          <div className="khmer-text">ភេទ</div>
          <div className="english-text">Gender</div>
        </div>
      ),
      dataIndex: "gender",
      render: (text) => (
        <div className="truncate-text" title={text || ""}>
          {text || "គ្មាន"}
        </div>
      ),
    }
    ,
   {
  key: "type",
  title: (
    <div>   
      <div className="khmer-text text-xs">ប្រភេទអតិថិជន</div>
      <div className="english-text text-[10px]">Customer Type</div>
    </div>
  ),
  dataIndex: "type",
  render: (type) => (
    <Tag color={type === "special" ? "blue" : "green"} className="text-xs py-0">
  <div className="leading-none">
    <div className="khmer-text text-[9px]">{type === "special" ? "អតិថិជនពិសេស" : "អតិថិជនធម្មតា"}</div>
    <div className="english-text text-[8px] opacity-70">{type === "special" ? "Special" : "Regular"}</div>
  </div>
</Tag>
  ),
  filters: [
    {
      text: (
        <div>
          <div className="khmer-text text-xs">អតិថិជនពិសេស</div>
          <div className="english-text text-[10px]">Special</div>
        </div>
      ), 
      value: "special"
    },
    {
      text: (
        <div>
          <div className="khmer-text text-xs">អតិថិជនធម្មតា</div>
          <div className="english-text text-[10px]">Regular</div>
        </div>
      ), 
      value: "regular"
    },
  ],
  onFilter: (value, record) => record.type === value,
},
    // {
    //   key: "email",
    //   title: (
    //     <div>
    //       <div className="khmer-text">អ៊ីមែល</div>
    //       <div className="english-text">Email</div>
    //     </div>
    //   ),
    //   dataIndex: "email",
    // },
    {
      key: "tel",
      title: (
        <div>
          <div className="khmer-text">លេខទូរស័ព្ទ</div>
          <div className="english-text">Tel</div>
        </div>
      ),
      dataIndex: "tel",
    },
   
   {
  key: "address",
  title: (
    <div>
      <div className="khmer-text">អាសយដ្ឋាន</div>
      <div className="english-text">Address</div>
    </div>
  ),
  dataIndex: "address",
  width: 250,
  render: (text) => (
    <Tooltip title={text} placement="topLeft">
      <div className="expandable-text">
        {text || "គ្មាន"}
      </div>
    </Tooltip>
  ),
},
 {
      key: "id_card_number",
      title: (
        <div>
          <div className="khmer-text">លេខអត្តសញ្ញាណបណ្ណ</div>
          <div className="english-text">ID Card Number</div>
        </div>
      ),
      dataIndex: "id_card_number",
    },
    {
      key: "spouse_name",
      title: (
        <div>
          <div className="khmer-text">ឈ្មោះប្តី/ប្រពន្ធ</div>
          <div className="english-text">Spouse Name</div>
        </div>
      ),
      dataIndex: "spouse_name",
    },
    {
      key: "guarantor_name",
      title: (
        <div>
          <div className="khmer-text">ឈ្មោះអ្នកធានា</div>
          <div className="english-text">Guarantor Name</div>
        </div>
      ),
      dataIndex: "guarantor_name",
    },
    {
      key: "created_at",
      title: (
        <div>
          <div className="khmer-text">កាលបរិច្ឆេទបង្កើត</div>
          <div className="english-text">Created Date</div>
        </div>
      ),
      dataIndex: "create_at",
      render: (value) => dayjs(value).format("YYYY-MM-DD h:mm A"),
    },
      {
      key: "create_by",
      title: (
        <div>
          <div className="khmer-text">បង្កើតដោយ</div>
          <div className="english-text">Create By</div>
        </div>
      ),
      dataIndex: "create_by",
    },
    // {
    //   key: "status",
    //   title: (
    //     <div>
    //       <div className="khmer-text">ស្ថានភាព</div>
    //       <div className="english-text">Status</div>
    //     </div>
    //   ),
    //   dataIndex: "status",
    //   render: (status) => (
    //     <Tag color={status === 1 ? "green" : "red"}>
    //       <div>
    //         <div className="khmer-text">{status === 1 ? "សកម្ម" : "អសកម្ម"}</div>
    //         <div className="english-text">{status === 1 ? "Active" : "Inactive"}</div>
    //       </div>
    //     </Tag>
    //   ),
    //   filters: [
    //     {
    //       text: (
    //         <div>
    //           <div className="khmer-text">សកម្ម</div>
    //           <div className="english-text">Active</div>
    //         </div>
    //       ), value: 1
    //     },
    //     {
    //       text: (
    //         <div>
    //           <div className="khmer-text">អសកម្ម</div>
    //           <div className="english-text">Inactive</div>
    //         </div>
    //       ), value: 0
    //     },
    //   ],
    //   onFilter: (value, record) => record.status === value,
    // },
    {
      key: "action",
      title: (
        <div>
          <div className="khmer-text">សកម្មភាព</div>
          <div className="english-text">Action</div>
        </div>
      ),
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          {/* កែសម្រួល */}
          {permissionsLoaded && isPermission("customer.update") && (
            <Button
              type="primary"
              icon={<MdEdit />}
              onClick={() => onClickEdit(record)}
              size="small"
            />
          )}

          {/* លុប តែបើមានសិទ្ធិ និងមិននៅក្នុង blockedPermissions.delete */}
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

  // Customer form fields
  const renderCustomerForm = () => (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">ឈ្មោះ</span></div>}
            name="name"
            rules={[{ required: true, message: "តម្រូវឱ្យមានឈ្មោះ" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>

          <Form.Item
            label={<div><span className="khmer-text">ភេទ</span></div>}
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
            label={<div><span className="khmer-text">អ៊ីមែល</span></div>}
            name="email"
            rules={[{ required: true, message: "តម្រូវឱ្យមានអ៊ីមែល" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>

         <Form.Item
  label={<div><span className="khmer-text">ទូរស័ព្ទ</span></div>}
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
            label={<div><span className="khmer-text">លេខអត្តសញ្ញាណបណ្ណ</span></div>}
            name="id_card_number"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">កាលបរិច្ឆេទផុតកំណត់អត្តសញ្ញាណបណ្ណ</span></div>}
            name="id_card_expiry"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={<div><span className="khmer-text">អាសយដ្ឋាន</span></div>}
            name="address"
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">ឈ្មោះប្តី/ប្រពន្ធ</span></div>}
            name="spouse_name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">លេខទូរស័ព្ទប្តី/ប្រពន្ធ</span></div>}
            name="spouse_tel"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">ឈ្មោះអ្នកធានា</span></div>}
            name="guarantor_name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">លេខទូរស័ព្ទអ្នកធានា</span></div>}
            name="guarantor_tel"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={<div><span className="khmer-text">ស្ថានភាព</span></div>}
            name="status"
            initialValue={1}
          >
            <Select>
              <Select.Option value={1}>
                <div>
                  <span className="khmer-text">សកម្ម</span>
                  <span className="english-text"> (Active)</span>
                </div>
              </Select.Option>
              <Select.Option value={0}>
                <div>
                  <span className="khmer-text">អសកម្ម</span>
                  <span className="english-text"> (Inactive)</span>
                </div>
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>

          <Form.Item
            label={
              <div>
                <span className="khmer-text">ប្រភេទអតិថិជន</span>
                <span className="english-text"> (Customer Type)</span>
              </div>
            }
            name="type"
            rules={[{ required: true, message: "តម្រូវឱ្យមានប្រភេទអតិថិជន" }]}
          >
            <Select>
              <Select.Option value="regular">
                <div>
                  <span className="khmer-text">អតិថិជនធម្មតា</span>
                  <span className="english-text"> (Regular)</span>
                </div>
              </Select.Option>
              <Select.Option value="special">
                <div>
                  <span className="khmer-text">អតិថិជនពិសេស</span>
                  <span className="english-text"> (Special)</span>
                </div>
              </Select.Option>
            </Select>
          </Form.Item>

        </Col>
      </Row>
    </Form>
  );

  // Assign to user form with separate form instance
  const renderAssignForm = () => (
    <Form form={assignForm} layout="vertical">
      <Form.Item
        label={<div><span className="khmer-text">អតិថិជន</span></div>}
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
        label={<div><span className="khmer-text">អ្នកប្រើប្រាស់</span></div>}
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
            <h1 className="khmer-text">ការគ្រប់គ្រងអតិថិជន</h1>
            <p className="english-text">Customer Management</p>
          </div>
          <Input.Search
            onChange={(e) =>
              setState((prev) => ({ ...prev, txtSearch: e.target.value }))
            }
            allowClear
            onSearch={getList}
            placeholder="ស្វែងរកតាមឈ្មោះ"
          />
          <Button className="khmer-text" type="primary" onClick={getList} icon={<CiSearch />}>
            ស្វែងរក
          </Button>
          {permissionsLoaded && isPermission("customer.getone") && (
            <Button
              className="khmer-text"
              type="primary"
              icon={<MdSecurity />} // <-- add icon here
              onClick={() => setDeletePermissionModalVisible(true)}
            >
              កំណត់សិទ្ធ
            </Button>
          )}
        </Space>
        <div>
          {permissionsLoaded && isPermission("customer.getone") && (
            <Button
              className="khmer-text mr-2"
              type="primary"
              onClick={onClickAssignToUser}
              icon={<IoPersonAddSharp />}
            >
              បង្កើតអតិថិជនទៅអ្នកប្រើប្រាស់
            </Button>
          )}
          {canCreateCustomer && (
            <Button
              className="khmer-text"
              type="primary"
              onClick={onClickAddBtn}
              icon={<MdOutlineCreateNewFolder />}
            >
              បង្កើតថ្មី
            </Button>
          )}
        </div>
      </div>

      {/* Customer Table */}
      
     <Table
  rowClassName={() => "pos-row"}
  rowKey="id"
  dataSource={list}
  columns={columns}
  pagination={false}
  scroll={{ 
    x: 180,
    y: 'calc(100vh - 350px)' // This enables vertical scroll with sticky header
  }}
  sticky={{
    offsetHeader: 0 // Ant Design's built-in sticky header
  }}
/>

      {/* Permission Settings Modal */}
      <Modal
        title="កំណត់សិទ្ធអ្នកប្រើប្រាស់" className="khmer-text"
        open={deletePermissionModalVisible}
        onOk={() => setDeletePermissionModalVisible(false)}
        onCancel={() => setDeletePermissionModalVisible(false)}
      >
        {/* Select Permission Type */}
        <div className="mb-4">
          <Select
            style={{ width: "100%" }}
            value={selectedPermissionType}
            onChange={(value) => setSelectedPermissionType(value)}
          >
            <Select.Option value="delete">មិនអនុញ្ញាតឲ្យលុប</Select.Option>
            <Select.Option value="create">មិនអនុញ្ញាតឲ្យបង្កើត</Select.Option>
          </Select>
        </div>

        {/* Checkbox Group */}
        <Checkbox.Group
          value={blockedPermissions[selectedPermissionType]}
          onChange={handleCheckboxChange}
        >
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            {(config?.user || []).map((user) => {
              const [namePart, ...rest] = user.label.split(" - ");
              const subPart = rest.join(" - ");
              return (
                <Checkbox key={user.value} value={user.value} className="custom-checkbox-user">
                  <span className="custom-checkbox-label">{namePart}</span>
                  <span className="custom-checkbox-sub">{subPart}</span>
                </Checkbox>
              );
            })}
          </div>
        </Checkbox.Group>
      </Modal>

      {/* Create/Edit Customer Modal */}
      <Modal
        title={
          <div>
            <span className="khmer-text">
              {state.isEditing ? "កែសម្រួលអតិថិជន" : "បង្កើតអតិថិជន"}
            </span>
          </div>
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
          <div>
            <span className="khmer-text">ចាត់ចែងអតិថិជនទៅអ្នកប្រើប្រាស់</span>
          </div>
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
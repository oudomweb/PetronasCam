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
} from "antd";
import { CiSearch } from "react-icons/ci";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import { isPermission, request } from "../../util/helper";
import { MdDelete, MdEdit, MdPerson } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { getProfile } from "../../store/profile.store";
import { configStore } from "../../store/configStore";
import { LuUserRoundSearch } from "react-icons/lu";

function CustomerPage() {
  const { config } = configStore();
  
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    txtSearch: "",
    user_id: null,
    isEditing: false,
    visibleAssignModal: false,
  });
  useEffect(() => {
    const userId = getProfile();
    if (userId) {
      setState((prev) => ({ ...prev, user_id: userId }));
    } else {
      message.error("No user ID found. Please log in again.");
    }
  }, []);
  useEffect(() => {
    if (state.user_id) {
      getList();
    }
  }, [state.user_id]);
  const getList = async () => {
    if (!state.user_id) {
      message.error("User ID is required!");
      return;
    }
    const param = {
      txtSearch: state.txtSearch || "",
    };
    try {
      setLoading(true);
      const { id } = getProfile();
      if (!id) return;
      const res = await request(`customer/${id}`, "get", param);
      setLoading(false);
      if (res?.success) {
        setList(res.list || []);
      } else {
        message.error(res?.message || "Failed to fetch customer list");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching customer list:", error);
      message.error("Failed to fetch customer list");
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
  const onClickEdit = (record) => {
    setState((prev) => ({
      ...prev,
      visibleModal: true,
      isEditing: true,
      id: record.id,
    }));
    form.setFieldsValue(record);
  };
  const onClickDelete = (record) => {
    if (!record.id) {
      message.error("Customer ID is missing!");
      return;
    }
    Modal.confirm({
      title: "Remove Customer",
      content: "Are you sure you want to remove this customer?",
      onOk: async () => {
        try {
          const res = await request(`customer/${record.id}`, "delete");
          if (res && !res.error) {
            message.success(res.message);
            getList();
          } else {
            message.error(res.message || "This customer is currently in use and cannot be deleted.!");
          }
        } catch (error) {
          console.error("Delete Error:", error);
          message.error("An error occurred while deleting the customer.");
        }
      },
    });
  };
  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { id, isEditing } = state;
      if (isEditing) {
        const res = await request(`customer/${id}`, "put", values);
        if (res && !res.error) {
          message.success("Customer updated successfully!");
          setState((prev) => ({ ...prev, visibleModal: false }));
          getList();
        } else {
          message.error("Failed to update customer.");
        }
      } else {
        const res = await request("customer", "post", values);
        if (res && !res.error) {
          message.success("Customer created successfully!");
          setState((prev) => ({ ...prev, visibleModal: false }));
          getList();
        } else {
          message.error("Failed to create customer.");
        }
      }
    } catch (error) {
      console.error("Validation or API error:", error);
    }
  };
  const handleModalCancel = () => {
    setState((prev) => ({ ...prev, visibleModal: false }));
    form.resetFields();
  };

  const onClickAddBtntoUser = () => {

    // alert("btn new tran")
  }






  const handleAssignToUserSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { customer_id, assigned_user_id } = values;

      // Call API to assign customer to user
      const res = await request(`customer/user`, "post", {
        customer_id,
        assigned_user_id,
      });

      if (res && !res.error) {
        message.success("Customer assigned successfully!");
        setState((prev) => ({ ...prev, visibleAssignModal: false }));
        getList(); // Refresh the list
      } else {
        message.error(res.message || "Failed to assign customer.");
      }
    } catch (error) {
      console.error("Validation or API error:", error);
      message.error("An error occurred while assigning the customer.");
    }
  };

  const onClickAssignToUser = () => {
    setState((prev) => ({
      ...prev,
      visibleAssignModal: true, // បើក Modal ចាត់ចែង
    }));
  };
  return (
    <MainPage loading={loading}>
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
            placeholder="Search by name"
          />
          <Button type="primary" onClick={getList} icon={<CiSearch />}>
            Filter
          </Button>
        </Space>
        {isPermission ("customer.create") && (
        <Button type="primary" onClick={onClickAssignToUser} icon={<IoPersonAddSharp />}>
          CREATE CUSTOMER TO USER
        </Button>)}
        {isPermission("customer.create") && ( 
        <Button type="primary" onClick={onClickAddBtn} icon={<MdOutlineCreateNewFolder />}>
          NEW
        </Button>
  )}
      </div>
      <Table
        rowClassName={() => "pos-row"}
        rowKey="id"
        dataSource={list}
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
                {text || "N/A"}
              </div>
            ),
          },
          {
            key: "type",
            title: (
              <div>
                <div className="khmer-text">ប្រភេទអ្នកលក់</div>
                <div className="english-text">Seller Type</div>
              </div>
            ),
            dataIndex: "type",
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
              <Space>
                {isPermission("customer.update")&&(
                <Button
                  type="primary"
                  icon={<MdEdit />}
                  onClick={() => onClickEdit(record)}
                  size="small"
                />)}
                {isPermission("customer.update")&&(
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => onClickDelete(record)}
                  size="small"
                />)}
              </Space>
            ),
          },
        ]}
      />


      <Modal
        title={
          <div>
            <span className="khmer-text">ចាត់ចែងអតិថិជនទៅអ្នកប្រើប្រាស់</span>
          </div>
        }
        visible={state.visibleAssignModal}
        onOk={handleAssignToUserSubmit}
        onCancel={() => setState((prev) => ({ ...prev, visibleAssignModal: false }))}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={
              <div>
                <span className="khmer-text">អតិថិជន</span>
              </div>
            }
            name="customer_id"
            rules={[{ required: true, message: "Customer is required" }]}
          >
            <Select placeholder="Select a customer">
              {list.map((customer) => (
                <Select.Option key={customer.id} value={customer.id}>
                  {customer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={
              <div>
                <span className="khmer-text">អ្នកប្រើប្រាស់</span>
              </div>
            }
            name="assigned_user_id"
            rules={[{ required: true, message: "User is required" }]}
          >
            <Select
              style={{ width: 300 }}
              allowClear
              placeholder="Select User"
              value={state.user_id || undefined} // Use `undefined` when value is null or empty
              options={config?.user || []} // Ensure options is always an array
              onChange={(value) => {
                setFilter((prev) => ({
                  ...prev,
                  user_id: value || null, // Set to `null` if value is cleared
                }));
              }}
              suffixIcon={<LuUserRoundSearch />} // Use `suffixIcon` instead of `icon`
            />

          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          <div>
            <span className="khmer-text">{state.isEditing ? "កែសម្រួលអតិថិជន" : "បង្កើតអតិថិជន"}</span>
          </div>
        }
        visible={state.visibleModal}
        onOk={handleModalSubmit}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={
              <div>
                <span className="khmer-text">ឈ្មោះ</span>
              </div>
            }
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <div>
                <span className="khmer-text">ទូរស័ព្ទ</span>
              </div>
            }
            name="tel"
            rules={[{ required: true, message: "Tel is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <div>
                <span className="khmer-text">អ៊ីមែល</span>
              </div>
            }
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <div>
                <span className="khmer-text">អាសយដ្ឋាន</span>
              </div>
            }
            name="address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={
              <div>
                <span className="khmer-text">ប្រភេទ</span>
              </div>
            }
            name="type"
            rules={[{ required: true, message: "Type is required" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </MainPage>
  );
}
export default CustomerPage;
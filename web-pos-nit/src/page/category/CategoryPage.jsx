import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { request } from "../../util/helper";
import { MdAdd, MdDelete, MdEdit, MdOutlineCreateNewFolder } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import "../category/Category.module.css"; // Import CSS file for Khmer font

function CategoryPage() {
  const { config } = configStore();
  const [formRef] = Form.useForm();
  const [list, setList] = useState([]);
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

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setLoading(true);
    const res = await request("category", "get");
    setLoading(false);
    if (res) {
      setList(res.list);
    }
  };

  const onClickEdit = (data) => {
    setState({
      ...state,
      visibleModal: true,
      id: data.id,
    });
    formRef.setFieldsValue({
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
    });
  };

  const onClickDelete = async (data) => {
    Modal.confirm({
      title: "លុប",
      content: "Are you sure you want to remove this category?",
      okText: "យល់ព្រម",
      cancelText: "បោះបង់",
      onOk: async () => {
        const res = await request("category", "delete", { id: data.id });
        if (res && !res.error) {
          message.success(res.message);
          setList(list.filter((item) => item.id !== data.id));
        }
      },
    });
  };

  const onClickAddBtn = () => {
    setState({
      ...state,
      visibleModal: true,
    });
    formRef.resetFields();
  };

  const onCloseModal = () => {
    formRef.resetFields();
    setState({
      ...state,
      visibleModal: false,
      id: null,
    });
  };

  const onFinish = async (items) => {
    const data = {
      id: formRef.getFieldValue("id"),
      name: items.name,
      description: items.description,
      status: items.status,
      parent_id: 0,
    };
    const method = data.id ? "put" : "post";

    const res = await request("category", method, data);
    if (res && !res.error) {
      message.success(res.message);
      getList();
      onCloseModal();
    }
  };

  return (
    <MainPage loading={loading}>
      <div className="pageHeader">
        <Space>
          <div className="khmer-title">ប្រភេទផលិតផល</div>
          <Input.Search
            onChange={(e) => setState((prev) => ({ ...prev, txtSearch: e.target.value }))}
            allowClear
            onSearch={getList}
            placeholder="Search"
          />
        </Space>
        <Button type="primary" onClick={onClickAddBtn} icon={<MdOutlineCreateNewFolder />}>
          NEW
        </Button>
      </div>

      <Modal
        open={state.visibleModal}
        title={<div className="khmer-title">{formRef.getFieldValue("id") ? "កែសម្រួលប្រភេទ" : "ប្រភេទថ្មី"}</div>}
        footer={null}
        onCancel={onCloseModal}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item
            name="name"
            label={<div className="khmer-title">ឈ្មោះប្រភេទ</div>}
            rules={[{ required: true, message: "Please enter category name!" }]}
          >
            <Input placeholder="Input Category name" />
          </Form.Item>

          <Form.Item name="description" label={<div className="khmer-title">ការពិពណ៌នា</div>}>
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>

          <Form.Item name="status" label={<div className="khmer-title">ស្ថានភាព</div>}>
            <Select
              placeholder="Select status"
              options={[
                { label: <div className="khmer-title">សកម្ម</div>, value: 1 },
                { label: <div className="khmer-title">អសកម្ម</div>, value: 0 },
              ]}
            />
          </Form.Item>

          <Space>
            <Button onClick={onCloseModal}>
              <span className="khmer-text">បោះបង់</span>
            </Button>
            <Button type="primary" htmlType="submit">
              <span className="khmer-title">{formRef.getFieldValue("id") ? "កែសម្រួល" : "រក្សាទុក"}</span>
            </Button>
          </Space>
        </Form>
      </Modal>

      <Table
        dataSource={list}
        columns={[
          {
            key: "No",
            title: <div className="khmer-text">លេខ</div>,
            render: (item, data, index) => index + 1,
          },
          {
            key: "name",
            title: <div className="khmer-text">ឈ្មោះ</div>,
            dataIndex: "name",
            render: (text) => <div className="khmer-title">{text}</div>,
          },
          {
            key: "description",
            title: <div className="khmer-text">សេចក្ដីពិពណ៌នា</div>,
            dataIndex: "description",
            render: (text) => <div className="khmer-title">{text}</div>,
          },
          {
            key: "status",
            title: <div className="khmer-text">ស្ថានភាព</div>,
            dataIndex: "status",
            render: (status) => (status === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>),
          },
          {
            key: "Action",
            title: <div className="khmer-text">សកម្មភាព</div>,
            align: "center",
            render: (item, data) => (
              <Space>
                <Button type="primary" icon={<MdEdit />} onClick={() => onClickEdit(data)} />
                <Button type="primary" danger icon={<MdDelete />} onClick={() => onClickDelete(data)} />
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}

export default CategoryPage;

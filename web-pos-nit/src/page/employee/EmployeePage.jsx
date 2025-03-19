import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  DatePicker,
  Tag
} from "antd";
import { formatDateClient, request } from "../../util/helper";
import * as XLSX from 'xlsx/xlsx.mjs';
import { MdDelete, MdEdit, MdNewLabel } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import dayjs from 'dayjs';
import { FiSearch } from "react-icons/fi";
import { IoBook } from "react-icons/io5";
function EmployeePage() {
  const [formRef] = Form.useForm();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    txtSearch: "",
  });
  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    setLoading(true);
    const param = {
      txtSearch: state.txtSearch,
    };
    const res = await request("employee", "get", param);
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
      gender: data.gender,
      dob: data.dob ? dayjs(data.dob) : null,
      position: data.position,
      salary: data.salary,
      tel: data.tel,
      email: data.email,
      address: data.address,
      status: data.status,
    });
  };
  const onClickDelete = async (data) => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure you want to remove this employee?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        const res = await request("employee", "delete", {
          id: data.id,
        });
        if (res && !res.error) {
          message.success(res.message);
          const newList = list.filter((item) => item.id !== data.id);
          setList(newList);
        }
      },
    });
  };
  const onClickAddBtn = () => {
    setState({
      ...state,
      visibleModal: true,
      id: null,
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
  const onFinish = async (values) => {
    const data = {
      id: state.id,
      name: values.name,
      gender: values.gender,
      dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      position: values.position,
      salary: values.salary,
      tel: values.tel,
      email: values.email,
      address: values.address,
      status: values.status,
    };
    const method = state.id ? "put" : "post";
    const res = await request("employee", method, data);
    if (res && !res.error) {
      message.success(res.message);
      getList();
      onCloseModal();
    }
  };
  const ExportToExcel = () => {
    if (list.length === 0) {
      message.warning("No data available to export.");
      return;
    }
  
    // Show loading message
    const hideLoadingMessage = message.loading(
      <div className="khmer-text">សូមមេត្តារងចាំ...</div>,
      0 // 0 means the message will not auto-close
    );
  
    // Simulate a delay for testing
    setTimeout(() => {
      try {
        // Prepare data for export
        const data = list.map((item) => ({
          ...item,
          gender: item.gender === 1 ? "Male" : "Female",
          dob: formatDateClient(item.dob),
          create_at: formatDateClient(item.create_at),
        }));
  
        // Create a worksheet and workbook
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Employee");
  
        // Write the file
        XLSX.writeFile(wb, "Employee_Data.xlsx");
  
        // Hide the loading message
        hideLoadingMessage();
  
        // Show success message
        message.success("Export completed successfully!");
      } catch (error) {
        // Hide the loading message in case of error
        hideLoadingMessage();
  
        // Show error message
        message.error("Failed to export data. Please try again.");
        console.error("Export error:", error);
      }
    }, 2000); // Simulate a 2-second delay
  };
  return (
    <MainPage loading={loading}>
      <div className="pageHeader">
        <Space>
          <div className="khmer-text">គ្រប់គ្រងបុគ្គលិក</div>
          <Input.Search
            onChange={(e) =>
              setState((prev) => ({ ...prev, txtSearch: e.target.value }))
            }
            allowClear
            onSearch={getList}
            placeholder="Search by name"
          />
          <Button type="primary" onClick={getList} icon={<FiSearch />}>
            Filter
          </Button>
          <Button type="primary" onClick={ExportToExcel} icon={<IoBook />}>
            Export to Exel
          </Button>
        </Space>
        <Button type="primary" onClick={onClickAddBtn} icon={<MdNewLabel />}>
          NEW
        </Button>
      </div>
      <Modal
    open={state.visibleModal}
    title={
        <div>
            <div className="khmer-text">
                {state.id ? "កែសម្រួលបុគ្គលិក" : "បុគ្គលិកថ្មី"}
            </div>
           
        </div>
    }
    footer={null}
    onCancel={onCloseModal}
>
    <Form layout="vertical" onFinish={onFinish} form={formRef}>
        {/* Hidden ID Field */}
        <Form.Item name="id" hidden>
            <Input />
        </Form.Item>

        {/* Name */}
        <Form.Item
            name="name"
            label={
                <div>
                    <div className="khmer-text">ឈ្មោះ</div>
                </div>
            }
            rules={[{ required: true, message: "Please input the employee name" }]}
        >
            <Input placeholder="Input employee name" />
        </Form.Item>

        {/* Gender */}
        <Form.Item
            name="gender"
            label={
                <div>
                    <div className="khmer-text">ភេទ</div>
                </div>
            }
            rules={[{ required: true, message: "Please select gender" }]}
        >
            <Select
                placeholder="Select gender"
                options={[
                    { label: "Male", value: 1 },
                    { label: "Female", value: 0 },
                ]}
            />
        </Form.Item>

        {/* Date of Birth */}
        <Form.Item
            name="dob"
            label={
                <div>
                    <div className="khmer-text">ថ្ងៃខែឆ្នាំកំណើត</div>
                </div>
            }
        >
            <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        {/* Position */}
        <Form.Item
            name="position"
            label={
                <div>
                    <div className="khmer-text">តួនាទី</div>
                </div>
            }
            rules={[{ required: true, message: "Please input the position" }]}
        >
            <Input placeholder="Input position" />
        </Form.Item>

        {/* Salary */}
        <Form.Item
            name="salary"
            label={
                <div>
                    <div className="khmer-text">ប្រាក់ខែ</div>
                </div>
            }
            rules={[{ required: true, message: "Please input the salary" }]}
        >
            <Input type="number" placeholder="Input salary" />
        </Form.Item>

        {/* Telephone */}
        <Form.Item
            name="tel"
            label={
                <div>
                    <div className="khmer-text">ទូរស័ព្ទ</div>
                </div>
            }
            rules={[{ required: true, message: "Please input the telephone number" }]}
        >
            <Input placeholder="Input telephone number" />
        </Form.Item>

        {/* Email */}
        <Form.Item
            name="email"
            label={
                <div>
                    <div className="khmer-text">អ៊ីមែល</div>
                </div>
            }
            rules={[{ type: "email", message: "Please input a valid email" }]}
        >
            <Input placeholder="Input email" />
        </Form.Item>

        {/* Address */}
        <Form.Item
            name="address"
            label={
                <div>
                    <div className="khmer-text">អាសយដ្ឋាន</div>
                </div>
            }
        >
            <Input.TextArea placeholder="Input address" />
        </Form.Item>

        {/* Status */}
        <Form.Item
            name="status"
            label={
                <div>
                    <div className="khmer-text">ស្ថានភាព</div>
                </div>
            }
            rules={[{ required: true, message: "Please select status" }]}
        >
            <Select
                placeholder="Select status"
                options={[
                    { label: "Active", value: 1 },
                    { label: "Inactive", value: 0 },
                ]}
            />
        </Form.Item>

        {/* Buttons */}
        <Space>
            <Button onClick={onCloseModal}>
                <div>
                    <div className="khmer-text">បោះបង់</div>
                </div>
            </Button>
            <Button type="primary" htmlType="submit">
                <div>
                    <div className="khmer-text">
                        {state.id ? "កែសម្រួល" : "រក្សាទុក"}
                    </div>
                   
                </div>
            </Button>
        </Space>
    </Form>
</Modal>
      <Table
    rowClassName={() => "pos-row"}
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
            render: (value) => (value === 1 ? "Male" : "Female"),
        },
        {
            key: "dob",
            title: (
                <div>
                    <div className="khmer-text">ថ្ងៃខែឆ្នាំកំណើត</div>
                    <div className="english-text">Date of Birth</div>
                </div>
            ),
            dataIndex: "dob",
            render: (value) => formatDateClient(value),
        },
        {
            key: "position",
            title: (
                <div>
                    <div className="khmer-text">តួនាទី</div>
                    <div className="english-text">Position</div>
                </div>
            ),
            dataIndex: "position",
        },
        {
            key: "salary",
            title: (
                <div>
                    <div className="khmer-text">ប្រាក់ខែ</div>
                    <div className="english-text">Salary</div>
                </div>
            ),
            dataIndex: "salary",
            render: (value) => `$${value}`,
        },
        {
            key: "tel",
            title: (
                <div>
                    <div className="khmer-text">ទូរស័ព្ទ</div>
                    <div className="english-text">Telephone</div>
                </div>
            ),
            dataIndex: "tel",
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
            key: "address",
            title: (
                <div>
                    <div className="khmer-text">អាសយដ្ឋាន</div>
                    <div className="english-text">Address</div>
                </div>
            ),
            dataIndex: "address",
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
            render: (value) => (
                <Tag color={value === 1 ? "green" : "red"}>
                    {value === 1 ? "Active" : "Inactive"}
                </Tag>
            ),
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
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<MdEdit />}
                        onClick={() => onClickEdit(record)}
                    />
                    <Button
                        type="primary"
                        danger
                        icon={<MdDelete />}
                        onClick={() => onClickDelete(record)}
                    />
                </Space>
            ),
        },
    ]}
    pagination={{ pageSize: 10 }}
/>
    </MainPage>
  );
}
export default EmployeePage;
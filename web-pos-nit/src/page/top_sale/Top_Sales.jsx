import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Image,
  Space,
  Table,
  Tag,
} from "antd";
import { request } from "../../util/helper";
import {MdRefresh } from "react-icons/md";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
function Top_Sales() {
  const { config } = configStore();
  const [formRef] = Form.useForm();
  const [list, setList] = useState([]);
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
  useEffect(() => {
    getList();
  }, []);
  const getList = async () => {
    setLoading(true);
    const res = await request("top_sales", "get");
    setLoading(false);
    if (res) {
      setList(res.list);
    }
  };
  const refreshList =()=>{
   window.location.reload();
  }    
  return (
    <MainPage loading={loading}>
      <div className="pageHeader" style={{ marginBottom: "20px" }}>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <h2 style={{ fontWeight: "bold", color: "#1890ff" }}>Top Sales</h2>
          <Space>
            <Button
              icon={<MdRefresh />}
              onClick={()=>refreshList()}
              type="primary"
              style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
            >
              Refresh
            </Button>
          </Space>
        </Space>
      </div>
      <Table
        dataSource={list}
        columns={[
          {
            key: "No",
            title: "No",
            render: (item, data, index) => (
              <span style={{ fontWeight: "bold" }}>{index + 1}</span>
            ),
            align: "center",
          },
          {
            key: "name",
            title: "Product Name",
            dataIndex: "product_name",
            render: (text) => (
              <span style={{ fontWeight: "bold", color: "#595959" }}>{text}</span>
            ),
          },
          {
            key: "name",
            title: "Category Name",
            dataIndex: "category_name",
            render: (text) => (
              <span style={{ fontWeight: "bold", color: "#595959" }}>{text}</span>
            ),
          },
          {
            key: "total_sale_amount",
            title: "Total Sale Amount",
            dataIndex: "total_sale_amount",
            render: (value) => (
              <Tag color="green" style={{ fontSize: "14px" }}>
                ${value.toLocaleString()}
              </Tag>
            ),
            align: "center",
          },
          {
            key: "image",
            title: "Image",
            dataIndex: "product_image",
            render: (value) =>
              value ? (
                <Image
                  src={"http://localhost:/fullstack/" + value}
                  style={{
                    width: 60,
                    borderRadius: "4px",
                    border: "1px solid #f0f0f0",
                  }}
                  alt="Product"
                />
              ) : (
                <div
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "4px",
                  }}
                >
                  <span style={{ color: "#8c8c8c" }}>No Image</span>
                </div>
              ),
            align: "center",
          },
        ]}
        bordered
        pagination={false}
        rowClassName="custom-row"
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
    </MainPage>
  );
}
export default Top_Sales;
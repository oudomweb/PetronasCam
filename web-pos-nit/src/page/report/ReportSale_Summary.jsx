import React, { useEffect, useState, useRef } from "react";
import { Chart } from "react-google-charts";
import { request } from "../../util/helper";
import { Button, DatePicker, Select, Space, Table, Typography } from "antd";
import { DownloadOutlined, PrinterOutlined, BarChartOutlined, LineChartOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { configStore } from "../../store/configStore";
import html2canvas from "html2canvas";

const { Title } = Typography;
const { RangePicker } = DatePicker;

export const chartOptions = {
  curveType: "function",
  legend: { position: "bottom" },
  colors: ["#1890ff", "#52c41a", "#fa8c16"],
  backgroundColor: "#ffffff",
  chartArea: { width: "85%", height: "70%" },
  hAxis: {
    title: "Date",
    gridlines: { color: "#f0f0f0" }
  },
  vAxis: {
    title: "Sales ($)",
    gridlines: { color: "#f0f0f0" }
  },
  animation: {
    startup: true,
    duration: 1000,
    easing: "out"
  }
};

function ReportSale_Summary() {
  const { config } = configStore();
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState("LineChart");
  const reportRef = useRef(null);
  const chartRef = useRef(null);
  
  const today = dayjs();
  const thirtyDaysAgo = dayjs().subtract(29, "day");
  
  const [filter, setFilter] = useState({
    from_date: thirtyDaysAgo,
    to_date: today,
    category_id: null,
    brand_id: null
  });
  
  const [state, setState] = useState({
    Data_Chat: [["Day", "Sale"]],
    list: [],
  });
  
  useEffect(() => {
    getList();
  }, []);
  
  const onreset = () => {
    const resetFilter = {
      from_date: thirtyDaysAgo,
      to_date: today,
      category_id: null,
      brand_id: null,
    };
    
    setFilter(resetFilter);
    
    getList({
      from_date: thirtyDaysAgo.format("YYYY-MM-DD"),
      to_date: today.format("YYYY-MM-DD"),
      category_id: null,
      brand_id: null,
    });
  };
  
  const getList = async (customFilter = null) => {
    try {
      setLoading(true);
      
      const fromDate = customFilter?.from_date || 
                      (filter.from_date ? filter.from_date.format("YYYY-MM-DD") : thirtyDaysAgo.format("YYYY-MM-DD"));
      const toDate = customFilter?.to_date || 
                    (filter.to_date ? filter.to_date.format("YYYY-MM-DD") : today.format("YYYY-MM-DD"));
      
      const param = customFilter || {
        from_date: fromDate,
        to_date: toDate,
        category_id: filter.category_id,
        brand_id: filter.brand_id,
      };
      
      console.log("API params:", param); // Debugging
      
      const res = await request("report_Sale_Sammary", "get", param);
      
      if (res && res.list && Array.isArray(res.list) && res.list.length > 0) {
        const listTMP = [["Day", "Sale"]];
        res.list.forEach((item) => {
          listTMP.push([item.order_date, Number(item.total_amount) || 0]);
        });
        setState({
          Data_Chat: listTMP,
          list: res.list,
        });
      } else {
        setState({
          Data_Chat: [["Day", "Sale"]],
          list: [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch sales summary:", error);
      setState({
        Data_Chat: [["Day", "Sale"]],
        list: [],
      });
    } finally {
      setLoading(false);
    }
  };
  
  const downloadChart = () => {
    if (chartRef.current) {
      try {
        html2canvas(chartRef.current).then(canvas => {
          const imageData = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imageData;
          link.download = `sales_report_${dayjs().format("YYYY-MM-DD")}.png`;
          link.click();
        }).catch(error => {
          console.error("Failed to generate chart image:", error);
        });
      } catch (error) {
        console.error("Error in downloadChart:", error);
      }
    } else {
      console.error("Chart reference is undefined.");
    }
  };
  
  const printReport = () => {
    if (reportRef.current) {
      const printWindow = window.open('', '_blank');
      
      const styles = `
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #1890ff; text-align: center; }
        .date-range { text-align: center; margin-bottom: 20px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f0f0f0; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
        .total-amount { font-weight: bold; color: green; }
        .order-date { color: #1890ff; }
      `;
      
      let chartImage = '';
      if (chartRef.current && state.Data_Chat.length > 1) {
        const chartContainer = chartRef.current.querySelector('div');
        if (chartContainer) {
          html2canvas(chartContainer).then(canvas => {
            chartImage = `<img src="${canvas.toDataURL()}" style="max-width: 100%; margin: 20px 0;" />`;
            
            printWindow.document.body.innerHTML = getReportHTML(chartImage);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
          });
        }
      } else {
        printWindow.document.open();
        printWindow.document.write(getReportHTML());
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
      
      function getReportHTML(chartImg = '') {
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Sales Report</title>
              <style>${styles}</style>
            </head>
            <body>
              <h1>Sales Performance Report</h1>
              <div class="date-range">
                From: ${filter.from_date?.format("DD/MM/YYYY") || thirtyDaysAgo.format("DD/MM/YYYY")} 
                To: ${filter.to_date?.format("DD/MM/YYYY") || today.format("DD/MM/YYYY")}
              </div>
              
              ${chartImg}
              
              <h2>Sales Details</h2>
              <table>
                <thead>
                  <tr>
                    <th>Order Date</th>
                    <th>Total Quantity</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.list.map(item => `
                    <tr>
                      <td class="order-date">${item.order_date}</td>
                      <td>${item.total_qty} Liter</td>
                      <td class="total-amount">$${item.total_amount}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `;
      }
    }
  };
  
  const toggleChartType = () => {
    setChartType(chartType === "LineChart" ? "BarChart" : "LineChart");
  };
  
  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setFilter((prev) => ({
        ...prev,
        from_date: dates[0],
        to_date: dates[1]
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        from_date: thirtyDaysAgo,
        to_date: today
      }));
    }
  };
  
  return (
    <div ref={reportRef} style={{ padding: "20px", backgroundColor: "#f7f7f7", borderRadius: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Title level={3} style={{ margin: 0, color: "#1890ff" }}>Sales Performance Dashboard</Title>
        <Space>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={downloadChart}
            style={{ backgroundColor: "#52c41a", color: "white" }}
          >
            Download Chart
          </Button>
          <Button 
            icon={<PrinterOutlined />} 
            onClick={printReport}
            style={{ backgroundColor: "#fa8c16", color: "white" }}
          >
            Print Report
          </Button>
          <Button 
            icon={chartType === "LineChart" ? <BarChartOutlined /> : <LineChartOutlined />} 
            onClick={toggleChartType}
          >
            Chart Type: {chartType === "LineChart" ? "Line" : "Bar"}
          </Button>
        </Space>
      </div>
      
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
        <Space wrap style={{ marginBottom: "20px" }}>
          <RangePicker
            format="DD/MM/YYYY"
            allowClear={false}
            value={[filter.from_date, filter.to_date]}
            onChange={handleDateRangeChange}
          />
          <Select
            allowClear
            placeholder="Select Category"
            value={filter.category_id}
            options={config?.category}
            style={{ minWidth: "150px" }}
            onChange={(value) => {
              setFilter((prev) => ({
                ...prev,
                category_id: value
              }));
            }}
          />
          <Select
            allowClear
            placeholder="Select Brand"
            value={filter.brand_id}
            options={config?.brand}
            style={{ minWidth: "150px" }}
            onChange={(value) => {
              setFilter((prev) => ({
                ...prev,
                brand_id: value
              }));
            }}
          />
          <Button onClick={onreset}>
            Reset Filters
          </Button>
          <Button type="primary" onClick={() => getList()} loading={loading}>
            Apply Filters
          </Button>
        </Space>
        
        <div ref={chartRef} style={{ backgroundColor: "white", padding: "10px", borderRadius: "8px", minHeight: "400px" }}>
          {state.Data_Chat.length > 1 ? (
            <Chart
              chartType={chartType}
              width="100%"
              height="400px"
              data={state.Data_Chat}
              options={chartOptions}
              legendToggle
            />
          ) : (
            <div style={{ textAlign: "center", marginTop: "20px", color: "#888", height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div>
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>No data available</div>
                <div>Try adjusting your filters to see sales data</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <Title level={4} style={{ marginBottom: "20px", color: "#1890ff" }}>Sales Details</Title>
        <Table
          style={{
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
          }}
          dataSource={state.list}
          columns={[
            {
              key: "order_date",
              title: "Order Date",
              dataIndex: "order_date",
              render: (value) => (
                <div style={{ backgroundColor: "#1890ff", color: "white", padding: "4px 8px", borderRadius: "4px", display: "inline-block" }}>
                  {value}
                </div>
              ),
            },
            {
              key: "total_qty",
              title: "Total QTY",
              dataIndex: "total_qty",
              render: (value) => (
                <div style={{ backgroundColor: "#52c41a", color: "white", padding: "4px 8px", borderRadius: "4px", display: "inline-block" }}>
                  {value} Liter
                </div>
              ),
            },
            {
              key: "total_amount",
              title: "Total Amount",
              dataIndex: "total_amount",
              render: (value) => (
                <div style={{ backgroundColor: "#722ed1", color: "white", padding: "4px 8px", borderRadius: "4px", display: "inline-block", fontWeight: "bold" }}>
                  ${value}
                </div>
              ),
            },
          ]}
          pagination={{
            pageSize: 7,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} records`,
            style: { marginTop: "16px" }
          }}
          loading={loading}
          rowKey="order_date"
          locale={{ emptyText: "No data available" }}
        />
      </div>
    </div>
  );
}

export default ReportSale_Summary;
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  DatePicker,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Card,
  Tooltip,
  Typography
} from "antd";
import { formatDateClient, formatPrice, isPermission, request } from "../../util/helper";
import { MdAdd, MdDelete, MdEdit, MdOutlineCreateNewFolder } from "react-icons/md";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsTrash, BsSearch, BsCalendar3, BsBoxSeam } from "react-icons/bs";
import MainPage from "../../component/layout/MainPage";
import { configStore } from "../../store/configStore";
import * as XLSX from 'xlsx/xlsx.mjs';
import { getProfile } from "../../store/profile.store";
import { FaFileExport, FaMoneyBillWave, FaWarehouse } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import moment from 'moment';
import dayjs from 'dayjs';

import "./product.css"
const { Title, Text } = Typography;

function ProductPage() {
  const { config } = configStore();
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [viewMode, setViewMode] = useState('my'); // 'my' | 'group'

  const [customers, setCustomers] = useState([]);
  const [datePickerOpen, setDatePickerOpen] = useState({
    create_at: false,
    receive_date: false
  });
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    visibleModal: false,
    is_list_all: false,
    totals: {},
  });

  // State to handle multiple products in form
  const [productItems, setProductItems] = useState([
    { key: 0, name: undefined, category_id: undefined, qty: undefined, unit_price: undefined }
  ]);

  // FIXED: Use the actual total_price from the item instead of calculating
  const getTotalPrice = (item) => {
    // Return the total_price directly from the item, or 0 if not available
    return parseFloat(item.total_price || 0);
  };

  const formatCurrencyalltotal = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value || 0);
  };

  const refPage = React.useRef(1);
  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });

  useEffect(() => {
    getList();
    fetchCustomers();
  }, []);

  // ✅ FIXED: Updated getList function to calculate totals correctly
  const getList = async () => {
    var param = {
      ...filter,
      page: 1,
      is_list_all: 1,
    };

    setState((pre) => ({ ...pre, loading: true }));
    const { id } = getProfile();
    if (!id) {
      return;
    }
    const res = await request(`product/my-group`, "get", param);
    if (res && !res.error) {
      // ✅ FIXED: Calculate totals using the backend calculated total_price
      const totals = res.list.reduce((acc, item) => {
        const categoryName = item.category_name || 'Uncategorized';

        if (!acc[categoryName]) {
          acc[categoryName] = {
            quantity: 0,
            totalValue: 0
          };
        }

        // ✅ Add quantity and use the backend calculated total_price
        acc[categoryName].quantity += Number(item.qty) || 0;
        // ✅ Use the total_price from backend (already calculated correctly)
        acc[categoryName].totalValue += Number(item.total_price) || 0;

        return acc;
      }, {});

      setState((pre) => ({
        ...pre,
        list: res.list,
        total: refPage.current === 1 ? res.total : pre.total,
        loading: false,
        totals,
      }));

      setList(res.list);
    }
  };

  const onCloseModal = () => {
    setState((p) => ({
      ...p,
      visibleModal: false,
    }));
    form.resetFields();
    // Reset product items to default state
    setProductItems([{ key: 0, name: undefined, category_id: undefined, qty: undefined, unit_price: undefined }]);
  };

  // Add a new product item row
  const addProductItem = () => {
    const newKey = productItems.length > 0 ? Math.max(...productItems.map(item => item.key)) + 1 : 0;
    setProductItems([...productItems, { key: newKey, name: undefined, category_id: undefined, qty: undefined, unit_price: undefined }]);
  };

  // Remove a product item row
  const removeProductItem = (key) => {
    if (productItems.length > 1) {
      setProductItems(productItems.filter(item => item.key !== key));
    } else {
      message.warning("ត្រូវតែមានយ៉ាងហោចណាស់មួយផលិតផល (At least one product is required)");
    }
  };


  // FIXED: Better form validation and data handling
  const onFinish = async (formValues) => {
    console.log('Form Values:', formValues); // Debug log

    const { id } = getProfile();
    if (!id) {
      message.error("User ID is missing!");
      return;
    }

    // FIXED: Better form data extraction with proper validation
    let products = [];

    // Handle different form data structures
    if (formValues.products) {
      if (Array.isArray(formValues.products)) {
        // Direct array format
        products = formValues.products.filter(product => product && typeof product === 'object');
      } else if (typeof formValues.products === 'object') {
        // Object format - convert to array
        products = Object.values(formValues.products).filter(product => product && typeof product === 'object');
      }
    }

    // FIXED: Also handle direct product fields (for single product edit mode)
    if (products.length === 0 && formValues.name) {
      products = [{
        id: formValues.id || undefined, // <-- include id for update
        name: formValues.name,
        category_id: formValues.category_id,
        qty: formValues.qty,
        unit_price: formValues.unit_price,
        actual_price: formValues.actual_price,
        barcode: formValues.barcode
      }];
    }


    console.log('Processed Products:', products); // Debug log

    // FIXED: Enhanced validation with better error messages
    const validationErrors = [];
    products.forEach((product, index) => {
      if (!product || typeof product !== 'object') {
        validationErrors.push(`Product ${index + 1}: Invalid product data structure`);
        return;
      }

      // Check for required fields with proper type validation
      if (!product.name || typeof product.name !== 'string') {
        validationErrors.push(`Product ${index + 1}: Name is required and must be a string`);
      }
      if (!product.category_id) {
        validationErrors.push(`Product ${index + 1}: Category is required`);
      }

      // FIXED: Better number validation for qty
      const qty = product.qty !== undefined && product.qty !== null ? Number(product.qty) : NaN;
      if (isNaN(qty) || qty <= 0) {
        validationErrors.push(`Product ${index + 1}: Valid quantity is required (current: ${product.qty}, parsed: ${qty})`);
      }

      // FIXED: Better number validation for unit_price
      const unitPrice = product.unit_price !== undefined && product.unit_price !== null ? Number(product.unit_price) : NaN;
      if (isNaN(unitPrice) || unitPrice <= 0) {
        validationErrors.push(`Product ${index + 1}: Valid unit price is required (current: ${product.unit_price}, parsed: ${unitPrice})`);
      }
    });

    if (products.length === 0) {
      message.error("At least one product is required! / ត្រូវតែមានយ៉ាងហោចណាស់មួយផលិតផល!");
      return;
    }

    if (validationErrors.length > 0) {
      console.error('Validation Errors:', validationErrors);
      message.error(`Validation failed / ការផ្ទៀងផ្ទាត់បរាជ័យ:\n${validationErrors.join('\n')}`);
      return;
    }

    setState(prev => ({ ...prev, loading: true }));
    try {
      const results = await Promise.all(
        products.map(async (product, index) => {
          console.log(`Processing product ${index + 1}:`, product); // Debug log

          // FIXED: Ensure numeric values are properly parsed with fallbacks
          let qty = Number(product.qty);
          let unitPrice = Number(product.unit_price);

          // Additional safety checks
          if (isNaN(qty) || qty <= 0) {
            qty = 1; // Default fallback
            console.warn(`Invalid qty for product ${index + 1}, using default: 1`);
          }

          if (isNaN(unitPrice) || unitPrice <= 0) {
            unitPrice = 0.01; // Default fallback
            console.warn(`Invalid unit_price for product ${index + 1}, using default: 0.01`);
          }

          // Auto-generate barcode if not provided
          const barcode = product.barcode || Date.now().toString() + Math.random().toString(36).substr(2, 5);

          // Get actual_price from category if not provided
          let actualPrice = Number(product.actual_price);
          if (!actualPrice || isNaN(actualPrice)) {
            const categoryInfo = config.category.find(c => c.value === product.category_id);
            actualPrice = Number(categoryInfo?.actual_price) || 1190;
          }

          const commonFields = {
            user_id: id,
            customer_id: formValues.customer_id,
            company_name: formValues.company_name,
            unit: formValues.unit,
            description: formValues.description || '',
            status: formValues.status || 1,
            create_at: formValues.create_at ? formValues.create_at.format('YYYY-MM-DD HH:mm:ss') :
              new Date().toISOString().slice(0, 19).replace('T', ' '),
            receive_date: formValues.receive_date ? formValues.receive_date.format('YYYY-MM-DD HH:mm:ss') :
              new Date().toISOString().slice(0, 19).replace('T', ' ')
          };

          const data = {
            ...commonFields,
            name: product.name,
            category_id: product.category_id,
            qty: qty, // Ensure it's a valid number
            unit_price: unitPrice, // Ensure it's a valid number
            actual_price: actualPrice,
            barcode: barcode
          };

          console.log(`Sending data for product ${index + 1}:`, data); // Debug log
          if (product.id) {
            // Update existing product
            return await request(`product/${product.id}`, "put", data);
          } else {
            // Create new product
            return await request("product", "post", data);
          }

        })
      );

      const allSuccessful = results.every(res => res && !res.error);
      if (allSuccessful) {
        message.success(`${results.length} products were successfully added! / បានបន្ថែមផលិតផលចំនួន ${results.length} ដោយជោគជ័យ!`);
        getList();
        onCloseModal();
      } else {
        results.forEach((res, index) => {
          if (res && res.error) {
            message.error(`Error adding product #${index + 1}: ${res.message} / មានបញ្ហាក្នុងការបន្ថែមផលិតផលលេខ ${index + 1}`);
          }
        });
      }
    } catch (error) {
      console.error('Error in onFinish:', error);
      message.error("Failed to add products / បរាជ័យក្នុងការបន្ថែមផលិតផល: " + (error.message || "Unknown error"));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // FIXED: Better InputNumber component with proper validation
  const getInputNumberProps = (field) => {
    const baseProps = {
      style: { width: "100%" },
      onChange: (value) => {
        console.log(`${field} changed to:`, value, typeof value); // Debug log
        // Ensure we return a valid number or undefined (not null)
        return value === null ? undefined : value;
      }
    };

    if (field === 'qty') {
      return {
        ...baseProps,
        formatter: (value) => {
          if (value === undefined || value === null || value === '') return '';
          return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        parser: (value) => {
          if (!value) return undefined;
          const parsed = value.replace(/(,*)/g, "");
          const num = Number(parsed);
          return isNaN(num) ? undefined : num;
        },
        min: 1,
        precision: 0,
        // FIXED: Add default validation
        onBlur: (e) => {
          const value = e.target.value;
          if (!value || Number(value) <= 0) {
            message.warning("Quantity must be greater than 0 / បរិមាណត្រូវតែធំជាង 0");
          }
        }
      };
    }

    if (field === 'unit_price') {
      return {
        ...baseProps,
        formatter: (value) => {
          if (value === undefined || value === null || value === '') return '';
          const num = Number(value);
          return isNaN(num) ? '' : `$ ${Math.round(num).toLocaleString()}`;
        },
        parser: (value) => {
          if (!value) return undefined;
          const parsed = value.replace(/[^\d]/g, "");
          const num = Number(parsed);
          return isNaN(num) || num === 0 ? undefined : num;
        },
        min: 0.01,
        precision: 2,
        // FIXED: Add default validation
        onBlur: (e) => {
          const value = e.target.value;
          if (!value || Number(value) <= 0) {
            message.warning("Unit price must be greater than 0 / តម្លៃឯកតាត្រូវតែធំជាង 0");
          }
        }
      };
    }

    return baseProps;
  };

  // FIXED: Better product change handler
  const handleProductChange = async (value, key, field) => {
    console.log(`Changing ${field} for product ${key} to:`, value); // Debug log

    const updatedItems = productItems.map(item => {
      if (item.key === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setProductItems(updatedItems);

    // FIXED: Better form field updates
    const fieldName = `products[${key}].${field}`;

    // Fetch barcode when category changes
    if (field === 'category_id' && value) {
      const categoryInfo = config.category.find(c => c.value === value);
      const categoryBarcode = categoryInfo?.barcode || '';

      const updatedItemsWithBarcode = productItems.map(item => {
        if (item.key === key) {
          return {
            ...item,
            [field]: value,
            barcode: categoryBarcode
          };
        }
        return item;
      });

      setProductItems(updatedItemsWithBarcode);

      // Update form fields
      form.setFieldsValue({
        [fieldName]: value,
        [`products[${key}].barcode`]: categoryBarcode
      });
    } else {
      // FIXED: Ensure numeric fields are properly handled
      let processedValue = value;
      if (field === 'qty' || field === 'unit_price') {
        processedValue = Number(value);
      }

      form.setFieldsValue({
        [fieldName]: processedValue
      });
    }
  };


  const onBtnNew = async () => {
    const res = await request("new_barcode", "post");
    if (res && !res.error) {
      form.setFieldsValue({
        barcode: res.barcode,
        create_at: moment(),
        receive_date: moment(),
      });

      setState((p) => ({
        ...p,
        visibleModal: true,
      }));

      // Reset product items
      setProductItems([{ key: 0, name: undefined, category_id: undefined, qty: undefined, unit_price: undefined }]);
    }
  };

  const onFilter = () => {
    getList();
  };

  const onClickEdit = (data, index) => {
    setState({
      ...state,
      visibleModal: true,
    });

    // Set form values with correct field names
    form.setFieldsValue({
      // Hidden fields for update
      id: data.id,
      user_id: data.user_id,

      // Common header fields
      company_name: data.company_name,
      unit: data.unit,
      description: data.description,
      status: data.status,
      create_at: data.create_at ? dayjs(data.create_at) : null,
      receive_date: data.receive_date ? dayjs(data.receive_date) : null,
      customer_id: data.customer_id,

      // Product array structure - use array notation
      products: [{
        name: data.name,
        category_id: data.category_id,
        qty: data.qty,
        unit_price: data.unit_price,
        actual_price: data.actual_price || 1190,
        barcode: data.barcode,
      }]
    });

    // Set productItems state to match the single product being edited
    setProductItems([
      {
        key: 0,
        name: data.name,
        category_id: data.category_id,
        qty: data.qty,
        unit_price: data.unit_price,
        actual_price: data.actual_price || 1190,
        barcode: data.barcode,
      },
    ]);
  };
  const onClickDelete = async (data, index) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: `Product: ${data.name} (${data.barcode})`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          const res = await request(`product/${data.id}`, "delete");
          if (res && !res.error) {
            message.success("Product deleted successfully!");
            getList(); // Refresh the product list
          } else {
            message.error(res?.message || "Failed to delete product.");
          }
        } catch (err) {
          console.error("Delete Error:", err);
          message.error("Something went wrong while deleting.");
        }
      },
    });
  };


  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const onValuesChange = (changedValues, allValues) => {
    if (changedValues.qty || changedValues.unit_price || changedValues.discount || changedValues.actual_price) {
      const { qty, unit_price, discount = 0, actual_price } = allValues;

      if (qty && unit_price && actual_price) {
        // Calculate total price
        const totalPrice = (qty * unit_price) * (1 - discount / 100) / actual_price;

        // Round the total price to the nearest whole number
        const roundedTotalPrice = Math.round(totalPrice);

        // Update the form field with the rounded total price
        form.setFieldsValue({ price: roundedTotalPrice });
      }
    }
  };

  const fetchCustomers = async () => {
    const { id } = getProfile();
    if (!id) return;

    try {
      const res = await request(`customer/my-group`, "get");
      if (res && res.list) {
        const customers = res.list.map(cust => ({
          label: `${cust.name} (${cust.tel})`,
          value: cust.id,
          address: cust.address,
          tel: cust.tel
        }));
        setCustomers(customers);
      }
    } catch (error) {
      message.error("Error fetching customers!");
    }
  };

  return (
    <MainPage loading={state.loading}>
      {/* Header Section */}
      <Card className="product-header-card">
        <Row align="middle" justify="space-between" gutter={16}>
          <Col>
            <div className="product-header-flex">
              <div className="product-icon-container">
                <BsBoxSeam size={24} className="product-icon-blue" />
              </div>
              <div>
                <div className="product-title-khmer">ការគ្រប់គ្រងផលិតផល</div>
                <div className="product-title-english">Product Management</div>
                <div className="product-stats-container">
                  <RiDashboardLine className="product-stats-icon" />
                  <span className="product-stats-text">Total: {state.total} products</span>
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                onClick={onBtnNew}
                icon={<MdOutlineCreateNewFolder />}
                className="product-add-btn"
              >
                Add Product
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Filter Section */}
      <Card className="product-filter-card">
        <Form layout="horizontal" className="product-filter-form">
          <Form.Item className="product-search-item">
            <Input.Search
              onChange={(event) => setFilter((p) => ({ ...p, txt_search: event.target.value }))}
              allowClear
              placeholder="Search products..."
              className="product-search-input"
              size="large"
            />
          </Form.Item>
          <Form.Item className="product-category-item">
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Select Category"
              options={config.category}
              onChange={(id) => setFilter((pre) => ({ ...pre, category_id: id }))}
              size="large"
            />
          </Form.Item>
          <Form.Item className="product-brand-item">
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Select Brand"
              options={config.brand}
              onChange={(id) => setFilter((pre) => ({ ...pre, brand: id }))}
              size="large"
            />
          </Form.Item>
          <Button
            onClick={onFilter}
            type="primary"
            icon={<BsSearch />}
            size="large"
            className="product-filter-btn"
          >
            Filter
          </Button>
        </Form>
      </Card>

      {/* Stats Cards - FIXED */}
      <Row style={{
        marginBottom: 24,
        borderRadius: 12,
      }} gutter={[16, 16]}>
        {Object.entries(state.totals || {}).map(([category, totals]) => {
          // Dynamic color based on category
          const categoryColors = {
            'ហ្កាស(LPG)': { bg: 'product-card-amber', text: 'product-text-amber', icon: <FaWarehouse className="product-icon-amber" /> },
            'ប្រេងសាំងធម្មតា(EA)': { bg: 'product-card-cyan', text: 'product-text-cyan', icon: <FaMoneyBillWave className="product-icon-cyan" /> },
            'ប្រេងម៉ាស៊ូត(Do)': { bg: 'product-card-green', text: 'product-text-green', icon: <FaWarehouse className="product-icon-green" /> },
            'ប្រេងសាំងស៊ុបពែរ(Super)': { bg: 'product-card-blue', text: 'product-text-blue', icon: <FaMoneyBillWave className="product-icon-blue" /> },
            'default': { bg: 'product-card-gray', text: 'product-text-gray', icon: <BsBoxSeam className="product-icon-gray" /> }
          };


          const colors = categoryColors[category] || categoryColors['default'];


          return (
            <Col key={category} xs={24} sm={12} md={8} lg={6}>
              <Card className={`product-stat-card ${colors.bg}`}>
                <div className="product-stat-header">
                  <div className="product-stat-icon-container">
                    <div className="product-stat-icon-wrapper">
                      {colors.icon}
                    </div>
                    <div>
                      <div className={`product-stat-title ${colors.text}`}>{category}</div>
                      <div className="product-stat-subtitle">Category</div>
                    </div>
                  </div>
                </div>
                <Divider className="product-stat-divider" />
                <div className="product-stat-metrics">
                  <div>
                    <div className="product-stat-label">Quantity</div>
                    <div className="product-stat-value">{totals.quantity.toLocaleString()}L</div>
                  </div>
                  <div>
                    <div className="product-stat-label">Total Value</div>
                    <div className="product-stat-value-highlight">{formatCurrencyalltotal(totals.totalValue)}</div>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Product Table */}
      <Card className="product-table-card">
        <Table
          className="product-table"
          rowClassName={() => "product-table-row"}
          dataSource={state.list}
          pagination={false}
          columns={[
            {
              key: "name",
              title: (
                <div className="product-table-header">
                  <div className="product-table-header-khmer">ឈ្មោះ</div>
                  <div className="product-table-header-english">Name</div>
                </div>
              ),
              dataIndex: "name",
              render: (text) => {
                // Map the value to Khmer display text
                const displayText = text === "oil" ? "ប្រេងឥន្ធនៈ" : text;
                return (
                  <div className="product-table-text" title={displayText || ""}>
                    {displayText || "N/A"}
                  </div>
                );
              },
            },
            {
              key: "barcode",
              title: (
                <div className="product-table-header">
                  <div className="product-table-header-khmer">លេខបាកូដ</div>
                  <div className="product-table-header-english">Barcode</div>
                </div>
              ),
              dataIndex: "category_barcode",
              render: (value) => <Tag color="blue" className="product-tag">{value}</Tag>,
            },
            {
              key: "category_name",
              title: (
                <div className="product-table-header">
                  <div className="product-table-header-khmer">ប្រភេទ</div>
                  <div className="product-table-header-english">Category</div>
                </div>
              ),
              dataIndex: "category_name",
              render: (text) => (
                <div className="product-table-text" title={text || ""}>
                  {text || "N/A"}
                </div>
              ),
            },
            {
              key: "qty",
              title: (
                <div className="product-table-header">
                  <div className="product-table-header-khmer">បរិមាណ</div>
                  <div className="product-table-header-english">Quantity</div>
                </div>
              ),
              dataIndex: "qty",
              render: (value) => (
                <Tag color={value > 5000 ? "green" : "red"} className="product-tag">
                  {value.toLocaleString()}
                </Tag>
              ),
            },
            {
              key: "unit",
              title: (
                <div className="product-table-header">
                  <div className="product-table-header-khmer">ឯកតា</div>
                  <div className="product-table-header-english">Unit</div>
                </div>
              ),
              dataIndex: "unit",
              render: (value) => <Tag color="green" className="product-tag">{value}</Tag>,
            },
            {
              key: "unit_price",
              title: (
                <div className="product-table-header">
                  <div className="product-table-header-khmer">តម្លៃតោន</div>
                  <div className="product-table-header-english">Unit Price</div>
                </div>
              ),
              dataIndex: "unit_price",
              render: (value) => (
                <Tag color={value > 20 ? "green" : "volcano"} className="product-tag">
                  {formatCurrency(value)}
                </Tag>
              ),
            },
            {
              key: "total_price",
              title: (
                <div className="product-table-header">
                  <div className="product-table-header-khmer">តម្លៃសរុប</div>
                  <div className="product-table-header-english">Total Price</div>
                </div>
              ),
              dataIndex: "total_price",
              render: (price, record) => {
                // ✅ Use the backend calculated total_price directly
                const totalPrice = Number(price) || 0;
                return (
                  <div className="product-price-text">
                    {formatPrice(totalPrice)}
                  </div>
                );
              },
            },
            {
              key: "status",
              title: (
                <div className="product-table-header">
                  <div className="product-table-header-khmer">ស្ថានភាព</div>
                  <div className="product-table-header-english">Status</div>
                </div>
              ),
              dataIndex: "status",
              render: (status) =>
                status == 1 ? (
                  <Tag color="green" className="product-tag">Active</Tag>
                ) : (
                  <Tag color="red" className="product-tag">Inactive</Tag>
                ),
            },
            // បង្ហាញអ្នកបង្កើត នៅពេលមើលក្រុម
            ...(viewMode === 'group' ? [{
              key: "creator",
              title: <div className="khmer-text1">អ្នកបង្កើត</div>,
              render: (text, record) => {
                const { id: currentUserId } = getProfile();
                const isCurrentUser = record.user_id === currentUserId;

                // បើជាខ្លួនឯង
                if (isCurrentUser) {
                  return <Tag color="blue">ខ្ញុំ</Tag>;
                }

                // បើមានឈ្មោះ បង្ហាញឈ្មោះ
                if (record.created_by_name) {
                  return (
                    <div>
                      <Tag color="default">{record.created_by_name}</Tag>
                      {record.created_by_username && (
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          @{record.created_by_username}
                        </div>
                      )}
                    </div>
                  );
                }

                // បើគ្មានឈ្មោះ បង្ហាញ username
                if (record.created_by_username) {
                  return <Tag color="default">@{record.created_by_username}</Tag>;
                }

                // fallback
                return <Tag color="default">បុគ្គលិកផ្សេង</Tag>;
              },
              width: 120,
            }] : []),
            {
              key: "Action",
              title: (
                <div className="product-table-header">
                  <div className="product-table-header-khmer">សកម្មភាព</div>
                  <div className="product-table-header-english">Action</div>
                </div>
              ),
              align: "center",
              width: 120,
              render: (item, data, index) => (

                <Space>
                  {isPermission("customer.getone") && (
                    <Button
                      type="primary"
                      icon={<MdEdit />}
                      onClick={() => onClickEdit(data, index)}
                      className="product-action-btn"
                    />
                  )}
                  {isPermission("customer.getone") && (
                    <Button
                      type="primary"
                      danger
                      icon={<MdDelete />}
                      onClick={() => onClickDelete(data, index)}
                      className="product-action-btn"
                    />

                  )}
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        open={state.visibleModal}
        title={
          <div className="product-modal-title">
            <BsBoxSeam className="product-modal-icon" size={20} />
            <span>
              {form.getFieldValue("id") ? (
                <div>
                  <div className="product-modal-title-khmer">កែប្រែព័ត៌មានផលិតផល</div>
                  <div className="product-modal-title-english">Edit Product</div>
                </div>
              ) : (
                <div>
                  <div className="product-modal-title-khmer">បន្ថែមផលិតផលច្រើនប្រភេទ</div>
                  <div className="product-modal-title-english">Add Multiple Products</div>
                </div>
              )}
            </span>
          </div>
        }
        footer={null}
        onCancel={onCloseModal}
        width={1400}
        bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
        className="product-modal"
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          onValuesChange={onValuesChange}
          className="product-form"
        >
          <Row gutter={16}>
            {/* Common Fields Section */}
            <Col span={24}>
              <Card
                title={
                  <div className="product-section-title">
                    <div className="product-section-icon-container">
                      <FaWarehouse className="product-section-icon" />
                    </div>
                    <div>
                      <div className="product-section-title-khmer">ព័ត៌មានទូទៅ</div>
                      <div className="product-section-title-english">Common Information</div>
                    </div>
                  </div>
                }
                className="product-section-card"
              >
                <Row gutter={16}>
                  <Col span={8}>
                   <Form.Item
  name={"company_name"}
  label={
    <div>
      <div className="product-label-khmer">ក្រុមហ៊ុន</div>
      <div className="product-label-english">Company</div>
    </div>
  }
  rules={[{ required: true, message: "Please Select Company Name" }]}
>
  <Select
    showSearch
    placeholder="Select Company"
    optionFilterProp="label"
    className="product-select"
    filterOption={(input, option) =>
      option.label.toLowerCase().includes(input.toLowerCase())
    }
    options={
      config?.company_name?.map((item, index) => ({
        label: `${index + 1}. ${item.label}`, // prepend index
        value: item.value,
      })) || []
    }
  />
</Form.Item>

                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={"unit"}
                      label={
                        <div>
                          <div className="product-label-khmer">ឯកតា</div>
                          <div className="product-label-english">Unit</div>
                        </div>
                      }
                    >
                      <Select
                        placeholder="Select Unit"
                        options={config?.unit}
                        className="product-select"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={"create_at"}
                      label={
                        <div>
                          <div className="product-label-khmer">ថ្ងែទីបញ្ចាទិញ</div>
                          <div className="product-label-english">Created At</div>
                        </div>
                      }
                      initialValue={moment()} // ✅ Set default to current date/time
                    >
                      <DatePicker
                        className="product-datepicker"
                        format="DD-MM-YYYY"
                        showNow={false}
                        placeholder="Select date and time"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={"receive_date"}
                      label={
                        <div>
                          <div className="product-label-khmer">ថ្ងៃទទួលទំនិញ</div>
                          <div className="product-label-english">Receive Date</div>
                        </div>
                      }
                      initialValue={moment()} // ✅ Set default to current date/time
                    >
                      <DatePicker
                        className="product-datepicker"
                        format="DD-MM-YYYY"
                        showNow={false}
                        placeholder="Select date and time"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={"status"}
                      label={<><div className="khmer-text">ស្ថានភាព</div><div className="english-text">Status</div></>}
                      initialValue={1}
                    >
                      <Select
                        placeholder="Select status"
                        options={[
                          { label: "Active", value: 1 },
                          { label: "Inactive", value: 0 },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={"description"}
                      label={<div><div className="khmer-text">ការពិពណ៌នា</div><div className="english-text">Description</div></div>}
                    >
                      <Input.TextArea placeholder="វិកយប័ត្រលេខ" rows={1} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="customer_id"
                      label={
                        <div>
                          <div className="khmer-text">អតិថិជន</div>
                          <div className="english-text">Customer</div>
                        </div>
                      }
                    >
                      <Select
                        showSearch
                        placeholder="Select customer"
                        options={customers.map((customer, index) => ({
                          ...customer,
                          label: `${index + 1}. ${customer.label}`, // Display index in the label
                          value: customer.value,
                          index: index + 1 // Store index for searching
                        }))}
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                          const searchValue = input.toLowerCase();
                          const label = option.label.toLowerCase();
                          const indexStr = option.index.toString();

                          // Allow searching by index number or original label
                          return indexStr.includes(searchValue) ||
                            label.includes(searchValue);
                        }}
                        onSelect={(value, option) => {
                          form.setFieldsValue({
                            customer_address: option.address,
                            customer_tel: option.tel
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Multiple Products Section */}
            <Col span={24}>
              <Card
                title={
                  <div style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className="khmer-text">បញ្ចូលផលិតផលច្រើនប្រភេទ</span>
                      <br />
                      <span className="english-text">Multiple Product Entry</span>
                    </div>
                    <Button type="primary" onClick={addProductItem} icon={<AiOutlinePlusCircle />}>
                      Add Product
                    </Button>
                  </div>
                }
                style={{ marginBottom: 16 }}
              >
                {productItems.map((item) => (
                  <Row key={item.key} gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={4}>
                      <Form.Item
                        name={['products', item.key, 'name']}
                        label={<><div className="khmer-text">ផលិតផល</div><div className="english-text">Product Name</div></>}
                        rules={[{ required: true, message: "Please select product name" }]}
                      >
                        <Select
                          options={config?.product}
                          placeholder="Select a product"
                          onChange={(value) => handleProductChange(value, item.key, 'name')}
                        />
                      </Form.Item>
                    </Col>
                     <Col span={4}>
                      <Form.Item
                        name={['products', item.key, 'category_id']}
                        label={<><div className="khmer-text">ប្រភេទផលិតផល</div><div className="english-text">Category</div></>}
                        rules={[{ required: true, message: "Please select category" }]}
                      >
                        <Select
                          placeholder="Select category"
                          optionRender={(option) => (
                            <div>
                              <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                              {option.data?.description && (
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                  {option.data.description}
                                </div>
                              )}
                            </div>
                          )}
                          options={config?.category?.map(cat => ({
                            ...cat,
                            label: cat.label,
                            value: cat.value,
                            description: cat.description || '' // assuming your config has description field
                          }))}
                          onChange={(value, option) => {
                            handleProductChange(value, item.key, 'category_id');
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name={['products', item.key, 'qty']}
                        label={<><div className="khmer-text">បរិមាណ</div><div className="english-text">Quantity</div></>}
                        rules={[{ required: true, message: "Please enter quantity" }]}
                      >
                        <InputNumber
                          placeholder="Quantity"
                          style={{ width: "100%" }}
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value) => value.replace(/(,*)/g, "")}
                          onChange={(value) => handleProductChange(value, item.key, 'qty')}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item
                        name={['products', item.key, 'unit_price']}  // <-- Change from 'ton_price' to 'unit_price'
                        label={<><div className="khmer-text">តម្លៃតោន</div><div className="english-text">Unit Price</div></>}
                        rules={[{ required: true, message: "Enter unit price" }]}
                      >
                        <InputNumber
                          placeholder="Unit Price"
                          style={{ width: "100%" }}
                          formatter={(value) => `$ ${Math.round(value).toLocaleString()}`}
                          parser={(value) => Math.round(value.replace(/[^\d]/g, ""))}
                          onChange={(value) => handleProductChange(value, item.key, 'unit_price')}  // Also update here!
                        />
                      </Form.Item>

                    </Col>
                    <Form.Item
                      name={['products', item.key, 'actual_price']}
                      style={{ display: 'none' }}
                    >
                      <InputNumber />
                    </Form.Item>

                    {/* Hidden field for barcode - auto-generated */}
                    <Form.Item
                      name={['products', item.key, 'barcode']}
                      style={{ display: 'none' }}
                    >
                      <Input />
                    </Form.Item>


                    <Col span={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Tooltip title="Remove Product">
                        <Button
                          danger
                          icon={<BsTrash />}
                          onClick={() => removeProductItem(item.key)}
                          disabled={productItems.length <= 1}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                ))}
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Space>
              <Button onClick={onCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save All Products"}
              </Button>
            </Space>
          </div>
        </Form>

      </Modal>




    </MainPage>
  );
}
export default ProductPage;
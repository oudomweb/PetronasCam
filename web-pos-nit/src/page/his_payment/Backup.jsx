import React, { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Form, InputNumber } from 'antd';

import {
  Button,
  Table,
  Tag,
  DatePicker,
  Space,
  Input,
  Card,
  Typography,
  Descriptions,
  Modal,
  Select,
  message,
  Image,
  List,
  Row, Col,
  Divider,
  Statistic,
  Avatar
} from "antd";
import { PrinterOutlined, UserOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { IoEyeOutline } from 'react-icons/io5';
import { formatDateClient, isPermission, request } from "../../util/helper";
import MainPage from "../../component/layout/MainPage";
import { getProfile } from "../../store/profile.store";
import './PaymentHistoryPage.css';
import { Config } from "../../util/config";
import { FaLeaf } from "react-icons/fa";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;

const khmerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@300;400;500;600;700&display=swap');
  
  .khmer-font {
    font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
    font-weight: 400;
    font-size: 15px;
  }
  
  .khmer-font-bold {
    font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
    font-weight: 600;
    font-size: 16px;
  }
  
  .khmer-font-large {
    font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
    font-weight: 500;
    font-size: 18px;
  }
  
  .payment-history-container {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    padding: 24px;
  }
  
  .main-card {
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: none;
    overflow: hidden;
  }
  
  .header-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 30px;
    color: white;
  }
  
  .header-section h1 {
    color: white !important;
    font-size: 32px;
    margin-bottom: 8px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  
  .header-section p {
    opacity: 0.9;
    font-size: 16px;
    margin: 0;
  }
  
  .filter-section {
    background: white;
    padding: 30px;
    border-bottom: 2px solid #f0f2f5;
  }
  
  .stats-section {
    background: white;
    padding: 30px;
    border-bottom: 2px solid #f0f2f5;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .stat-card {
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    text-align: center;
    border: none;
    box-shadow: 0 8px 20px rgba(255, 154, 158, 0.3);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(255, 154, 158, 0.4);
  }
  
  .stat-card.customers {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
  
  .stat-card.payments {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    box-shadow: 0 8px 20px rgba(240, 147, 251, 0.3);
  }
  
  .stat-card.total {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3);
  }
  
  .stat-number {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  }
  
  .stat-label {
    font-size: 16px;
    opacity: 0.95;
  }
  
  .table-section {
    background: white;
    padding: 30px;
  }
  
  .view-toggle {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 20px;
  }
  
  .view-toggle .ant-btn {
    height: 48px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    margin-right: 12px;
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }
  
  .view-toggle .ant-btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: 2px solid #667eea;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  
  .custom-table .ant-table {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  
  .custom-table .ant-table-thead > tr > th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    font-size: 15px;
    padding: 20px 16px;
    border: none;
  }
  
  .custom-table .ant-table-tbody > tr > td {
    padding: 16px;
    font-size: 14px;
    border-bottom: 1px solid #f0f2f5;
  }
  
  .custom-table .ant-table-tbody > tr:hover > td {
    background: #f8f9ff;
  }
  
  .filter-group {
    background: #f8f9fa;
    padding: 24px;
    border-radius: 16px;
    margin-bottom: 24px;
  }
  
  .filter-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    align-items: end;
  }
  
  .filter-label {
    font-size: 15px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
    display: block;
  }
  
  .custom-input {
    height: 48px;
    border-radius: 12px;
    border: 2px solid #e1e5e9;
    font-size: 15px;
    transition: all 0.3s ease;
  }
  
  .custom-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .custom-select {
    height: 48px;
  }
  
  .custom-select .ant-select-selector {
    height: 48px !important;
    border-radius: 12px;
    border: 2px solid #e1e5e9;
    font-size: 15px;
  }
  
  .custom-select .ant-select-selector:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .custom-date-picker {
    height: 48px;
    border-radius: 12px;
    border: 2px solid #e1e5e9;
    font-size: 15px;
  }
  
  .custom-date-picker:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .action-button {
    height: 48px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    padding: 0 24px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  
  .action-button.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
  }
  
  .action-button.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  .action-button.secondary {
    background: white;
    border-color: #d1d5db;
    color: #6b7280;
  }
  
  .action-button.secondary:hover {
    border-color: #667eea;
    color: #667eea;
  }
  
  .custom-tag {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    border: none;
  }
  
  .amount-display {
    font-size: 16px;
    font-weight: 700;
    color: #10b981;
  }
  
  .table-action-btn {
    height: 36px;
    border-radius: 8px;
    font-size: 13px;
    margin-right: 8px;
    border: 1px solid #d1d5db;
    transition: all 0.2s ease;
  }
  
  .table-action-btn:hover {
    transform: translateY(-1px);
  }
  
  .payment-history-container .ant-table-thead > tr > th {
    font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
    font-weight: 600;
    font-size: 15px;
  }
  
  .payment-history-container .ant-table-tbody > tr > td {
    font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
    font-size: 14px;
  }
  
  .payment-history-container .ant-btn {
    font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
    font-size: 14px;
  }
  
  .payment-history-container .ant-input {
    font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
    font-size: 14px;
  }
  
  .payment-history-container .ant-select-selection-item {
    font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
    font-size: 14px;
  }
  
  .payment-history-container .ant-tag {
    font-family: 'Noto Sans Khmer', 'Khmer OS', 'Khmer OS System', sans-serif;
    font-size: 13px;
  }
  
  @media (max-width: 768px) {
    .payment-history-container {
      padding: 16px;
    }
    
    .header-section {
      padding: 24px 20px;
    }
    
    .header-section h1 {
      font-size: 24px;
    }
    
    .filter-section, .stats-section, .table-section {
      padding: 20px;
    }
    
    .filter-row {
      grid-template-columns: 1fr;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .stat-number {
      font-size: 28px;
    }
  }
`;

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);
};
const printCustomerPaymentReport = (customerData) => {
  const { customer_name, customer_phone, customer_email, payments } = customerData;
  const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);



  const printContent = `
    <html>
      <head>
        <title>របាយការណ៍ការទូទាត់អតិថិជន</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body { 
            font-family: 'Khmer OS Siemreap', 'Khmer OS', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.4;
            color: #333;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .print-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white !important;
          }

          .header { 
            text-align: center; 
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 20px; 
            margin-bottom: 30px;
            background: white !important;
          }

          .header h1 {
            font-size: 28px;
            color: #2c3e50;
            margin-bottom: 8px;
            font-weight: 600;
          }

          .header .subtitle {
            font-size: 14px;
            color: #7f8c8d;
            font-weight: normal;
          }

          .customer-section {
            margin-bottom: 30px;
            background: white !important;
          }

          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #ecf0f1;
          }

          .customer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }

          .info-item {
            display: flex;
            align-items: center;
          }

          .info-label {
            font-weight: 600;
            color: #34495e;
            min-width: 120px;
            margin-right: 10px;
          }

          .info-value {
            color: #2c3e50;
            flex: 1;
          }

          .payments-section {
            margin-top: 30px;
            background: white !important;
          }

          .payment-card {
            border: 1px solid #ddd;
            margin-bottom: 20px;
            border-radius: 8px;
            overflow: hidden;
            background: white !important;
            box-shadow: none !important;
          }

          .payment-header {
            background: #34495e !important;
            color: white !important;
            padding: 12px 16px;
            font-weight: 600;
            font-size: 14px;
          }

          .payment-body {
            padding: 16px;
            background: white !important;
          }

          .payment-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 12px;
          }

          .payment-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px dotted #ddd;
          }

          .payment-row:last-child {
            border-bottom: none;
            margin-top: 8px;
            padding-top: 12px;
          }

          .payment-label {
            font-weight: 500;
            color: #7f8c8d;
            font-size: 13px;
          }

          .payment-value {
            font-weight: 500;
            color: #2c3e50;
            text-align: right;
          }

          .amount-highlight {
            font-size: 16px !important;
            font-weight: 700 !important;
            color: #27ae60 !important;
          }

          .method-tag {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .method-cash { 
            background: #d5f4e6 !important; 
            color: #27ae60 !important; 
            border: 1px solid #27ae60;
          }
          
          .method-card { 
            background: #dae8fc !important; 
            color: #3498db !important; 
            border: 1px solid #3498db;
          }
          
          .method-transfer { 
            background: #fdeaa7 !important; 
            color: #f39c12 !important; 
            border: 1px solid #f39c12;
          }

          .summary-section {
            margin-top: 30px;
            padding: 20px;
            border: 2px solid #34495e;
            border-radius: 8px;
            background: white !important;
          }

          .summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
          }

          .summary-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
          }

          .summary-label {
            font-weight: 600;
            color: #34495e;
          }

          .summary-value {
            font-weight: 700;
            color: #2c3e50;
          }

          .total-amount {
            font-size: 20px !important;
            color: #27ae60 !important;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            color: #95a5a6;
            font-size: 12px;
            border-top: 1px solid #ecf0f1;
            padding-top: 20px;
          }

          /* Print-specific styles */
          @media print {
            body { 
              margin: 0 !important;
              background: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            * {
              background: white !important;
              box-shadow: none !important;
            }
            
            .print-container {
              max-width: none;
              margin: 0;
              padding: 15px;
            }
            
            .payment-header {
              background: #34495e !important;
              color: white !important;
            }
            
            .method-cash { 
              background: #d5f4e6 !important; 
              color: #27ae60 !important; 
            }
            
            .method-card { 
              background: #dae8fc !important; 
              color: #3498db !important; 
            }
            
            .method-transfer { 
              background: #fdeaa7 !important; 
              color: #f39c12 !important; 
            }

            .no-print { 
              display: none !important; 
            }

            .page-break {
              page-break-before: always;
            }
          }

          @page {
            margin: 1cm;
            size: A4;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <h1>របាយការណ៍ការទូទាត់អតិថិជន</h1>
            <div class="subtitle">បង្កើតនៅថ្ងៃទី ${moment().format('DD/MM/YYYY HH:mm')}</div>
          </div>
          
          <div class="customer-section">
            <div class="section-title">ព័ត៌មានអតិថិជន</div>
            <div class="customer-grid">
              <div class="info-item">
                <span class="info-label">ឈ្មោះ៖</span>
                <span class="info-value">${customer_name || 'មិនមាន'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">លេខទូរស័ព្ទ៖</span>
                <span class="info-value">${customer_phone || 'មិនមាន'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">អ៊ីមែល៖</span>
                <span class="info-value">${customer_email || 'មិនមាន'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ចំនួនទូទាត់៖</span>
                <span class="info-value">${payments.length} ប្រតិបត្តិការ</span>
              </div>
            </div>
          </div>

          <div class="payments-section">
            <div class="section-title">ប្រវត្តិការទូទាត់ (${payments.length} ការទូទាត់)</div>
            
            ${payments.map((payment, index) => `
              <div class="payment-card">
                <div class="payment-header">
                  ការទូទាត់ #${index + 1} - លេខប័ណ្ណ ${payment.product_description ? payment.product_description.toString().padStart(4, '0') : 'មិនមាន'}
                </div>
                <div class="payment-body">
                  <div class="payment-grid">
                    <div class="payment-row">
                      <span class="payment-label">កាលបរិច្ឆេទ៖</span>
                      <span class="payment-value">${formatDateClient(payment.payment_date)}</span>
                    </div>
                    <div class="payment-row">
                      <span class="payment-label">ចំនួនទឹកប្រាក់៖</span>
                      <span class="payment-value amount-highlight">${formatCurrency(payment.amount)}</span>
                    </div>
                    <div class="payment-row">
                      <span class="payment-label">វិធីសាស្ត្រ៖</span>
                      <span class="payment-value">
                        <span class="method-tag method-${payment.payment_method === 'cash' ? 'cash' : payment.payment_method === 'credit_card' ? 'card' : 'transfer'}">
                          ${payment.payment_method === 'cash' ? 'សាច់ប្រាក់' :
      payment.payment_method === 'credit_card' ? 'កាតឥណទាន' :
        payment.payment_method === 'bank_transfer' ? 'ប្រេវេសប្រាក់' : 'មិនមាន'}
                        </span>
                      </span>
                    </div>
                    <div class="payment-row">
                      <span class="payment-label">ប្រមូលដោយ៖</span>
                      <span class="payment-value">${payment.collected_by || 'មិនមាន'}</span>
                    </div>
                    <div class="payment-row">
                      <span class="payment-label">ប្រភេទ៖</span>
                      <span class="payment-value">${payment.category_name || 'មិនមាន'}</span>
                    </div>
                    ${payment.notes ? `
                      <div class="payment-row">
                        <span class="payment-label">កំណត់ចំណាំ៖</span>
                        <span class="payment-value">${payment.notes}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="summary-section">
            <div class="section-title">សង្ខេប</div>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">ការទូទាត់សរុប៖</span>
                <span class="summary-value">${payments.length}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">ចំនួនទឹកប្រាក់សរុប៖</span>
                <span class="summary-value total-amount">${formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>សូមអរគុណសម្រាប់ការធ្វើអាជីវកម្មរបស់អ្នក!</p>
            <p>នេះជារបាយការណ៍ដែលបង្កើតដោយកុំព្យូទ័រ។</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Ensure styles and content are fully loaded before printing
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
};





const printSinglePaymentReport = (payment) => {
  const printContent = `
      <html>
        <head>
          <title>បង្កាន់ដៃការទូទាត់</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              font-family: 'Khmer OS Siemreap', 'Khmer OS', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.5;
              color: #333;
              background: white !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
  
            .receipt-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: white !important;
            }
  
            .receipt-header { 
              text-align: center; 
              border-bottom: 3px solid #2c3e50;
              padding-bottom: 20px; 
              margin-bottom: 30px;
              background: white !important;
            }
  
            .receipt-header h1 {
              font-size: 32px;
              color: #2c3e50;
              margin-bottom: 8px;
              font-weight: 700;
            }
  
            .receipt-header h2 {
              font-size: 20px;
              color: #3498db;
              margin-bottom: 8px;
              font-weight: 600;
            }
  
            .receipt-header .date {
              font-size: 14px;
              color: #7f8c8d;
              font-weight: normal;
            }
  
            .receipt-body {
              background: white !important;
              border: 1px solid #ddd;
              border-radius: 8px;
              overflow: hidden;
              margin-bottom: 25px;
            }
  
            .info-section {
              padding: 20px;
              background: white !important;
            }
  
            .info-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px dotted #ddd;
            }
  
            .info-row:last-child {
              border-bottom: none;
            }
  
            .info-label {
              font-weight: 600;
              color: #34495e;
              min-width: 180px;
              font-size: 14px;
            }
  
            .info-value {
              text-align: right;
              flex: 1;
              font-weight: 500;
              color: #2c3e50;
              font-size: 14px;
            }
  
            .amount-section {
              background: #ecf0f1 !important;
              padding: 25px;
              text-align: center;
              border-top: 3px solid #3498db;
              margin: 25px 0;
              border-radius: 8px;
            }
  
            .amount-section h2 {
              color: #2c3e50;
              margin-bottom: 10px;
              font-size: 18px;
              font-weight: 600;
            }
  
            .amount-section .amount {
              font-size: 36px;
              font-weight: 700;
              color: #27ae60;
              margin: 0;
            }
  
            .method-tag {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
  
            .method-cash { 
              background: #d5f4e6 !important; 
              color: #27ae60 !important; 
              border: 1px solid #27ae60;
            }
            
            .method-card { 
              background: #dae8fc !important; 
              color: #3498db !important; 
              border: 1px solid #3498db;
            }
            
            .method-transfer { 
              background: #fdeaa7 !important; 
              color: #f39c12 !important; 
              border: 1px solid #f39c12;
            }
  
            .receipt-footer {
              text-align: center;
              margin-top: 40px;
              color: #95a5a6;
              font-size: 12px;
              border-top: 1px solid #ecf0f1;
              padding-top: 20px;
            }
  
            .receipt-footer p {
              margin-bottom: 5px;
            }
  
            /* Print-specific styles */
            @media print {
              body { 
                margin: 0 !important;
                background: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              * {
                background: white !important;
                box-shadow: none !important;
              }
              
              .receipt-container {
                max-width: none;
                margin: 0;
                padding: 15px;
              }
              
              .amount-section {
                background: #ecf0f1 !important;
              }
              
              .method-cash { 
                background: #d5f4e6 !important; 
                color: #27ae60 !important; 
              }
              
              .method-card { 
                background: #dae8fc !important; 
                color: #3498db !important; 
              }
              
              .method-transfer { 
                background: #fdeaa7 !important; 
                color: #f39c12 !important; 
              }
  
              .no-print { 
                display: none !important; 
              }
            }
  
            @page {
              margin: 1cm;
              size: A4;
            }
          </style>
        </head>
        <body style="margin:0;padding:0;">
          <div class="receipt-container" style="page-break-inside: avoid;">
            <div class="receipt-header">
              <h1>បង្កាន់ដៃការទូទាត់</h1>
              <h2>លេខប័ណ្ណ #${payment.product_description ? payment.product_description.toString().padStart(4, '0') : 'មិនមាន'}</h2>
              <div class="date">បង្កើតនៅថ្ងៃទី ${moment().format('DD/MM/YYYY HH:mm')}</div>
            </div>
            
            <div class="receipt-body">
              <div class="info-section">
                <div class="info-row">
                  <span class="info-label">កាលបរិច្ឆេទទូទាត់៖</span>
                  <span class="info-value">${payment.payment_date ? formatDateClient(payment.payment_date) : 'មិនមាន'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">ឈ្មោះអតិថិជន៖</span>
                  <span class="info-value">${payment.customer_name || 'មិនមាន'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">លេខទូរស័ព្ទអតិថិជន៖</span>
                  <span class="info-value">${payment.customer_phone || 'មិនមាន'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">អ៊ីមែលអតិថិជន៖</span>
                  <span class="info-value">${payment.customer_email || 'មិនមាន'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">វិធីសាស្ត្រទូទាត់៖</span>
                  <span class="info-value">
                    <span class="method-tag method-${payment.payment_method === 'cash' ? 'cash' : payment.payment_method === 'credit_card' ? 'card' : 'transfer'}">
                      ${payment.payment_method === 'cash' ? 'សាច់ប្រាក់' :
      payment.payment_method === 'credit_card' ? 'កាតឥណទាន' :
        payment.payment_method === 'bank_transfer' ? 'ប្រេវេសប្រាក់' : 'មិនមាន'}
                    </span>
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">ប្រមូលដោយ៖</span>
                  <span class="info-value">${payment.collected_by || 'មិនមាន'}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">ប្រភេទ៖</span>
                  <span class="info-value">${payment.category_name || 'មិនមាន'}</span>
                </div>
                ${payment.notes ? `
                  <div class="info-row">
                    <span class="info-label">កំណត់ចំណាំ៖</span>
                    <span class="info-value">${payment.notes}</span>
                  </div>
                ` : ''}
              </div>
            </div>
  
            <div class="amount-section">
              <h2>ចំនួនទឹកប្រាក់សរុបដែលបានទូទាត់</h2>
              <div class="amount">${formatCurrency(payment.amount)}</div>
            </div>
  
            <div class="receipt-footer">
              <p><strong>សូមអរគុណសម្រាប់ការទូទាត់របស់អ្នក!</strong></p>
              <p>នេះជាបង្កាន់ដៃដែលបង្កើតដោយកុំព្យូទ័រ។</p>
              <p>សូមរក្សាបង្កាន់ដៃនេះសម្រាប់កំណត់ត្រារបស់អ្នក។</p>
            </div>
          </div>
        </body>
      </html>
    `;

  const printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Ensure styles and content are fully loaded before printing
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
};



function PaymentHistoryPage() {
  const [state, setState] = useState({
    payments: [],
    consolidatedCustomers: [],
    loading: false,
    total: 0,
    error: null
  });
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState({
    search: "",
    dateRange: null,
    payment_method: ""
  });

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = khmerStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // In PaymentHistoryPage.jsx, increase the limit to fetch more records
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5000,  // Increase from 10 to 50 or 100
  });
  const [editModal, setEditModal] = useState({
    visible: false,
    data: null,
    loading: false
  });

  const [form] = Form.useForm();

  const profile = getProfile();
  const userId = profile?.id;


  useEffect(() => {
    getPaymentHistory();

    // Set default date range to last 30 days using moment
    const defaultEndDate = moment();
    const defaultStartDate = moment().subtract(30, 'days');

    setFilter(prev => ({
      ...prev,
      dateRange: [defaultStartDate, defaultEndDate]
    }));
  }, []);


  const consolidateCustomers = (payments) => {
    const customerMap = new Map();

    payments.forEach(payment => {
      // Create unique key based on customer identifiers
      const customerKey = [
        payment.customer_name?.trim().toLowerCase() || '',
        payment.customer_phone?.trim() || '',
        payment.customer_email?.trim().toLowerCase() || ''
      ].join('|');

      if (customerMap.has(customerKey)) {
        const existing = customerMap.get(customerKey);
        existing.payments.push(payment);
        existing.totalAmount += parseFloat(payment.amount || 0);
        existing.paymentCount = existing.payments.length;
        // Update last payment date
        if (new Date(payment.payment_date) > new Date(existing.lastPaymentDate)) {
          existing.lastPaymentDate = payment.payment_date;
        }
      } else {
        customerMap.set(customerKey, {
          customer_name: payment.customer_name,
          customer_phone: payment.customer_phone,
          customer_email: payment.customer_email,
          payments: [payment],
          totalAmount: parseFloat(payment.amount || 0),
          paymentCount: 1,
          lastPaymentDate: payment.payment_date
        });
      }
    });

    // Convert to array and sort by total amount descending
    return Array.from(customerMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  };
  const deletePayment = async (paymentId) => {
    Modal.confirm({
      title: <span className="khmer-font-bold">លុបការទូទាត់</span>,
      icon: <ExclamationCircleOutlined />,
      content: <span className="khmer-font">តើអ្នកប្រាកដថាចង់លុបការទូទាត់នេះមែនទេ? ការលុបនេះមិនអាចត្រឡប់វិញបានទេ។</span>,
      okText: <span className="khmer-font">លុប</span>,
      cancelText: <span className="khmer-font">បោះបង់</span>,
      okType: 'danger',
      onOk: async () => {
        try {
          const res = await request(`payment/${paymentId}`, "delete");
          if (res?.success) {
            message.success('ការទូទាត់ត្រូវបានលុបដោយជោគជ័យ');
            await getPaymentHistory();
            if (customerDetailModal.visible) {
              await refreshCustomerModal();
            }
            if (paymentDetailModal.visible && paymentDetailModal.data?.id === paymentId) {
              setPaymentDetailModal({ visible: false, data: null });
            }
          } else {
            throw new Error(res?.error || "Failed to delete payment");
          }
        } catch (error) {
          message.error(error.message);
        }
      }
    });
  };

  const showEditModal = (payment) => {
    setEditModal({
      visible: true,
      data: payment,
      loading: false
    });

    form.setFieldsValue({
      amount: parseFloat(payment.amount) || 0,
      payment_method: payment.payment_method || 'cash',
      bank: payment.bank || null,
      payment_date: payment.payment_date ? moment(payment.payment_date) : moment(),
      notes: payment.notes || ''
    });
  };


  // Update Payment Function
  const updatePayment = async (values) => {
    try {
      setEditModal(prev => ({ ...prev, loading: true }));

      const updateData = {
        amount: parseFloat(values.amount),
        payment_method: values.payment_method,
        bank: values.bank || null,
        payment_date: values.payment_date.format('YYYY-MM-DD'),
        notes: values.notes || ''
      };

      const res = await request(`payment/${editModal.data.id}`, "put", updateData);

      if (res?.success) {
        message.success('ការទូទាត់ត្រូវបានកែប្រែដោយជោគជ័យ');

        // Show difference info if needed
        if (res.data?.difference !== 0) {
          const diffAmount = Math.abs(res.data.difference);
          const diffType = res.data.difference > 0 ? 'បន្ថែម' : 'កាត់បន្ថយ';
          message.info(`បានកែប្រែចំនួនទឹកប្រាក់ ${diffType} ${formatCurrency(diffAmount)}`);
        }

        setEditModal({ visible: false, data: null, loading: false });
        form.resetFields();

        // Refresh data
        await getPaymentHistory();

        // If viewing customer modal, refresh it
        if (customerDetailModal.visible) {
          await refreshCustomerModal();
        }

        // If viewing payment detail modal for this payment, close it
        if (paymentDetailModal.visible && paymentDetailModal.data?.id === editModal.data.id) {
          setPaymentDetailModal({ visible: false, data: null });
        }
      } else {
        throw new Error(res?.error || "Failed to update payment");
      }
    } catch (error) {
      console.error('Update payment error:', error);
      message.error(error.response?.data?.error || error.message || 'មានបញ្ហាក្នុងការកែប្រែការទូទាត់');
      setEditModal(prev => ({ ...prev, loading: false }));
    }
  };

  const getPaymentHistory = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const params = {
        page: viewMode === 'customer' ? 1 : pagination.current,
        limit: viewMode === 'customer' ? 1000 : pagination.pageSize,  // Get all for customer view
        search: filter.search,
        payment_method: filter.payment_method,
        ...(filter.dateRange && {
          from_date: filter.dateRange[0]?.format('YYYY-MM-DD'),
          to_date: filter.dateRange[1]?.format('YYYY-MM-DD')
        })
      };

      const res = await request(`payment/history/my-group`, "get", params);

      if (res?.success) {
        const payments = res.data.list;
        const consolidatedCustomers = consolidateCustomers(payments);

        setState({
          payments: payments,  // All individual payments
          consolidatedCustomers: consolidatedCustomers,  // Grouped by customer
          loading: false,
          total: res.data.pagination.total,
          error: null
        });

        console.log('Total payments:', payments.length);
        console.log('Unique customers:', consolidatedCustomers.length);
      } else {
        throw new Error(res?.error || "Failed to load payment history");
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      message.error(error.message);
    }
  };
  const handleTableChange = (pagination) => {
    setPagination(pagination);
    getPaymentHistory();
  };

  // Modal states
  const [customerDetailModal, setCustomerDetailModal] = useState({
    visible: false,
    data: null
  });

  const [paymentDetailModal, setPaymentDetailModal] = useState({
    visible: false,
    data: null
  });

  const [viewMode, setViewMode] = useState('customer');

  const showCustomerDetails = (customerData) => {
    setCustomerDetailModal({
      visible: true,
      data: customerData
    });
  };

  const showPaymentDetails = (paymentData) => {
    setPaymentDetailModal({
      visible: true,
      data: paymentData
    });
  };

  const refreshCustomerModal = async () => {
    if (customerDetailModal.visible && customerDetailModal.data) {
      await getPaymentHistory();
      const updatedCustomer = state.consolidatedCustomers.find(customer => {
        const currentCustomer = customerDetailModal.data;
        return (
          customer.customer_name === currentCustomer.customer_name &&
          customer.customer_phone === currentCustomer.customer_phone &&
          customer.customer_email === currentCustomer.customer_email
        );
      });

      if (updatedCustomer && updatedCustomer.payments.length > 0) {
        setCustomerDetailModal(prev => ({
          ...prev,
          data: updatedCustomer
        }));
      } else {
        setCustomerDetailModal({ visible: false, data: null });
        message.info('អតិថិជននេះមិនមានការទូទាត់នៅសល់ទេ');
      }
    }
  };

  // Columns for consolidated customer view
  const customerColumns = [
    {
      title: <span className="khmer-font-bold">អតិថិជន</span>,
      key: 'customer_info',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar icon={<UserOutlined />} size="large" style={{ backgroundColor: '#667eea' }} />
          <div>
            <div className="khmer-font-bold" style={{ fontSize: '15px', marginBottom: '4px' }}>
              {record.customer_name || 'មិនមាន'}
            </div>
            <div className="khmer-font" style={{ color: '#6b7280', fontSize: '13px' }}>
              {record.customer_phone || 'មិនមាន'} | {record.customer_email || 'មិនមាន'}
            </div>
          </div>
        </div>
      )
    },
    {
      title: <span className="khmer-font-bold">ការទូទាត់</span>,
      dataIndex: 'paymentCount',
      key: 'paymentCount',
      align: 'center',
      render: (count) => (
        <Tag className="custom-tag" style={{ background: '#e0f2fe', color: '#0277bd', border: 'none' }}>
          {count} ការទូទាត់
        </Tag>
      )
    },
    {
      title: <span className="khmer-font-bold">ចំនួនទឹកប្រាក់សរុប</span>,
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      align: 'right',
      render: (amount) => (
        <div className="amount-display">
          {formatCurrency(amount)}
        </div>
      )
    },
    {
      title: <span className="khmer-font-bold">សកម្មភាព</span>,
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            className="table-action-btn khmer-font"
            icon={<IoEyeOutline />}
            onClick={() => showCustomerDetails(record)}
            size="small"
          >
            មើល
          </Button>

        </Space>
      )
    }
  ];

  const paymentColumns = [
    {
      title: <span className="khmer-font-bold">លេខប័ណ្ណ</span>,
      dataIndex: 'product_description',
      key: 'order_no',
      render: (text) => (
        <Tag className="custom-tag" style={{ background: '#f3e8ff', color: '#7c3aed', border: 'none' }}>
          #{text ? text.toString().padStart(4, '0') : 'មិនមាន'}
        </Tag>
      )
    },
    {
      title: <span className="khmer-font-bold">កាលបរិច្ឆេទ</span>,
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarOutlined style={{ color: '#6b7280' }} />
          <span className="khmer-font">{formatDateClient(date)}</span>
        </div>
      )
    },
    {
      title: <span className="khmer-font-bold">អតិថិជន</span>,
      key: 'customer_info',
      render: (_, record) => (
        <div>
          <div className="khmer-font" style={{ fontWeight: 500 }}>
            {record.customer_name || 'មិនមាន'}
          </div>
          <div className="khmer-font" style={{ color: '#6b7280', fontSize: '12px' }}>
            {record.customer_phone || 'មិនមាន'}
          </div>
        </div>
      )
    },
    {
      title: <span className="khmer-font-bold">ចំនួនទឹកប្រាក់</span>,
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
          <DollarOutlined style={{ color: '#10b981' }} />
          <span className="amount-display">
            {formatCurrency(amount)}
          </span>
        </div>
      )
    },
    {
      title: <span className="khmer-font-bold">វិធីសាស្ត្រ</span>,
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method) => {
        const methodMap = {
          'cash': { text: 'សាច់ប្រាក់', color: '#dcfce7', textColor: '#16a34a' },
          'credit_card': { text: 'កាតឥណទាន', color: '#dbeafe', textColor: '#2563eb' },
          'bank_transfer': { text: 'ប្រេវេសប្រាក់', color: '#fef3c7', textColor: '#d97706' }
        };
        const methodInfo = methodMap[method] || { text: 'មិនមាន', color: '#f3f4f6', textColor: '#6b7280' };
        return (
          <Tag
            className="custom-tag khmer-font"
            style={{
              background: methodInfo.color,
              color: methodInfo.textColor,
              border: 'none'
            }}
          >
            {methodInfo.text}
          </Tag>
        );
      }
    },
    {
      title: <span className="khmer-font-bold">សកម្មភាព</span>,
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            className="table-action-btn khmer-font"
            icon={<IoEyeOutline />}
            onClick={() => showPaymentDetails(record)}
            size="small"
          >
            មើល
          </Button>
          <Button
            className="table-action-btn khmer-font"
            icon={<PrinterOutlined />}
            size="small"
          >
            បោះពុម្ព
          </Button>
        </Space>
      )
    }
  ];

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    getPaymentHistory();
  };

  const handleReset = () => {
    setFilter({
      search: "",
      dateRange: null,
      payment_method: ""
    });
    setPagination({ ...pagination, current: 1 });
  };

  useEffect(() => {
    if (filter.search === "" && !filter.dateRange && filter.payment_method === "") {
      getPaymentHistory();
    }
  }, [filter]);

  return (
    <MainPage loading={loading}>
      <div className="payment-history-container">
        <Card className="main-card">
          {/* Header Section */}
          <div className="header-section">
            <Title level={1} className="khmer-font-bold">ប្រវត្តិការទូទាត់</Title>
            <Text className="khmer-font-large">គ្រប់គ្រងនិងតាមដានការទូទាត់របស់អ្នក</Text>
          </div>

          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-group">
              <div className="filter-row">
                <div>
                  <span className="filter-label khmer-font-bold">ស្វែងរក</span>
                  <Input
                    className="custom-input khmer-font"
                    placeholder="ស្វែងរកតាមឈ្មោះ ទូរស័ព្ទ ឬអ៊ីមែល..."
                    value={filter.search}
                    onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                    prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
                    allowClear
                  />
                </div>

                <div>
                  <span className="filter-label khmer-font-bold">ជ្រើសរើសកាលបរិច្ឆេទ</span>
                  <RangePicker
                    className="custom-date-picker khmer-font"
                    value={filter.dateRange}
                    onChange={(dates) => setFilter(prev => ({ ...prev, dateRange: dates }))}
                    format="DD/MM/YYYY"
                    placeholder={['ចាប់ពីថ្ងៃ', 'ដល់ថ្ងៃ']}
                  />
                </div>

                <div>
                  <span className="filter-label khmer-font-bold">វិធីសាស្ត្រទូទាត់</span>
                  <Select
                    className="custom-date-picker khmer-font w-40"
                    placeholder="ជ្រើសរើសវិធីសាស្ត្រ"
                    value={filter.payment_method}
                    onChange={(value) => setFilter(prev => ({ ...prev, payment_method: value }))}
                    allowClear
                    suffixIcon={<FilterOutlined style={{ color: '#9ca3af' }} />}
                  >
                    <Option value="cash" className="khmer-font">សាច់ប្រាក់</Option>
                    <Option value="credit_card" className="khmer-font">កាតឥណទាន</Option>
                    <Option value="bank_transfer" className="khmer-font">ប្រេវេសប្រាក់</Option>
                  </Select>
                </div>

                <div>
                  <Space style={{ marginTop: '30px' }}>
                    <Button
                      className="action-button primary khmer-font"
                      onClick={handleSearch}
                      icon={<SearchOutlined />}
                    >
                      ស្វែងរក
                    </Button>
                    <Button
                      className="action-button secondary khmer-font"
                      onClick={handleReset}
                    >
                      សម្អាត
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card customers">
                <div className="stat-number">{state.consolidatedCustomers.length}</div>
                <div className="stat-label khmer-font-bold">អតិថិជនសរុប</div>
              </div>

              <div className="stat-card payments">
                <div className="stat-number">{state.payments.length}</div>
                <div className="stat-label khmer-font-bold">ការទូទាត់សរុប</div>
              </div>

              <div className="stat-card total">
                <div className="stat-number">
                  {formatCurrency(state.payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0))}
                </div>
                <div className="stat-label khmer-font-bold">ចំនួនទឹកប្រាក់សរុប</div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="table-section">
            {/* View Mode Toggle */}
            <div className="view-toggle">
              <Space size="large">
                <Text className="khmer-font-bold" style={{ fontSize: '16px', color: '#374151' }}>
                  មើលតាម:
                </Text>
                <Button
                  className={viewMode === 'customer' ? 'ant-btn-primary' : ''}
                  onClick={() => setViewMode('customer')}
                  size="large"
                >
                  <UserOutlined />
                  <span className="khmer-font-bold">
                    អតិថិជន ({state.consolidatedCustomers.length})
                  </span>
                </Button>
                <Button
                  className={viewMode === 'payment' ? 'ant-btn-primary' : ''}
                  onClick={() => setViewMode('payment')}
                  size="large"
                >
                  <DollarOutlined />
                  <span className="khmer-font-bold">
                    ការទូទាត់ ({state.payments.length})
                  </span>
                </Button>
              </Space>
            </div>

            {/* Error Display */}
            {state.error && (
              <div style={{
                marginBottom: 20,
                padding: 16,
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                color: '#dc2626'
              }}>
                <Text className="khmer-font-bold">កំហុស: {state.error}</Text>
              </div>
            )}

            {/* Data Table */}
            <div className="custom-table">
              <Table
                columns={viewMode === 'customer' ? customerColumns : paymentColumns}
                dataSource={viewMode === 'customer' ? state.consolidatedCustomers : state.payments}
                loading={state.loading}
                pagination={false}
                onChange={handleTableChange}
                rowKey={(record, index) =>
                  viewMode === 'customer'
                    ? `${record.customer_name}-${record.customer_phone}-${index}`
                    : record.id || index
                }
                scroll={{ x: 'max-content' }}
                size="middle"
              />
            </div>
          </div>
        </Card>

        {/* Edit Payment Modal */}
        <Modal
          title={<span className="khmer-font-bold" style={{ fontSize: '18px' }}>កែប្រែការទូទាត់</span>}
          open={editModal.visible}
          onCancel={() => {
            setEditModal({ visible: false, data: null, loading: false });
            form.resetFields();
          }}
          footer={[
            <Button
              key="cancel"
              className="action-button secondary khmer-font"
              onClick={() => {
                setEditModal({ visible: false, data: null, loading: false });
                form.resetFields();
              }}
            >
              បោះបង់
            </Button>,
            <Button
              key="submit"
              className="action-button primary khmer-font"
              loading={editModal.loading}
              onClick={() => form.submit()}
            >
              រក្សាទុក
            </Button>
          ]}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={updatePayment}
            style={{ marginTop: '20px' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="amount"
                  label={<span className="khmer-font-bold">ចំនួនទឹកប្រាក់</span>}
                  rules={[
                    { required: true, message: 'សូមបញ្ចូលចំនួនទឹកប្រាក់' },
                    { type: 'number', min: 0.01, message: 'ចំនួនទឹកប្រាក់ត្រូវតែធំជាង 0' }
                  ]}
                >
                  <InputNumber
                    className="custom-input"
                    style={{ width: '100%' }}
                    placeholder="បញ្ចូលចំនួនទឹកប្រាក់"
                    min={0.01}
                    step={0.01}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="payment_method"
                  label={<span className="khmer-font-bold">វិធីសាស្ត្រទូទាត់</span>}
                  rules={[{ required: true, message: 'សូមជ្រើសរើសវិធីសាស្ត្រទូទាត់' }]}
                >
                  <Select
                    className="custom-select khmer-font"
                    placeholder="ជ្រើសរើសវិធីសាស្ត្រទូទាត់"
                  >
                    <Option value="cash" className="khmer-font">សាច់ប្រាក់</Option>
                    <Option value="bank_transfer" className="khmer-font">ផ្ទេរប្រាក់តាមធនាគារ</Option>
                    <Option value="mobile_banking" className="khmer-font">ធនាគារតាមទូរស័ព្ទ</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Conditionally show bank field */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.payment_method !== currentValues.payment_method
              }
            >
              {({ getFieldValue }) =>
                getFieldValue('payment_method') !== 'cash' && (
                  <Form.Item
                    name="bank"
                    label={<span className="khmer-font-bold">ធនាគារ</span>}
                  >
                    <Select
                      className="custom-select khmer-font"
                      placeholder="ជ្រើសរើសធនាគារ"
                      allowClear
                    >
                      <Option value="aba" className="khmer-font">ABA Bank</Option>
                      <Option value="acleda" className="khmer-font">ACLEDA Bank</Option>
                      <Option value="canadia" className="khmer-font">Canadia Bank</Option>
                      <Option value="wing" className="khmer-font">Wing Bank</Option>
                      <Option value="truemoney" className="khmer-font">True Money</Option>
                      <Option value="pipay" className="khmer-font">Pi Pay</Option>
                      <Option value="bakong" className="khmer-font">Bakong</Option>
                    </Select>
                  </Form.Item>
                )
              }
            </Form.Item>

            <Form.Item
              name="payment_date"
              label={<span className="khmer-font-bold">កាលបរិច្ឆេទទូទាត់</span>}
              rules={[{ required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទ' }]}
            >
              <DatePicker
                className="custom-date-picker khmer-font"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
              />
            </Form.Item>

            <Form.Item
              name="notes"
              label={<span className="khmer-font-bold">កំណត់ចំណាំ</span>}
            >
              <Input.TextArea
                className="khmer-font"
                rows={4}
                placeholder="បញ្ចូលកំណត់ចំណាំ (ស្រេចចិត្ត)"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #e1e5e9',
                  fontSize: '15px'
                }}
              />
            </Form.Item>

            {/* Show old vs new amount comparison */}
            {editModal.data && (
              <div style={{
                background: '#f0f9ff',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #bae6fd'
              }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="khmer-font-bold" style={{ color: '#0369a1', marginBottom: '4px' }}>
                      ចំនួនចាស់:
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6b7280' }}>
                      {formatCurrency(editModal.data.amount)}
                    </div>
                  </Col>
                  <Col span={12}>
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue }) => {
                        const newAmount = getFieldValue('amount');
                        const difference = newAmount - parseFloat(editModal.data.amount);
                        return (
                          <>
                            <div className="khmer-font-bold" style={{ color: '#0369a1', marginBottom: '4px' }}>
                              ចំនួនថ្មី:
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
                              {formatCurrency(newAmount || 0)}
                            </div>
                            {difference !== 0 && (
                              <div style={{
                                fontSize: '13px',
                                color: difference > 0 ? '#16a34a' : '#dc2626',
                                marginTop: '4px'
                              }} className="khmer-font">
                                {difference > 0 ? '↑' : '↓'} {formatCurrency(Math.abs(difference))}
                              </div>
                            )}
                          </>
                        );
                      }}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}
          </Form>
        </Modal>
        {/* Customer Details Modal */}
        <Modal
          title={<span className="khmer-font-bold">ព័ត៌មានលម្អិតអតិថិជន - {customerDetailModal.data?.customer_name || 'មិនមាន'}</span>}
          open={customerDetailModal.visible}
          onCancel={() => setCustomerDetailModal({ visible: false, data: null })}
          footer={[
            <Button key="print" icon={<PrinterOutlined />} onClick={() => printCustomerPaymentReport(customerDetailModal.data)} className="khmer-font">
              បោះពុម្ពរបាយការណ៍
            </Button>,
            <Button key="close" onClick={() => setCustomerDetailModal({ visible: false, data: null })} className="khmer-font">
              បិទ
            </Button>
          ]}
          width={1400}
        >
          {customerDetailModal.data && (
            <div>
              <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
                <Descriptions.Item label={<span className="khmer-font-bold">ឈ្មោះ</span>}>
                  <span className="khmer-font">{customerDetailModal.data.customer_name || 'មិនមាន'}</span>
                </Descriptions.Item>
                <Descriptions.Item label={<span className="khmer-font-bold">លេខទូរស័ព្ទ</span>}>
                  <span className="khmer-font">{customerDetailModal.data.customer_phone || 'មិនមាន'}</span>
                </Descriptions.Item>
                <Descriptions.Item label={<span className="khmer-font-bold">អ៊ីមែល</span>}>
                  <span className="khmer-font">{customerDetailModal.data.customer_email || 'មិនមាន'}</span>
                </Descriptions.Item>
                <Descriptions.Item label={<span className="khmer-font-bold">ចំនួនការទូទាត់</span>}>
                  <Tag color="blue" className="khmer-font">{customerDetailModal.data.paymentCount}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<span className="khmer-font-bold">ចំនួនទឹកប្រាក់សរុប</span>} span={2}>
                  <span style={{ fontSize: 18, fontWeight: 'bold', color: '#27ae60' }} className="khmer-font">
                    {formatCurrency(customerDetailModal.data.totalAmount)}
                  </span>
                </Descriptions.Item>
              </Descriptions>

              <Title level={4} className="khmer-font-bold">ប្រវត្តិការទូទាត់</Title>

              {/* Payment History as Individual Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {customerDetailModal.data.payments.map((payment, index) => (
                  <Card
                    key={index}
                    size="small"
                    style={{
                      border: '1px solid #d9d9d9',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    extra={
                      <Space>
                        <Button
                          size="small"
                          icon={<IoEyeOutline />}
                          onClick={() => showPaymentDetails(payment)}
                          className="khmer-font"
                        >
                          មើលលម្អិត
                        </Button>
                        {isPermission("customer.getone") && (


                          <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => showEditModal(payment)}
                            className="khmer-font"
                          >
                            កែប្រែ
                          </Button>

                        )}
                        {isPermission("customer.getone") && (

                          <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => deletePayment(payment.id)}
                            danger
                            className="khmer-font"
                          >
                            លុប
                          </Button>
                        )}

                        <Button
                          size="small"
                          icon={<PrinterOutlined />}
                          onClick={() => printSinglePaymentReport(payment)}
                          className="khmer-font"
                        >
                          បោះពុម្ព
                        </Button>
                      </Space>
                    }
                  >
                    <Row gutter={[16, 8]}>
                      <Col span={24}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                          color: '#1890ff'
                        }} className="khmer-font">
                          ការទូទាត់ #{index + 1} - លេខប័ណ្ណ {payment.product_description ? payment.product_description.toString().padStart(4, '0') : 'មិនមាន'}
                        </div>
                      </Col>

                      <Col span={6}>
                        <div className="khmer-font">
                          <strong>កាលបរិច្ឆេទ៖</strong>
                          <br />
                          {formatDateClient(payment.payment_date)}
                        </div>
                      </Col>

                      <Col span={6}>
                        <div className="khmer-font">
                          <strong>ចំនួនទឹកប្រាក់៖</strong>
                          <br />
                          <span style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '16px' }}>
                            {formatCurrency(payment.amount)}
                          </span>
                        </div>
                      </Col>

                      <Col span={6}>
                        <div className="khmer-font">
                          <strong>វិធីសាស្ត្រ៖</strong>
                          <br />
                          {payment.payment_method === 'cash' ? 'សាច់ប្រាក់' :
                            payment.payment_method === 'credit_card' ? 'កាតឥណទាន' :
                              payment.payment_method === 'bank_transfer' ? 'ប្រេវេសប្រាក់' : 'មិនមាន'}
                        </div>
                      </Col>

                      <Col span={6}>
                        <div className="khmer-font">
                          <strong>កំណត់ចំណាំ៖</strong>
                          <br />
                          {payment.notes || 'មិនមាន'}
                        </div>
                      </Col>

                      {payment.slips?.length > 0 && (
                        <Col span={24}>
                          <div className="khmer-font" style={{ marginTop: '8px' }}>
                            <strong>Payment Slips:</strong>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px',
                              marginTop: '8px'
                            }}>
                              {payment.slips.map((imagePath, slipIndex) => {
                                const isBase64 = imagePath.startsWith('data:image');
                                const fullImageUrl = isBase64 ? imagePath : Config.getFullImagePath(imagePath);

                                return (
                                  <Image
                                    key={slipIndex}
                                    src={fullImageUrl}
                                    alt={`Slip ${slipIndex + 1}`}
                                    width={80}
                                    height={80}
                                    style={{
                                      borderRadius: '8px',
                                      objectFit: 'cover',
                                      border: '2px solid #d9d9d9',
                                    }}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/path/to/placeholder.png';
                                    }}
                                    preview={{
                                      mask: <IoEyeOutline size={16} />
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Modal>
        {/* Payment Details Modal */}
        <Modal
          title={<span className="khmer-font-bold">ព័ត៌មានលម្អិតការទូទាត់ - លេខប័ណ្ណ #{paymentDetailModal.data?.product_description?.toString().padStart(4, '0') || 'មិនមាន'}</span>}
          open={paymentDetailModal.visible}
          onCancel={() => setPaymentDetailModal({ visible: false, data: null })}
          footer={[
            <Button key="print" icon={<PrinterOutlined />} onClick={() => printSinglePaymentReport(paymentDetailModal.data)} className="khmer-font">
              បោះពុម្ពបង្កាន់ដៃ
            </Button>,
            <Button key="close" onClick={() => setPaymentDetailModal({ visible: false, data: null })} className="khmer-font">
              បិទ
            </Button>
          ]}
          width={600}
        >
          {paymentDetailModal.data && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label={<span className="khmer-font-bold">កាលបរិច្ឆេទទូទាត់</span>}>
                <span className="khmer-font">{formatDateClient(paymentDetailModal.data.payment_date)}</span>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="khmer-font-bold">ឈ្មោះអតិថិជន</span>}>
                <span className="khmer-font">{paymentDetailModal.data.customer_name || 'មិនមាន'}</span>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="khmer-font-bold">លេខទូរស័ព្ទ</span>}>
                <span className="khmer-font">{paymentDetailModal.data.customer_phone || 'មិនមាន'}</span>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="khmer-font-bold">អ៊ីមែល</span>}>
                <span className="khmer-font">{paymentDetailModal.data.customer_email || 'មិនមាន'}</span>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="khmer-font-bold">ចំនួនទឹកប្រាក់</span>}>
                <span style={{ fontSize: 18, fontWeight: 'bold', color: '#27ae60' }} className="khmer-font">
                  {formatCurrency(paymentDetailModal.data.amount)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="khmer-font-bold">វិធីសាស្ត្រទូទាត់</span>}>
                <Tag color={
                  paymentDetailModal.data.payment_method === 'cash' ? 'green' :
                    paymentDetailModal.data.payment_method === 'credit_card' ? 'blue' : 'orange'
                } className="khmer-font">
                  {paymentDetailModal.data.payment_method === 'cash' ? 'សាច់ប្រាក់' :
                    paymentDetailModal.data.payment_method === 'credit_card' ? 'កាតឥណទាន' :
                      paymentDetailModal.data.payment_method === 'bank_transfer' ? 'ប្រេវេសប្រាក់' : 'មិនមាន'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="khmer-font-bold">ប្រមូលដោយ</span>}>
                <span className="khmer-font">{paymentDetailModal.data.collected_by || 'មិនមាន'}</span>
              </Descriptions.Item>
              <Descriptions.Item label={<span className="khmer-font-bold">ប្រភេទ</span>}>
                <span className="khmer-font">{paymentDetailModal.data.category_name || 'មិនមាន'}</span>
              </Descriptions.Item>
              {paymentDetailModal.data.notes && (
                <Descriptions.Item label={<span className="khmer-font-bold">កំណត់ចំណាំ</span>}>
                  <span className="khmer-font">{paymentDetailModal.data.notes}</span>
                </Descriptions.Item>
              )}

            </Descriptions>
          )}
        </Modal>
      </div>
    </MainPage>
  );
}

export default PaymentHistoryPage;
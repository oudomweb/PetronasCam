import React from "react";
import styles from "./BillItem.module.css";
import { Col, Row, Space, InputNumber } from "antd";

function BillItem({
  name,
  category_name,
  unit_price,
  actual_price,
  barcode,
  cart_qty,
  handleQuantityChange,
  handlePriceChange,
  handleActualPriceChange,
  index,
}) {
  const safe_actual_price = actual_price > 0 ? actual_price : unit_price; // Prevent division by zero

  // Calculate the total for this item using the formula (qty * unit_price) / actual_price
  const calculated_total = ((cart_qty * unit_price) / safe_actual_price).toFixed(0); // Remove decimals first
  const formattedTotal = Number(calculated_total).toLocaleString(); // Format with commas

  // Format handler for InputNumber
  const formatter = (value) => {
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Parser to convert formatted string back to number
  const parser = (value) => {
    return value.replace(/\$\s?|(,*)/g, '');
  };

  return (
    <div className={styles.container}>
      <Row>
        <Col span={18}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="khmer-oil">{name}</div>
          </div>
          <div>{barcode}</div>
          <div className="khmer-category">{category_name}</div>

          <Space>
            <div className="khmer-text">បរិមាណ:</div> {/* Quantity */}
            <InputNumber
              value={cart_qty}
              onChange={(value) => handleQuantityChange(value, index)}
              min={1}
              formatter={formatter}
              parser={parser}
            />

            <div className="khmer-text">តម្លៃឯកតា($):</div> {/* Unit Price */}
            <InputNumber
              value={unit_price}
              onChange={(value) => handlePriceChange(value, index)}
              min={0}
              formatter={formatter}
              parser={parser}
            />

            <div className="khmer-text">មេចែក:</div> {/* Actual Price */}
            <InputNumber
              value={actual_price}
              onChange={(value) => handleActualPriceChange(value, index)}
              min={0}
              formatter={formatter}
              parser={parser}
            />
          </Space>

          <div className="khmer-total">
            តម្លៃសរុប: {formattedTotal}$ {/* Total */}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default BillItem;
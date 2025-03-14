import React from "react";
import logo from "../../assets/CAMPTN.png";
import "./fonts.css";
import { getProfile } from "../../store/profile.store";

const PrintInvoice = React.forwardRef((props, ref) => {
  const profile = getProfile();
  const {
    objSummary = {
      sub_total: 0,
      total_qty: 0,
      save_discount: 0,
      tax: 10,
      total: 0,
      total_paid: 0,
      customer_id: null,
      user_id: null,
      payment_method: null,
      remark: null,
      order_no: null,
      order_date: null,
    },
    cart_list = [],
  } = props;

  const formatNumber = (value) => {
    const number = parseFloat(value) || 0;
    return Math.round(number).toLocaleString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateTax = () => {
    const subtotal = parseFloat(objSummary.sub_total) || 0;
    const taxRate = parseFloat(objSummary.tax) || 0;
    return (subtotal * taxRate) / 100;
  };

  return (
    <div ref={ref} className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center ">
        <div className=" items-center ">
          <img
            src={logo}
            alt="Company Logo"
            className="w-20 h-20 object-contain"
          />
        </div>
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold khmer-text">វិក្កយបត្រ</h2>
          <h2 className="text-xl khmer-text">INVOICE</h2>
        </div>
        <div className="w-16 h-16"></div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="khmer-text ">
            ឈ្មោះអតិថិជន: {objSummary?.customer_name || "N/A"}
          </p>
          <p className="khmer-text mt-2">អាសយដ្ឋាន: {profile?.address || "N/A"}</p>
          <p className="khmer-text mt-2">លេខទូរស័ព្ទ: {profile?.tel || "N/A"}</p>
          <p className="khmer-text mt-2">គោលដៅ: {objSummary.user_name || "N/A"}</p>
        </div>
        <div className="text-right">
          <p className="khmer-text mt-2">លេខវិក្កយបត្រ: {objSummary.order_no}</p>
          <p className="khmer-text mt-2">
            ថ្ងៃប្រគល់ទំនិញ: {formatDate(objSummary.order_date)}
          </p>
          <p className="khmer-text mt-2"> ថ្ងៃបញ្ជាទិញ:....../....../.....</p>
          <p className="khmer-text mt-2">លេខបញ្ជាទិញ:...................</p>
          <p className="khmer-text mt-2">លេខបណ្ណបញ្ចេញទំនិញ:...................</p>
        </div>
      </div>
      <div className="w-full mb-8 overflow-x-auto">
        <table className="w-full border-collapse border-2 border-black">
          <thead className="border-2 border-black text-black">
            <tr>
              <th className="border-2 border-black p-2 w-1/12 khmer-text text-center">
                <span>ល.រ</span>
                <br /> <span>No</span>
              </th>
              <th className="border-2 border-black p-2 w-5/12 text-center khmer-text">
                {" "}
                <span>ការពិពណ៌នា</span>
                <br /> <span>Description</span>{" "}
              </th>
              <th className="border-2 border-black p-2 w-2/12 text-center khmer-text">
                {" "}
                <span>បរិមាណ</span>
                <br /> <span> Quantity(Liters)</span>{" "}
              </th>
              <th className="border-2 border-black p-2 w-2/12 text-center khmer-text">
                {" "}
                <span>តម្លៃរាយ</span>
                <br /> <span> Unit Price </span>{" "}
              </th>
              <th className="border-2 border-black p-2 w-2/12 text-center khmer-text">
                {" "}
                <span> តម្លៃសរុប</span>
                <br /> <span> Amount</span>{" "}
              </th>
            </tr>
          </thead>
          <tbody className="border-2 border-black">
            {cart_list.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border-2 border-black p-2 text-center khmer-text">
                  {index + 1}
                </td>
                <td className="border-2 border-black p-2 text-center khmer-text">
                  {item.category_name}
                </td>
                <td className="border-2 border-black p-2 text-center khmer-text">
                  {item.cart_qty} <span className=" text-sm">{item.unit}</span>
                </td>
                <td className="border-2 border-black p-2 text-right khmer-text">
                  <div className="w-100 h-100 flex justify-between">
                    <span>$</span>
                    <span>{formatNumber(item.unit_price)}</span>
                  </div>
                </td>
                <td className="border-2 border-black p-2 font-bold khmer-text text-center">
                  <span>$</span>{" "}
                  <span>
                    {formatNumber(
                      (item.cart_qty * item.unit_price) / (item.actual_price || 1)
                    )}
                  </span>
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td
                className="border-2 text-center border-black p-2 khmer-text"
                colSpan={2}
              ></td>
              <td
                className="border-2 border-black p-2 text-center khmer-text"
                colSpan={2}
              >
                តម្លៃរាយសរុប Grand Total
              </td>
              <td className="border-2 border-black p-2 text-right khmer-text">
                <div className="w-100 h-100 flex justify-between">
                  <span>$</span>
                  <span>
                    {formatNumber(
                      cart_list.reduce(
                        (sum, item) =>
                          sum +
                          (item.cart_qty * item.unit_price) /
                          (item.actual_price || 1),
                        0
                      )
                    )}
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td
                className="border-0 border-black p-2 text-center khmer-text"
                colSpan={5}
              >
                ទំនិញត្រូវបានទទួលនៅក្នុងលក្ខខណ្ឌល្អ /{" "}
                <span className="italic">Product Received in Good Order</span>
              </td>
            </tr>
            <tr>
              <td
                className="text-center khmer-text mb-10 pb-0"
                colSpan={5}
              >
                <div className="grid grid-cols-2 text-center khmer-text gap-4">
                  <div className="mt-4 mb-10">
                    <p className="font-bold mb-2 khmer-text">អតិថិជន</p>
                    <p className="khmer-text">Customer:</p>
                    <p className="mt-32 khmer-text">....................</p>
                    <p className="mt-2 khmer-text">ហត្ថលេខា</p>
                    <p className="​ mt-2 khmer-text">ការបរិច្ឆទ Date:</p>
                    <p className="mt-2"> ....../....../.....</p>
                  </div>
                  <div className="text-center mt-4 mb-10 khmer-text px-32">
                    <p className="font-bold mb-2 khmer-text">គណនេយ្យករ</p>
                    <p className="khmer-text">Accountant:</p>
                    <p className="mt-32 khmer-text">....................</p>
                    <p className="mt-2 khmer-text">ហត្ថលេខា</p>
                    <p className="mt-2 khmer-text">ការបរិច្ឆទ Date:</p>
                    <p className="khmer-text mt-2">
                      {formatDate(objSummary.order_date)}
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center khmer-text">
        {/* <p>ទំនាក់ទំនងផ្នែកបច្ចេកទេស: {profile?.tel}</p> */}
        <p>ទំនាក់ទំនងផ្នែកបច្ចេកទេស: +855 67 733 335 / +855 76 5555 713</p>
        {/* <p>តំលៃ: {formatNumber(objSummary.total)}$</p> */}
        {/* <p className="mt-2">បញ្ចុះតំលៃ: {formatNumber(objSummary.save_discount)}$</p>
        <p className="mt-2">សរុប: {formatNumber(objSummary.total - objSummary.save_discount)}$</p> */}
      </div>
    </div>
  );
});

export default PrintInvoice;
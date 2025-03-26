import React from "react";
import logo from "../../assets/petronas_black2.png";
import "./fonts.css";
import { getProfile } from "../../store/profile.store";
import { formatDateClient } from "../../util/helper";
import './printFont.css';

// Function to convert number to Khmer words
const numberToKhmerWords = (number) => {
  const units = ["", "មួយ", "ពីរ", "បី", "បួន", "ប្រាំ", "ប្រាំមួយ", "ប្រាំពីរ", "ប្រាំបី", "ប្រាំបួន"];
  const tens = ["", "ដប់", "ម្ភៃ", "សាមសិប", "សែសិប", "ហាសិប", "ហុកសិប", "ចិតសិប", "ប៉ែតសិប", "កៅសិប"];
  const scales = ["", "ពាន់", "ម៉ឺន", "លាន", "ប៊ីលាន", "ទ្រីលាន"];

  if (number === 0) return "សូន្យដុល្លារគត់";

  let words = "";
  let scaleIndex = 0;

  while (number > 0) {
    const remainder = number % 1000;
    if (remainder !== 0) {
      let remainderWords = "";
      if (remainder < 10) {
        remainderWords = units[remainder];
      } else if (remainder < 100) {
        remainderWords = tens[Math.floor(remainder / 10)] + (remainder % 10 !== 0 ? units[remainder % 10] : "");
      } else {
        remainderWords = units[Math.floor(remainder / 100)] + "រយ" + (remainder % 100 !== 0 ? numberToKhmerWords(remainder % 100).replace("ដុល្លារគត់", "") : "");
      }
      words = remainderWords + scales[scaleIndex] + words;
    }
    number = Math.floor(number / 1000);
    scaleIndex++;
  }

  return words.trim() + "ដុល្លារគត់";
};

const PrintInvoice = React.forwardRef((props, ref) => {
  const profile = getProfile();
  const {
    objSummary = {
      sub_total: 0,
      total_qty: 0,
      save_discount: 0,
      tax: 0,
      total: 0,
      total_paid: 0,
      customer_id: null,
      customer_address: null,
      customer_tel: null,
      user_id: null,
      payment_method: null,
      remark: null,
      order_no: null,
      order_date: null,
    },
    cart_list = [],
  } = props;

  const formatNumber = (value, withDollar = false) => {
    const number = parseFloat(value) || 0;
    const rounded = Math.ceil(number); // Round UP to nearest dollar
    const formatted = rounded.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return withDollar ? `${formatted}$` : formatted;
  };

  const formatGrandTotal = (value, withDollar = false) => {
    const number = parseFloat(value) || 0;
    const rounded = Math.ceil(number); // Round UP to nearest dollar
    const formatted = rounded.toLocaleString('en-US', {
      minimumFractionDigits: 2,  // កំណត់ឱ្យមានយ៉ាងហោចណាស់ 2 ខ្ទង់ទសភាគ
      maximumFractionDigits: 2   // កំណត់ឱ្យមានអតិបរមា 2 ខ្ទង់ទសភាគ
    });
    return withDollar ? `${formatted}$` : formatted;
  };
  const FormatQTY = (value) => {
    const number = parseFloat(value) || 0;
    return number.toLocaleString('en-US');
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
  const formatUnitPrice = (value) => {
    const number = parseFloat(value) || 0;
    return Math.floor(number); // Removes decimal part completely
  };

  const calculateTax = () => {
    const subtotal = parseFloat(objSummary.sub_total) || 0;
    const taxRate = parseFloat(objSummary.tax) || 0;
    return (subtotal * taxRate) / 100;
  };

  // Calculate total amount
  const totalAmount = cart_list.reduce(
    (sum, item) =>
      sum +
      (item.cart_qty * item.unit_price) / (item.actual_price || 1),
    0
  );

  // Round total amount UP to the nearest dollar (ceiling instead of regular rounding)
  const roundedTotal = Math.ceil(totalAmount);

  // Convert rounded total to Khmer words
  const totalInKhmerWords = numberToKhmerWords(roundedTotal);
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    return phone.split("/").join(" / ");
  }
  return (
    <div ref={ref} className="p-8 max-w-4xl mx-auto ">
      <div className="flex justify-between items-center">
        <div className="items-center">
          <img
            src={logo}
            alt="Company Logo"
            className="w-40 h-40 object-contain filter grayscale"
          />
        </div>


        <div className="flex flex-col items-center justify-center text-center flex-1">
          <h2 className="text-2xl khmer-text moul-regular ">វិក្កយប័ត្រ</h2>
          <h2 className="text-xl khmer-text">INVOICE</h2>
        </div>

        <div className="w-16 h-16"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
  <div className="w-full">
    <div className="grid gap-y-1">
      <p className=" khmer-text font-bold  text-black">
      ឈ្មោះអតិថិជន:
      {objSummary?.customer_name || "N/A"}
      </p>
      <p className="khmer-text font-medium">
        អាស័យដ្ឋាន: <span className="freehand-regular text-[11px]">{objSummary?.customer_address || "N/A"}</span>
      </p>
      <p className="khmer-text font-medium">លេខទូរស័ព្ទ: {objSummary?.customer_tel || "N/A"}</p>
      <p className="khmer-text font-medium">គោលដៅ: {objSummary.user_name || "N/A"}</p>
    </div>
  </div>

  <div className="w-full flex justify-end">
  <div className="w-[80%] grid grid-cols-[55%_3%_43%]  gap-y-1 p-2 rounded-lg">

    <div className="text-start flex flex-col items-start">
      <p className="khmer-text font-medium">លេខវិក្កយប័ត្រ</p>
      <p className="khmer-text font-medium">ថ្ងៃបញ្ជាទិញ</p>
      <p className="khmer-text font-medium">ថ្ងៃប្រគល់ទំនិញ</p>
      <p className="khmer-text font-medium">លេខបញ្ជាទិញ</p>
      <p className="khmer-text font-medium">លេខបណ្ណបញ្ចេញទំនិញ</p>
    </div>


    <div className="flex flex-col items-center">
      <p className="khmer-text font-medium">:</p>
      <p className="khmer-text font-medium">:</p>
      <p className="khmer-text font-medium">:</p>
      <p className="khmer-text font-medium">:</p>
      <p className="khmer-text font-medium">:</p>
    </div>

    <div className="text-start flex flex-col ">
      <p className="khmer-text font-medium">{objSummary.order_no}</p>
      <p className="khmer-text font-medium">{formatDateClient(objSummary.order_date)}</p>
      <p className="khmer-text font-medium">{formatDateClient(objSummary.order_date)}</p>
      <p className="khmer-text font-medium">{objSummary.order_no ? `#SA-${objSummary.order_no}` : ""}</p>
      <p className="khmer-text font-medium">...................</p>
    </div>
  </div>
</div>



</div>


      <div className="w-full mb-8 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-500">
          <thead className="border border-gray-500 text-black">
            <tr>
              <th className="border border-gray-500 p-[2px] min-w-[0px] khmer-text font-semibold text-center">
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-xs  khmer-text font-semibold">ល.រ</span>
                  <span className="text-[10px]">No</span>
                </div>
              </th>


              <th className="border border-gray-500 p-1 w-5/12 text-center khmer-text font-semibold">
                <span>ការពិពណ៌នា</span>
                <br /> <span>Description</span>
              </th>
              <th className="border border-gray-500 p-1 w-2/12 text-center khmer-text font-semibold">
                <span>បរិមាណ</span>
                <br /> <span>Quantity(Liters)</span>
              </th>
              <th className="border border-gray-500 p-1 w-2/12 text-center khmer-text font-semibold">
                <span>តម្លៃរាយ</span>
                <br /> <span>Ton Price</span>
              </th>
              <th className="border border-gray-500 p-1 w-2/12 text-center khmer-text font-semibold">
                <span>តម្លៃសរុប</span>
                <br /> <span>Amount</span>
              </th>
            </tr>
          </thead>
          <tbody className="border border-gray-500">
            {cart_list.map((item, index) => {
              // Calculate individual item total correctly
              const itemTotal = (item.cart_qty * item.unit_price) / (item.actual_price || 1);
              const formattedItemTotal = formatNumber(itemTotal);

              return (
                <tr key={index} className="hover:bg-gray-50 p-1">
                  <td className="border border-gray-500 p-1 text-center khmer-text font-medium">
                    {index + 1}
                  </td>
                  <td className="border border-gray-500 p-4 text-left khmer-text font-medium">
                    {item.category_name}
                  </td>
                  <td className="border border-gray-500 p-1  text-center khmer-text font-medium">
                    {FormatQTY(item.cart_qty)} <span className="text-sm">{item.unit}</span>
                  </td>

                  <td className="border border-gray-500 p-1 text-right khmer-text font-medium">
                    <div className="w-100 h-100 flex justify-between">
                      <span>$</span>
                      <span>{formatUnitPrice(item.unit_price)}</span>
                    </div>
                  </td>
                  <td className="border border-gray-500 p-1 text-right font-bold khmer-text font-medium">
                    $ {formattedItemTotal}
                  </td>
                </tr>
              );
            })}


            {/* Grand Total Row */}
            <tr className="font-bold">
              <td className="border text-center border-gray-500 p-2 khmer-text font-medium" colSpan={2}>
                {totalInKhmerWords}
              </td>
              <td className="border border-gray-500 p-1 text-center khmer-text font-medium" colSpan={2}>
                តម្លៃរាយសរុប Grand Total
              </td>
              <td className="border border-gray-500 p-1 text-right khmer-text font-medium">
                <div className="w-100 h-100 flex justify-between">
                  <span>$</span>
                  <span>{formatNumber(roundedTotal)}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td
                className="border-0 border-gray-500 p-1 text-center khmer-text font-medium"
                colSpan={5}
              >
                ទំនិញត្រូវបានទទួលនៅក្នុងលក្ខខណ្ឌល្អ /{" "}
                <span className="italic">Product Received in Good Order</span>
              </td>
            </tr>
            <tr>
              <td
                className="text-center khmer-text font-medium mb-10 pb-0"
                colSpan={5}
              >
                <div className="grid grid-cols-2 text-center khmer-text font-medium gap-4">
                  <div className="mt-4 mb-10">
                    <p className="font-bold mb-2 khmer-text font-medium">អតិថិជន</p>
                    <p className="khmer-text font-medium">Customer:</p>
                    <p className="mt-32 khmer-text font-medium">....................</p>
                    <p className="mt-2 khmer-text font-medium">ហត្ថលេខា</p>
                    <p className="mt-2 khmer-text font-medium">ការបរិច្ឆទ Date:</p>

                    {/* Add space here */}
                    <div className="mt-8"></div>

                    <p className="mt-2 text-md"> ....../....../.....</p>
                  </div>
                  <div className="text-center mt-4 mb-10 khmer-text font-medium px-32">
                    <p className="font-bold mb-2 khmer-text font-medium">គណនេយ្យករ</p>
                    <p className="khmer-text font-medium">Accountant:</p>
                    <p className="mt-32 khmer-text font-medium">....................</p>
                    <p className="mt-2 khmer-text font-medium">ហត្ថលេខា</p>
                    <p className="mt-2 khmer-text font-medium">ការបរិច្ឆទ Date:</p>
                    <div className="mt-8"></div>
                    <p className="khmer-text font-medium mt-2">
                      {formatDateClient(objSummary.order_date)}
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center font-medium">
        <p>ទំនាក់ទំនងផ្នែកទីផ្សារ: {formatPhoneNumber(profile?.tel)} </p>
      </div>
    </div>
  );
});

export default PrintInvoice;


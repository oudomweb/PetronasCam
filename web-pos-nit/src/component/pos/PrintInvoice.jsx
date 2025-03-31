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
  const scales = ["", "ពាន់", "ម៉ឺន", "លាន", "ដប់លាន", "រយលាន", "ពាន់លាន"];

  const dollarPart = Math.floor(number);
  const centPart = Math.round((number - dollarPart) * 100);

  const convertLessThanOneMillion = (num) => {
    if (num === 0) return "";
    let str = "";

    if (num >= 100000) {
      const hundredThousands = Math.floor(num / 100000);
      str += units[hundredThousands] + "រយ";
      num %= 100000;
    }

    if (num >= 10000) {
      const tenThousands = Math.floor(num / 10000);
      str += tens[tenThousands];
      num %= 10000;
    }

    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      str += units[thousands] + "ពាន់";
      num %= 1000;
    }

    if (num >= 100) {
      const hundreds = Math.floor(num / 100);
      str += units[hundreds] + "រយ";
      num %= 100;
    }

    if (num >= 10) {
      const ten = Math.floor(num / 10);
      str += tens[ten];
      num %= 10;
    }

    if (num > 0) {
      str += units[num];
    }

    return str;
  };

  let dollarWords = "";
  let remaining = dollarPart;

  if (remaining === 0) {
    dollarWords = "សូន្យ";
  } else {
    const millions = Math.floor(remaining / 1000000);
    remaining %= 1000000;

    if (millions > 0) {
      dollarWords += convertLessThanOneMillion(millions) + "លាន";
    }

    dollarWords += convertLessThanOneMillion(remaining);
  }

  let centWords = "";
  if (centPart > 0) {
    if (centPart < 10) {
      centWords = units[centPart] + "សេន";
    } else {
      const ten = Math.floor(centPart / 10);
      const unit = centPart % 10;
      centWords = tens[ten] + (unit !== 0 ? units[unit] : "") + "សេន";
    }
  }

  if (dollarPart > 0 && centPart > 0) {
    return dollarWords.trim() + "ដុល្លារនិង" + centWords;
  } else if (dollarPart > 0) {
    return dollarWords.trim() + "ដុល្លារគត់";
  } else if (centPart > 0) {
    return centWords;
  } else {
    return "សូន្យដុល្លារគត់";
  }
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

    // Format the number to have at most 2 decimal places
    let formatted = number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    // Remove the decimal part if it's .00
    if (formatted.endsWith('.00')) {
      formatted = formatted.slice(0, -3);
    }

    return withDollar ? `$${formatted}` : formatted;
  };


  const formatGrandTotal = (value, withDollar = false) => {
    return formatNumber(value, withDollar); // Use same formatting as item totals
  };

  const FormatQTY = (value) => {
    const number = parseFloat(value) || 0;
    return number.toLocaleString('en-US');
  };


  const formatUnitPrice = (value) => {
    const number = parseFloat(value) || 0;
    return Math.floor(number);
  };



  const totalAmount = cart_list.reduce(
    (sum, item) => sum + (item.cart_qty * item.unit_price) / (item.actual_price || 1),
    0
  );

  const displayAmount = totalAmount; // No rounding
  const displayWords = numberToKhmerWords(displayAmount);

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    return phone.split("/").join(" / ");
  }

  return (
    <div ref={ref} className="p-8 px-14 max-w-4xl mx-auto ">
      <div className="flex justify-between items-center">
        <div className="items-center">
          <img
            src={logo}
            alt="Company Logo"
            className="w-40 h-40 object-contain filter grayscale"
          />
        </div>


        <div className="flex flex-col items-center justify-center text-center flex-1 relative me-16 mt-10">
          <h2 className="text-2xl text-[15px] moul-regular ">វិក្កយប័ត្រ</h2>
          <h2 className="text-xl text-[15px]">INVOICE</h2>
        </div>

        <div className="w-16 h-16"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="w-full mt-2">
          <div className="grid gap-y-1">
            <p className=" text-[15px] font-bold  text-black">
              ឈ្មោះអតិថិជន:
              {objSummary?.customer_name || "N/A"}
            </p>
            <p className="text-[15px] font-medium">
              អាស័យដ្ឋាន: <span className="freehand-regular text-[11px]">{objSummary?.customer_address || "N/A"}</span>
            </p>
            <p className="text-[15px] font-medium">លេខទូរស័ព្ទ: {objSummary?.customer_tel || "N/A"}</p>
            <p className="text-[15px] font-medium">គោលដៅ: {objSummary.user_name || "N/A"}</p>
          </div>
        </div>

        <div className="w-full flex justify-end relative ms-4 ">
          <div className="w-[80%] grid grid-cols-[57%_1%_43%]  gap-y-1 p-2 rounded-lg">

            <div className="text-start flex flex-col items-start">
              <p className="text-[15px] font-medium">លេខវិក្កយប័ត្រ</p>
              <p className="text-[15px] font-medium">ថ្ងៃបញ្ជាទិញ</p>
              <p className="text-[15px] font-medium">ថ្ងៃប្រគល់ទំនិញ</p>
              <p className="text-[15px] font-medium">លេខបញ្ជាទិញ</p>
              <p className="text-[15px] font-medium">លេខបណ្ណបញ្ចេញទំនិញ</p>
            </div>


            <div className="flex flex-col items-center">
              <p className="text-[15px] font-medium">:</p>
              <p className="text-[15px] font-medium">:</p>
              <p className="text-[15px] font-medium">:</p>
              <p className="text-[15px] font-medium">:</p>
              <p className="text-[15px] font-medium">:</p>
            </div>

            <div className="text-start flex flex-col ">
              <p className="text-[15px] font-medium">{objSummary.order_no}</p>
              <p className="text-[15px] font-medium">{formatDateClient(objSummary.order_date)}</p>
              <p className="text-[15px] font-medium">....../....../.....</p>
              <p className="text-[15px] font-medium">{objSummary.order_no ? `#SA-${objSummary.order_no}` : ""}</p>
              <p className="text-[15px] font-medium">...................</p>
            </div>
          </div>
        </div>



      </div>
      <div className="w-full mb-4 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-500">
          <thead className="border border-gray-500 text-black">
            <tr>
              <th className="border border-gray-500 p-[2px] min-w-[0px] text-[15px] font-semibold text-center">
                <div className="flex flex-col items-center leading-tight">
                  <span className=" text-[15px] font-semibold">ល.រ</span>
                  <span className="">No</span>
                </div>
              </th>


              <th className="border border-gray-500 p-1 w-5/12 text-center text-[15px] font-semibold">
                <span>បរិយាយមុខទំនិញ</span>
                <br /> <span>Description</span>
              </th>
              <th className="border border-gray-500 p-1 w-2/12 text-center text-[15px] font-semibold">
                <span>បរិមាណ</span>
                <br /> <span>Quantity(Liters)</span>
              </th>
              <th className="border border-gray-500 p-1 w-2/12 text-center text-[15px] font-semibold">
                <span>តម្លៃតោន</span>
                <br /> <span>Ton Price</span>
              </th>
              <th className="border border-gray-500 p-1 w-2/12 text-center text-[15px] font-semibold">
                <span>តម្លៃសរុប</span>
                <br /> <span>Amount</span>
              </th>
            </tr>
          </thead>
          <tbody className="border border-gray-500">
            {cart_list?.map((item, index) => {
              // Calculate individual item total correctly
              const itemTotal = (item.cart_qty * item.unit_price) / (item.actual_price || 1);
              const formattedItemTotal = formatNumber(itemTotal);

              return (
                <>
                  <tr key={index} className="hover:bg-gray-50 ">
                    <td className="border border-gray-500  text-center text-[15px] font-medium">
                      {index + 1}
                    </td>
                    <td className="border border-gray-500 text-center p-2  text-[15px] font-medium">
                      {item.category_name}
                    </td>
                    <td className="border border-gray-500   text-center text-[15px] font-medium">
                      {FormatQTY(item.cart_qty)} <span className="text-sm">{item.unit}</span>
                    </td>

                    <td className="border border-gray-500  text-center text-[15px] font-medium">
                      <div className="w-100 h-100 ">
                        <span>$ {formatUnitPrice(item.unit_price)}</span>
                      </div>
                    </td>
                    <td className="border border-gray-500  text-center font-bold text-[15px] font-medium">
                      $ {formattedItemTotal}
                    </td>
                  </tr>
                </>
              );
            })}


            {/* Grand Total Row */}
            <tr className="font-bold">
              <td className="border text-center border-gray-500 p-2 text-[15px] font-medium" colSpan={2}>
                {displayWords}
              </td>
              <td className="border border-gray-500 p-1 text-center text-[15px] font-medium" colSpan={2}>
                តម្លៃរាយសរុប Grand Total
              </td>
              <td className="border border-gray-500 p-1 text-right text-[15px] font-medium">
                <div className="w-100 h-100">
                  <span></span>
                  <span>$ {formatGrandTotal(displayAmount)}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td
                className="border-0 border-gray-500 p-1 text-center text-[15px] font-medium"
                colSpan={5}
              >
                ទំនិញត្រូវបានទទួលនៅក្នុងលក្ខខណ្ឌល្អ /{" "}
                <span className="italic">Product Received in Good Order</span>
              </td>
            </tr>
            <tr>
              <td
                className="text-center text-[15px] font-medium mb-10 pb-0"
                colSpan={5}
              >
                <div className="grid grid-cols-2 text-center text-[15px] font-medium gap-4">
                  <div className="mt-2 mb-10">
                    <p className="font-bold mb-2 text-[15px] font-medium">អតិថិជន</p>
                    <p className="text-[15px] font-medium">Customer:</p>
                    <p className="mt-28 text-[15px] font-medium">....................</p>
                    <p className="mt-2 text-[15px] font-medium">ហត្ថលេខា</p>
                    <p className="mt-2 text-[15px] font-medium">កាលបរិច្ឆេទ Date:</p>

                    {/* Add space here */}
                    <div className="mt-8"></div>

                    <p className="mt-2 text-md"> ....../....../.....</p>
                  </div>
                  <div className="text-center mt-2 mb-10 text-[15px] font-medium px-32">
                    <p className="font-bold mb-2 text-[15px] font-medium">គណនេយ្យករ</p>
                    <p className="text-[15px] font-medium">Accountant:</p>
                    <p className="mt-28 text-[15px] font-medium">....................</p>
                    <p className="mt-2 text-[15px] font-medium">ហត្ថលេខា</p>
                    <p className="mt-2 text-[15px] font-medium">កាលបរិច្ឆេទ Date:</p>
                    <div className="mt-8"></div>
                    <p className="text-[15px] font-medium mt-2">
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


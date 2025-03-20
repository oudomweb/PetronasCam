// const { db, isArray, isEmpty, logError } = require("../util/helper");

// exports.getList = async (req, res) => {
//   try {
//     const [customer] = await db.query("SELECT COUNT(id) AS total FROM customer");
//     const [employee] = await db.query("SELECT COUNT(id) AS total FROM employee");
//     const [expanse] = await db.query("SELECT " +
//       "COALESCE(SUM(amount), 0) AS total, " +
//       "COUNT(id) AS total_expense " +
//       " FROM expense " +
//       " WHERE " +
//       "MONTH(expense_date) = MONTH(CURRENT_DATE()) " +
//       "AND YEAR(expense_date) = YEAR(CURRENT_DATE());");
//     const [sale] = await db.query("SELECT " +
//       "CONCAT(COALESCE(SUM(r.total_amount), 0), '$') AS total, " +
//       "COUNT(r.id) AS total_order " +
//       "FROM `order` r " +
//       "WHERE MONTH(r.create_at) = MONTH(CURRENT_DATE()) " +
//       "AND YEAR(r.create_at) = YEAR(CURRENT_DATE());");

//     const [Sale_Summary_By_Month] = await db.query(
//       "SELECT " +
//       "DATE_FORMAT(r.create_at, '%M') AS title, " +
//       "SUM(r.total_amount) AS total " +
//       "FROM  " +
//       "`order` r " +
//       "WHERE  " +
//       "YEAR(r.create_at) = YEAR(CURRENT_DATE) " +
//       "GROUP BY  " +
//       "MONTH(r.create_at)"
//     );
//     const [Expense_Summary_By_Month] = await db.query(
//       "SELECT " +
//       "DATE_FORMAT(r.expense_date, '%M') AS title, " +
//       "SUM(r.amount) AS total " +
//       "FROM  " +
//       "`expense` r " +
//       "WHERE  " +
//       "YEAR(r.expense_date) = YEAR(CURRENT_DATE) " +
//       "GROUP BY  " +
//       "MONTH(r.expense_date)"
//     );

//     const [User_Summary] = await db.query(`
//   SELECT 
//       r.name, 
//       COUNT(u.id) AS total_users
//   FROM user u
//   JOIN role r ON u.role_id = r.id
//   GROUP BY r.name;
// `);
//     const malePercentage = 0.6; // 60%
//     const femalePercentage = 0.4; // 40%

//     let dashboard = [
//       {
//         title: "អ្នកប្រើបាស់",
//         Summary: {
//           "សរុប": User_Summary.reduce((sum, row) => sum + row.total_users, 0), // បូកសរុបអ្នកប្រើប្រាស់ទាំងអស់
//           "អ្នកគ្រប់គ្រង": User_Summary.find(role => role.name === 'Admin')?.total_users || 0, // ចំនួនអ្នកគ្រប់គ្រង
//           "អ្នកប្រើប្រាស់": User_Summary.find(role => role.name === 'User')?.total_users || 0 // ចំនួនអ្នកប្រើប្រាស់

//         }

//       },
//       {
//         title: "អតិថិជន",
//         Summary: {
//           សរុប: customer[0].total,
//           បុរស: Math.round(customer[0].total * malePercentage), // 60% Male
//           ស្ត្រី: Math.round(customer[0].total * femalePercentage) // 40% Female
//         }


//       },
//       {
//         title: "និយោជិត", // Employee

//         Summary: {
//           សរុប: employee[0].total, // Total
//           បុរស: 1, // Male
//           ស្ត្រី: 2 // Female
//         }
//       }
//       ,
//       {
//         title: "ប្រព័ន្ធចំណាយ",
//         Summary: {
//           "ចំណាយ": "ខែនេះ",
//           "សរុប": expanse[0].total + "$", // Total translated as "សរុប"
//           "ចំនួនសរុប": expanse[0].total_expense // Total_Expense translated as "ចំណាយសរុប"
//         }

//       }
//       ,
//       {

//         title: "ការលក់",
//         Summary: {
//           "លក់": "ខែនេះ",
//           "សរុប": sale[0].total,
//           "ការបញ្ជាទិញសរុប": sale[0].total_order
//         }

//       }
//     ];



//     res.json({
//       dashboard,
//       Sale_Summary_By_Month,
//       Expense_Summary_By_Month
//     });

//   } catch (error) {
//     logError("Dashbaord.getList", error, res);
//   }
// };

const { db, isArray, isEmpty, logError } = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    // Get date filter parameters
    let { from_date, to_date } = req.query;

    // Set default date range if not provided
    if (!from_date || !to_date) {
      const currentDate = new Date();
      to_date = currentDate.toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

      // Default from_date to first day of current year
      from_date = `${currentDate.getFullYear()}-01-01`;
    }

    // Query parameters for filtering by date
    const dateFilter = from_date && to_date ?
      `AND DATE(r.create_at) BETWEEN '${from_date}' AND '${to_date}'` :
      '';

    const expenseDateFilter = from_date && to_date ?
      `AND DATE(r.expense_date) BETWEEN '${from_date}' AND '${to_date}'` :
      '';

    // Customer count - optionally filtered by date
    const customerQuery = `
      SELECT COUNT(id) AS total 
      FROM customer
      ${from_date && to_date ? `WHERE DATE(create_at) BETWEEN '${from_date}' AND '${to_date}'` : ''}
    `;
    const [customer] = await db.query(customerQuery);

    // Employee count - typically not filtered by date unless needed
    const [employee] = await db.query(`
     SELECT 
    COUNT(id) AS total, 
    SUM(CASE WHEN gender = 1 THEN 1 ELSE 0 END) AS male, 
    SUM(CASE WHEN gender = 0 THEN 1 ELSE 0 END) AS female
FROM employee;
    `);

    // Expense data with date filter
    const expenseQuery = `
      SELECT 
        COALESCE(SUM(amount), 0) AS total, 
        COUNT(id) AS total_expense 
      FROM expense 
      WHERE 1=1
      ${from_date && to_date ? `AND DATE(expense_date) BETWEEN '${from_date}' AND '${to_date}'` : ''}
    `;
    const [expanse] = await db.query(expenseQuery);

    // Sales data with date filter
    const saleQuery = `
      SELECT 
        CONCAT(COALESCE(SUM(r.total_amount), 0), '$') AS total, 
        COUNT(r.id) AS total_order 
      FROM \`order\` r 
      WHERE 1=1
      ${from_date && to_date ? `AND DATE(r.create_at) BETWEEN '${from_date}' AND '${to_date}'` : ''}
    `;
    const [sale] = await db.query(saleQuery);

    // Sales summary by month with date filter
    const saleSummaryQuery = `
      SELECT 
        DATE_FORMAT(r.create_at, '%M') AS title, 
        SUM(r.total_amount) AS total 
      FROM \`order\` r 
      WHERE 1=1
      ${dateFilter}
      GROUP BY DATE_FORMAT(r.create_at, '%M')
    `;
    const [Sale_Summary_By_Month] = await db.query(saleSummaryQuery);

    // Expense summary by month with date filter
    const expenseSummaryQuery = `
      SELECT 
        DATE_FORMAT(r.expense_date, '%M') AS title, 
        SUM(r.amount) AS total 
      FROM expense r 
      WHERE 1=1
      ${expenseDateFilter}
      GROUP BY DATE_FORMAT(r.expense_date, '%M')
    `;
    const [Expense_Summary_By_Month] = await db.query(expenseSummaryQuery);

    // User summary data - typically not filtered by date
    const [User_Summary] = await db.query(`
      SELECT 
        r.name, 
        COUNT(u.id) AS total_users
      FROM user u
      JOIN role r ON u.role_id = r.id
      GROUP BY r.name
    `);

    const malePercentage = 0.6; // 60%
    const femalePercentage = 0.4; // 40%

    let dashboard = [
      {
        title: "អ្នកប្រើប្រាស់",
        Summary: {
          "សរុប": User_Summary.reduce((sum, row) => sum + row.total_users, 0) + " នាក់", // Correct total sum
          "អ្នកគ្រប់គ្រង": (User_Summary.find(role => role.name === 'Admin')?.total_users || 0) + " នាក់", // Ensuring valid number
          "អ្នកប្រើប្រាស់": (User_Summary.find(role => role.name === 'User')?.total_users || 0) + " នាក់" // Ensuring valid number
        }
      },

      {
        title: "អតិថិជន",
        Summary: {
          សរុប: customer[0].total + " នាក់",
          បុរស: Math.round(customer[0].total * malePercentage) + " នាក់", // 60% Male
          ស្ត្រី: Math.round(customer[0].total * femalePercentage) + " នាក់" // 40% Female
        }
      },
      {
        title: "និយោជិត", // Employee
        Summary: {
          "សរុប": employee[0].total + "នាក់", // Total Employees
          "បុរស": employee[0].male + " នាក់", // Male Employees
          "ស្ត្រី": employee[0].female + " នាក់" // Female Employees
        }
      },
      {
        title: "ប្រព័ន្ធចំណាយ",
        Summary: {
          "ចំណាយ": from_date && to_date ? `${from_date} - ${to_date}` : "ខែនេះ",
          "សរុប": expanse[0].total + "$", // Total translated as "សរុប"
          "ចំនួនសរុប": expanse[0].total_expense // Total_Expense translated as "ចំណាយសរុប"
        }
      },
      {
        title: "ការលក់",
        Summary: {
          "លក់": from_date && to_date ? `${from_date} - ${to_date}` : "ខែនេះ",
          "សរុប": sale[0].total,
          "ការបញ្ជាទិញសរុប": sale[0].total_order
        }
      }
    ];

    res.json({
      dashboard,
      Sale_Summary_By_Month,
      Expense_Summary_By_Month
    });

  } catch (error) {
    logError("Dashboard.getList", error, res);
  }
};
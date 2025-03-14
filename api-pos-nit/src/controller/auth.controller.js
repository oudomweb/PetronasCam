const { logError, db } = require("../util/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../util/config");
const { json } = require("express");

exports.getList = async (req, res) => {
  try {
    let sql = `
  SELECT  
    u.id, 
    u.name, 
    u.barcode, 
    u.username, 
    u.branch_name, 
    u.create_by, 
    u.create_at, 
    u.address, 
    u.tel, 
    u.is_active, 
    r.name AS role_name 
  FROM user u 
  INNER JOIN role r ON u.role_id = r.id 
  ORDER BY u.create_at DESC
`;


    const [list] = await db.query(sql);
    const [role] = await db.query(
      "SELECT id AS value, name AS label FROM role"
    );

    res.json({
      list,
      role,
    });
  } catch (error) {
    logError("auth.getList", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    // Check if a password is provided for update
    let password = req.body.password;
    
    // Only hash the password if it's being updated (if password exists)
    if (password) {
      password = bcrypt.hashSync(password, 10); // Hash the password
    }

    // Create the SQL query based on the presence of the password
    let sql = "UPDATE user SET name = :name, username = :username, role_id = :role_id, ";
    sql += password ? "password = :password, " : "";  // Only add password field if password exists
    sql += "tel = :tel, branch_name = :branch_name, "; // Added comma after branch_name
    sql += "is_active = :is_active, address = :address, create_by = :create_by, create_at = :create_at ";
    sql += "WHERE id = :id";
    
    // Prepare the query parameters
    const queryParams = { 
      ...req.body, 
      password: password || req.body.password, // If no new password, retain the original password
      create_by: req.auth?.name,
      create_at: new Date() // Use current timestamp or req.auth?.create_at
    };
    
    // Execute the query
    const [data] = await db.query(sql, queryParams);
    
    // Send response back
    res.json({
      data: data,
      message: "Update success!",
      create_by: req.auth?.name,
    });
  } catch (error) {
    logError("customer.update", error, res);
  }
};


// exports.register = async (req, res) => {
//   try {
//     // Extract values from req.body
//     const { role_id, name, username, password, address, tel, branch_name, barcode, is_active } = req.body;

//     // Hash password
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     // SQL Query
//     let sql = `
//       INSERT INTO user (role_id, name, username, password, is_active, address, tel, branch_name, barcode, create_by, create_at) 
//       VALUES (:role_id, :name, :username, :password, :is_active, :address, :tel, :branch_name, :barcode, :create_by, :create_at);
//     `;

//     // Execute Query
//     let data = await db.query(sql, {
//       role_id,
//       name,
//       username,
//       password: hashedPassword,
//       address,
//       tel,
//       branch_name,
//       barcode,
//       is_active,
//       create_by: req.auth?.name,
//       create_at: new Date() // Set the creation time
//     });

//     // Success Response
//     res.json({
//       message: "Create new account success!",
//       data: data,
//     });
//   } catch (error) {
//     logError("auth.register", error, res);
//   }
// };
// exports.register = async (req, res) => {
//   try {
//     let password = bcrypt.hashSync(req.body.password, 10);

//     // Generate a new barcode
//     const { role_id, name, username, address, tel, branch_name, barcode, status } = req.body;

//     let sql = `
//       INSERT INTO user (role_id, name, username, password, is_active, address, tel, branch_name, barcode, create_by, create_at)
//       VALUES (:role_id, :name, :username, :password, :is_active, :address, :tel, :branch_name, :barcode, :create_by, :create_at);
//     `;

//     let data = await db.query(sql, {
//       role_id,
//       name,
//       username,
//       password,
//       address,
//       tel,
//       branch_name,
//       barcode, // Use the generated barcode
//       status,
//       create_by: req.auth?.name,
//       create_at: req.auth?.create_at,
//     });

//     res.json({
//       message: "Create new account success!",
//       data: data,
//     });
//   } catch (error) {
//     logError("auth.register", error, res);
//   }
// };

// exports.register = async (req, res) => {
//   try {
//     let password = bcrypt.hashSync(req.body.password, 10);

//     const { role_id, name, username, address, tel, branch_name, barcode, status } = req.body;

//     // Insert into the user table
//     let userSql = `
//       INSERT INTO user (role_id, name, username, password, is_active, address, tel, branch_name, barcode, create_by, create_at)
//       VALUES (:role_id, :name, :username, :password, :is_active, :address, :tel, :branch_name, :barcode, :create_by, :create_at);
//     `;

//     let userData = await db.query(userSql, {
//       role_id,
//       name,
//       username,
//       password,
//       is_active: status, // Assuming status corresponds to is_active
//       address,
//       tel,
//       branch_name,
//       barcode,
//       create_by: req.auth?.name,
//       create_at: new Date(), // Using current date if create_at is not provided
//     });

//     // Get the newly created user's ID
//     const userId = userData.insertId;

//     // Insert into user_roles table
//     let rolesSql = `
//       INSERT INTO user_roles (user_id, role_id) 
//       VALUES (:user_id, :role_id);
//     `;

//     await db.query(rolesSql, {
//       user_id: userId,
//       role_id
//     });

//     res.json({
//       message: "Create new account success!",
//       data: userData,
//     });
//   } catch (error) {
//     logError("auth.register", error, res);
//   }
// };

exports.register = async (req, res) => {
  try {
    let password = bcrypt.hashSync(req.body.password, 10);

    const { role_id, name, username, address, tel, branch_name, barcode, status } = req.body;

    // Insert into the user table
    let userSql = `
      INSERT INTO user (role_id, name, username, password, is_active, address, tel, branch_name, barcode, create_by, create_at)
      VALUES (:role_id, :name, :username, :password, :is_active, :address, :tel, :branch_name, :barcode, :create_by, :create_at);
    `;

    let userData = await db.query(userSql, {
      role_id,
      name,
      username,
      password,
      is_active: status, // Assuming status corresponds to is_active
      address,
      tel,
      branch_name,
      barcode,
      create_by: req.auth?.name,
      create_at: new Date(), // Using current date if create_at is not provided
    });

    // Get the newly created user's ID - add debugging to see the structure
    // console.log("Database response:", JSON.stringify(userData));
    
    // Try different ways to get the ID based on common database return formats
    let userId;
    if (userData.insertId) {
      userId = userData.insertId;
    } else if (userData.rows && userData.rows.insertId) {
      userId = userData.rows.insertId;
    } else if (userData[0] && userData[0].insertId) {
      userId = userData[0].insertId;
    } else if (userData.lastInsertId) {
      userId = userData.lastInsertId;
    } else {
      // If we can't find the ID, query for it
      const findUserSql = `SELECT id FROM user WHERE username = :username LIMIT 1`;
      const userResult = await db.query(findUserSql, { username });
      userId = userResult[0]?.id;
      
      if (!userId) {
        throw new Error("Failed to retrieve the newly created user ID");
      }
    }
    
    console.log("Using user ID:", userId);

    // Insert into user_roles table
    let rolesSql = `
      INSERT INTO user_roles (user_id, role_id) 
      VALUES (:user_id, :role_id);
    `;

    await db.query(rolesSql, {
      user_id: userId,
      role_id
    });

    res.json({
      message: "Create new account success!",
      data: userData,
    });
  } catch (error) {
    // console.error("Registration error:", error);
    logError("auth.register", error, res);
  }
};

exports.newBarcode = async (req, res) => {
  try {
    var sql = `
      SELECT CONCAT('U', LPAD(COALESCE(MAX(id), 0) + 1, 3, '0')) AS barcode 
      FROM user
    `;
    var [data] = await db.query(sql);

    // If no users exist, default to "U001"
    let barcode = data[0]?.barcode || "U001";

    res.json({ barcode });
  } catch (error) {
    logError("barcode.create", error, res);
  }
};


isExistBarcode = async (barcode) => {
  try {
    var sql = "SELECT COUNT(id) as Total FROM user WHERE barcode=:barcode";
    var [data] = await db.query(sql, {
      barcode: barcode,
    });
    if (data.length > 0 && data[0].Total > 0) {
      return true; // ស្ទួន
    }
    return false; // អត់ស្ទួនទេ
  } catch (error) {
    logError("barcode.create", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM user WHERE id = :id", {
      id: req.body.id,
    });
    res.json({
      data: data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("user.remove", error, res);
  }
}
// a,b (123456)
// a : p1 => true
// b : p1 => true
exports.login = async (req, res) => {
  try {
    let { password, username } = req.body;
    // let sql = "SELECT * FROM user WHERE username=:username ";
    let sql =
      "SELECT " +
      " u.*," +
      " r.name as role_name" +
      " FROM user u " +
      " INNER JOIN role r ON u.role_id = r.id " +
      " WHERE u.username=:username ";

    let [data] = await db.query(sql, {
      username: username,
    });
    if (data.length == 0) {
      res.json({
        error: {
          username: "Username doesn't exist!",
        },
      });
    } else {
      let dbPass = data[0].password;
      let isCorrectPass = bcrypt.compareSync(password, dbPass); // true | false
      if (!isCorrectPass) {
        res.json({
          error: {
            password: "Password incorrect!",
          },
        });
      } else {
        delete data[0].password;
        let obj = {
          profile: data[0],
          permission: await getPermissionByUser(data[0].id),
        };
        res.json({
          message: "Login success",
          ...obj,
          access_token: await getAccessToken(obj),
        });
      }
    }
  } catch (error) {
    logError("auth.login", error, res);
  }
};

exports.profile = async (req, res) => {
  try {
    res.json({
      profile: req.profile,
    });
  } catch (error) {
    logError("auth.register", error, res);
  }
};

exports.validate_token = (permission_name) => {
  // call in midleware in route (role route, user route, teacher route)
  return (req, res, next) => {
    var authorization = req.headers.authorization; // token from client
    var token_from_client = null;
    if (authorization != null && authorization != "") {
      token_from_client = authorization.split(" "); // authorization : "Bearer lkjsljrl;kjsiejr;lqjl;ksjdfakljs;ljl;r"
      token_from_client = token_from_client[1]; // get only access_token
    }
    if (token_from_client == null) {
      res.status(401).send({
        message: "Unauthorized",
      });
    } else {
      jwt.verify(
        token_from_client,
        config.config.token.access_token_key,
        (error, result) => {
          if (error) {
            res.status(401).send({
              message: "Unauthorized",
              error: error,
            });
          } else {

            if (permission_name){
              let findIdex = result.data.permision?.findIdex(
                (item) => item.name == permission_name
              );
              if (findIdex == -1 ){
                res.status(401).send({
                  message:"Unauthorized",
                  error:error 
                });
                return;
              }
            }
            req.current_id = result.data.profile.id;
            req.auth = result.data.profile; // write user property
            req.permision = result.data.permision; // write user property
            next(); // continue controller
          }
        }
      );
    }
  };
};
// exports.validate_token = (permission_name) => {
//   return (req, res, next) => {
//     var authorization = req.headers.authorization;
//     var token_from_client = null;
//     if (authorization && authorization !== "") {
//       token_from_client = authorization.split(" ")[1];
//     }
    
//     if (!token_from_client) {
//       return res.status(401).send({ message: "Unauthorized" });
//     }

//     jwt.verify(token_from_client, config.config.token.access_token_key, (error, result) => {
//       if (error) {
//         return res.status(401).send({ message: "Unauthorized", error: error });
//       }

//       if (permission_name) {
//         let findIndex = result.data.permision?.findIndex(item => item.name === permission_name);
//         if (findIndex === -1) {
//           return res.status(401).send({ message: "Unauthorized" });
//         }
//       }

//       req.current_id = result.data.profile.id;
//       req.auth = result.data.profile;
//       req.permission = result.data.permision;

//       // Determine if the user is an admin
//       req.isAdmin = result.data.profile.role === 'admin';

//       next();
//     });
//   };
// };


const getPermissionByUser = async (user_id) => {
  let sql =
    "   SELECT  " +
    " DISTINCT " +
    " p.id, " +
    " p.name, " +
    " p.group, " +
    " p.is_menu_web, " +
    " p.web_route_key " +
    " FROM permissions  p " +
    " INNER JOIN permission_roles pr ON p.id = pr.permission_id " +
    " INNER JOIN `role` r ON pr.role_id = r.id " +
    " INNER JOIN user_roles ur ON r.id = ur.role_id " +
    " WHERE ur.user_id = :user_id; "
  // "   SELECT DISTINCT "+
  // "   p.id, "+
  // "   p.name, "+
  // "   p.group, "+
  // "   p.is_menu_web, "+
  // "   p.web_route_key "+
  // " FROM permissions p "+
  // " INNER JOIN permission_roles pr ON p.id = pr.permission_id "+
  // " WHERE pr.role_id = :role_id; "

  const [permission] = await db.query(sql, { user_id })
  return permission;


}

const getAccessToken = async (paramData) => {
  const acess_token = await jwt.sign(
    { data: paramData },
    config.config.token.access_token_key
    // {
    //   expiresIn: "1d",
    // }
  );
  return acess_token;
};

// getpermission menu
// getpermission role

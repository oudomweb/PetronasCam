const { logError, db, removeFile } = require("../util/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../util/config");
const { json } = require("express");

// exports.getList = async (req, res) => {
//   try {
//     let sql = `
//   SELECT  
//     u.id, 
//     u.name, 
//     u.barcode, 
//     u.username, 
//     u.branch_name, 
//     u.create_by, 
//     u.create_at, 
//     u.address, 
//     u.tel, 
//     u.is_active, 
//     r.name AS role_name 
//   FROM user u 
//   INNER JOIN role r ON u.role_id = r.id 
//   ORDER BY u.create_at DESC
// `;


//     const [list] = await db.query(sql);
//     const [role] = await db.query(
//       "SELECT id AS value, name AS label FROM role"
//     );

//     res.json({
//       list,
//       role,
//     });
//   } catch (error) {
//     logError("auth.getList", error, res);
//   }
// };
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
        u.profile_image, 
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

// Add this to your auth.controller.js
// exports.getUserProfile = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Fetch user profile data from the database
//     const sql = `
//       SELECT 
//         u.id, 
//         u.name, 
//         u.username, 
//         u.profile_image, 
//         u.address, 
//         u.tel, 
//         u.branch_name, 
//         u.is_active, 
//         r.name AS role_name 
//       FROM user u 
//       INNER JOIN role r ON u.role_id = r.id 
//       WHERE u.id = ?
//     `;

//     const [user] = await db.query(sql, [userId]);

//     if (user.length > 0) {
//       res.json({ profile: user[0] });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     logError("auth.getUserProfile", error, res);
//   }
// };


// exports.updateUserProfile = async (req, res) => {

// const { userId } = req.params;
// const { name, username, email, password } = req.body;
// const profileImage = req.file?.filename;

// try {
//   const sql = `
//     UPDATE user SET
//       name = ?,
//       username = ?,
//       email = ?,
//       password = ?,
//       profile_image = ?
//     WHERE id = ?
//   `;
//   const [data] = await db.query(sql, [name, username, email, password, profileImage, userId]);

//   res.json({ message: "Profile updated successfully", data });
// } catch (error) {
//   logError("auth.getUserProfile", error, res);
// }
// };


exports.updateuserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const { name, username, password } = req.body;
    const profileImage = req.file?.filename;

    let sql = "UPDATE user SET name = ?, username = ?";
    let params = [name, username];

    if (password && password.trim() !== '') {
      const hashedPassword = bcrypt.hashSync(password, 10);
      sql += ", password = ?";
      params.push(hashedPassword);
    }

    if (profileImage) {
      sql += ", profile_image = ?";
      params.push(profileImage);
    }

    sql += " WHERE id = ?";
    params.push(userId);

    const [result] = await db.query(sql, params);

    if (result.affectedRows > 0) {
      const [updatedUser] = await db.query(
        "SELECT id, name, username, profile_image FROM user WHERE id = ?", 
        [userId]
      );

      res.json({ 
        success: true,
        message: "Profile updated successfully", 
        profile: updatedUser[0] 
      });
    } else {
      res.status(404).json({ success: false, message: "User not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

exports.getuserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const sql = `
      SELECT 
        u.id, 
        u.name, 
        u.username, 
        u.profile_image, 
        u.address, 
        u.tel, 
        u.branch_name, 
        u.is_active, 
        r.name AS role_name 
      FROM user u 
      INNER JOIN role r ON u.role_id = r.id 
      WHERE u.id = ?
    `;

    const [user] = await db.query(sql, [userId]);

    if (user.length > 0) {
      res.json({ profile: user[0] });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
      logError("auth.getUserProfile", error, res);
    }
};

// exports.update = async (req, res) => {
//   try {
//     // Check if a password is provided for update
//     let password = req.body.password;
    
//     // Only hash the password if it's being updated (if password exists)
//     if (password) {
//       password = bcrypt.hashSync(password, 10); // Hash the password
//     }

//     // Create the SQL query based on the presence of the password
//     let sql = "UPDATE user SET name = :name, username = :username, role_id = :role_id, ";
//     sql += password ? "password = :password, " : "";  // Only add password field if password exists
//     sql += "tel = :tel, branch_name = :branch_name, "; // Added comma after branch_name
//     sql += "is_active = :is_active, address = :address, create_by = :create_by, create_at = :create_at ";
//     sql += "WHERE id = :id";
    
//     // Prepare the query parameters
//     const queryParams = { 
//       ...req.body, 
//       password: password || req.body.password, // If no new password, retain the original password
//       create_by: req.auth?.name,
//       create_at: new Date() // Use current timestamp or req.auth?.create_at
//     };
    
//     // Execute the query
//     const [data] = await db.query(sql, queryParams);
    
//     // Send response back
//     res.json({
//       data: data,
//       message: "Update success!",
//       create_by: req.auth?.name,
//     });
//   } catch (error) {
//     logError("user.update", error, res);
//   }
// };

exports.update = async (req, res) => {
  try {
    // Check if a password is provided for update
    let password = req.body.password;

    // Only hash the password if it's being updated (if password exists)
    if (password) {
      password = bcrypt.hashSync(password, 10); // Hash the password
    }

    // Handle profile image upload or removal
    let profileImage = req.body.profile_image;

    if (req.file) {
      profileImage = req.file.filename; // New image uploaded
    }

    if (req.body.profile_image_remove === "1") {
      removeFile(req.body.profile_image); // Remove the old image file
      profileImage = null; // Set profile_image to NULL in the database
    }

    // Create the SQL query
    let sql = `
      UPDATE user SET
        name = :name,
        username = :username,
        role_id = :role_id,
        ${password ? "password = :password," : ""}
        tel = :tel,
        branch_name = :branch_name,
        is_active = :is_active,
        address = :address,
        profile_image = :profile_image,
        create_by = :create_by,
        create_at = :create_at
      WHERE id = :id
    `;

    // Prepare the query parameters
    const queryParams = {
      ...req.body,
      password: password || req.body.password, // If no new password, retain the original password
      profile_image: profileImage, // Set the new profile image filename
      create_by: req.auth?.name,
      create_at: new Date(), // Use current timestamp
    };

    // Execute the query
    const [data] = await db.query(sql, queryParams);

    res.json({
      data: data,
      message: "Update success!",
    });
  } catch (error) {
    logError("user.update", error, res);
  }
};


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

    
//     let userId;
//     if (userData.insertId) {
//       userId = userData.insertId;
//     } else if (userData.rows && userData.rows.insertId) {
//       userId = userData.rows.insertId;
//     } else if (userData[0] && userData[0].insertId) {
//       userId = userData[0].insertId;
//     } else if (userData.lastInsertId) {
//       userId = userData.lastInsertId;
//     } else {
//       // If we can't find the ID, query for it
//       const findUserSql = `SELECT id FROM user WHERE username = :username LIMIT 1`;
//       const userResult = await db.query(findUserSql, { username });
//       userId = userResult[0]?.id;
      
//       if (!userId) {
//         throw new Error("Failed to retrieve the newly created user ID");
//       }
//     }
    
//     console.log("Using user ID:", userId);

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
//     // console.error("Registration error:", error);
//     logError("auth.register", error, res);
//   }
// };

exports.register = async (req, res) => {
  try {
    let password = bcrypt.hashSync(req.body.password, 10);

    const { role_id, name, username, address, tel, branch_name, barcode, status } = req.body;

    // Insert into the user table
    let userSql = `
      INSERT INTO user (
        role_id, name, username, password, is_active, address, tel, branch_name, barcode, profile_image, create_by, create_at
      ) VALUES (
        :role_id, :name, :username, :password, :is_active, :address, :tel, :branch_name, :barcode, :profile_image, :create_by, :create_at
      );
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
      profile_image: req.file?.filename, // Save the uploaded profile image filename
      create_by: req.auth?.name,
      create_at: new Date(), // Using current date if create_at is not provided
    });

    // Get the newly created user's ID
    let userId = userData.insertId || userData[0]?.insertId;

    if (!userId) {
      // If we can't find the ID, query for it
      const findUserSql = `SELECT id FROM user WHERE username = :username LIMIT 1`;
      const userResult = await db.query(findUserSql, { username });
      userId = userResult[0]?.id;

      if (!userId) {
        throw new Error("Failed to retrieve the newly created user ID");
      }
    }

    // Insert into user_roles table
    let rolesSql = `
      INSERT INTO user_roles (user_id, role_id) 
      VALUES (:user_id, :role_id);
    `;

    await db.query(rolesSql, {
      user_id: userId,
      role_id,
    });

    res.json({
      message: "Create new account success!",
      body:req.body,
      data: userData,
      file:req.file
    });
  } catch (error) {
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

// exports.remove = async (req, res) => {
//   try {
//     var [data] = await db.query("DELETE FROM user WHERE id = :id", {
//       id: req.body.id,
//     });
//     res.json({
//       data: data,
//       message: "Data delete success!",
//     });
//   } catch (error) {
//     logError("user.remove", error, res);
//   }
// }
exports.remove = async (req, res) => {
  try {
    // Get the user's profile image before deleting
    const [user] = await db.query("SELECT profile_image FROM user WHERE id = :id", {
      id: req.body.id,
    });

    // Delete the user
    const [data] = await db.query("DELETE FROM user WHERE id = :id", {
      id: req.body.id,
    });

    // Remove the profile image file if it exists
    if (user[0]?.profile_image) {
      removeFile(user[0].profile_image);
    }

    res.json({
      data: data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("user.remove", error, res);
  }
};
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





exports.updateUserProfile = async (req, res) => {
  try {
    const { username, password, address, tel } = req.body;
    const userId = req.user.id; // Assuming user ID is available in the request

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
    }

    // Update the user's profile in the database
    const sql = `
      UPDATE user SET
        username = :username,
        ${password ? "password = :password," : ""}
        address = :address,
        tel = :tel
      WHERE id = :userId
    `;

    await db.query(sql, {
      username,
      password: hashedPassword,
      address,
      tel,
      userId,
    });

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};




exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request

    // Fetch the user's profile from the database
    const sql = `
      SELECT id, username, address, tel, profile_image 
      FROM user 
      WHERE id = :userId
    `;
    const [user] = await db.query(sql, { userId });

    if (!user[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ profile: user[0] });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Failed to retrieve profile" });
  }
};
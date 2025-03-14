const {
  getList,
  register,
  login,
  profile,
  validate_token,
  remove,
  update,
  newBarcode,
} = require("../controller/auth.controller");

module.exports = (app) => {
  app.get("/api/auth/get-list", validate_token("user.getlist"), getList);
  app.post("/api/auth/register", validate_token("user.create"), register);
  app.delete("/api/user", validate_token("user.remove"), remove);
  app.put("/api/auth/register", validate_token("user.update"), update);
  app.post("/api/auth/login", login);
  app.post("/api/auth/profile", validate_token(), profile);
  app.post("/api/auth/new_barcode", validate_token(), newBarcode);

};

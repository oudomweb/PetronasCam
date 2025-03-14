const { validate_token } = require("../controller/auth.controller");
const {
  getStockByUser,
  gettotal_due,
  newBarcode,
  create,
  remove, 
 
} = require("../controller/stockUser.controller");
module.exports = (app) => {
  app.post("/api/stock", validate_token(), create);
  app.delete("/api/stock/:id", validate_token(), remove);
  app.get("/api/stock/:user_id", validate_token(), getStockByUser);
  app.get("/api/gettotal_due", validate_token(), gettotal_due);
    app.post("/api/new_barcode", validate_token(), newBarcode);
    

};
   
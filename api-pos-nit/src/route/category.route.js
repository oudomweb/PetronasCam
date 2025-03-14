const { validate_token } = require("../controller/auth.controller");
const {
  getList,
  create,
  update,
  remove,
} = require("../controller/category.controller");
module.exports = (app) => {
  app.get("/api/category", validate_token("category.getlist"), getList);
  app.post("/api/category", validate_token("category.create"), create);
  app.put("/api/category",validate_token("category.update"), update);
  app.delete("/api/category",validate_token("category.remove"), remove);
};

const router = require("express").Router();
const controller = require("./storefront.controller");
const auth = require("../../../shared/middlewares/auth.middleware");
const role = require("../../../shared/middlewares/role.middleware");

router.get("/",auth,role("designer"),controller.getMyStorefront);

module.exports = router;
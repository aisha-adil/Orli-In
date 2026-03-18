const router = require("express").Router();
const controller = require("./analytics.controller");
const auth = require("../../../shared/middlewares/auth.middleware");
const role = require("../../../shared/middlewares/role.middleware");

router.get("/",auth,role("designer"),controller.getAnalytics);

module.exports = router;
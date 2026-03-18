const router = require("express").Router();
const controller = require("./product.controller");
const auth = require("../../../shared/middlewares/auth.middleware");
const role = require("../../../shared/middlewares/role.middleware");

router.use(auth);
router.use(role("designer"));

router.post("/", controller.createProduct);
router.get("/", controller.getMyProducts);
router.put("/:id", controller.updateProduct);
router.delete("/:id", controller.deleteProduct);
router.patch("/:id/publish", controller.publishProduct);
router.patch("/:id/unpublish", controller.unpublishProduct);

module.exports = router;

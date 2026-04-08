const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Routes
router.post("/", authMiddleware.authuserMiddleware, orderController.createOrder);
router.get("/history", authMiddleware.authuserMiddleware, orderController.getUserOrders);

module.exports = router;

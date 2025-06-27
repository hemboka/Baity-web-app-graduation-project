// modules/order/order.routes.js
import express from "express";
import {
  updateOrderStatus,
  getCustomerOrders,
  getChefOrders,
  orderMeal,
  getOrder,
  getAllOrders,
  updatePaymentStatus,
  deleteOrderByCustomer,
} from "./order.controller.js";
import { verifyChefToken, verifyCustomer } from "../../middleware/verfyToken.middleware.js";

const router = express.Router();

router.post("/:mealId", verifyCustomer, orderMeal);
router.put("/status/:orderId", verifyChefToken, updateOrderStatus);
router.get("/customer/", verifyCustomer, getCustomerOrders);
router.get("/chef/", verifyChefToken, getChefOrders);
router.get("/:orderId", getOrder);
router.get("/", getAllOrders);
router.put("/payment/:orderId", verifyCustomer, updatePaymentStatus);
router.delete("/customer/:orderId", verifyCustomer, deleteOrderByCustomer);

export default router;

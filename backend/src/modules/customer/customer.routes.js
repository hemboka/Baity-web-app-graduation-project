// modules/customer/customer.routes.js
import express from "express";
import {
  getCustomerData,
  updateCustomerData,
  toggleFavoriteMeal,
} from "./customer.controller.js";
import { verifyCustomer } from "../../middleware/verfyToken.middleware.js";

const router = express.Router();

// كل الراوتس دي محتاجة تسجيل دخول
router.get("/profile", verifyCustomer, getCustomerData);
router.put("/profile", verifyCustomer, updateCustomerData);
router.put("/favorite/:mealId", verifyCustomer, toggleFavoriteMeal);

export default router;

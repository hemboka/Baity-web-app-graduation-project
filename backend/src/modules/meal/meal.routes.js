// routes/meal.routes.js
import express from "express";
import {
  addMeal,
  updateMeal,
  deleteMeal,
  getAllMeals,
  getMealById,
  getChefMeals,
  rateMeal,
} from "./meal.controller.js";
import { verifyCustomer } from "../../middleware/verfyToken.middleware.js";

const mealRouter = express.Router();

// لازم تسجيل دخول في الحاجات دي:
mealRouter.post("/add", verifyCustomer, addMeal);
mealRouter.put("/:id", verifyCustomer, updateMeal);
mealRouter.delete("/:mealId", verifyCustomer, deleteMeal);
mealRouter.post("/rate/:mealId", verifyCustomer, rateMeal);

// ممكن أي حد يشوفهم:
mealRouter.get("/", getAllMeals);
mealRouter.get("/:mealId", getMealById);
mealRouter.get("/chef/:chefId", getChefMeals);

export default mealRouter;

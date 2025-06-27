// modules/search/search.controller.js
import { MealModel } from "../../../database/models/meal.model.js";
import { UserModel } from "../../../database/models/user.model.js";

export const searchMealOrChef = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const mealRegex = new RegExp(keyword, "i"); // case-insensitive
    const chefRegex = new RegExp(keyword, "i");

    // Meals: search by name or description
    const meals = await MealModel.find({
      $or: [
        { name: mealRegex },
        { description: mealRegex }
      ]
    }).populate("chef", "name email");

    // تقسيم النتائج
    const mainMeals = meals.filter(meal => meal.category === "وجبات رئيسية");
    const desserts = meals.filter(meal => meal.category === "حلويات");


    // Chefs: search by name, email or governorate, and role must be 'chef'
    const chefs = await UserModel.find({
      role: "chef",
      $or: [
        { name: chefRegex },
        { governorate: chefRegex },
      ],
    }).select("name email governorate profilePic");

    return res.status(200).json({
      mainMeals,
      desserts,
      chefs,
    });

  } catch (err) {
    return res.status(500).json({ message: "Search failed", error: err.message });
  }
};

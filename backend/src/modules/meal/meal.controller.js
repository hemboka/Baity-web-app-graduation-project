// controllers/meal.controller.js
import mongoose from "mongoose";
import { MealModel } from "../../../database/models/meal.model.js";

export const addMeal = async (req, res) => {
  try {
    const { name, cookTime, description, price, category } = req.body;
    const chef = req.user.userId; // بعد التوكن
    
    const newMeal = await MealModel.create({
      name,
      cookTime,
      description,
      price,
      category,
      chef,
    });

    return res.status(201).json({ message: "success", meal: newMeal });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Update Meal
export const updateMeal = async (req, res) => {
  try {
    const { mealId } = req.params;
    const updateData = req.body;

    const updated = await MealModel.findOneAndUpdate(
      { _id: mealId, chef: req.user.userId }, // بس الشيف يقدر يعدل
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Meal not found or unauthorized" });
    }

    return res.status(200).json({ message: "success", meal: updated });
  } catch (err) {
    return res.status(500).json({ message: "Error updating meal", error: err.message });
  }
};

// Delete Meal
export const deleteMeal = async (req, res) => {
  try {
    const { mealId } = req.params;

    const deleted = await MealModel.findOneAndDelete({
      _id: mealId,
      chef: req.user.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Meal not found or unauthorized" });
    }

    return res.status(200).json({ message: "success" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting meal", error: err.message });
  }
};

// Get All Meals
export const getAllMeals = async (req, res) => {
  try {
    const foodMealsRaw = await MealModel.find({ category: "وجبة رئيسية" }).populate("chef", "name email");
    const dessertMealsRaw = await MealModel.find({ category: "حلويات" }).populate("chef", "name email");

    const calcAverage = (ratings) => {
      if (!ratings || ratings.length === 0) return null;
      const sum = ratings.reduce((acc, r) => acc + r.value, 0);
      return +(sum / ratings.length).toFixed(1);
    };

    const foodMeals = foodMealsRaw.map(meal => ({
      ...meal._doc,
      averageRating: calcAverage(meal.ratings),
    }));

    const dessertMeals = dessertMealsRaw.map(meal => ({
      ...meal._doc,
      averageRating: calcAverage(meal.ratings),
    }));

    return res.status(200).json({
      foodMeals,
      dessertMeals,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error getting meals", error: err.message });
  }
};

// Get Meal By ID
export const getMealById = async (req, res) => {
  try {
    const meal = await MealModel.findById(req.params.mealId).populate("chef", "name");

    if (!meal) return res.status(404).json({ message: "الوجبة غير موجودة" });

    const token = req.headers.authorization?.split(" ")[1];
    let currentUserId = null;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      currentUserId = decoded.userId;
    }

    const userRating = meal.ratings.find(r => r.user.toString() === currentUserId)?.value || null;

    const avg =
      meal.ratings.length === 0
        ? null
        : meal.ratings.reduce((sum, r) => sum + r.value, 0) / meal.ratings.length;

    res.json({
      meal: {
        ...meal._doc,
        averageRating: avg?.toFixed(1) || null,
        userRating: userRating,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء تحميل تفاصيل الوجبة" });
  }
};

// Get Chef's Meals
export const getChefMeals = async (req, res) => {
  try {
    const { chefId } = req.params;
    const meals = await MealModel.find({ chef: new mongoose.Types.ObjectId(chefId) });
    // const meals = await MealModel.find({ chef: chefId });
    return res.status(200).json({ meals });
  } catch (err) {
    return res.status(500).json({ message: "Error getting chef meals", error: err.message });
  }
};

export const rateMeal = async (req, res) => {
  try {
    const mealId = req.params.mealId;
    const userId = req.user.userId;
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "قيمة التقييم يجب أن تكون بين 1 و 5" });
    }

    const meal = await MealModel.findById(mealId);
    if (!meal) return res.status(404).json({ message: "الوجبة غير موجودة" });

    // شوف لو اليوزر قيّم قبل كده
    const existingRating = meal.ratings.find(r => r.user.toString() === userId);

    if (existingRating) {
      existingRating.value = rating; // عدل التقييم القديم
    } else {
      meal.ratings.push({ user: userId, rating }); // أضف تقييم جديد
    }

    await meal.save();

    res.json({ message: "تم تسجيل تقييمك بنجاح", ratings: meal.ratings });
  } catch (err) {
    console.error("خطأ في تقييم الوجبة:", err);
    res.status(500).json({ message: "حدث خطأ أثناء تقييم الوجبة" });
  }
};

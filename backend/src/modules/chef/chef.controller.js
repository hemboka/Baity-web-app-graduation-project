// modules/chef/chef.controller.js
import { MealModel } from "../../../database/models/meal.model.js";
import { UserModel } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";

export const getAllChefs = async (req, res) => {
  try {
    const chefs = await UserModel.find({ role: "chef" }).select("-password -savedChefs -savedMeals");

    // نجيب الوجبات كلها مرة واحدة عشان الأداء
    const meals = await MealModel.find({}).select("chef ratings");

    const calcAverage = (ratings) => {
      if (!ratings || ratings.length === 0) return null;
      const sum = ratings.reduce((acc, r) => acc + r.value, 0);
      return +(sum / ratings.length).toFixed(1);
    };

    const chefsWithRating = chefs.map(chef => {
      const chefMeals = meals.filter(meal => meal.chef?.toString() === chef._id.toString());

      const allRatings = chefMeals.flatMap(meal => meal.ratings || []);
      const averageRating = calcAverage(allRatings);

      return {
        ...chef._doc,
        averageRating,
      };
    });

    return res.status(200).json({ chefs: chefsWithRating });
  } catch (err) {
    return res.status(500).json({ message: "Error getting chefs", error: err.message });
  }
};

// GET /api/users/chef/:id
export const getChefProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const chef = await UserModel.findById(id);

    if (!chef || chef.role !== "chef") {
      return res.status(404).json({ message: "الشيف غير موجود" });
    }

    return res.status(200).json({ chef });
  } catch (err) {
    return res.status(500).json({ message: "خطأ في جلب بيانات الشيف", error: err.message });
  }
};

// PUT /api/users/chef/:id
export const updateChefProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const chef = await UserModel.findById(id);

    if (!chef || chef.role !== "chef") {
      return res.status(404).json({ message: "الشيف غير موجود" });
    }

    // تعديل البيانات المتاحة فقط
    const allowedUpdates = ['name', 'address', 'email', 'phoneNumber', 'password'];
    allowedUpdates.forEach(async key => {
      if (key === 'password') {
        var password = req.body[key];
        const hashedPassword = await bcrypt.hash(password, 8);
        chef[key] = hashedPassword;
      }
      else if (req.body[key]) chef[key] = req.body[key];
    });

    await chef.save();

    return res.status(200).json({ message: "تم تحديث البيانات بنجاح", chef });
  } catch (err) {
    return res.status(500).json({ message: "خطأ في التحديث", error: err.message });
  }
};

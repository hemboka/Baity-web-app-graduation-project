// modules/customer/customer.controller.js
import { UserModel } from "../../../database/models/user.model.js";

// 1) Get customer data
export const getCustomerData = async (req, res) => {
  try {
    const customer = await UserModel.findById(req.user.userId).select("-password").populate("favoriteMeals");
    if (!customer || customer.role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({ customer });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching customer", error: err.message });
  }
};

// 2) Update customer data
export const updateCustomerData = async (req, res) => {
  try {
    const updates = req.body;

    const customer = await UserModel.findOneAndUpdate(
      { _id: req.user.userId, role: "customer" },
      updates,
      { new: true }
    ).select("-password");

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer updated", customer });
  } catch (err) {
    return res.status(500).json({ message: "Error updating customer", error: err.message });
  }
};


export const toggleFavoriteMeal = async (req, res) => {
  const customerId = req.user.userId;
  const mealId = req.params.mealId;

  try {
    const customer = await UserModel.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const index = customer.favoriteMeals.indexOf(mealId);

    if (index === -1) {
      customer.favoriteMeals.push(mealId);
    } else {
      customer.favoriteMeals.splice(index, 1);
    }

    await customer.save();

    return res.json({
      message: index === -1 ? "Meal saved to favorites" : "Meal removed from favorites",
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal error", error: err.message });
  }
};
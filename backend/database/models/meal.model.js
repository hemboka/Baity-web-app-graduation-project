import mongoose from "mongoose";

const { Schema, model } = mongoose;

const mealSchema = new Schema({
  category: {
    type: String,
    enum: ['وجبة رئيسية', 'حلويات'],
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  cookTime: {
    type: Number, // بالدقايق مثلاً
    required: true,
    min: 1
  },

  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      value: Number,
    },
  ],

  description: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 1
  },

}, { timestamps: true });

export const MealModel = model('Meal', mealSchema);

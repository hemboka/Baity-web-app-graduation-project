import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  role: {
    type: String,
    enum: ['chef', 'customer'],
    required: true
  },

  // بيانات مشتركة
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  governorate: {
    type: String,
  },
  address: {
    type: String,
  },

  // خاص بـ customer
  favoriteChefs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming chefs are also users
  }],
  favoriteMeals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  }],

  // خاص بـ chef
  nationalID: {
    type: String,
  },

  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      value: Number,
    },
  ],
}, { timestamps: true });

export const UserModel = model('User', userSchema);

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  price: {
    type: Number,
    required: true
  },

  deliveryServicePrice: {
    type: Number,
    required: true
  },

  totalPrice: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['تحت المعالجة', 'مقبول', 'مرفوض'],
    default: 'تحت المعالجة'
  },

  estimatedTime: {
    type: Number,
    required: true
  },

  temperature: {
    type: String,
    enum: ['حار', 'بارد'],
    required: true
  },

  location: {
    type: String,
    required: true
  },

  governorate: {
    type: String,
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ['تحت المعالجة', 'تم الدفع', 'تم الإلغاء'],
    default: 'تحت المعالجة'
  }

}, { timestamps: true });

export const OrderModel = model('Order', orderSchema);

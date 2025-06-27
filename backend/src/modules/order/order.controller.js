// modules/order/order.controller.js
import { OrderModel } from "../../../database/models/order.model.js";
import { MealModel } from "../../../database/models/meal.model.js";

// 1) Add Order (نفسه اللي عملناه قبل كده)
export const orderMeal = async (req, res) => {
  try {
    const customer = req.user.userId;
    const mealId = req.params.mealId;
    const { quantity, location, temperature, deliveryServicePrice, governorate } = req.body;

    const deliveryTimes = {
      'cairo': 60,
      'giza': 50,
      'alexandria': 45,
      'dakahlia': 35,
      'red sea': 30,
      'beheira': 35,
      'fayoum': 30,
      'gharbia': 30,
      'ismailia': 25,
      'menofia': 25,
      'minya': 30,
      'qalyubia': 30,
      'new valley': 25,
      'suez': 25,
      'aswan': 30,
      'assiut': 30,
      'beni suef': 30,
      'port said': 20,
      'damietta': 25,
      'sharqia': 35,
      'south sinai': 30,
      'kafr el-sheikh': 30,
      'matrouh': 35,
      'luxor': 30,
      'qena': 30,
      'north sinai': 30,
      'sohag': 30
    };

    const meal = await MealModel.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    const estimatedTime = 
      parseInt(quantity) * parseInt(meal.cookTime) + deliveryTimes[governorate.toLowerCase()];
    const price = meal.price * quantity;
    const totalPrice = price + deliveryServicePrice;

    const order = await OrderModel.create({
      customer,
      chef: meal.chef._id,
      meal: meal._id,
      quantity,
      location,
      temperature,
      deliveryServicePrice,
      price,
      totalPrice,
      estimatedTime,
      governorate,
    });

    return res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    return res.status(500).json({ message: "Error ordering meal", error: err.message });
  }
};

// 2) Update order status (chef or admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // accepted | declined | preparing | delivered ...
    
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== 'تحت المعالجة' || order.chef.toString() !== req.user.userId) {
      return res.status(409).json({ message: "Order cannot be updated in its current state." });
    }



    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    return res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

// 3) Get orders for a specific customer
export const getCustomerOrders = async (req, res) => {
  try {
    const orders = await OrderModel
      .find({ customer: req.user.userId })
      .populate("meal chef", "name email");

    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

// 4) Get orders for a specific chef
export const getChefOrders = async (req, res) => {
  try {
    const orders = await OrderModel
      .find({ chef: req.user.userId })
      .populate("meal customer", "name email");
    
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};


export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order fetched successfully", order });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching order", error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orders = await OrderModel.find();

    if (!orders) {
      return res.status(404).json({ message: "There is no orders" });
    }

    return res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

// controllers/orderController.js
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body; // 'تم الدفع' أو 'تم الإلغاء'

    // تحقق من القيم المسموحة
    const validStatuses = ['تم الدفع', 'تم الإلغاء'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "حالة دفع غير صالحة" });
    }

    // هات الأوردر وتأكد إنه يخص الكاستمر ده
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "الطلب غير موجود" });
    }

    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: "غير مسموح بتحديث هذا الطلب" });
    }

    // لو الأوردر مرفوض، ميصحش يدفعه
    if (order.status === "مرفوض") {
      return res.status(409).json({ message: "لا يمكن الدفع لطلب مرفوض" });
    }

    // تحديث حالة الدفع
    order.paymentStatus = paymentStatus;
    await order.save();

    return res.status(200).json({ message: "تم تحديث حالة الدفع بنجاح", order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "حدث خطأ أثناء تحديث الدفع", error: err.message });
  }
};

// controllers/orderController.js
export const deleteOrderByCustomer = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "الطلب غير موجود" });
    }

    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: "غير مسموح بحذف هذا الطلب" });
    }

    if (order.status !== "مقبول" || order.paymentStatus !== "تم الإلغاء") {
      return res.status(409).json({ message: "لا يمكن حذف الطلب إلا بعد إلغائه من العميل." });
    }

    await order.deleteOne();

    return res.status(200).json({ message: "تم حذف الطلب بنجاح" });
  } catch (err) {
    return res.status(500).json({ message: "حدث خطأ أثناء الحذف", error: err.message });
  }
};

import express from "express";
import cors from "cors";
import { dbConnection } from "./database/dbConnection.js";
import dotenv from "dotenv";
dotenv.config();

// Auth / Users
import authRoutes from "./src/modules/auth/auth.routes.js";
import chefRoutes from "./src/modules/chef/chef.routes.js";
import customerRoutes from "./src/modules/customer/customer.routes.js";

// Meals / Orders / Search
import mealRoutes from   "./src/modules/meal/meal.routes.js";
import orderRoutes from  "./src/modules/order/order.routes.js";
import searchRoutes from "./src/modules/search/search.routes.js";

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);            // signUp / signIn
app.use("/api/users/chef", chefRoutes);           // addChef, getAllChefs, AcceptOrder
app.use("/api/users/customer", customerRoutes);   // orderMeal, updateProfile, getData

app.use("/api/meals", mealRoutes);           // meals APIs
app.use("/api/orders", orderRoutes);         // order APIs
app.use("/api/search", searchRoutes);        // unified search

// DB + Start
dbConnection();
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

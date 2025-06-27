// modules/search/search.routes.js
import express from "express";
import { searchMealOrChef } from "./search.controller.js";

const router = express.Router();

router.get("/", searchMealOrChef); // /api/search?keyword=كلمة

export default router;

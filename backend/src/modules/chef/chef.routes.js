// modules/chef/chef.routes.js
import express from "express";
import {
  getAllChefs,
  getChefProfile,
  updateChefProfile,
} from "./chef.controller.js";

const chefRouter = express.Router();

// كل الشيفات
chefRouter.get("/", getAllChefs);
chefRouter.get("/:id", getChefProfile);
chefRouter.put("/:id", updateChefProfile);

export default chefRouter;

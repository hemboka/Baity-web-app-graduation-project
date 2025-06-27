import express from "express";
import { signin, signup } from "./auth.controller.js";
import { validation, signInSchema, signUpSchema } from "../../middleware/validation.middleware.js";

const authRoter = express.Router();

authRoter.post("/signup", validation(signUpSchema), signup);
authRoter.post("/signin", validation(signInSchema), signin);

export default authRoter;

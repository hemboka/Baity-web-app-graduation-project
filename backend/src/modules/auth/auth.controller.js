import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../../../database/models/user.model.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, nationalID, address } = req.body;
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      nationalID: role === "chef" ? nationalID : undefined,
      address: address? address : "",
    });

    
    return res.status(201).json({ message: "Account created successfully!", userId: newUser._id });    
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      {
        name: user.name,
        email,
        role: user.role,
        userId: user._id,
      },
      `${process.env.JWT_SECRET}`,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ message: "Welcome to Food App", token });

  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

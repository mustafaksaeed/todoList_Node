import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

console.log();
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      res.status(400).send({
        message: "user already exists ",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    const isValidEmail = (email) => emailRegex.test(email);
    const isValidPassword = (password) => password.length > 6;

    if (!isValidEmail(email)) {
      return res.status(400).send({
        message: "email format invalid",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).send({
        message: "password must be atleast 6 characters long",
      });
    }
    const newUser = await User.create({
      email: email,
      password: hashedPassword,
    });

    res.status(200).send({ message: "user created ", status: "Success" });
  } catch (error) {
    res
      .status(400)
      .send({ message: "internal server error ", status: "failure" });
  }
});

router.post("/login", async (req, res) => {
  console.log("jwtsecret", JWT_SECRET);
  try {
    const { email, password } = req.body;
    const Userfound = await User.findOne({ email: email });

    if (!Userfound) {
      res.status(401).send({ message: "user credentials invalud" });
    }
    const comparedPassword = await bcrypt.compare(password, Userfound.password);

    if (!comparedPassword) {
      res.status(401).send({ message: "user credentials invalud" });
    }

    const token = jwt.sign({ userId: Userfound._id }, JWT_SECRET, {
      expiresIn: "3h",
    });

    console.log("token", token);
    res.status(200).json({
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "internal server error" });
  }
});

export default router;

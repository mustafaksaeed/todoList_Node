import express from "express";
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
dotenv.config();
const port = process.env.PORT;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
const url = process.env.URL;

try {
  await mongoose.connect(url, clientOptions);
  console.log("database connected Successfully");
} catch (err) {
  console.error("MongoDB connection error:", err);
  process.exit(1);
}

const app = express();

app.use(express.json());

app.use("/user", userRoutes);
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;

app.get("/health", (req, res) => {
  res.send("API is healthy!");
});

app.post("/signup", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.post("/login", async (req, res) => {
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

    const token = jwt.sign({ email: Userfound.email }, JWT_SECRET, {
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






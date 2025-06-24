import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import todoRoutes from "./routes/todoRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import cors from "cors";
import authorize from "./middleware/authorize.js";

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
app.use(cors());

app.use(express.json());

app.use("/todos", authorize, todoRoutes);
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.send("API is healthy!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
<<<<<<< HEAD
=======

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





>>>>>>> f1cedb5dfecd82855274bdba47e0b92a4b86a75e

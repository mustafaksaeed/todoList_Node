import express from "express";
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
const url = process.env.URL;

mongoose
  .connect(url, clientOptions)
  .then(() => {
    console.log("Successfully connected to MongoDB!");

    return mongoose.connection.db.admin().command({ ping: 1 });
  })
  .then(() => {
    console.log("Pinged your deployment. Database is responsive!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);

    process.exit(1);
  });

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/user", userRoutes);
app.use(cors());

app.get("/health", (req, res) => {
  res.send("API is healthy!");
});

app.post("/signup", async (req, res) => {
  console.log("body", req.body);
  try {
    const foundUser = await User.findOne({ email: req.body.email });
    if (foundUser) {
      res.status(400).send({
        message: "user already exists ",
        status: "failed",
      });
    }

    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const newUser = await User.create({
      email: req.body.email,
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
    const Userfound = await User.findOne({ email: req.body.email });

    if (!Userfound) {
      res.status(401).send({ message: "user credentials invalud" });
    }
    const comparedPassword = await bcrypt.compare(
      req.body.password,
      Userfound.password
    );

    if (!comparedPassword) {
      res.status(401).send({ message: "user credentials invalud" });
    }

    res.status(401).send({ message: "login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "internal server error" });
  }
});

/*
- user/userid/




*/

import express from "express";
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;
const url = process.env.URI;
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

try {
  await mongoose.connect(url, clientOptions);
  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
  await mongoose.disconnect();
}

app.use(express.json());

app.use("/user", userRoutes);

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

    const newUser = {
      email: req.body.email,
      password: hashedPassword,
    };

    await newUser.save();
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

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const Userfound = allUsers.find((user) => user.email === email);

//   if (!Userfound) {
//     res.status(401).send({ message: "user credentials invalud" });
//   }
//   const comparedPassword = bcrypt.compare(password, Userfound.password);

//   if (!comparedPassword) {
//     res.status(401).send({ message: "user credentials invalud" });
//   }

//   res.status(401).send({ message: "Login Successful" });
// });

/*
- user/userid/




*/

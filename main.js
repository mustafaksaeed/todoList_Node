import express from "express";
import bcrypt from "bcryptjs";

// import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/user", userRoutes);

const port = process.env.PORT;

app.get("/health", (req, res) => {
  res.send("API is healthy!");
});

let allUsers = [];

app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  const foundUser = allUsers.find((user) => user.email === email);
  if (foundUser) {
    res.status(400).send({
      message: "user already exists ",
      status: "failed",
    });
  }
  const newUser = {
    id: Date.now(),
    email: email,
    password: password,
  };

  allUsers.push(newUser);
  console.log("users", allUsers);
  res
    .status(200)
    .send({ message: "user created ", status: "Success", users: allUsers });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// const uri = process.env.URI;

// const clientOptions = {
//   serverApi: { version: "1", strict: true, deprecationErrors: true },
// };

// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);

/*
- user/userid/




*/

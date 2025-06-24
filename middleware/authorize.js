import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET;
const authorize = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized - Missing or invalid authorization header",
    });
  }

  const token = authHeader.replace("Bearer ", "");
  console.log(token);

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const { userId } = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
};

export default authorize;

//error handling, oauth,

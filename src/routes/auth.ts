import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import User from "../models/user";

const router = Router();

// ==========================
// LOGIN
// ==========================
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

   
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const JWT_SECRET: Secret = process.env.JWT_SECRET as string;

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const options: SignOptions = {
      expiresIn: "1d", // ✅ safest (no TS issues)
    };

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      options
    );

  
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
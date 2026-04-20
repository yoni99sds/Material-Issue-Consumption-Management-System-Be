import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// ==========================
// ✅ GET ALL USERS (ADMIN ONLY)
// ==========================
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ==========================
// ✅ CREATE USER (ADMIN ONLY)
// ==========================
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
        
      return res.status(403).json({ message: "Forbidden" });
    }

    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await User.findOne({ username });
    
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔥 IMPORTANT: hash manually OR rely on pre-save
    const newUser = new User({
      username,
      password,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User created" });
  } catch (err: any) {
  console.log(err.response?.data);
  alert(err.response?.data?.message || "Failed to create user");
}
});

// ==========================
// ✅ DELETE USER (ADMIN ONLY)
// ==========================
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});


router.get("/seed-admin", async (req, res) => {
  try {
    await User.deleteMany({}); // optional reset

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    res.json({ message: "Admin seeded successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
import { Router, Response } from "express";
import MaterialIssue from "../models/materialIssue";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// ==========================
// ✅ CREATE (PROTECTED)
// ==========================
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { header, rows } = req.body;

    if (!header || !rows) {
      return res.status(400).json({ message: "Missing header or rows" });
    }

    // 🔥 attach logged-in user automatically
    header.operator = req.user?.username;
    header.operatorId = req.user?._id; // optional but recommended

    const newIssue = new MaterialIssue({
      header,
      rows,
      createdBy: req.user?._id,
      role: req.user?.role,
    });

    await newIssue.save();

    res.status(201).json(newIssue);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ==========================
// ✅ GET ALL (ROLE BASED)
// ==========================
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    let query: any = {};

    // 🔥 ROLE-BASED DATA ACCESS
    if (user?.role === "operator") {
      query = { "header.operator": user.username };
    }

    if (user?.role === "supervisor") {
      query = {}; // supervisor sees all but can be filtered later
    }

    if (user?.role === "admin") {
      query = {}; // full access
    }

    const issues = await MaterialIssue.find(query).sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data", error });
  }
});

// ==========================
// ✅ UPDATE (PROTECTED)
// ==========================
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const updated = await MaterialIssue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
});

// ==========================
// ✅ DELETE (ADMIN ONLY)
// ==========================
router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const deleted = await MaterialIssue.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Not found" });
      }

      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Delete failed", error });
    }
  }
);

export default router;
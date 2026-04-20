import { Router } from "express";
import MaterialIssue from "../models/materialIssue";

const router = Router();

// Operator Dashboard
router.get("/operator", async (req, res) => {
  const total = await MaterialIssue.countDocuments();
  res.json({ totalIssues: total });
});

// Supervisor Dashboard
router.get("/supervisor", async (req, res) => {
  const pending = await MaterialIssue.countDocuments({
    "header.status": "pending",
  });

  res.json({ pending });
});

// Admin Dashboard
router.get("/admin", async (req, res) => {
  const total = await MaterialIssue.countDocuments();
  const approved = await MaterialIssue.countDocuments({
    "header.status": "approved",
  });

  res.json({ total, approved });
});

export default router;
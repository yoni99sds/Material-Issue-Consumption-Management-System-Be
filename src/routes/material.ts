import { Router, Response } from "express";
import MaterialIssue from "../models/materialIssue";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

/* =========================
   CREATE (FIXED + SAFE)
========================= */
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { header, rows } = req.body;

    if (!header?.machine || !header?.workOrderNo) {
      return res.status(400).json({
        message: "Machine and Work Order are required",
      });
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: "Rows required" });
    }

    const newIssue = new MaterialIssue({
      header: {
        date: new Date().toISOString(),
        machine: header.machine?.trim() || "",
        workOrderNo: header.workOrderNo?.trim() || "",
        jobDescription: header.jobDescription || "",
        shift: header.shift || "Day",
        operator: req.user?.username || "unknown",
        status: "pending",
      },
      rows: rows.map((r: any, index: number) => ({
        sn: r.sn ?? index + 1,
        description: r.description || "",
        rollNo: r.rollNo || "",
        width: r.width ?? 0,
        weight: r.weight ?? 0,
        issuedLength: r.issuedLength ?? 0,
        waste: r.waste ?? 0,
        actualSheetProduced: r.actualSheetProduced ?? 0,
        sheetSize: r.sheetSize || "",
      })),
    });

    const saved = await newIssue.save();
    return res.status(201).json(saved);
  } catch (err: any) {
    console.error("CREATE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   GET ALL (🔥 FINAL FIX)
   - handles missing header safely
   - removes undefined issues
   - supports old + new structure
========================= */
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const issues = await MaterialIssue.find()
      .sort({ createdAt: -1 })
      .lean();

    const normalized = issues.map((i: any) => {
      const header = i.header || {};

      return {
        ...i,

        header: {
          machine: header.machine ?? i.machine ?? "-",
          workOrderNo: header.workOrderNo ?? i.workOrderNo ?? "-",
          operator: header.operator ?? i.operator ?? "-",
          status: header.status ?? i.status ?? "pending",
        },
      };
    });

    return res.json(normalized);
  } catch (err) {
    console.error("GET ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch" });
  }
});

/* =========================
   UPDATE STATUS
========================= */
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    const updated = await MaterialIssue.findByIdAndUpdate(
      req.params.id,
      { "header.status": status },
      { new: true }
    );

    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Update failed" });
  }
});

/* =========================
   DELETE
========================= */
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await MaterialIssue.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Delete failed" });
  }
});

export default router;

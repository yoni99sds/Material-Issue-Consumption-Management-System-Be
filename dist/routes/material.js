"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const materialIssue_1 = __importDefault(require("../models/materialIssue"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// ==========================
// ✅ CREATE (PROTECTED)
// ==========================
router.post("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { header, rows } = req.body;
        if (!header || !rows) {
            return res.status(400).json({ message: "Missing header or rows" });
        }
        // 🔥 attach logged-in user automatically
        header.operator = req.user?.username;
        header.operatorId = req.user?._id; // optional but recommended
        const newIssue = new materialIssue_1.default({
            header,
            rows,
            createdBy: req.user?._id,
            role: req.user?.role,
        });
        await newIssue.save();
        res.status(201).json(newIssue);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
// ==========================
// ✅ GET ALL (ROLE BASED)
// ==========================
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        let query = {};
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
        const issues = await materialIssue_1.default.find(query).sort({ createdAt: -1 });
        res.json(issues);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch data", error });
    }
});
// ==========================
// ✅ UPDATE (PROTECTED)
// ==========================
router.put("/:id", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const updated = await materialIssue_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: "Not found" });
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: "Update failed", error });
    }
});
// ==========================
// ✅ DELETE (ADMIN ONLY)
// ==========================
router.delete("/:id", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const deleted = await materialIssue_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Not found" });
        }
        res.json({ message: "Deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Delete failed", error });
    }
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// ==========================
// ✅ GET ALL USERS (ADMIN ONLY)
// ==========================
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const users = await user_1.default.find().select("-password");
        res.json(users);
    }
    catch {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});
// ==========================
// ✅ CREATE USER (ADMIN ONLY)
// ==========================
router.post("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }
        const exists = await user_1.default.findOne({ username });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }
        // 🔥 IMPORTANT: hash manually OR rely on pre-save
        const newUser = new user_1.default({
            username,
            password,
            role,
        });
        await newUser.save();
        res.status(201).json({ message: "User created" });
    }
    catch (err) {
        console.log(err.response?.data);
        alert(err.response?.data?.message || "Failed to create user");
    }
});
// ==========================
// ✅ DELETE USER (ADMIN ONLY)
// ==========================
router.delete("/:id", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        await user_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    }
    catch {
        res.status(500).json({ message: "Delete failed" });
    }
});
exports.default = router;

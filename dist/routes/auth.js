"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const router = (0, express_1.Router)();
// ==========================
// LOGIN
// ==========================
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await user_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret not configured" });
        }
        const options = {
            expiresIn: "1d", // ✅ safest (no TS issues)
        };
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            username: user.username,
            role: user.role,
        }, JWT_SECRET, options);
        res.json({
            user: {
                _id: user._id,
                username: user.username,
                role: user.role,
            },
            token,
        });
    }
    catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ message: "Login failed" });
    }
});
exports.default = router;

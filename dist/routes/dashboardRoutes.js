"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const materialIssue_1 = __importDefault(require("../models/materialIssue"));
const router = (0, express_1.Router)();
// Operator Dashboard
router.get("/operator", async (req, res) => {
    const total = await materialIssue_1.default.countDocuments();
    res.json({ totalIssues: total });
});
// Supervisor Dashboard
router.get("/supervisor", async (req, res) => {
    const pending = await materialIssue_1.default.countDocuments({
        "header.status": "pending",
    });
    res.json({ pending });
});
// Admin Dashboard
router.get("/admin", async (req, res) => {
    const total = await materialIssue_1.default.countDocuments();
    const approved = await materialIssue_1.default.countDocuments({
        "header.status": "approved",
    });
    res.json({ total, approved });
});
exports.default = router;

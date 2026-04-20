"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "operator", "supervisor"],
        default: "operator",
    },
}, { timestamps: true });
// ✅ FIXED (NO next, NO TS ERROR)
userSchema.pre("save", async function () {
    const user = this;
    if (!user.isModified("password"))
        return;
    const salt = await bcryptjs_1.default.genSalt(10);
    user.password = await bcryptjs_1.default.hash(user.password, salt);
});
exports.default = mongoose_1.default.model("User", userSchema);

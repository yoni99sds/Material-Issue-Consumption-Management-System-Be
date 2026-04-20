"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = __importDefault(require("../src/models/user")); // adjust path if needed
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const seedUsers = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
        // 🧹 clear existing users
        await user_1.default.deleteMany();
        const salt = await bcryptjs_1.default.genSalt(10);
        const users = [
            {
                username: "admin",
                password: await bcryptjs_1.default.hash("admin123", salt),
                role: "admin",
            },
            {
                username: "operator",
                password: await bcryptjs_1.default.hash("operator123", salt),
                role: "operator",
            },
            {
                username: "supervisor",
                password: await bcryptjs_1.default.hash("supervisor123", salt),
                role: "supervisor",
            },
        ];
        await user_1.default.insertMany(users);
        console.log("✅ Users seeded successfully");
        process.exit();
    }
    catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};
seedUsers();

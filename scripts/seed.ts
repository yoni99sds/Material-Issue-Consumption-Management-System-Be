import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/user"; // adjust path if needed
import dotenv from "dotenv";

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB connected");

    // 🧹 clear existing users
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);

    const users = [
      {
        username: "admin",
        password: await bcrypt.hash("admin123", salt),
        role: "admin",
      },
      {
        username: "operator",
        password: await bcrypt.hash("operator123", salt),
        role: "operator",
      },
      {
        username: "supervisor",
        password: await bcrypt.hash("supervisor123", salt),
        role: "supervisor",
      },
    ];

    await User.insertMany(users);

    console.log("✅ Users seeded successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedUsers();
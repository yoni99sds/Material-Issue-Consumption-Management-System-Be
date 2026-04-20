import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import dashboardRoutes from "./routes/dashboardRoutes";
import authRoutes from "./routes/auth";
import materialRoutes from "./routes/material";
import consumptionRoutes from "./routes/consumption";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();

// 🚀 IMPORTANT: Railway provides PORT dynamically
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: "*", // you can restrict later
}));

app.use(express.json());

/* =========================
   ROUTES
========================= */
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/material-issue", materialRoutes);
app.use("/api/consumption", consumptionRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running 🚀",
  });
});

/* =========================
   START SERVER SAFELY
========================= */
const startServer = async () => {
  try {
    console.log("🚀 Starting server...");

    await connectDB();
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
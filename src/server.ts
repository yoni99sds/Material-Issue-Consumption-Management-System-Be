import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import dashboardRoutes from "./routes/dashboardRoutes"
import authRoutes from "./routes/auth";
import materialRoutes from "./routes/material";
import consumptionRoutes from "./routes/consumption";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/material-issue", materialRoutes);
app.use("/api/consumption", consumptionRoutes);
app.use("/api/dashboard", dashboardRoutes);
// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// start server AFTER DB connects
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`[server]: Running on http://localhost:${port}`);
  });
});
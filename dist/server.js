"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const auth_1 = __importDefault(require("./routes/auth"));
const material_1 = __importDefault(require("./routes/material"));
const consumption_1 = __importDefault(require("./routes/consumption"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// routes
app.use("/api/users", user_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/material-issue", material_1.default);
app.use("/api/consumption", consumption_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
// health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});
// start server AFTER DB connects
(0, db_1.connectDB)().then(() => {
    app.listen(port, () => {
        console.log(`[server]: Running on http://localhost:${port}`);
    });
});

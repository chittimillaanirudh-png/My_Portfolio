import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Admin credentials configuration
const ADMIN_ID = process.env.ADMIN_ID || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminpassword";

const PORTFOLIO_FILE_PATH = path.join(__dirname, "data/portfolio.json");

// Helper to read portfolio data safely
function getPortfolioData() {
  try {
    if (fs.existsSync(PORTFOLIO_FILE_PATH)) {
      const content = fs.readFileSync(PORTFOLIO_FILE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading portfolio data:", err);
  }
  // Safe default
  return { homeBanner: {}, skills: [], projects: [] };
}

// Endpoint to fetch portfolio data
app.get("/api/portfolio", (req, res) => {
  const data = getPortfolioData();
  res.json(data);
});

// Endpoint to authenticate admin login
app.post("/api/admin/login", (req, res) => {
  const { adminId, password } = req.body;
  if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: "anirudh-portfolio-admin-session-token-2026" });
  }
  res.status(401).json({ success: false, error: "Invalid Admin ID or Password" });
});

// Endpoint to update portfolio data (authorized via simple header token check)
app.post("/api/portfolio", (req, res) => {
  const token = req.headers.authorization;
  if (token !== "Bearer anirudh-portfolio-admin-session-token-2026") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const newData = req.body;
  if (!newData || typeof newData !== "object") {
    return res.status(400).json({ error: "Invalid data payload" });
  }

  try {
    fs.writeFileSync(PORTFOLIO_FILE_PATH, JSON.stringify(newData, null, 2), "utf-8");
    res.json({ success: true, message: "Portfolio updated successfully" });
  } catch (err) {
    console.error("Failed to write portfolio data:", err);
    res.status(500).json({ error: "Failed to save portfolio data" });
  }
});

// Serve static built frontend folder in production (built inside ../frontend/dist)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Fallback index.html for Single Page Application client-side routing
app.get("*", (req, res) => {
  const indexPath = path.resolve(__dirname, "../frontend/dist/index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Frontend build not found. Please build the frontend first using 'npm run build' inside the frontend directory.");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend Server is running at http://0.0.0.0:${PORT}`);
});

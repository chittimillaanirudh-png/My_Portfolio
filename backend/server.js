import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file if it exists
try {
  process.loadEnvFile(path.resolve(__dirname, "../.env"));
} catch (err) {
  // .env file might not exist in production, which is fine
}

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
const JWT_SECRET = process.env.JWT_SECRET || "anirudh-portfolio-fallback-secret-2026";

const PORTFOLIO_FILE_PATH = path.join(__dirname, "data/portfolio.json");

// Define Mongoose Schema for Portfolio
const PortfolioSchema = new mongoose.Schema({
  homeBanner: {
    title: String,
    subtitle: String,
    roles: String,
    description: String,
    imageUrl: String
  },
  skills: [
    {
      id: String,
      title: String,
      desc: String,
      iconName: String,
      color: String,
      textColor: String
    }
  ],
  projects: [
    {
      title: String,
      subtitle: String,
      category: String,
      desc: String,
      image: String,
      tags: [String],
      link: String
    }
  ]
}, { timestamps: true, collection: "portfolio" });

const Portfolio = mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);

// Setup MongoDB connection if MONGODB_URI is provided
let MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  // Fix accidental angle brackets around password
  MONGODB_URI = MONGODB_URI.replace(/<([^>]+)>/g, '$1');
}

// Workaround for local Windows DNS issues blocking SRV queries (querySrv ECONNREFUSED)
if (process.env.NODE_ENV !== "production") {
  try {
    const dns = await import("dns");
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (err) {
    // Ignore DNS override errors
  }
}

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s so the server remains responsive
  })
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas");
    })
    .catch((err) => {
      console.error("MongoDB Atlas connection error:", err.message);
      console.log("--------------------------------------------------------------------------------");
      console.log("⚠️  MongoDB connection failed. This is usually due to one of the following:");
      console.log("1. Your current IP address is not whitelisted in MongoDB Atlas.");
      console.log("   Go to Atlas -> Network Access -> 'Add IP Address' -> Select 'Allow Access From Anywhere' (0.0.0.0/0).");
      console.log("2. Incorrect MongoDB URI username or password.");
      console.log("--------------------------------------------------------------------------------");
      console.log("Falling back to local JSON file database for now.");
    });
} else {
  console.log("No MONGODB_URI environment variable detected. Running in local file system database mode.");
}

// Helper to read portfolio data safely from local file
function getLocalPortfolioData() {
  try {
    if (fs.existsSync(PORTFOLIO_FILE_PATH)) {
      const content = fs.readFileSync(PORTFOLIO_FILE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading local portfolio data file:", err);
  }
  return { homeBanner: {}, skills: [], projects: [] };
}

// Helper to write portfolio data safely to local file
function writeLocalPortfolioData(data) {
  try {
    fs.writeFileSync(PORTFOLIO_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to local portfolio JSON file:", err);
  }
}

// Helper to get portfolio data (MongoDB with local file system fallback)
async function getPortfolioData() {
  if (mongoose.connection.readyState === 1) {
    try {
      const doc = await Portfolio.findOne();
      if (doc) {
        return doc;
      } else {
        // If the database has no documents, seed it with the contents from local file
        const localData = getLocalPortfolioData();
        console.log("MongoDB is empty. Seeding with local portfolio data...");
        const seeded = await Portfolio.create(localData);
        return seeded;
      }
    } catch (err) {
      console.error("Error reading portfolio data from MongoDB, falling back:", err);
    }
  }
  return getLocalPortfolioData();
}

// Helper to save portfolio data (MongoDB with local file system fallback)
async function savePortfolioData(newData) {
  if (mongoose.connection.readyState === 1) {
    try {
      let doc = await Portfolio.findOne();
      if (doc) {
        doc.homeBanner = newData.homeBanner;
        doc.skills = newData.skills;
        doc.projects = newData.projects;
        await doc.save();
      } else {
        await Portfolio.create(newData);
      }
    } catch (err) {
      console.error("Error saving portfolio data to MongoDB:", err);
      throw err;
    }
  }
  // Always save locally too for perfect synchronization and safety
  writeLocalPortfolioData(newData);
}

// Endpoint to fetch portfolio data
app.get("/api/portfolio", async (req, res) => {
  const data = await getPortfolioData();
  res.json(data);
});

// Endpoint to fetch public configurations (EmailJS credentials) dynamically
app.get("/api/config/emailjs", (req, res) => {
  res.json({
    serviceId: process.env.EMAILJS_SERVICE_ID || "service_bdu1n5v",
    templateId: process.env.EMAILJS_TEMPLATE_ID || "template_7u102re",
    publicKey: process.env.EMAILJS_PUBLIC_KEY || "KqrFRK0YlakuNxj9K"
  });
});

// Endpoint to authenticate admin login (using JWT)
app.post("/api/admin/login", (req, res) => {
  const { adminId, password } = req.body;
  if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
    // Generate a secure JWT token signed with JWT_SECRET
    const token = jwt.sign({ adminId }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, error: "Invalid Admin ID or Password" });
});

// Endpoint to update portfolio data (authorized via JWT token or fallback token)
app.post("/api/portfolio", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Unauthorized access - Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  let isAuthorized = false;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.adminId === ADMIN_ID) {
      isAuthorized = true;
    }
  } catch (err) {
    // Fallback support for legacy token
    if (token === "anirudh-portfolio-admin-session-token-2026") {
      isAuthorized = true;
    } else {
      return res.status(401).json({ error: "Unauthorized access - invalid token" });
    }
  }

  if (!isAuthorized) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  const newData = req.body;
  if (!newData || typeof newData !== "object") {
    return res.status(400).json({ error: "Invalid data payload" });
  }

  try {
    await savePortfolioData(newData);
    res.json({ success: true, message: "Portfolio updated successfully" });
  } catch (err) {
    console.error("Failed to save portfolio data:", err);
    res.status(500).json({ error: "Failed to save portfolio data" });
  }
});

// Setup dev server vs production server static assets
let vite;
if (process.env.NODE_ENV !== "production") {
  const { createServer } = await import("vite");
  vite = await createServer({
    root: path.resolve(__dirname, "../frontend"),
    server: { middlewareMode: true },
    appType: "custom",
  });
  app.use(vite.middlewares);
} else {
  // Serve static built frontend folder in production
  app.use(express.static(path.join(__dirname, "../dist")));
}

// Fallback index.html for Single Page Application client-side routing
app.get("*", async (req, res, next) => {
  const url = req.originalUrl;

  try {
    let template;
    if (process.env.NODE_ENV !== "production" && vite) {
      // Read index.html from frontend folder for Vite
      template = fs.readFileSync(path.resolve(__dirname, "../frontend/index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);
    } else {
      // Read index.html from dist for production
      template = fs.readFileSync(path.resolve(__dirname, "../dist/index.html"), "utf-8");
    }

    res.status(200).set({ "Content-Type": "text/html" }).end(template);
  } catch (e) {
    if (vite) vite.ssrFixStacktrace(e);
    next(e);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});


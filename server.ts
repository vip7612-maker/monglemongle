import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from 'better-sqlite3';
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
import fs from 'fs';

// Force load .env.local if exists
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config(); // fallback
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const db = new Database('sponsors.db');

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    target TEXT NOT NULL,
    amount INTEGER NOT NULL,
    message TEXT,
    type TEXT NOT NULL,
    date TEXT NOT NULL,
    isDeleted INTEGER DEFAULT 0
  )
`);

const insertStmt = db.prepare(`
  INSERT INTO submissions (id, name, phone, target, amount, message, type, date, isDeleted)
  VALUES (@id, @name, @phone, @target, @amount, @message, @type, @date, @isDeleted)
`);

const updateDeletedStmt = db.prepare(`
  UPDATE submissions SET isDeleted = @isDeleted WHERE id = @id
`);

const deleteStmt = db.prepare(`
  DELETE FROM submissions WHERE id = @id
`);

const getAllStmt = db.prepare(`
  SELECT * FROM submissions ORDER BY id DESC
`);

// Initialize Gemini AI
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.warn("Gemini API Key missing or invalid, AI generation disabled.");
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Send current DB state to the new client
    const allSubmissions = getAllStmt.all().map((row: any) => ({
      ...row,
      isDeleted: row.isDeleted === 1
    }));
    socket.emit("init", allSubmissions);

    // Handle new submission
    socket.on("submit", async (data) => {
      const newSubmission = {
        ...data,
        id: Date.now(),
        date: new Date().toISOString(),
        isDeleted: 0 // Keep as 0 or 1 for SQLite
      };

      try {
        insertStmt.run(newSubmission);

        // Broadcast to all clients including sender
        const clientData = { ...newSubmission, isDeleted: false };
        io.emit("new_submission", clientData);

        // Generate AI message
        if (ai) {
          try {
            const typeText = data.type === 'commitment' ? '정기 후원 약정' : '일시 후원';
            const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: `Write a short, heartwarming thank you message in Korean for a sponsor named "${data.name}" who just committed to a ${typeText} to support "${data.target}" in their mission to teach Google AI in Mongolia. Mention how this specific support for ${data.target} will help the mission. Keep it under 3 sentences.`,
            });
            socket.emit("ai_message_result", response.text || "후원 약정에 진심으로 감사드립니다!");
          } catch (error) {
            console.error("AI Error:", error);
            socket.emit("ai_message_error", "몽골의 미래를 위한 따뜻한 후원에 감사드립니다!");
          }
        } else {
          socket.emit("ai_message_error", "따뜻한 후원에 감사드립니다 (AI 키 없음)");
        }

      } catch (err) {
        console.error("Database insert error:", err);
      }
    });

    // Handle admin actions (delete/restore)
    socket.on("admin_action", (data: { type: 'delete' | 'restore' | 'permanent_delete', id: number }) => {
      try {
        if (data.type === 'delete') {
          updateDeletedStmt.run({ isDeleted: 1, id: data.id });
        } else if (data.type === 'restore') {
          updateDeletedStmt.run({ isDeleted: 0, id: data.id });
        } else if (data.type === 'permanent_delete') {
          deleteStmt.run({ id: data.id });
        }

        // Send updated entire state
        const allSubmissions = getAllStmt.all().map((row: any) => ({
          ...row,
          isDeleted: row.isDeleted === 1
        }));
        io.emit("init", allSubmissions);
      } catch (err) {
        console.error("Admin action error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

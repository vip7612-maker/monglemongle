import express from "express";
import { neon } from '@neondatabase/serverless';
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Force load .env.local if exists
if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config(); // fallback
}

// Initialize database
let sql: any;
try {
    if (process.env.DATABASE_URL) {
        sql = neon(process.env.DATABASE_URL);
    } else {
        console.warn("DATABASE_URL missing. Database will not function.");
    }
} catch (e) {
    console.error("Neon DB Init error:", e);
}

// Function to initialize table
export async function initDB() {
    if (!sql) return;
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id BIGINT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        target TEXT NOT NULL,
        amount INTEGER NOT NULL,
        message TEXT,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        isDeleted INTEGER DEFAULT 0
      )
    `;
        console.log("Database initialized.");
    } catch (err) {
        console.error("Database table creation error:", err);
    }
}

// Initialize Gemini AI
let ai: GoogleGenAI | null = null;
try {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
} catch (e) {
    console.warn("Gemini API Key missing or invalid, AI generation disabled.");
}

const app = express();
app.use(express.json());

// API Route: Get all submissions
app.get("/api/submissions", async (req, res) => {
    if (sql) {
        try {
            const rows = await sql`SELECT * FROM submissions ORDER BY id DESC`;
            const allSubmissions = rows.map((row: any) => ({
                ...row,
                id: Number(row.id),
                isDeleted: row.isdeleted === 1 || row.isdeleted === true
            }));
            res.json(allSubmissions);
        } catch (err) {
            console.error("Fetch error:", err);
            res.status(500).json([]);
        }
    } else {
        res.json([]);
    }
});

// API Route: Submit new
app.post("/api/submit", async (req, res) => {
    const data = req.body;
    const newSubmission = {
        ...data,
        id: Date.now(),
        date: new Date().toISOString(),
        isDeleted: 0
    };

    if (sql) {
        try {
            await sql`
        INSERT INTO submissions(id, name, phone, target, amount, message, type, date, isDeleted)
        VALUES(${newSubmission.id}, ${newSubmission.name}, ${newSubmission.phone}, ${newSubmission.target}, ${newSubmission.amount}, ${newSubmission.message || ''}, ${newSubmission.type}, ${newSubmission.date}, ${newSubmission.isDeleted})
      `;
        } catch (err) {
            console.error("Database insert error:", err);
        }
    }

    // Generate AI message as part of the response
    let aiMessageResult = "후원 약정에 진심으로 감사드립니다!";
    let aiMessageError = null;

    if (ai) {
        try {
            const typeText = data.type === 'commitment' ? '정기 후원 약정' : '일시 후원';
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Write a short, heartwarming thank you message in Korean for a sponsor named "${data.name}" who just committed to a ${typeText} to support "${data.target}" in their mission to teach Google AI in Mongolia. Mention how this specific support for ${data.target} will help the mission. Keep it under 3 sentences.`,
            });
            aiMessageResult = response.text || aiMessageResult;
        } catch (error) {
            console.error("AI Error:", error);
            aiMessageResult = "몽골의 미래를 위한 따뜻한 후원에 감사드립니다!";
            aiMessageError = true;
        }
    } else {
        aiMessageResult = "따뜻한 후원에 감사드립니다 (AI 키 없음)";
        aiMessageError = true;
    }

    res.json({
        success: true,
        submission: { ...newSubmission, isDeleted: false },
        aiMessage: aiMessageResult,
        aiError: aiMessageError
    });
});

// API Route: Admin actions
app.post("/api/admin_action", async (req, res) => {
    const data = req.body;
    if (!sql) {
        res.status(500).json({ error: "No database connected" });
        return;
    }

    try {
        if (data.type === 'delete') {
            await sql`UPDATE submissions SET isDeleted = 1 WHERE id = ${data.id}`;
        } else if (data.type === 'restore') {
            await sql`UPDATE submissions SET isDeleted = 0 WHERE id = ${data.id}`;
        } else if (data.type === 'permanent_delete') {
            await sql`DELETE FROM submissions WHERE id = ${data.id}`;
        }

        const rows = await sql`SELECT * FROM submissions ORDER BY id DESC`;
        const allSubmissions = rows.map((row: any) => ({
            ...row,
            id: Number(row.id),
            isDeleted: row.isdeleted === 1 || row.isdeleted === true
        }));
        res.json(allSubmissions);
    } catch (err) {
        console.error("Admin action error:", err);
        res.status(500).json({ error: "Action failed" });
    }
});

export default app;

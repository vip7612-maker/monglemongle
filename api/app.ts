import express from "express";
import { createClient } from '@libsql/client';
import { GoogleGenAI } from "@google/genai";
import { google } from 'googleapis';
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
    if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
        sql = createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN
        });
    } else {
        console.warn("TURSO_DATABASE_URL missing. Database will not function.");
    }
} catch (e) {
    console.error("Turso DB Init error:", e);
}

// Function to initialize table
export async function initDB() {
    if (!sql) return;
    try {
        await sql.execute(`
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
            const result = await sql.execute(`SELECT * FROM submissions ORDER BY id DESC`);
            const allSubmissions = result.rows.map((row: any) => ({
                ...row,
                id: Number(row.id),
                isDeleted: row.isDeleted === 1 || row.isDeleted === true || row.isdeleted === 1 || row.isdeleted === true
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
            await sql.execute({
                sql: `INSERT INTO submissions(id, name, phone, target, amount, message, type, date, isDeleted)
                      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [newSubmission.id, newSubmission.name, newSubmission.phone, newSubmission.target, newSubmission.amount, newSubmission.message || '', newSubmission.type, newSubmission.date, newSubmission.isDeleted]
            });
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
        const targetId = Number(data.id);
        console.log(`Admin action: ${data.type} on id=${targetId}`);

        if (data.type === 'delete') {
            const updateResult = await sql.execute({ sql: `UPDATE submissions SET "isDeleted" = 1 WHERE id = ?`, args: [targetId] });
            console.log(`Delete result rowsAffected:`, updateResult.rowsAffected);
            if (updateResult.rowsAffected === 0) {
                // Try without quotes (lowercase column)
                await sql.execute({ sql: `UPDATE submissions SET isdeleted = 1 WHERE id = ?`, args: [targetId] });
            }
        } else if (data.type === 'restore') {
            await sql.execute({ sql: `UPDATE submissions SET "isDeleted" = 0 WHERE id = ?`, args: [targetId] });
        } else if (data.type === 'permanent_delete') {
            await sql.execute({ sql: `DELETE FROM submissions WHERE id = ?`, args: [targetId] });
        }

        const result = await sql.execute(`SELECT * FROM submissions ORDER BY id DESC`);
        const allSubmissions = result.rows.map((row: any) => ({
            ...row,
            id: Number(row.id),
            isDeleted: row.isDeleted === 1 || row.isDeleted === true || row.isdeleted === 1 || row.isdeleted === true
        }));
        res.json(allSubmissions);
    } catch (err) {
        console.error("Admin action error:", err);
        res.status(500).json({ error: "Action failed" });
    }
});

// API Route: Export all to Google Sheets
app.post("/api/export-google-sheets", async (req, res) => {
    if (!sql) {
        res.status(500).json({ success: false, error: "Database not connected" });
        return;
    }

    if (!process.env.GOOGLE_SHEET_ID) {
        res.status(500).json({ success: false, error: "GOOGLE_SHEET_ID missing" });
        return;
    }

    try {
        let auth;
        console.log('GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64);
        console.log('GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 length:', process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64?.length);
        console.log('GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);

        if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
            console.log('Using BASE64 approach');
            const jsonStr = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64, 'base64').toString('utf-8');
            const creds = JSON.parse(jsonStr);
            console.log('Decoded email:', creds.client_email);
            console.log('Private key starts:', creds.private_key?.substring(0, 30));
            console.log('Private key length:', creds.private_key?.length);
            auth = new google.auth.JWT(creds.client_email, undefined, creds.private_key, ['https://www.googleapis.com/auth/spreadsheets']);
        } else if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
            console.log('Using individual env vars approach');
            const pk = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
            auth = new google.auth.JWT(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, undefined, pk, ['https://www.googleapis.com/auth/spreadsheets']);
        } else {
            res.status(500).json({ success: false, error: "Google API credentials missing" });
            return;
        }


        const sheets = google.sheets({ version: 'v4', auth });
        const result = await sql.execute(`SELECT * FROM submissions ORDER BY id DESC`);

        const rows = result.rows.map((row: any) => [
            row.date,
            row.name,
            row.phone,
            row.target,
            row.amount,
            row.message || '',
            row.type === 'commitment' ? '정기약정' : '일시후원',
            (row.isDeleted || row.isdeleted) ? '삭제됨' : '활성'
        ]);

        const header = ["날짜", "성함", "연락처", "후원대상", "금액", "메시지", "유형", "상태"];
        const values = [header, ...rows];

        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'A1',
            valueInputOption: 'RAW',
            requestBody: { values },
        });

        res.json({ success: true });
    } catch (err: any) {
        console.error("Google Sheets Sync Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default app;

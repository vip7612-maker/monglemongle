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
        // Get credentials from base64 env var or individual env vars
        let clientEmail: string;
        let privateKeyPem: string;

        if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
            const jsonStr = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64, 'base64').toString('utf-8');
            const creds = JSON.parse(jsonStr);
            clientEmail = creds.client_email;
            privateKeyPem = creds.private_key;
        } else if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
            clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
            privateKeyPem = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
        } else {
            res.status(500).json({ success: false, error: "Google API credentials missing" });
            return;
        }

        // Clean the PEM key: ensure actual newlines, remove carriage returns
        privateKeyPem = privateKeyPem.replace(/\\n/g, '\n');
        privateKeyPem = privateKeyPem.replace(/\r/g, '');
        privateKeyPem = privateKeyPem.trim();

        // Use jose library to sign JWT (uses Web Crypto / crypto.subtle, avoids OpenSSL 3.0 issues)
        const { importPKCS8, SignJWT } = await import('jose');
        const privateKey = await importPKCS8(privateKeyPem, 'RS256');

        const now = Math.floor(Date.now() / 1000);
        const jwt = await new SignJWT({
            iss: clientEmail,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            aud: 'https://oauth2.googleapis.com/token',
        })
            .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
            .setIssuedAt(now)
            .setExpirationTime(now + 3600)
            .sign(privateKey);

        // Exchange JWT for access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
        });
        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`);
        }

        // Fetch submissions from database
        const result = await sql.execute(`SELECT * FROM submissions ORDER BY id DESC`);
        const rows = result.rows.map((row: any) => [
            row.date ? row.date.split('T')[0] : '',
            row.name,
            row.phone,
            row.amount,
            row.message || '',
            row.type === 'commitment' ? '정기약정' : '일시후원',
            (row.isDeleted || row.isdeleted) ? '삭제됨' : '활성'
        ]);

        const header = ["날짜", "이름", "연락처", "금액", "메시지", "유형", "상태"];
        const values = [header, ...rows];

        // Update Google Sheet using REST API directly
        const sheetId = process.env.GOOGLE_SHEET_ID;
        const sheetsResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1?valueInputOption=RAW`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ values }),
            }
        );

        if (!sheetsResponse.ok) {
            const errorText = await sheetsResponse.text();
            throw new Error(`Sheets API error: ${sheetsResponse.status} ${errorText}`);
        }

        // Auto-resize columns in Google Sheets
        await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requests: [
                        {
                            autoResizeDimensions: {
                                dimensions: {
                                    sheetId: 0,
                                    dimension: 'COLUMNS',
                                    startIndex: 0,
                                    endIndex: 7
                                }
                            }
                        }
                    ]
                }),
            }
        );

        res.json({ success: true });
    } catch (err: any) {
        console.error("Google Sheets Sync Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default app;

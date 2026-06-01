import express from 'express';
import cors from 'cors';
import sql from './db.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app = express()
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

function scoreUrl(raw) {
    let score = 0;
    const reasons = [];

    try {
        const url = new URL(raw.startsWith("http") ? raw : "http://" + raw);
        const hostname = url.hostname.toLowerCase();
        const fullUrl = raw.toLowerCase();
        const path = url.pathname + url.search;

        // 1️⃣ @ symbol (SEVERE)
        if (fullUrl.includes("@")) {
            score += 40;
            reasons.push("Uses '@' to hide real destination");
        }

        // 2️⃣ IP address instead of domain (SEVERE)
        if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
            score += 35;
            reasons.push("Uses raw IP address instead of domain");
        }

        // 3️⃣ Extremely long URL (MODERATE)
        if (fullUrl.length > 100) {
            score += 15;
            reasons.push("Excessively long URL");
        }

        // 4️⃣ Phishing bait keywords (HIGH)
        const phishingWords = [
            "login", "verify", "secure", "account", "update", "bank",
            "wallet", "confirm", "reset", "ebay", "paypal", "crypto"
        ];
        phishingWords.forEach(word => {
            if (path.includes(word)) {
                score += 15;
                reasons.push(`Suspicious keyword in URL path: ${word}`);
            }
        });

        // 5️⃣ Fake brand in subdomain trick (SEVERE)
        const brands = ["google", "facebook", "paypal", "amazon", "apple", "microsoft"];
        brands.forEach(brand => {
            if (hostname.includes(brand) && !hostname.endsWith(`${brand}.com`)) {
                score += 30;
                reasons.push(`Brand impersonation detected: ${brand}`);
            }
        });

        // 6️⃣ Too many subdomains (MODERATE)
        if (hostname.split(".").length >= 5) {
            score += 10;
            reasons.push("Too many subdomains (obfuscation technique)");
        }

        // 7️⃣ Hyphen abuse in domain (LOW-MODERATE)
        const hyphenCount = (hostname.match(/-/g) || []).length;
        if (hyphenCount >= 2) {
            score += 10;
            reasons.push("Multiple hyphens in domain");
        }

        // 8️⃣ Dangerous TLDs (MODERATE)
        const riskyTlds = ["tk", "ml", "ga", "cf", "gq"];
        const tld = hostname.split(".").pop();
        if (riskyTlds.includes(tld)) {
            score += 20;
            reasons.push("High-abuse top-level domain");
        }

        // 9️⃣ No HTTPS (LOW-MODERATE)
        if (url.protocol !== "https:") {
            score += 10;
            reasons.push("No HTTPS encryption");
        }

        // 🔟 Encoded URL (HIGH)
        if (/%[0-9a-f]{2}/i.test(fullUrl)) {
            score += 15;
            reasons.push("URL is obfuscated with encoding");
        }

        // ✅ Final normalization
        if (score > 100) score = 100;

        let verdict = "legit";
        let riskLevel = "low";

        if (score >= 70) {
            verdict = "phishing";
            riskLevel = "high";
        } else if (score >= 40) {
            verdict = "suspicious";
            riskLevel = "medium";
        }

        return {
            input: raw,
            score,
            verdict,
            riskLevel,
            reasons,
            confidence: `${score}%`
        };

    } catch (err) {
        return {
            input: raw,
            score: 0,
            verdict: "invalid",
            riskLevel: "unknown",
            reasons: ["Invalid or broken URL"]
        };
    }
}

app.get("/", (req, res) => {
    res.send("hello from backend!");
})
app.get("/api/auth", (req, res) => {
    try {
        console.log("auth called")
        const token = req.cookies.token; // HttpOnly cookie
        if (!token) {
            return res.status(200).json({ loggedIn: false });
        }

        const decoded = jwt.verify(token, "12345");

        return res.status(200).json({
            loggedIn: true,
            user: decoded // email, id, etc
        });

    } catch (err) {
        return res.status(200).json({ loggedIn: false });
    }
});

app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ error: "All fields required" });

    try {
        const userExists = await sql.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );
        console.log("there bro:", userExists)
        if (userExists?.length > 0) {
            return res.status(200).json({ message: "Email already exists" });
        }
        else {
            const hashed = await bcrypt.hash(password, 10);

            await sql.query(
                "INSERT INTO users(name, email, password) VALUES ($1, $2, $3)",
                [name, email, hashed]
            );

            res.status(200).json({ message: "User created successfully" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,   // true in production
        sameSite: "lax", // "none" in production
    });

    return res.json({ message: "Logged out successfully" });
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(200).json({ error: "All fields required" });

    try {
        const user = await sql.query("SELECT * FROM users WHERE email=$1", [email]);

        if (user.length === 0) {
            return res.status(200).json({ login: false, message: "Invalid credentials" });
        }
        const validPass = await bcrypt.compare(
            password,
            user[0].password
        );

        if (!validPass)
            return res.status(200).json({ login: false, message: "Invalid credentials" });

        // Create JWT
        const token = jwt.sign(
            { id: user[0].id, name: user[0].name, email: user[0].email },
            "12345",
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,    // set TRUE in production
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ login: true, message: "Login successful" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/api/check', async (req, res) => {
    try {
        const { url } = req.body || {};
        const token = await req.cookies.token; // ✅ get token from cookie
        console.log("token", token)
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decoded = jwt.verify(token, "12345"); // same secret as login
        const email = decoded.email;
        const response = await fetch("http://127.0.0.1:8000/predict?url=" + url, {
            method: "POST"
        });

        const data = await response.json();
        // ✅ Send result back to frontend
        console.log(data)
        await sql.query(
            "INSERT INTO allurls (email, url, status) VALUES ($1, $2, $3)",
            [email, url, !data.is_phishing ? 'Legitimate' : 'suspicious']
        );
        res.json(data);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/api/checkextension', async (req, res) => {
    try {
        const { url } = req.body || {};
        if (!url) return res.status(400).json({ error: 'Missing url in body' });


        // ✅ Run phishing detection
        const response = await fetch("http://127.0.0.1:8000/predict?url=" + url, {
            method: "POST"
        });

        const data = await response.json();

        const email = 'example@project.com'
        // ✅ Save to database
        await sql.query(
            "INSERT INTO allurls (email, url, status) VALUES ($1, $2, $3)",
            [email, url, !data.is_phishing ? 'Legitimate' : 'suspicious']
        );
        // ✅ Send result back to frontend
        console.log(data)
        res.json(data);

    } catch (err) {
        res.status(500).json({ error: "Server error :", err });
    }
});
app.get("/api/history", async (req, res) => {
    try {
        const token = await req.cookies.token; // ✅ get token from cookie
        console.log("token", token)
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decoded = jwt.verify(token, "12345"); // same secret as login
        const email = decoded.email;

        const rows = await sql.query(
            "SELECT * FROM allurls WHERE email=$1 ORDER BY time DESC",
            [email]
        );

        res.json(rows);

    } catch (err) {
        console.error(err);
        res.status(401).json({ error: "Invalid token" });
    }
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, '::', () => console.log(`PhishShield API listening on ${PORT}`));
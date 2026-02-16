// Simple in-memory rate limiter (resets on cold start, good enough for free tier)
const rateMap = new Map();
const RATE_LIMIT = 10;       // max emails per window per IP
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (!entry || now - entry.start > RATE_WINDOW_MS) {
        rateMap.set(ip, { start: now, count: 1 });
        return true;
    }
    if (entry.count >= RATE_LIMIT) return false;
    entry.count++;
    return true;
}

function alertHTML({ symbol, price, drop_percent, threshold, observation_months }) {
    return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <h2 style="color:#d32f2f;margin:0 0 16px;">&#x1F6A8; Drawdown Alert: ${symbol}</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <tr><td style="padding:8px 0;color:#666;">Current Price</td><td style="padding:8px 0;font-weight:bold;">$${price}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Drop from High</td><td style="padding:8px 0;font-weight:bold;color:#d32f2f;">${drop_percent}%</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Threshold</td><td style="padding:8px 0;">${threshold}%</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Lookback Window</td><td style="padding:8px 0;">${observation_months} months</td></tr>
        </table>
        <p style="font-size:13px;color:#999;margin-top:24px;">Sent by <a href="https://sdmr-liard-zeta.vercel.app" style="color:#999;">Tactical Drawdown Strategy Lab</a></p>
    </div>`;
}

function welcomeHTML({ observation_months, threshold }) {
    return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
        <h2 style="color:#2e7d32;margin:0 0 16px;">&#x2705; Alert Settings Saved</h2>
        <p>Your drawdown monitor is now active. You'll receive an email when any tracked stock drops beyond your threshold.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px 0;color:#666;">Lookback Window</td><td style="padding:8px 0;font-weight:bold;">${observation_months} months</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Drop Threshold</td><td style="padding:8px 0;font-weight:bold;">${threshold}%</td></tr>
        </table>
        <p style="font-size:13px;color:#999;margin-top:24px;">Sent by <a href="https://sdmr-liard-zeta.vercel.app" style="color:#999;">Tactical Drawdown Strategy Lab</a></p>
    </div>`;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Email service not configured' });
    }

    // Rate limit by IP
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
    if (!checkRateLimit(ip)) {
        return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }

    const { type, to_email, symbol, price, drop_percent, threshold, observation_months } = req.body || {};

    // Validate required fields
    if (!type || !to_email) {
        return res.status(400).json({ error: 'Missing required fields: type, to_email' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to_email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }
    if (!['alert', 'welcome'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type. Must be "alert" or "welcome".' });
    }
    if (type === 'alert' && (!symbol || !price || !drop_percent)) {
        return res.status(400).json({ error: 'Alert type requires: symbol, price, drop_percent' });
    }

    // Build email content
    const subject = type === 'alert'
        ? `🚨 ${symbol} dropped ${drop_percent}% — Drawdown Alert`
        : '✅ Drawdown Alert Settings Saved';

    const html = type === 'alert'
        ? alertHTML({ symbol, price, drop_percent, threshold, observation_months })
        : welcomeHTML({ observation_months: observation_months || '6', threshold: threshold || '20' });

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Strategy Lab <onboarding@resend.dev>',
                to: [to_email],
                subject,
                html
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend API error:', data);
            return res.status(response.status).json({ error: data.message || 'Failed to send email' });
        }

        return res.status(200).json({ success: true, id: data.id });
    } catch (e) {
        console.error('Email send failed:', e);
        return res.status(502).json({ error: 'Failed to send email' });
    }
}

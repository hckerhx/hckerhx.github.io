export default async function handler(req, res) {
    const { symbol, range = '1y', interval = '1d' } = req.query;

    if (!symbol || !/^[A-Z]{1,5}(\.[A-Z])?$|^\d{1,5}\.HK$/.test(symbol)) {
        return res.status(400).json({ error: 'Invalid symbol' });
    }

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`;

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await response.json();
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(response.status).json(data);
    } catch (e) {
        return res.status(502).json({ error: 'Failed to fetch from Yahoo Finance' });
    }
}

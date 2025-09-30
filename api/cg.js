// /api/cg.js  – Binance 全局多空比（2025-09 實測可用）
export default async function handler(req, res) {
  const sym  = (req.query.s || 'BTCUSDT').toUpperCase();

  const [frRes, lsrRes] = await Promise.all([
    fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${sym}`),
    fetch(`https://fapi.binance.com/fapi/v1/globalLongShortAccountRatio?symbol=${sym}&period=1h&limit=1`)
  ]);

  const frData  = await frRes.json();
  const lsrData = await lsrRes.json();

  const fr  = parseFloat(frData.lastFundingRate) || 0;
  const lsr = parseFloat(lsrData[0]?.longShortRatio) || 1;

  res.setHeader('Cache-Control', 's-maxage=60');
  res.json({ fr, lsr });
}

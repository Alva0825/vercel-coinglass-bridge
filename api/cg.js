// api/cg.js  – Binance 免费源
export default async function handler(req, res) {
  const sym  = (req.query.s || 'BTCUSDT').toUpperCase();   // Binance 用 BTCUSDT
  // 1. 资金费率
  const frRes = await fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${sym}`);
  const frData = await frRes.json();
  // 2. 多空比（Top 账户）
  const lsrRes = await fetch(`https://fapi.binance.com/fapi/v1/topLongShortAccountRatio?symbol=${sym}&period=1h&limit=1`);
  const lsrData = await lsrRes.json();

  const fr  = parseFloat(frData.lastFundingRate) || 0;
  const lsr = parseFloat(lsrData[0]?.longShortRatio) || 1;

  res.setHeader('Cache-Control', 's-maxage=60');
  res.json({ fr, lsr });
}

// api/cg.js
export default async function handler(req, res) {
  const CG = process.env.CG_API_KEY;
  const sym = (req.query.s || 'BTC').toUpperCase();
  const exch = (req.query.e || 'Binance').toLowerCase();

  const [frRes, lsrRes] = await Promise.all([
    fetch(`https://open-api-v4.coinglass.com/api/futures/funding-rate/exchange-list`, {
      headers: { 'CG-API-KEY': CG }
    }),
    fetch(`https://open-api-v4.coinglass.com/api/futures/global-long-short-account-ratio/history?symbol=${sym}&interval=1h&limit=1`, {
      headers: { 'CG-API-KEY': CG }
    })
  ]);

  const frData  = await frRes.json();
  const lsrData = await lsrRes.json();

  const item = frData.data?.find(i => i.symbol === sym);
  const fr   = item?.stablecoin_margin_list?.find(j => j.exchange.toLowerCase() === exch)?.funding_rate || 0;
  const lsr  = lsrData.data?.[0]?.global_account_long_short_ratio || 1;

  res.setHeader('Cache-Control', 's-maxage=20');
  res.json({ fr: Number(fr), lsr: Number(lsr) });
}

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ─── Currency Data ────────────────────────────────────────────────────────────

const CURRENCIES = [
  // ── Americas ──────────────────────────────────────────────────────────────
  { code: 'USD', name: 'US Dollar',                   flag: '🇺🇸' },
  { code: 'CAD', name: 'Canadian Dollar',             flag: '🇨🇦' },
  { code: 'MXN', name: 'Mexican Peso',                flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real',              flag: '🇧🇷' },
  { code: 'ARS', name: 'Argentine Peso',              flag: '🇦🇷' },
  { code: 'CLP', name: 'Chilean Peso',                flag: '🇨🇱' },
  { code: 'COP', name: 'Colombian Peso',              flag: '🇨🇴' },
  { code: 'PEN', name: 'Peruvian Sol',                flag: '🇵🇪' },
  { code: 'UYU', name: 'Uruguayan Peso',              flag: '🇺🇾' },
  { code: 'BOB', name: 'Bolivian Boliviano',          flag: '🇧🇴' },
  { code: 'PYG', name: 'Paraguayan Guaraní',          flag: '🇵🇾' },
  { code: 'VES', name: 'Venezuelan Bolívar',          flag: '🇻🇪' },
  { code: 'GYD', name: 'Guyanese Dollar',             flag: '🇬🇾' },
  { code: 'SRD', name: 'Surinamese Dollar',           flag: '🇸🇷' },
  { code: 'GTQ', name: 'Guatemalan Quetzal',          flag: '🇬🇹' },
  { code: 'CRC', name: 'Costa Rican Colón',           flag: '🇨🇷' },
  { code: 'HNL', name: 'Honduran Lempira',            flag: '🇭🇳' },
  { code: 'NIO', name: 'Nicaraguan Córdoba',          flag: '🇳🇮' },
  { code: 'PAB', name: 'Panamanian Balboa',           flag: '🇵🇦' },
  { code: 'DOP', name: 'Dominican Peso',              flag: '🇩🇴' },
  { code: 'CUP', name: 'Cuban Peso',                  flag: '🇨🇺' },
  { code: 'JMD', name: 'Jamaican Dollar',             flag: '🇯🇲' },
  { code: 'TTD', name: 'Trinidad & Tobago Dollar',    flag: '🇹🇹' },
  { code: 'BBD', name: 'Barbadian Dollar',            flag: '🇧🇧' },
  { code: 'BSD', name: 'Bahamian Dollar',             flag: '🇧🇸' },
  { code: 'BZD', name: 'Belize Dollar',               flag: '🇧🇿' },
  { code: 'HTG', name: 'Haitian Gourde',              flag: '🇭🇹' },
  { code: 'AWG', name: 'Aruban Florin',               flag: '🇦🇼' },
  { code: 'ANG', name: 'N. Antillean Guilder',        flag: '🇨🇼' },
  { code: 'XCD', name: 'East Caribbean Dollar',       flag: '🇦🇬' },
  { code: 'KYD', name: 'Cayman Islands Dollar',       flag: '🇰🇾' },
  { code: 'SVC', name: 'Salvadoran Colón',            flag: '🇸🇻' },
  // ── Europe ────────────────────────────────────────────────────────────────
  { code: 'EUR', name: 'Euro',                        flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound',               flag: '🇬🇧' },
  { code: 'CHF', name: 'Swiss Franc',                 flag: '🇨🇭' },
  { code: 'NOK', name: 'Norwegian Krone',             flag: '🇳🇴' },
  { code: 'SEK', name: 'Swedish Krona',               flag: '🇸🇪' },
  { code: 'DKK', name: 'Danish Krone',                flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty',                flag: '🇵🇱' },
  { code: 'CZK', name: 'Czech Koruna',                flag: '🇨🇿' },
  { code: 'HUF', name: 'Hungarian Forint',            flag: '🇭🇺' },
  { code: 'RON', name: 'Romanian Leu',                flag: '🇷🇴' },
  { code: 'BGN', name: 'Bulgarian Lev',               flag: '🇧🇬' },
  { code: 'HRK', name: 'Croatian Kuna',               flag: '🇭🇷' },
  { code: 'RSD', name: 'Serbian Dinar',               flag: '🇷🇸' },
  { code: 'ISK', name: 'Icelandic Króna',             flag: '🇮🇸' },
  { code: 'UAH', name: 'Ukrainian Hryvnia',           flag: '🇺🇦' },
  { code: 'RUB', name: 'Russian Ruble',               flag: '🇷🇺' },
  { code: 'BYN', name: 'Belarusian Ruble',            flag: '🇧🇾' },
  { code: 'GEL', name: 'Georgian Lari',               flag: '🇬🇪' },
  { code: 'AMD', name: 'Armenian Dram',               flag: '🇦🇲' },
  { code: 'AZN', name: 'Azerbaijani Manat',           flag: '🇦🇿' },
  { code: 'MDL', name: 'Moldovan Leu',                flag: '🇲🇩' },
  { code: 'MKD', name: 'Macedonian Denar',            flag: '🇲🇰' },
  { code: 'BAM', name: 'Bosnia-Herz. Mark',           flag: '🇧🇦' },
  { code: 'ALL', name: 'Albanian Lek',                flag: '🇦🇱' },
  { code: 'TRY', name: 'Turkish Lira',               flag: '🇹🇷' },
  { code: 'GIP', name: 'Gibraltar Pound',             flag: '🇬🇮' },
  // ── Middle East ───────────────────────────────────────────────────────────
  { code: 'AED', name: 'UAE Dirham',                  flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal',                 flag: '🇸🇦' },
  { code: 'QAR', name: 'Qatari Riyal',                flag: '🇶🇦' },
  { code: 'KWD', name: 'Kuwaiti Dinar',               flag: '🇰🇼' },
  { code: 'BHD', name: 'Bahraini Dinar',              flag: '🇧🇭' },
  { code: 'OMR', name: 'Omani Rial',                  flag: '🇴🇲' },
  { code: 'JOD', name: 'Jordanian Dinar',             flag: '🇯🇴' },
  { code: 'ILS', name: 'Israeli New Shekel',          flag: '🇮🇱' },
  { code: 'LBP', name: 'Lebanese Pound',              flag: '🇱🇧' },
  { code: 'IQD', name: 'Iraqi Dinar',                 flag: '🇮🇶' },
  { code: 'IRR', name: 'Iranian Rial',                flag: '🇮🇷' },
  { code: 'YER', name: 'Yemeni Rial',                 flag: '🇾🇪' },
  { code: 'SYP', name: 'Syrian Pound',                flag: '🇸🇾' },
  // ── Asia-Pacific ──────────────────────────────────────────────────────────
  { code: 'JPY', name: 'Japanese Yen',                flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan',                flag: '🇨🇳' },
  { code: 'HKD', name: 'Hong Kong Dollar',            flag: '🇭🇰' },
  { code: 'TWD', name: 'New Taiwan Dollar',           flag: '🇹🇼' },
  { code: 'KRW', name: 'South Korean Won',            flag: '🇰🇷' },
  { code: 'SGD', name: 'Singapore Dollar',            flag: '🇸🇬' },
  { code: 'AUD', name: 'Australian Dollar',           flag: '🇦🇺' },
  { code: 'NZD', name: 'New Zealand Dollar',          flag: '🇳🇿' },
  { code: 'INR', name: 'Indian Rupee',                flag: '🇮🇳' },
  { code: 'PKR', name: 'Pakistani Rupee',             flag: '🇵🇰' },
  { code: 'BDT', name: 'Bangladeshi Taka',            flag: '🇧🇩' },
  { code: 'LKR', name: 'Sri Lankan Rupee',            flag: '🇱🇰' },
  { code: 'NPR', name: 'Nepalese Rupee',              flag: '🇳🇵' },
  { code: 'MYR', name: 'Malaysian Ringgit',           flag: '🇲🇾' },
  { code: 'IDR', name: 'Indonesian Rupiah',           flag: '🇮🇩' },
  { code: 'THB', name: 'Thai Baht',                   flag: '🇹🇭' },
  { code: 'PHP', name: 'Philippine Peso',             flag: '🇵🇭' },
  { code: 'VND', name: 'Vietnamese Dong',             flag: '🇻🇳' },
  { code: 'MMK', name: 'Myanmar Kyat',                flag: '🇲🇲' },
  { code: 'KHR', name: 'Cambodian Riel',              flag: '🇰🇭' },
  { code: 'LAK', name: 'Laotian Kip',                 flag: '🇱🇦' },
  { code: 'MNT', name: 'Mongolian Tögrög',            flag: '🇲🇳' },
  { code: 'KZT', name: 'Kazakhstani Tenge',           flag: '🇰🇿' },
  { code: 'UZS', name: 'Uzbekistani Som',             flag: '🇺🇿' },
  { code: 'KGS', name: 'Kyrgyz Som',                  flag: '🇰🇬' },
  { code: 'TJS', name: 'Tajikistani Somoni',          flag: '🇹🇯' },
  { code: 'TMT', name: 'Turkmenistani Manat',         flag: '🇹🇲' },
  { code: 'AFN', name: 'Afghan Afghani',              flag: '🇦🇫' },
  { code: 'BND', name: 'Brunei Dollar',               flag: '🇧🇳' },
  { code: 'MOP', name: 'Macanese Pataca',             flag: '🇲🇴' },
  { code: 'BTN', name: 'Bhutanese Ngultrum',          flag: '🇧🇹' },
  { code: 'MVR', name: 'Maldivian Rufiyaa',           flag: '🇲🇻' },
  { code: 'FJD', name: 'Fijian Dollar',               flag: '🇫🇯' },
  { code: 'PGK', name: 'Papua New Guinean Kina',      flag: '🇵🇬' },
  { code: 'SBD', name: 'Solomon Islands Dollar',      flag: '🇸🇧' },
  { code: 'VUV', name: 'Vanuatu Vatu',                flag: '🇻🇺' },
  { code: 'WST', name: 'Samoan Tala',                 flag: '🇼🇸' },
  { code: 'TOP', name: "Tongan Paʻanga",              flag: '🇹🇴' },
  // ── Africa ────────────────────────────────────────────────────────────────
  { code: 'ZAR', name: 'South African Rand',          flag: '🇿🇦' },
  { code: 'NGN', name: 'Nigerian Naira',              flag: '🇳🇬' },
  { code: 'EGP', name: 'Egyptian Pound',              flag: '🇪🇬' },
  { code: 'KES', name: 'Kenyan Shilling',             flag: '🇰🇪' },
  { code: 'GHS', name: 'Ghanaian Cedi',               flag: '🇬🇭' },
  { code: 'TZS', name: 'Tanzanian Shilling',          flag: '🇹🇿' },
  { code: 'UGX', name: 'Ugandan Shilling',            flag: '🇺🇬' },
  { code: 'ETB', name: 'Ethiopian Birr',              flag: '🇪🇹' },
  { code: 'DZD', name: 'Algerian Dinar',              flag: '🇩🇿' },
  { code: 'MAD', name: 'Moroccan Dirham',             flag: '🇲🇦' },
  { code: 'TND', name: 'Tunisian Dinar',              flag: '🇹🇳' },
  { code: 'LYD', name: 'Libyan Dinar',                flag: '🇱🇾' },
  { code: 'XOF', name: 'West African CFA Franc',      flag: '🇨🇮' },
  { code: 'XAF', name: 'Central African CFA Franc',   flag: '🇨🇲' },
  { code: 'XPF', name: 'CFP Franc',                   flag: '🇵🇫' },
  { code: 'AOA', name: 'Angolan Kwanza',              flag: '🇦🇴' },
  { code: 'MZN', name: 'Mozambican Metical',          flag: '🇲🇿' },
  { code: 'ZMW', name: 'Zambian Kwacha',              flag: '🇿🇲' },
  { code: 'BWP', name: 'Botswana Pula',               flag: '🇧🇼' },
  { code: 'MUR', name: 'Mauritian Rupee',             flag: '🇲🇺' },
  { code: 'RWF', name: 'Rwandan Franc',               flag: '🇷🇼' },
  { code: 'MWK', name: 'Malawian Kwacha',             flag: '🇲🇼' },
  { code: 'NAD', name: 'Namibian Dollar',             flag: '🇳🇦' },
  { code: 'MGA', name: 'Malagasy Ariary',             flag: '🇲🇬' },
  { code: 'SCR', name: 'Seychellois Rupee',           flag: '🇸🇨' },
  { code: 'SDG', name: 'Sudanese Pound',              flag: '🇸🇩' },
  { code: 'SOS', name: 'Somali Shilling',             flag: '🇸🇴' },
  { code: 'SLE', name: 'Sierra Leonean Leone',        flag: '🇸🇱' },
  { code: 'LRD', name: 'Liberian Dollar',             flag: '🇱🇷' },
  { code: 'GNF', name: 'Guinean Franc',               flag: '🇬🇳' },
  { code: 'GMD', name: 'Gambian Dalasi',              flag: '🇬🇲' },
  { code: 'CVE', name: 'Cape Verdean Escudo',         flag: '🇨🇻' },
  { code: 'DJF', name: 'Djiboutian Franc',            flag: '🇩🇯' },
  { code: 'KMF', name: 'Comorian Franc',              flag: '🇰🇲' },
  { code: 'STN', name: 'São Tomé & Príncipe Dobra',   flag: '🇸🇹' },
  { code: 'CDF', name: 'Congolese Franc',             flag: '🇨🇩' },
  { code: 'BIF', name: 'Burundian Franc',             flag: '🇧🇮' },
  { code: 'ERN', name: 'Eritrean Nakfa',              flag: '🇪🇷' },
  { code: 'LSL', name: 'Lesotho Loti',                flag: '🇱🇸' },
  { code: 'SZL', name: 'Swazi Lilangeni',             flag: '🇸🇿' },
  { code: 'MRU', name: 'Mauritanian Ouguiya',         flag: '🇲🇷' },
  { code: 'ZWL', name: 'Zimbabwean Dollar',           flag: '🇿🇼' },
  // ── Territories / Islands ─────────────────────────────────────────────────
  { code: 'SHP', name: 'Saint Helena Pound',          flag: '🇸🇭' },
  { code: 'FKP', name: 'Falkland Islands Pound',      flag: '🇫🇰' },
  { code: 'BMD', name: 'Bermudian Dollar',            flag: '🇧🇲' },
];

const CURRENCY_MAP = Object.fromEntries(CURRENCIES.map(c => [c.code, c]));

// ─── Crypto Data ──────────────────────────────────────────────────────────────

const CRYPTOS = [
  { id: 'bitcoin',                   symbol: 'BTC',   name: 'Bitcoin'           },
  { id: 'ethereum',                  symbol: 'ETH',   name: 'Ethereum'          },
  { id: 'tether',                    symbol: 'USDT',  name: 'Tether'            },
  { id: 'binancecoin',               symbol: 'BNB',   name: 'BNB'               },
  { id: 'solana',                    symbol: 'SOL',   name: 'Solana'            },
  { id: 'ripple',                    symbol: 'XRP',   name: 'XRP'               },
  { id: 'usd-coin',                  symbol: 'USDC',  name: 'USD Coin'          },
  { id: 'cardano',                   symbol: 'ADA',   name: 'Cardano'           },
  { id: 'avalanche-2',               symbol: 'AVAX',  name: 'Avalanche'         },
  { id: 'dogecoin',                  symbol: 'DOGE',  name: 'Dogecoin'          },
  { id: 'polkadot',                  symbol: 'DOT',   name: 'Polkadot'          },
  { id: 'matic-network',             symbol: 'MATIC', name: 'Polygon'           },
  { id: 'shiba-inu',                 symbol: 'SHIB',  name: 'Shiba Inu'         },
  { id: 'litecoin',                  symbol: 'LTC',   name: 'Litecoin'          },
  { id: 'chainlink',                 symbol: 'LINK',  name: 'Chainlink'         },
  { id: 'uniswap',                   symbol: 'UNI',   name: 'Uniswap'           },
  { id: 'stellar',                   symbol: 'XLM',   name: 'Stellar'           },
  { id: 'monero',                    symbol: 'XMR',   name: 'Monero'            },
  { id: 'ethereum-classic',          symbol: 'ETC',   name: 'Ethereum Classic'  },
  { id: 'cosmos',                    symbol: 'ATOM',  name: 'Cosmos'            },
  { id: 'near',                      symbol: 'NEAR',  name: 'NEAR Protocol'     },
  { id: 'tron',                      symbol: 'TRX',   name: 'TRON'              },
  { id: 'aave',                      symbol: 'AAVE',  name: 'Aave'              },
  { id: 'algorand',                  symbol: 'ALGO',  name: 'Algorand'          },
  { id: 'the-graph',                 symbol: 'GRT',   name: 'The Graph'         },
  { id: 'maker',                     symbol: 'MKR',   name: 'Maker'             },
  { id: 'internet-computer',         symbol: 'ICP',   name: 'Internet Computer' },
  { id: 'bitcoin-cash',              symbol: 'BCH',   name: 'Bitcoin Cash'      },
  { id: 'filecoin',                  symbol: 'FIL',   name: 'Filecoin'          },
  { id: 'vechain',                   symbol: 'VET',   name: 'VeChain'           },
  { id: 'hedera-hashgraph',          symbol: 'HBAR',  name: 'Hedera'            },
  { id: 'fantom',                    symbol: 'FTM',   name: 'Fantom'            },
  { id: 'theta-token',               symbol: 'THETA', name: 'Theta Network'     },
  { id: 'injective-protocol',        symbol: 'INJ',   name: 'Injective'         },
  { id: 'arbitrum',                  symbol: 'ARB',   name: 'Arbitrum'          },
  { id: 'optimism',                  symbol: 'OP',    name: 'Optimism'          },
  { id: 'sui',                       symbol: 'SUI',   name: 'Sui'               },
  { id: 'aptos',                     symbol: 'APT',   name: 'Aptos'             },
  { id: 'cronos',                    symbol: 'CRO',   name: 'Cronos'            },
  { id: 'quant-network',             symbol: 'QNT',   name: 'Quant'             },
  { id: 'flow',                      symbol: 'FLOW',  name: 'Flow'              },
  { id: 'sandbox',                   symbol: 'SAND',  name: 'The Sandbox'       },
  { id: 'decentraland',              symbol: 'MANA',  name: 'Decentraland'      },
  { id: 'axie-infinity',             symbol: 'AXS',   name: 'Axie Infinity'     },
  { id: 'eos',                       symbol: 'EOS',   name: 'EOS'               },
  { id: 'dash',                      symbol: 'DASH',  name: 'Dash'              },
  { id: 'zcash',                     symbol: 'ZEC',   name: 'Zcash'             },
  { id: 'chiliz',                    symbol: 'CHZ',   name: 'Chiliz'            },
  { id: 'compound-governance-token', symbol: 'COMP',  name: 'Compound'          },
  { id: 'apecoin',                   symbol: 'APE',   name: 'ApeCoin'           },
];

const CRYPTO_MAP = Object.fromEntries(CRYPTOS.map(c => [c.id, c]));

// ─── API helpers (Frankfurter → CDN fallback) ────────────────────────────────

const FRANKFURTER_HOSTS = [
  'https://api.frankfurter.app',
  'https://api.frankfurter.dev',
];
const CDN_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api';

async function timedFetch(url, ms = 6000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/** Returns { rate, date } or throws */
async function getLatestRate(from, to) {
  // 1 + 2: try both Frankfurter hosts
  for (const host of FRANKFURTER_HOSTS) {
    try {
      const res = await timedFetch(`${host}/latest?from=${from}&to=${to}`);
      if (res.ok) {
        const data = await res.json();
        return { rate: data.rates[to], date: data.date };
      }
    } catch { /* try next */ }
  }
  // 3: CDN fallback
  const res = await timedFetch(
    `${CDN_BASE}@latest/v1/currencies/${from.toLowerCase()}.min.json`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const rate = data[from.toLowerCase()]?.[to.toLowerCase()];
  if (rate == null) throw new Error('Rate not available');
  return { rate, date: data.date };
}

/** Returns Array<{date,rate}> or throws */
async function getHistoricalRates(from, to) {
  // 1 + 2: try both Frankfurter hosts
  const { start, end } = getDateRange(30);
  for (const host of FRANKFURTER_HOSTS) {
    try {
      const res = await timedFetch(
        `${host}/${start}..${end}?from=${from}&to=${to}`
      );
      if (res.ok) {
        const data = await res.json();
        return Object.entries(data.rates).map(([date, rates]) => ({
          date,
          rate: rates[to],
        }));
      }
    } catch { /* try next */ }
  }
  // 3: CDN fallback — sample every 3rd day (~10 points)
  const dates = [];
  for (let i = 29; i >= 0; i -= 3) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  const results = await Promise.all(
    dates.map(date =>
      timedFetch(`${CDN_BASE}@${date}/v1/currencies/${from.toLowerCase()}.min.json`)
        .then(r => (r.ok ? r.json() : null))
        .catch(() => null)
    )
  );
  const points = results
    .filter(Boolean)
    .map(data => ({
      date: data.date,
      rate: data[from.toLowerCase()]?.[to.toLowerCase()] ?? null,
    }))
    .filter(p => p.rate != null);
  if (!points.length) throw new Error('No historical data available');
  return points;
}

/** Returns { rate, date } for a specific date, trying Frankfurter then CDN */
async function getRateAtDate(from, to, date) {
  for (const host of FRANKFURTER_HOSTS) {
    try {
      const res = await timedFetch(`${host}/${date}?from=${from}&to=${to}`);
      if (res.ok) {
        const data = await res.json();
        return { rate: data.rates[to], date: data.date };
      }
    } catch { /* try next */ }
  }
  // CDN fallback
  const res = await timedFetch(
    `${CDN_BASE}@${date}/v1/currencies/${from.toLowerCase()}.min.json`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const r = data[from.toLowerCase()]?.[to.toLowerCase()];
  if (r == null) throw new Error('Rate not available for this date');
  return { rate: r, date: data.date ?? date };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns { [code]: rate, ... } for all targets in one request */
async function getMultiRates(from, targets) {
  const toParam = targets.join(',');
  // 1 + 2: Frankfurter can return all targets in a single call
  for (const host of FRANKFURTER_HOSTS) {
    try {
      const res = await timedFetch(`${host}/latest?from=${from}&to=${toParam}`);
      if (res.ok) {
        const data = await res.json();
        return data.rates;
      }
    } catch { /* try next */ }
  }
  // 3: CDN fallback — full base-currency object, pick targets
  const res = await timedFetch(
    `${CDN_BASE}@latest/v1/currencies/${from.toLowerCase()}.min.json`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const base = data[from.toLowerCase()] ?? {};
  const result = {};
  for (const t of targets) {
    const r = base[t.toLowerCase()];
    if (r != null) result[t] = r;
  }
  return result;
}

/** Returns { usd: number, eur: number, ... } for the given coin */
async function getCryptoRates(coinId, fiatCurrencies) {
  const vs = [...new Set(['usd', ...fiatCurrencies.map(c => c.toLowerCase())])].join(',');
  const res = await timedFetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${vs}`,
    10000
  );
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  const data = await res.json();
  return data[coinId] ?? {};
}

// ISO 4217 currencies with no minor unit (zero decimal places)
const ZERO_DECIMAL = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW',
  'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);

function formatAmount(value, code) {
  if (value == null || isNaN(value)) return '—';
  const maxFraction = ZERO_DECIMAL.has(code) ? 0 : 4;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: Math.min(2, maxFraction),
    maximumFractionDigits: maxFraction,
  }).format(value);
}

function getDateRange(days = 30) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  const fmt = d => d.toISOString().slice(0, 10);
  return { start: fmt(start), end: fmt(end) };
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  });
  const set = useCallback(valOrFn => {
    setValue(prev => {
      const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [value, set];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// align='left'|'right' controls which edge the dropdown panel snaps to
function CurrencyDropdown({ value, onChange, label, darkMode, isFav, onToggleFav, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const filtered = useMemo(() =>
    CURRENCIES.filter(c =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = CURRENCY_MAP[value];

  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0" ref={ref}>
      <span className={`text-[10px] font-semibold uppercase tracking-widest
        ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        {label}
      </span>
      {/* Trigger row: dropdown button + star */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => { setOpen(o => !o); setSearch(''); }}
          className={`flex-1 min-w-0 flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left
            transition-all duration-150
            ${darkMode
              ? 'bg-slate-800 border-slate-700 hover:border-blue-500 text-white'
              : 'bg-white border-slate-200 hover:border-blue-400 text-slate-900 shadow-sm'
            }`}
        >
          <span className="text-2xl leading-none shrink-0">{selected?.flag}</span>
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`font-bold text-sm tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {selected?.code}
            </span>
            <span className={`text-xs truncate ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              {selected?.name}
            </span>
          </div>
          <svg className="w-3.5 h-3.5 shrink-0 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {onToggleFav && (
          <button
            type="button"
            onClick={onToggleFav}
            className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-base
              transition-colors
              ${isFav
                ? 'text-amber-400'
                : (darkMode ? 'text-slate-600 hover:text-amber-400' : 'text-slate-300 hover:text-amber-400')
              }`}
            aria-label={isFav ? `Remove ${value} from favourites` : `Save ${value}`}
          >
            {isFav ? '★' : '☆'}
          </button>
        )}
      </div>

      {/* Dropdown panel */}
      {open && (
        <div
          className={`absolute z-50 mt-1 rounded-xl border overflow-hidden animate-slideDown
            ${darkMode
              ? 'bg-slate-800 border-slate-700 shadow-2xl shadow-black/40'
              : 'bg-white border-slate-200 shadow-2xl shadow-slate-200/80'
            }`}
          style={{
            top: '100%',
            [align === 'right' ? 'right' : 'left']: 0,
            width: 'min(16rem, calc(100vw - 1rem))',
          }}
        >
          <div className={`px-2.5 pt-2.5 pb-1.5 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
            <input
              autoFocus
              type="text"
              placeholder="Search currency…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full px-2.5 py-1.5 text-sm rounded-lg outline-none
                ${darkMode
                  ? 'bg-slate-700 text-white placeholder-slate-500 focus:bg-slate-600'
                  : 'bg-slate-50 text-slate-900 placeholder-slate-400 focus:bg-white'}`}
            />
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filtered.map(c => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { onChange(c.code); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors
                    ${c.code === value
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                      : (darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-50 text-slate-700')
                    }`}
                >
                  <span className="text-base leading-none shrink-0">{c.flag}</span>
                  <span className="font-semibold shrink-0">{c.code}</span>
                  <span className={`text-xs truncate
                    ${c.code === value ? 'opacity-70' : (darkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                    {c.name}
                  </span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className={`px-3 py-5 text-center text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                No currencies found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function ChartSkeleton({ darkMode }) {
  return (
    <div className={`h-20 rounded-xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />
  );
}

function CustomTooltip({ active, payload, darkMode }) {
  if (!active || !payload?.length) return null;
  const { date, rate } = payload[0].payload;
  return (
    <div className={`px-3 py-2 rounded-lg text-xs shadow-xl border
      ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
      <div className={`text-[10px] font-semibold uppercase tracking-widest mb-0.5
        ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{date}</div>
      <div className="font-bold text-sm">{rate}</div>
    </div>
  );
}

function formatCryptoPrice(value) {
  if (value == null || isNaN(value)) return '—';
  if (value === 0) return '0.00';
  const abs = Math.abs(value);
  let opts;
  if (abs >= 10000)      opts = { minimumFractionDigits: 0, maximumFractionDigits: 2 };
  else if (abs >= 1000)  opts = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  else if (abs >= 1)     opts = { minimumFractionDigits: 2, maximumFractionDigits: 4 };
  else if (abs >= 0.001) opts = { minimumFractionDigits: 4, maximumFractionDigits: 6 };
  else                   opts = { minimumFractionDigits: 2, maximumFractionDigits: 10 };
  return new Intl.NumberFormat('en-US', opts).format(value);
}

function CryptoDropdown({ value, onChange, darkMode }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  const filtered = useMemo(() =>
    CRYPTOS.filter(c =>
      c.symbol.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const selected = CRYPTO_MAP[value];

  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0 relative" ref={ref}>
      <span className={`text-xs font-medium uppercase tracking-wider
        ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Coin</span>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch(''); }}
        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left transition-colors
          ${darkMode
            ? 'bg-slate-800 border-slate-700 hover:border-slate-500 text-white'
            : 'bg-white border-slate-200 hover:border-slate-400 text-slate-900'
          }`}
      >
        <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded-md
          ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
          {selected?.symbol}
        </span>
        <span className={`flex-1 text-sm truncate ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          {selected?.name}
        </span>
        <svg className="w-3.5 h-3.5 shrink-0 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute z-50 rounded-xl shadow-xl border overflow-hidden
            ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
          style={{ top: '100%', left: 0, width: 'min(18rem, calc(100vw - 1rem))' }}
        >
          <div className={`px-2 pt-2 pb-1 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
            <input
              autoFocus
              type="text"
              placeholder="Search coin…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full px-2 py-1.5 text-sm rounded-lg outline-none
                ${darkMode ? 'bg-slate-700 text-white placeholder-slate-400'
                           : 'bg-slate-50 text-slate-900 placeholder-slate-400'}`}
            />
          </div>
          <ul className="max-h-56 overflow-y-auto">
            {filtered.map(c => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => { onChange(c.id); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors
                    ${c.id === value
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700')
                      : (darkMode ? 'hover:bg-slate-700 text-slate-200' : 'hover:bg-slate-50 text-slate-800')
                    }`}
                >
                  <span className={`shrink-0 text-xs font-bold w-12 text-center px-1 py-0.5 rounded
                    ${c.id === value
                      ? (darkMode ? 'bg-white/20' : 'bg-blue-100')
                      : (darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600')
                    }`}>
                    {c.symbol}
                  </span>
                  <span className={`truncate text-xs ${c.id === value ? 'opacity-80' : (darkMode ? 'text-slate-400' : 'text-slate-500')}`}>
                    {c.name}
                  </span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className={`px-3 py-4 text-center text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                No coins found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CurrencyConverter() {
  const [darkMode, setDarkMode] = useLocalStorage('cc-dark', false);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [toCurrency, setToCurrency] = useState('EUR');
  const [rawAmount, setRawAmount] = useState('1');
  const [rate, setRate] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState(null);
  const [swapRotated, setSwapRotated] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);
  const [favCurrencies, setFavCurrencies] = useLocalStorage('cc-fav-currencies', []);

  // ── Multi-tab state ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('converter');
  const [multiBase, setMultiBase] = useLocalStorage('cc-multi-base', 'USD');
  const [multiRawAmount, setMultiRawAmount] = useState('1');
  const [multiRates, setMultiRates] = useState(null);
  const [multiLoading, setMultiLoading] = useState(false);
  const [multiError, setMultiError] = useState(null);

  // ── Crypto-tab state ─────────────────────────────────────────────────────────
  const [cryptoCoin, setCryptoCoin] = useLocalStorage('cc-crypto-coin', 'bitcoin');
  const [cryptoRawAmount, setCryptoRawAmount] = useState('1');
  const [cryptoRates, setCryptoRates] = useState(null);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [cryptoError, setCryptoError] = useState(null);

  const debouncedMultiAmount = useDebounce(multiRawAmount, 300);
  const multiAmount = parseFloat(debouncedMultiAmount) || 0;

  const debouncedAmount = useDebounce(rawAmount, 300);
  const amount = parseFloat(debouncedAmount) || 0;

  // ── Fetch latest rate ────────────────────────────────────────────────────────
  const fetchRate = useCallback(async () => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
      setRate(1);
      return;
    }
    setRateLoading(true);
    setRateError(null);
    try {
      const { rate: r } = await getLatestRate(fromCurrency, toCurrency);
      setRate(r);
      setUpdatedAt(new Date());
    } catch (err) {
      setRateError(err.message || 'Failed to fetch rate');
    } finally {
      setRateLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => { fetchRate(); }, [fetchRate]);

  // ── Fetch 30-day chart ───────────────────────────────────────────────────────
  const fetchChart = useCallback(async () => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
      setChartData([]);
      return;
    }
    setChartLoading(true);
    setChartError(null);
    try {
      const points = await getHistoricalRates(fromCurrency, toCurrency);
      setChartData(points);
    } catch (err) {
      setChartError(err.message || 'Failed to fetch chart');
    } finally {
      setChartLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => { fetchChart(); }, [fetchChart]);

  // ── Derived values ───────────────────────────────────────────────────────────
  const converted = rate != null ? amount * rate : null;

  const updatedLabel = useMemo(() => {
    if (!updatedAt) return '';
    const diff = Math.round((Date.now() - updatedAt.getTime()) / 1000);
    if (diff < 10) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    return `${Math.round(diff / 60)}m ago`;
  }, [updatedAt, rate]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Trend: compare current rate vs 30-day-ago first chart point ─────────────
  const trend = useMemo(() => {
    if (!chartData?.length || rate == null) return null;
    const first = chartData[0].rate;
    if (!first) return null;
    const pct = ((rate - first) / first) * 100;
    return { pct, up: pct >= 0 };
  }, [chartData, rate]);

  // ── Historical rate lookup ───────────────────────────────────────────────────
  const [histDate, setHistDate] = useState('');
  const [histRate, setHistRate] = useState(null);
  const [histActualDate, setHistActualDate] = useState(null);
  const [histLoading, setHistLoading] = useState(false);
  const [histError, setHistError] = useState(null);

  // Clear stale result when the currency pair changes
  useEffect(() => { setHistRate(null); setHistActualDate(null); setHistError(null); }, [fromCurrency, toCurrency]);

  const fetchHistRate = useCallback(async () => {
    if (!histDate) return;
    setHistLoading(true);
    setHistError(null);
    setHistRate(null);
    try {
      const { rate: r, date: d } = await getRateAtDate(fromCurrency, toCurrency, histDate);
      setHistRate(r);
      setHistActualDate(d);
    } catch (err) {
      setHistError(err.message || 'Rate not available for this date');
    } finally {
      setHistLoading(false);
    }
  }, [fromCurrency, toCurrency, histDate]);

  // ── Multi-tab fetch ──────────────────────────────────────────────────────────
  const fetchMultiRates = useCallback(async () => {
    const targets = favCurrencies.filter(t => t !== multiBase);
    if (!targets.length) return;
    setMultiLoading(true);
    setMultiError(null);
    try {
      const rates = await getMultiRates(multiBase, targets);
      setMultiRates(rates);
    } catch (err) {
      setMultiError(err.message || 'Failed to fetch rates');
    } finally {
      setMultiLoading(false);
    }
  }, [multiBase, favCurrencies]);

  useEffect(() => { if (activeTab === 'multi') fetchMultiRates(); }, [fetchMultiRates, activeTab]);

  // ── Crypto-tab fetch ─────────────────────────────────────────────────────────
  const fetchCryptoRates = useCallback(async () => {
    setCryptoLoading(true);
    setCryptoError(null);
    try {
      const rates = await getCryptoRates(cryptoCoin, favCurrencies);
      setCryptoRates(rates);
    } catch (err) {
      setCryptoError(err.message || 'Failed to fetch crypto rates');
    } finally {
      setCryptoLoading(false);
    }
  }, [cryptoCoin, favCurrencies]);

  useEffect(() => { if (activeTab === 'crypto') fetchCryptoRates(); }, [fetchCryptoRates, activeTab]);

  // ── Favourites helpers (single currencies) ──────────────────────────────────
  const toggleFavCurrency = code => {
    setFavCurrencies(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // ── Swap ─────────────────────────────────────────────────────────────────────
  const handleSwap = () => {
    setSwapRotated(r => !r);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // ── Chart domain lines ───────────────────────────────────────────────────────
  const chartMin = useMemo(() => {
    if (!chartData?.length) return 0;
    const min = Math.min(...chartData.map(d => d.rate));
    return min * 0.998;
  }, [chartData]);

  const chartMax = useMemo(() => {
    if (!chartData?.length) return 0;
    const max = Math.max(...chartData.map(d => d.rate));
    return max * 1.002;
  }, [chartData]);

  // ── PWA: capture install prompt ─────────────────────────────────────────────
  useEffect(() => {
    const handler = e => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const onUpdate = () => setShowUpdateToast(true);
    const onOffline = () => { setShowOfflineToast(true); setTimeout(() => setShowOfflineToast(false), 3500); };
    window.addEventListener('pwa-update-available', onUpdate);
    window.addEventListener('pwa-offline-ready', onOffline);
    return () => {
      window.removeEventListener('pwa-update-available', onUpdate);
      window.removeEventListener('pwa-offline-ready', onOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  const dm = darkMode;

  return (
    <div className={`min-h-screen w-full overflow-x-hidden flex items-start sm:items-center
      justify-center p-3 sm:p-6 transition-colors duration-300
      ${dm ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* ── Update toast ─────────────────────────────────────────────────────── */}
      {showUpdateToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3
          px-4 py-3 rounded-xl shadow-xl bg-blue-600 text-white text-sm font-medium
          animate-fadeIn max-w-xs w-full mx-4">
          <span className="flex-1">New version available</span>
          <button
            type="button"
            onClick={() => { window.__swUpdate?.(true); setShowUpdateToast(false); }}
            className="px-3 py-1 rounded-lg bg-white text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-colors"
          >
            Update
          </button>
          <button type="button" onClick={() => setShowUpdateToast(false)} className="opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* ── Offline-ready toast ───────────────────────────────────────────────── */}
      {showOfflineToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50
          px-4 py-3 rounded-xl shadow-xl bg-emerald-600 text-white text-sm font-medium
          animate-fadeIn max-w-xs w-full mx-4">
          ✓ Ready to work offline
        </div>
      )}

      <div className={`w-full max-w-md rounded-2xl overflow-hidden transition-colors duration-300
        ${dm ? 'bg-slate-900 shadow-2xl shadow-black/40' : 'bg-white shadow-xl shadow-slate-200/80 ring-1 ring-slate-100'}`}>

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className={`flex items-center justify-between px-5 py-4 border-b
          ${dm ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💱</span>
            <div>
              <span className={`font-bold text-sm tracking-tight ${dm ? 'text-white' : 'text-slate-900'}`}>
                Lumina Exchange
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {installPrompt && (
              <button
                type="button"
                onClick={handleInstall}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                  transition-colors border
                  ${dm
                    ? 'bg-blue-600 border-blue-500 hover:bg-blue-500 text-white'
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700'
                  }`}
                aria-label="Install app"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Install
              </button>
            )}
            <button
              type="button"
              onClick={() => setDarkMode(!dm)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                ${dm ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              aria-label="Toggle dark mode"
            >
              {dm ? '☀' : '🌙'}
            </button>
          </div>
        </div>

        {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
        <div className={`flex border-b ${dm ? 'border-slate-800' : 'border-slate-100'}`}>
          {[
            { id: 'converter', icon: '⇄', label: 'Converter' },
            { id: 'multi',     icon: '⊞', label: 'Multi' },
            { id: 'crypto',    icon: '₿',  label: 'Crypto' },
          ].map(({ id, icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold
                border-b-2 transition-all
                ${activeTab === id
                  ? (dm ? 'border-blue-400 text-blue-400' : 'border-blue-500 text-blue-600')
                  : (dm ? 'border-transparent text-slate-500 hover:text-slate-300' : 'border-transparent text-slate-400 hover:text-slate-600')
                }`}
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ════════════ CONVERTER TAB ════════════ */}
        {activeTab === 'converter' && (
        <div className="px-4 pt-3 pb-4 flex flex-col gap-3">

          {/* ── Amount Input ─────────────────────────────────────────────────── */}
          <div className={`px-4 py-3 rounded-lg border transition-all
            focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10
            ${dm ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <label className={`block text-[10px] font-semibold uppercase tracking-widest mb-1
              ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
              Amount
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={rawAmount}
              onChange={e => setRawAmount(e.target.value)}
              placeholder="1"
              className={`w-full bg-transparent text-3xl font-bold outline-none tracking-tight
                ${dm ? 'text-white placeholder-slate-600' : 'text-slate-900 placeholder-slate-300'}`}
            />
          </div>

          {/* ── Currency Selectors + Swap ────────────────────────────────────── */}
          <div className="flex items-end gap-2">
            <div className="relative flex-1 min-w-0">
              <CurrencyDropdown
                value={fromCurrency} onChange={setFromCurrency} label="From" darkMode={dm}
                align="left"
                isFav={favCurrencies.includes(fromCurrency)}
                onToggleFav={() => toggleFavCurrency(fromCurrency)}
              />
            </div>

            <button
              type="button"
              onClick={handleSwap}
              style={{ transform: `rotate(${swapRotated ? 180 : 0}deg)`, transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mb-0.5
                font-bold text-lg shadow-lg transition-colors
                ${dm ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              aria-label="Swap currencies"
            >
              ⇄
            </button>

            <div className="relative flex-1 min-w-0">
              <CurrencyDropdown
                value={toCurrency} onChange={setToCurrency} label="To" darkMode={dm}
                align="right"
                isFav={favCurrencies.includes(toCurrency)}
                onToggleFav={() => toggleFavCurrency(toCurrency)}
              />
            </div>
          </div>

          {/* ── Conversion Result ────────────────────────────────────────────── */}
          <div className={`rounded-lg px-5 py-4 border
            ${dm ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>

            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2
              ${dm ? 'text-slate-500' : 'text-slate-400'}`}>Result</p>

            {rateLoading ? (
              <div className="flex flex-col gap-2 py-1">
                <div className={`h-10 w-44 rounded-lg animate-pulse ${dm ? 'bg-slate-700' : 'bg-slate-100'}`} />
                <div className={`h-3.5 w-32 rounded animate-pulse ${dm ? 'bg-slate-700' : 'bg-slate-100'}`} />
              </div>
            ) : rateError ? (
              <div className="flex items-center gap-3">
                <p className="text-red-400 text-sm font-medium flex-1">⚠ {rateError}</p>
                <button
                  type="button"
                  onClick={fetchRate}
                  className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2 min-w-0 flex-wrap">
                  <span className={`text-5xl font-extrabold tracking-tight ${dm ? 'text-white' : 'text-slate-900'}`}>
                    {formatAmount(converted, toCurrency)}
                  </span>
                  <span className={`text-xl font-semibold shrink-0 ${dm ? 'text-slate-400' : 'text-slate-400'}`}>
                    {CURRENCY_MAP[toCurrency]?.code}
                  </span>
                  {trend && (
                    <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full
                      ${trend.up
                        ? (dm ? 'text-emerald-400 bg-emerald-950/60' : 'text-emerald-700 bg-emerald-50')
                        : (dm ? 'text-red-400 bg-red-950/60' : 'text-red-700 bg-red-50')
                      }`}>
                      {trend.up ? '↑' : '↓'} {trend.pct > 0 ? '+' : ''}{trend.pct.toFixed(2)}%
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1.5 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
                  {rate != null
                    ? `1 ${fromCurrency} = ${formatAmount(rate, toCurrency)} ${toCurrency} · updated ${updatedLabel}`
                    : '—'
                  }
                </p>
              </>
            )}
          </div>

          {/* ── Mini Chart ───────────────────────────────────────────────────── */}
          <div className={`rounded-lg overflow-hidden border
            ${dm ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <span className={`text-[10px] font-semibold uppercase tracking-widest
                ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
                30-day trend · {fromCurrency}/{toCurrency}
              </span>
            </div>

            {chartLoading ? (
              <div className={`h-14 mx-4 mb-3 rounded-lg animate-pulse ${dm ? 'bg-slate-700' : 'bg-slate-100'}`} />
            ) : chartError ? (
              <div className={`h-14 mx-4 mb-3 rounded-lg flex items-center justify-center gap-2 text-xs
                ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Chart unavailable</span>
                <button type="button" onClick={fetchChart} className="underline hover:no-underline">Retry</button>
              </div>
            ) : chartData?.length ? (
              <div className="h-16 w-full animate-fadeIn pb-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 4, right: 12, left: 12, bottom: 4 }}>
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3.5, fill: '#3b82f6', strokeWidth: 0 }}
                    />
                    <Tooltip
                      content={<CustomTooltip darkMode={dm} />}
                      cursor={{ stroke: dm ? '#334155' : '#e2e8f0', strokeWidth: 1 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className={`h-10 mx-4 mb-3 flex items-center justify-center text-xs
                ${dm ? 'text-slate-600' : 'text-slate-400'}`}>
                Same currency — no chart
              </div>
            )}
          </div>

          {/* ── Historical Rate ──────────────────────────────────────────────── */}
          <div className={`rounded-lg border px-4 pt-3 pb-4
            ${dm ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2.5
              ${dm ? 'text-slate-500' : 'text-slate-400'}`}>Rate on date</p>
            <div className="flex gap-2">
              <input
                type="date"
                value={histDate}
                onChange={e => setHistDate(e.target.value)}
                min="1999-01-04"
                max={new Date(Date.now() - 86400000).toISOString().slice(0, 10)}
                className={`flex-1 min-w-0 px-3 py-2 rounded-lg border text-sm outline-none
                  transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
                  ${dm ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              />
              <button
                type="button"
                onClick={fetchHistRate}
                disabled={!histDate || histLoading || fromCurrency === toCurrency}
                className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                  bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {histLoading ? '…' : 'Go'}
              </button>
            </div>

            {histError && (
              <p className="text-red-400 text-xs mt-2">⚠ {histError}</p>
            )}

            {histRate != null && !histLoading && (
              <div className={`mt-3 pt-3 border-t ${dm ? 'border-slate-700' : 'border-slate-100'}`}>
                <p className={`text-xs mb-1.5 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
                  {histActualDate}
                  {histActualDate !== histDate && (
                    <span className="ml-1 opacity-60">(nearest trading day)</span>
                  )}
                </p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className={`text-2xl font-extrabold tracking-tight ${dm ? 'text-white' : 'text-slate-900'}`}>
                    {formatAmount(amount * histRate, toCurrency)}
                  </span>
                  <span className={`text-sm font-semibold ${dm ? 'text-slate-400' : 'text-slate-400'}`}>
                    {toCurrency}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
                  1 {fromCurrency} = {formatAmount(histRate, toCurrency)} {toCurrency}
                  {rate != null && (() => {
                    const diff = ((rate - histRate) / histRate) * 100;
                    const sign = diff >= 0 ? '+' : '';
                    return (
                      <span className={`ml-2 font-medium ${diff >= 0
                        ? (dm ? 'text-emerald-400' : 'text-emerald-600')
                        : (dm ? 'text-red-400' : 'text-red-600')}`}>
                        {sign}{diff.toFixed(2)}% vs today
                      </span>
                    );
                  })()}
                </p>
              </div>
            )}
          </div>

          {/* ── Quick-select currencies ───────────────────────────────────────── */}
          {favCurrencies.length > 0 && (
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2
                ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
                Quick select
              </p>
              <div className="flex flex-wrap gap-1.5">
                {favCurrencies.map(code => {
                  const curr = CURRENCY_MAP[code];
                  const isFrom = code === fromCurrency;
                  const isTo   = code === toCurrency;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setFromCurrency(code)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5
                        rounded-lg text-sm font-semibold border transition-all
                        ${isFrom
                          ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20'
                          : isTo
                            ? (dm ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600')
                            : (dm ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 shadow-sm')
                        }`}
                    >
                      <span className="text-base leading-none">{curr?.flag}</span>
                      <span>{code}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
        )} {/* end converter tab */}

        {/* ════════════ MULTI TAB ════════════ */}
        {activeTab === 'multi' && (
        <div className="px-4 pt-3 pb-4 flex flex-col gap-3">

          {favCurrencies.length === 0 ? (
            /* ── Empty state ─────────────────────────────────────────────────── */
            <div className={`rounded-lg px-5 py-8 flex flex-col items-center gap-2 text-center border
              ${dm ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              <span className="text-3xl">☆</span>
              <p className={`text-sm font-semibold ${dm ? 'text-slate-300' : 'text-slate-700'}`}>
                No favourites yet
              </p>
              <p className={`text-xs ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
                Star currencies in Converter — they'll appear here.
              </p>
            </div>
          ) : (
            <>
              {/* ── Base currency + Amount ─────────────────────────────────────── */}
              <div className="flex gap-2">
                <div className="relative w-36 shrink-0">
                  <CurrencyDropdown
                    value={multiBase}
                    onChange={v => { setMultiBase(v); setMultiRates(null); }}
                    label="Base"
                    darkMode={dm}
                    align="left"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className={`text-[10px] font-semibold uppercase tracking-widest
                    ${dm ? 'text-slate-500' : 'text-slate-400'}`}>Amount</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    value={multiRawAmount}
                    onChange={e => setMultiRawAmount(e.target.value)}
                    placeholder="1"
                    className={`w-full px-3 py-2.5 rounded-lg border text-xl font-bold outline-none
                      transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
                      ${dm ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600'
                           : 'bg-white border-slate-200 text-slate-900 placeholder-slate-300 shadow-sm'}`}
                  />
                </div>
              </div>

              {/* ── Rates list ──────────────────────────────────────────────────── */}
              <div className={`rounded-lg overflow-hidden border
                ${dm ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                {/* List header */}
                <div className={`flex items-center justify-between px-4 py-2.5 border-b
                  ${dm ? 'border-slate-700' : 'border-slate-100'}`}>
                  <span className={`text-[10px] font-semibold uppercase tracking-widest
                    ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
                    {favCurrencies.filter(t => t !== multiBase).length} currencies
                  </span>
                  <button
                    type="button"
                    onClick={fetchMultiRates}
                    className={`text-xs font-medium transition-colors
                      ${dm ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-500'}`}
                  >
                    ↻ Refresh
                  </button>
                </div>

                {/* Error state */}
                {multiError && (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <p className="text-red-400 text-sm flex-1">⚠ {multiError}</p>
                    <button type="button" onClick={fetchMultiRates}
                      className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white">Retry</button>
                  </div>
                )}

                {/* Rows */}
                {favCurrencies
                  .filter(t => t !== multiBase)
                  .map((code, i, arr) => {
                    const curr = CURRENCY_MAP[code];
                    const rate = multiRates?.[code];
                    const converted = rate != null ? multiAmount * rate : null;
                    const isLast = i === arr.length - 1;
                    return (
                      <div
                        key={code}
                        className={`flex items-center gap-3 px-3 py-2.5
                          ${!isLast ? (dm ? 'border-b border-slate-700/50' : 'border-b border-slate-100') : ''}`}
                      >
                        <span className="text-xl leading-none shrink-0">{curr?.flag}</span>
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-semibold ${dm ? 'text-white' : 'text-slate-800'}`}>
                            {code}
                          </span>
                          <span className={`text-xs ml-1.5 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
                            {curr?.name}
                          </span>
                        </div>
                        <div className="shrink-0 text-right">
                          {multiLoading ? (
                            <div className={`h-4 w-16 rounded animate-pulse
                              ${dm ? 'bg-slate-700' : 'bg-slate-200'}`} />
                          ) : (
                            <span className={`text-sm font-bold tabular-nums
                              ${dm ? 'text-white' : 'text-slate-900'}`}>
                              {converted != null ? formatAmount(converted, code) : '—'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}

        </div>
        )} {/* end multi tab */}

        {/* ════════════ CRYPTO TAB ════════════ */}
        {activeTab === 'crypto' && (
        <div className="px-4 pt-3 pb-4 flex flex-col gap-3">

          {/* ── Coin selector + Amount ───────────────────────────────────────── */}
          <div className="flex gap-2 items-end">
            <div className="relative flex-1 min-w-0">
              <CryptoDropdown
                value={cryptoCoin}
                onChange={v => { setCryptoCoin(v); setCryptoRates(null); }}
                darkMode={dm}
              />
            </div>
            <div className="w-28 shrink-0 flex flex-col gap-1.5">
              <label className={`text-[10px] font-semibold uppercase tracking-widest
                ${dm ? 'text-slate-500' : 'text-slate-400'}`}>Amount</label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={cryptoRawAmount}
                onChange={e => setCryptoRawAmount(e.target.value)}
                placeholder="1"
                className={`w-full px-3 py-2.5 rounded-lg border text-xl font-bold outline-none
                  transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10
                  ${dm ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600'
                       : 'bg-white border-slate-200 text-slate-900 placeholder-slate-300 shadow-sm'}`}
              />
            </div>
          </div>

          {/* ── Prices list ──────────────────────────────────────────────────── */}
          <div className={`rounded-lg overflow-hidden border
            ${dm ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-2.5 border-b
              ${dm ? 'border-slate-700' : 'border-slate-100'}`}>
              <span className={`text-[10px] font-semibold uppercase tracking-widest
                ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
                {CRYPTO_MAP[cryptoCoin]?.symbol} price
              </span>
              <button
                type="button"
                onClick={fetchCryptoRates}
                className={`text-xs font-medium transition-colors
                  ${dm ? 'text-slate-500 hover:text-amber-400' : 'text-slate-400 hover:text-amber-500'}`}
              >
                ↻ Refresh
              </button>
            </div>

            {/* Error */}
            {cryptoError && (
              <div className="flex items-center gap-3 px-4 py-3">
                <p className="text-red-400 text-sm flex-1">⚠ {cryptoError}</p>
                <button type="button" onClick={fetchCryptoRates}
                  className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white">Retry</button>
              </div>
            )}

            {/* Rows: USD always first, then fav currencies */}
            {(() => {
              const cryptoAmount = parseFloat(cryptoRawAmount) || 1;
              const displayCurrencies = ['USD', ...favCurrencies.filter(c => c !== 'USD')];
              return displayCurrencies.map((code, i, arr) => {
                const curr = CURRENCY_MAP[code];
                const unitPrice = cryptoRates?.[code.toLowerCase()];
                const total = unitPrice != null ? cryptoAmount * unitPrice : null;
                const isLast = i === arr.length - 1;
                return (
                  <div
                    key={code}
                    className={`flex items-center gap-3 px-3 py-2.5
                      ${!isLast ? (dm ? 'border-b border-slate-700/50' : 'border-b border-slate-100') : ''}`}
                  >
                    <span className="text-xl leading-none shrink-0">{curr?.flag}</span>
                    <span className={`text-sm font-semibold w-10 shrink-0 ${dm ? 'text-slate-300' : 'text-slate-700'}`}>
                      {code}
                    </span>
                    <div className="flex-1 min-w-0 text-right">
                      {cryptoLoading ? (
                        <div className={`h-4 w-24 rounded animate-pulse ml-auto
                          ${dm ? 'bg-slate-700' : 'bg-slate-200'}`} />
                      ) : (
                        <span className={`text-sm font-bold tabular-nums
                          ${dm ? 'text-white' : 'text-slate-900'}`}>
                          {total != null ? formatCryptoPrice(total) : '—'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              });
            })()}

            {/* Empty fav hint */}
            {favCurrencies.length === 0 && !cryptoError && (
              <div className={`px-4 py-2.5 border-t text-xs
                ${dm ? 'border-slate-700 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                ☆ Star currencies in Converter to see more prices here
              </div>
            )}
          </div>

        </div>
        )} {/* end crypto tab */}

      </div>
    </div>
  );
}

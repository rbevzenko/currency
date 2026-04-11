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

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ISO 4217 currencies with no minor unit (zero decimal places)
const ZERO_DECIMAL = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW',
  'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);

function formatAmount(value, code) {
  if (value == null || isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: ZERO_DECIMAL.has(code) ? 0 : 4,
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
  const set = useCallback(v => {
    setValue(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [value, set];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CurrencyDropdown({ value, onChange, label, darkMode }) {
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
    <div className="flex flex-col gap-1 flex-1" ref={ref}>
      <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
        {label}
      </span>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch(''); }}
        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left transition-colors
          ${darkMode
            ? 'bg-zinc-800 border-zinc-700 hover:border-zinc-500 text-white'
            : 'bg-white border-zinc-200 hover:border-zinc-400 text-zinc-900'
          }`}
      >
        <span className="text-xl leading-none">{selected?.flag}</span>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm">{selected?.code}</span>
          <span className={`text-xs truncate ${darkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{selected?.name}</span>
        </div>
        <svg className="ml-auto w-4 h-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute z-50 mt-1 w-64 rounded-xl shadow-xl border overflow-hidden
          ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}
          style={{ top: '100%', left: 0 }}
        >
          <div className={`px-2 pt-2 pb-1 border-b ${darkMode ? 'border-zinc-700' : 'border-zinc-100'}`}>
            <input
              autoFocus
              type="text"
              placeholder="Search currency…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={`w-full px-2 py-1.5 text-sm rounded-lg outline-none
                ${darkMode ? 'bg-zinc-700 text-white placeholder-zinc-400' : 'bg-zinc-50 text-zinc-900 placeholder-zinc-400'}`}
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
                      ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700')
                      : (darkMode ? 'hover:bg-zinc-700 text-zinc-200' : 'hover:bg-zinc-50 text-zinc-800')
                    }`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="font-medium">{c.code}</span>
                  <span className={`text-xs truncate ${c.code === value ? 'opacity-75' : (darkMode ? 'text-zinc-400' : 'text-zinc-500')}`}>
                    {c.name}
                  </span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className={`px-3 py-4 text-center text-sm ${darkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
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
    <div className={`h-20 rounded-xl animate-pulse ${darkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`} />
  );
}

function CustomTooltip({ active, payload, darkMode }) {
  if (!active || !payload?.length) return null;
  const { date, rate } = payload[0].payload;
  return (
    <div className={`px-2.5 py-1.5 rounded-lg text-xs shadow-lg border
      ${darkMode ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-white border-zinc-200 text-zinc-800'}`}>
      <div className="font-medium">{date}</div>
      <div className="opacity-75">{rate}</div>
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
  const [favourites, setFavourites] = useLocalStorage('cc-favourites', []);
  const [favOpen, setFavOpen] = useState(true);

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

  // ── Favourites helpers ───────────────────────────────────────────────────────
  const favKey = `${fromCurrency}-${toCurrency}`;
  const isFav = favourites.some(f => f.key === favKey);

  const toggleFav = () => {
    if (isFav) {
      setFavourites(favourites.filter(f => f.key !== favKey));
    } else {
      setFavourites([...favourites, { key: favKey, from: fromCurrency, to: toCurrency }]);
    }
  };

  const loadFav = fav => {
    setFromCurrency(fav.from);
    setToCurrency(fav.to);
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
    <div className={`min-h-screen flex items-start sm:items-center justify-center p-2 sm:p-4
      transition-colors duration-300
      ${dm ? 'bg-zinc-950' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
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

      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300
        ${dm ? 'bg-zinc-900' : 'bg-white'}`}>

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className={`flex items-center justify-between px-4 py-3 border-b
          ${dm ? 'border-zinc-800' : 'border-zinc-100'}`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">💱</span>
            <span className={`font-semibold text-sm ${dm ? 'text-white' : 'text-zinc-800'}`}>
              Currency Converter
            </span>
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
                ${dm ? 'bg-zinc-800 hover:bg-zinc-700 text-yellow-400' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'}`}
              aria-label="Toggle dark mode"
            >
              {dm ? '☀' : '🌙'}
            </button>
          </div>
        </div>

        <div className="px-4 pt-3 pb-4 flex flex-col gap-3">

          {/* ── Amount Input ─────────────────────────────────────────────────── */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors
            focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent
            ${dm ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'}`}>
            <label className={`text-xs font-medium uppercase tracking-wider shrink-0
              ${dm ? 'text-zinc-500' : 'text-zinc-400'}`}>
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
              className={`flex-1 min-w-0 py-1 bg-transparent text-base font-semibold outline-none
                ${dm ? 'text-white placeholder-zinc-500' : 'text-zinc-900 placeholder-zinc-400'}`}
            />
          </div>

          {/* ── Currency Selectors + Swap ────────────────────────────────────── */}
          <div className="flex items-end gap-2 relative">
            <div className="relative flex-1">
              <CurrencyDropdown value={fromCurrency} onChange={setFromCurrency} label="From" darkMode={dm} />
            </div>

            <button
              type="button"
              onClick={handleSwap}
              style={{ transform: `rotate(${swapRotated ? 180 : 0}deg)`, transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mb-0.5
                font-bold text-lg shadow-md transition-colors
                ${dm ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
              aria-label="Swap currencies"
            >
              ⇄
            </button>

            <div className="relative flex-1">
              <CurrencyDropdown value={toCurrency} onChange={setToCurrency} label="To" darkMode={dm} />
            </div>
          </div>

          {/* ── Conversion Result ────────────────────────────────────────────── */}
          <div className={`rounded-2xl px-4 py-3 flex flex-col gap-0.5
            ${dm ? 'bg-zinc-800' : 'bg-blue-50'}`}>

            {rateLoading ? (
              <div className="flex flex-col gap-2 py-1">
                <div className={`h-8 w-40 rounded-lg animate-pulse ${dm ? 'bg-zinc-700' : 'bg-blue-100'}`} />
                <div className={`h-3.5 w-28 rounded animate-pulse ${dm ? 'bg-zinc-700' : 'bg-blue-100'}`} />
              </div>
            ) : rateError ? (
              <div className="flex items-center gap-3">
                <p className="text-red-400 text-sm font-medium flex-1">⚠ {rateError}</p>
                <button
                  type="button"
                  onClick={fetchRate}
                  className="shrink-0 px-3 py-1 text-xs font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1.5 min-w-0">
                    <span className={`text-3xl font-bold tracking-tight truncate ${dm ? 'text-white' : 'text-zinc-900'}`}>
                      {formatAmount(converted, toCurrency)}
                    </span>
                    <span className={`text-base font-semibold shrink-0 ${dm ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {CURRENCY_MAP[toCurrency]?.code}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleFav}
                    className={`shrink-0 text-lg leading-none transition-transform hover:scale-125
                      ${isFav ? 'text-yellow-400' : (dm ? 'text-zinc-600 hover:text-yellow-300' : 'text-zinc-300 hover:text-yellow-400')}`}
                    aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
                  >
                    {isFav ? '★' : '☆'}
                  </button>
                </div>
                <p className={`text-xs ${dm ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {rate != null
                    ? `1 ${fromCurrency} = ${formatAmount(rate, toCurrency)} ${toCurrency} · updated ${updatedLabel}`
                    : '—'
                  }
                </p>
              </>
            )}
          </div>

          {/* ── Mini Chart ───────────────────────────────────────────────────── */}
          <div className={`rounded-xl overflow-hidden ${dm ? 'bg-zinc-800/60' : 'bg-zinc-50'}`}>
            <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
              <span className={`text-xs font-medium uppercase tracking-wider ${dm ? 'text-zinc-500' : 'text-zinc-400'}`}>
                30d · {fromCurrency}/{toCurrency}
              </span>
            </div>

            {chartLoading ? (
              <div className={`h-12 mx-3 mb-2.5 rounded-lg animate-pulse ${dm ? 'bg-zinc-700' : 'bg-zinc-200'}`} />
            ) : chartError ? (
              <div className={`h-12 mx-3 mb-2.5 rounded-lg flex items-center justify-center gap-2 text-xs
                ${dm ? 'text-zinc-500' : 'text-zinc-400'}`}>
                <span>Chart unavailable</span>
                <button type="button" onClick={fetchChart} className="underline hover:no-underline">Retry</button>
              </div>
            ) : chartData?.length ? (
              <div className="h-14 w-full animate-fadeIn">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 2, right: 8, left: 8, bottom: 2 }}>
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#3b82f6"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                    />
                    <Tooltip
                      content={<CustomTooltip darkMode={dm} />}
                      cursor={{ stroke: dm ? '#52525b' : '#e4e4e7', strokeWidth: 1 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className={`h-10 mx-3 mb-2.5 flex items-center justify-center text-xs
                ${dm ? 'text-zinc-600' : 'text-zinc-400'}`}>
                Same currency — no chart
              </div>
            )}
          </div>

          {/* ── Favourites Panel ─────────────────────────────────────────────── */}
          {favourites.length > 0 && (
            <div className={`rounded-xl border overflow-hidden
              ${dm ? 'border-zinc-800' : 'border-zinc-100'}`}>
              {/* Header row: label left, toggle + count right */}
              <div className={`flex items-center justify-between px-3 py-2
                ${dm ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                <span className={`text-xs font-semibold uppercase tracking-wider
                  ${dm ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  ⭐ Saved
                </span>
                <button
                  type="button"
                  onClick={() => setFavOpen(o => !o)}
                  className={`text-xs flex items-center gap-1
                    ${dm ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  {favourites.length}
                  <svg
                    className={`w-3 h-3 transition-transform ${favOpen ? '' : '-rotate-90'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Single horizontal-scroll row — no wrapping */}
              {favOpen && (
                <div
                  className={`flex gap-2 px-3 py-2.5 overflow-x-auto ${dm ? 'bg-zinc-900' : 'bg-white'}`}
                  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {favourites.map(fav => {
                    const fc = CURRENCY_MAP[fav.from];
                    const tc = CURRENCY_MAP[fav.to];
                    const active = fav.from === fromCurrency && fav.to === toCurrency;
                    return (
                      <button
                        key={fav.key}
                        type="button"
                        onClick={() => loadFav(fav)}
                        className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1.5
                          rounded-full text-xs font-medium border transition-colors
                          ${active
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : dm
                              ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-blue-500'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-blue-400'
                          }`}
                      >
                        <span className="text-sm leading-none">{fc?.flag}{tc?.flag}</span>
                        <span>{fav.from}→{fav.to}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

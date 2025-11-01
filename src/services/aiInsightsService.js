/* AI Insights Service
- Tries to use LangChain's GoogleGenerativeAI if available
- Falls back to direct Gemini REST call otherwise
- Removed LangChain import and usage due to unresolved dependency error
*/

const DEFAULT_MODEL = (typeof import.meta !== 'undefined' && import.meta.env.VITE_GEMINI_MODEL) || 'gemini-2.5-flash';
const GEMINI_ENDPOINT = (model)=>`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const getApiKey = () => (typeof import.meta !== 'undefined' ? import.meta.env.VITE_GEMINI_API_KEY : undefined);

async function tryLangChainCall(prompt, model = DEFAULT_MODEL) {
  // Removed LangChain usage due to unresolved dependency
  return null;
}

async function callGeminiRest(prompt, model = DEFAULT_MODEL) {
  const key = getApiKey();
  if (!key) throw new Error('Missing VITE_GEMINI_API_KEY');
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 512 },
  };
  const url = `${GEMINI_ENDPOINT(model)}?key=${encodeURIComponent(key)}`;
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`Gemini error ${res.status}`);
  const data = await res.json();
  console.log("AKSHHHHH", prompt);
  console.log('🤖 Gemini Raw Response:', data);
  const text = data?.candidates?.[0]?.content?.parts?.map(p=>p.text).join('\n') || '';
  console.log('📝 Gemini Parsed Text:', text);
  return text;
}

// Lightweight client-side validation of AI JSON
function validateInsightJson(obj) {
  const errors = [];
  if (typeof obj !== 'object' || obj === null) errors.push('root must be object');
  if (typeof obj.summary !== 'string') errors.push('summary must be string');
  if (!Array.isArray(obj.bullets)) errors.push('bullets must be array');
  if (obj.bullets && obj.bullets.some((b)=>typeof b !== 'string')) errors.push('bullets must be string[]');
  if (obj.caveats && typeof obj.caveats !== 'string') errors.push('caveats must be string when present');
  return { ok: errors.length === 0, errors };
}

async function pydanticValidate(obj, schemaName = 'CorrelationInsight') {
  const url = (typeof import.meta !== 'undefined' && import.meta.env.VITE_PYDANTIC_VALIDATE_URL) || '';
  if (!url) return { ok: true, errors: [], data: obj }; // optional
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ schema: schemaName, data: obj }) });
    if (!res.ok) throw new Error(`Pydantic validator error ${res.status}`);
    const data = await res.json();
    return data; // expected { ok:boolean, errors:[], data:validated }
  } catch (e) {
    return { ok: false, errors: [e.message], data: null };
  }
}

export const aiInsightsService = {
  async summarizeCorrelation({ indicatorX, indicatorY, pearson, spearman, topCountries = [], bottomCountries = [], samplePoints = [] }) {
    const prompt = `You are a data analyst for a travel and research portal. Return STRICT JSON only, no prose. Use this JSON schema: {\n  summary: string,\n  bullets: string[],\n  caveats?: string\n}\nKeep the summary 100-140 words.\n\nIndicators:\n- X: ${indicatorX}\n- Y: ${indicatorY}\nStats: Pearson=${pearson}, Spearman=${spearman}\nTop sample: ${topCountries.slice(0,5).map(c=>c.name).join(', ')}\nBottom sample: ${bottomCountries.slice(0,5).map(c=>c.name).join(', ')}\nSample size: ${samplePoints.length}\nGuidelines: objective tone, no invented numbers.`;
    const viaLC = await tryLangChainCall(prompt, DEFAULT_MODEL);
    const raw = viaLC || await callGeminiRest(prompt, DEFAULT_MODEL);
    // try parse JSON from model
    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = { summary: raw, bullets: [] }; }
    const local = validateInsightJson(parsed);
    if (!local.ok) {
      // fallback to wrapping as text
      parsed = { summary: typeof raw === 'string' ? raw : JSON.stringify(raw), bullets: [] };
    }
    const server = await pydanticValidate(parsed, 'CorrelationInsight');
    const result = server.ok ? server.data : parsed;
    console.log('✅ Correlation Summary Result:', result);
    return result;
  },

  async summarizeCountry({ name, region, capital, population, area, indicators = {} }) {
    const prompt = `Write a brief country insight (80-120 words) for travelers and researchers.\nCountry: ${name}\nRegion: ${region}\nCapital: ${capital}\nPopulation: ${population}\nArea: ${area}\nKey indicators: ${Object.entries(indicators).map(([k,v])=>`${k}: ${v}`).join(', ')}\nFocus on 2-3 notable facts and one actionable tip. Keep it neutral and concise.`;
    const viaLC = await tryLangChainCall(prompt, DEFAULT_MODEL);
    const raw = viaLC || await callGeminiRest(prompt, DEFAULT_MODEL);
    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = { summary: raw, bullets: [] }; }
    const local = validateInsightJson(parsed);
    if (!local.ok) parsed = { summary: typeof raw === 'string' ? raw : JSON.stringify(raw), bullets: [] };
    const server = await pydanticValidate(parsed, 'CountryInsight');
    const result = server.ok ? server.data : parsed;
    console.log('✅ Country Summary Result:', result);
    return result;
  },

  async summarizeHeadlines({ titles = [] }) {
    const prompt = `Return STRICT JSON only (no prose) summarizing these news headlines for a global audience. Schema: { summary: string, bullets: string[] }\n\nHeadlines:\n${titles.map((t,i)=>`${i+1}. ${t}`).join('\n')}`;
    const viaLC = await tryLangChainCall(prompt, DEFAULT_MODEL);
    const raw = viaLC || await callGeminiRest(prompt, DEFAULT_MODEL);
    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = { summary: raw, bullets: [] }; }
    const local = validateInsightJson({ ...parsed, caveats: parsed.caveats ?? undefined });
    if (!local.ok) parsed = { summary: typeof raw === 'string' ? raw : JSON.stringify(raw), bullets: [] };
    const server = await pydanticValidate(parsed, 'HeadlineInsight');
    const result = server.ok ? server.data : parsed;
    console.log('✅ Headlines Summary Result:', result);
    return result;
  },

  async compareCountries({ countries = [] }) {
    const countriesText = countries.map(c => 
      `${c.name}: Population ${c.population?.toLocaleString() || 'N/A'}, GDP ${c.gdp || 'N/A'}, Area ${c.area?.toLocaleString() || 'N/A'} km²`
    ).join('\n');
    const prompt = `Return STRICT JSON only. Schema: { summary: string, bullets: string[], keyDifferences: string[] }\n\nCompare these countries for travelers and researchers:\n${countriesText}\n\nProvide: 1) Brief comparison summary (80-100 words), 2) 3-4 key bullet points, 3) 2-3 notable differences. Be objective and factual.`;
    const viaLC = await tryLangChainCall(prompt, DEFAULT_MODEL);
    const raw = viaLC || await callGeminiRest(prompt, DEFAULT_MODEL);
    let parsed;
    try { 
      parsed = JSON.parse(raw); 
      if (!parsed.keyDifferences) parsed.keyDifferences = [];
    } catch { 
      parsed = { summary: raw, bullets: [], keyDifferences: [] }; 
    }
    console.log('✅ Compare Countries Result:', parsed);
    return parsed;
  },

  async analyzeWishlist({ countries = [] }) {
    const countriesText = countries.map(c => c.name || c.country_name).join(', ');
    const prompt = `Return STRICT JSON only. Schema: { summary: string, bullets: string[], recommendations: string[] }\n\nAnalyze this travel wishlist:\n${countriesText}\n\nProvide: 1) Brief analysis (60-80 words), 2) 2-3 insights about the selection, 3) 2 similar destination recommendations. Keep it helpful and concise.`;
    const viaLC = await tryLangChainCall(prompt, DEFAULT_MODEL);
    const raw = viaLC || await callGeminiRest(prompt, DEFAULT_MODEL);
    let parsed;
    try { 
      parsed = JSON.parse(raw);
      if (!parsed.recommendations) parsed.recommendations = [];
    } catch { 
      parsed = { summary: raw, bullets: [], recommendations: [] }; 
    }
    console.log('✅ Wishlist Analysis Result:', parsed);
    return parsed;
  },

  async analyzeDemographicTrend({ indicator, topCountries = [], bottomCountries = [] }) {
    const topText = topCountries.slice(0, 5).map(c => `${c.name}: ${c.value?.toLocaleString() || c.value}`).join(', ');
    const bottomText = bottomCountries.slice(0, 5).map(c => `${c.name}: ${c.value?.toLocaleString() || c.value}`).join(', ');
    const prompt = `Return STRICT JSON only. Schema: { summary: string, bullets: string[] }\n\nAnalyze this demographic indicator: ${indicator}\n\nTop countries: ${topText}\nBottom countries: ${bottomText}\n\nProvide: 1) Brief analysis (80-100 words), 2) 3-4 key insights. Be objective and data-driven.`;
    const viaLC = await tryLangChainCall(prompt, DEFAULT_MODEL);
    const raw = viaLC || await callGeminiRest(prompt, DEFAULT_MODEL);
    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = { summary: raw, bullets: [] }; }
    const local = validateInsightJson({ ...parsed, caveats: parsed.caveats ?? undefined });
    if (!local.ok) parsed = { summary: typeof raw === 'string' ? raw : JSON.stringify(raw), bullets: [] };
    console.log('✅ Demographic Trend Result:', parsed);
    return parsed;
  },

  async summarizeCountryProfile({ name, region, capital, population, gdp, languages = [], currencies = [], climate, culture }) {
    const prompt = `Return STRICT JSON only. Schema: { summary: string, bullets: string[], travelTips: string[] }\n\nCountry: ${name}\nRegion: ${region}\nCapital: ${capital}\nPopulation: ${population?.toLocaleString() || 'N/A'}\nGDP: ${gdp || 'N/A'}\nLanguages: ${languages.join(', ') || 'N/A'}\nCurrencies: ${currencies.join(', ') || 'N/A'}\n\nProvide: 1) Comprehensive overview (100-120 words), 2) 4-5 key facts, 3) 2-3 practical travel tips. Be informative and helpful.`;
    const viaLC = await tryLangChainCall(prompt, DEFAULT_MODEL);
    const raw = viaLC || await callGeminiRest(prompt, DEFAULT_MODEL);
    let parsed;
    try { 
      parsed = JSON.parse(raw);
      if (!parsed.travelTips) parsed.travelTips = [];
    } catch { 
      parsed = { summary: raw, bullets: [], travelTips: [] }; 
    }
    console.log('✅ Country Profile Result:', parsed);
    return parsed;
  }
};

export default aiInsightsService;

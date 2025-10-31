/* AI Insights Service
 - Tries to use LangChain's GoogleGenerativeAI if available
 - Falls back to direct Gemini REST call otherwise
*/

const DEFAULT_MODEL = (typeof import.meta !== 'undefined' && import.meta.env.VITE_GEMINI_MODEL) || 'gemini-2.5-flash';
const GEMINI_ENDPOINT = (model)=>`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const getApiKey = () => (typeof import.meta !== 'undefined' ? import.meta.env.VITE_GEMINI_API_KEY : undefined);

async function tryLangChainCall(prompt, model = DEFAULT_MODEL) {
  try {
    const { ChatGoogleGenerativeAI } = await import('@langchain/google-genai');
    const llm = new ChatGoogleGenerativeAI({
      apiKey: getApiKey(),
      modelName: model,
      temperature: 0.4,
    });
    const res = await llm.call(prompt);
    const text = typeof res?.content === 'string' ? res.content : (Array.isArray(res?.content) ? res.content.map(p=>p.text||'').join('') : String(res||''));
    return text;
  } catch (e) {
    return null;
  }
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
  const text = data?.candidates?.[0]?.content?.parts?.map(p=>p.text).join('\n') || '';
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
    return server.ok ? server.data : parsed;
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
    return server.ok ? server.data : parsed;
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
    return server.ok ? server.data : parsed;
  }
};

export default aiInsightsService;

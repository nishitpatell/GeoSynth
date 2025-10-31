import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import CountrySearch from "@/components/CountrySearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Globe, BarChart3, Download } from "lucide-react";
import { enhancedCountryService } from "@/services/enhancedCountryService";
import { demographicsService, INDICATORS } from "@/services/demographicsService";
import { Globe3D } from "@/features/globe";
import WorldMap from "@/components/WorldMap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries as CountryList } from "@/data/countries";
import { aiInsightsService } from "@/services/aiInsightsService";

export default function Demographics() {
  const [selected, setSelected] = useState(null);
  const [compare, setCompare] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [series, setSeries] = useState([]);
  const [topGlobal, setTopGlobal] = useState([]);
  const [metric, setMetric] = useState('POPULATION');
  const [heatmap, setHeatmap] = useState({ map: {}, min: 0, max: 0 });
  const [seriesCompare, setSeriesCompare] = useState([]);
  const [corrX, setCorrX] = useState('POPULATION');
  const [corrY, setCorrY] = useState('AREA');
  const [corrData, setCorrData] = useState([]);
  const [corrLoading, setCorrLoading] = useState(false);
  const [corrStats, setCorrStats] = useState({ pearson: null, spearman: null });
  const [useLog, setUseLog] = useState(false);
  const [showTrend, setShowTrend] = useState(true);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiText, setAiText] = useState("");
  const codeToName = useMemo(() => Object.fromEntries(CountryList.map(c => [c.code, c.name])), []);
  const prettyLabel = (k) => k.replace(/_/g, ' ');

  const hasData = useMemo(() => !!data, [data]);

  useEffect(() => {
    if (selected?.code) {
      (async () => {
        setLoading(true);
        setError("");
        try {
          const basic = await enhancedCountryService.getBasicCountryData(selected.code);
          setData(basic);
          const indicatorKey = INDICATORS[metric] || INDICATORS.POPULATION;
          const ser = await demographicsService.getIndicatorSeries(selected.code, indicatorKey);
          setSeries(ser.series || []);
          if (compare?.code) {
            const ser2 = await demographicsService.getIndicatorSeries(compare.code, indicatorKey);
            setSeriesCompare(ser2.series || []);
          } else {
            setSeriesCompare([]);
          }
        } catch (e) {
          setError("Failed to load demographics");
          setData(null);
          setSeries([]);
          setSeriesCompare([]);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [selected, compare, metric]);

  // Load global overview when no country selected
  useEffect(() => {
    (async () => {
      const indicatorKey = INDICATORS[metric] || INDICATORS.POPULATION;
      const res = await demographicsService.getTopCountriesByIndicator(indicatorKey, 10);
      setTopGlobal(res.items || []);
      const heat = await demographicsService.getAllByIndicatorYear(indicatorKey);
      setHeatmap(heat);
    })();
  }, [metric]);

  // Correlation Explorer: load cross-country values and compute correlation
  useEffect(() => {
    (async () => {
      try {
        setCorrLoading(true);
        const keyX = INDICATORS[corrX] || INDICATORS.POPULATION;
        const keyY = INDICATORS[corrY] || INDICATORS.POPULATION;
        const [mx, my] = await Promise.all([
          demographicsService.getAllByIndicatorYear(keyX),
          demographicsService.getAllByIndicatorYear(keyY),
        ]);
        const points = Object.keys(mx.map || {}).map(code => ({
          code,
          x: mx.map[code],
          y: (my.map || {})[code],
        })).filter(p => p.x != null && p.y != null && !isNaN(p.x) && !isNaN(p.y));

        const pearson = (() => {
          const n = points.length; if (!n) return null;
          const sx = points.reduce((a,p)=>a+p.x,0);
          const sy = points.reduce((a,p)=>a+p.y,0);
          const sxx = points.reduce((a,p)=>a+p.x*p.x,0);
          const syy = points.reduce((a,p)=>a+p.y*p.y,0);
          const sxy = points.reduce((a,p)=>a+p.x*p.y,0);
          const num = n*sxy - sx*sy;
          const den = Math.sqrt((n*sxx - sx*sx)*(n*syy - sy*sy));
          return den ? (num/den) : null;
        })();

        const spearman = (() => {
          const rank = arr => {
            const sorted = [...arr].map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v);
            const ranks = Array(arr.length);
            let i=0;
            while(i<sorted.length){
              let j=i; while(j+1<sorted.length && sorted[j+1].v===sorted[i].v) j++;
              const r = (i+j)/2 + 1; // average rank for ties
              for(let k=i;k<=j;k++) ranks[sorted[k].i]=r;
              i=j+1;
            }
            return ranks;
          };
          const xs = points.map(p=>p.x); const ys = points.map(p=>p.y);
          const rx = rank(xs), ry = rank(ys);
          const n = points.length; if (!n) return null;
          const d2 = rx.reduce((a,r,i)=>{const d=r-ry[i]; return a+d*d;},0);
          return n>1 ? 1 - (6*d2)/(n*(n*n-1)) : null;
        })();

        setCorrData(points);
        setCorrStats({ pearson, spearman });
      } catch {
        setCorrData([]); setCorrStats({ pearson: null, spearman: null });
      } finally {
        setCorrLoading(false);
      }
    })();
  }, [corrX, corrY]);

  const growthPct = useMemo(() => {
    if (!series || series.length < 2) return null;
    const first = series[0].value;
    const last = series[series.length - 1].value;
    if (!first || !last) return null;
    return ((last - first) / first) * 100;
  }, [series]);

  const LineChart = ({ dataPoints, dataPoints2, label1 = 'Series A', label2 = 'Series B' }) => {
    if ((!dataPoints || dataPoints.length === 0) && (!dataPoints2 || dataPoints2.length === 0)) return null;
    const width = 360;
    const height = 140;
    const padding = 20;
    const merged = [...(dataPoints || []), ...(dataPoints2 || [])];
    const xs = merged.map((d) => d.year);
    const ys = merged.map((d) => d.value);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const scaleX = (x) =>
      padding + ((x - minX) / (maxX - minX || 1)) * (width - padding * 2);
    const scaleY = (y) =>
      height - (padding + ((y - minY) / (maxY - minY || 1)) * (height - padding * 2));
    const path1 = (dataPoints || []).map((d) => `${scaleX(d.year)},${scaleY(d.value)}`).join(" ");
    const path2 = (dataPoints2 || []).map((d) => `${scaleX(d.year)},${scaleY(d.value)}`).join(" ");
    const lastPoint = (dataPoints || [])[dataPoints?.length - 1];
    return (
      <svg width={width} height={height} className="w-full h-[140px]">
        {dataPoints && dataPoints.length > 0 && (
          <>
            <polyline points={path1} fill="none" className="stroke-[3]" style={{ stroke: "hsl(var(--primary))" }} />
            <circle cx={scaleX(lastPoint.year)} cy={scaleY(lastPoint.value)} r="3" style={{ fill: "hsl(var(--primary))" }} />
          </>
        )}
        {dataPoints2 && dataPoints2.length > 0 && (
          <polyline points={path2} fill="none" className="stroke-[3]" style={{ stroke: "hsl(var(--primary) / 0.5)", strokeDasharray: '4 4' }} />
        )}
      </svg>
    );
  };

  const ScatterPlot = ({ points, xLabel, yLabel, useLog, showTrend }) => {
    if (!points || points.length === 0) return null;
    const width = 560, height = 300, pad = 46;
    const tx = (v) => useLog ? Math.log10(Math.max(v, 1e-9)) : v;
    const xs = points.map(p=>tx(p.x)), ys = points.map(p=>tx(p.y));
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const sx = x => pad + ((x - minX) / (maxX - minX || 1)) * (width - pad*2);
    const sy = y => height - (pad + ((y - minY) / (maxY - minY || 1)) * (height - pad*2));
    // Gridlines (5 ticks)
    const ticks = 5;
    const xsTicks = Array.from({length:ticks+1}, (_,i)=> minX + (i*(maxX-minX)/ticks));
    const ysTicks = Array.from({length:ticks+1}, (_,i)=> minY + (i*(maxY-minY)/ticks));
    // Trendline (least squares on transformed values)
    let line = null, r2 = null;
    if (showTrend && xs.length>1) {
      const n = xs.length;
      const sumX = xs.reduce((a,b)=>a+b,0);
      const sumY = ys.reduce((a,b)=>a+b,0);
      const sumXX = xs.reduce((a,b)=>a+b*b,0);
      const sumXY = xs.reduce((a,xi,i)=>a+xi*ys[i],0);
      const denom = (n*sumXX - sumX*sumX) || 1;
      const m = (n*sumXY - sumX*sumY) / denom;
      const c = (sumY - m*sumX) / n;
      const yhat = xs.map(x=> m*x + c);
      const ssRes = ys.reduce((a,y,i)=>a+(y - yhat[i])**2,0);
      const ybar = sumY/n;
      const ssTot = ys.reduce((a,y)=>a+(y - ybar)**2,0) || 1;
      r2 = 1 - (ssRes/ssTot);
      line = { m, c };
    }
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* grid */}
        {xsTicks.map((t,i)=> (
          <line key={`vx-${i}`} x1={sx(t)} y1={pad} x2={sx(t)} y2={height-pad} stroke="hsl(var(--muted-foreground) / 0.15)" />
        ))}
        {ysTicks.map((t,i)=> (
          <line key={`hz-${i}`} x1={pad} y1={sy(t)} x2={width-pad} y2={sy(t)} stroke="hsl(var(--muted-foreground) / 0.15)" />
        ))}
        {/* axes */}
        <line x1={pad} y1={height-pad} x2={width-pad} y2={height-pad} stroke="hsl(var(--border))" strokeWidth="1.5" />
        <line x1={pad} y1={pad} x2={pad} y2={height-pad} stroke="hsl(var(--border))" strokeWidth="1.5" />
        {/* ticks labels */}
        {xsTicks.map((t,i)=> (
          <text key={`xt-${i}`} x={sx(t)} y={height-pad+16} fontSize="10" textAnchor="middle" fill="hsl(var(--muted-foreground))">{useLog ? (10**t).toLocaleString() : t.toLocaleString()}</text>
        ))}
        {ysTicks.map((t,i)=> (
          <text key={`yt-${i}`} x={pad-6} y={sy(t)} fontSize="10" textAnchor="end" dominantBaseline="middle" fill="hsl(var(--muted-foreground))">{useLog ? (10**t).toLocaleString() : t.toLocaleString()}</text>
        ))}
        {/* points */}
        {points.map((p,i)=> (
          <circle key={i} cx={sx(tx(p.x))} cy={sy(tx(p.y))} r="3.5" fill="hsl(var(--primary))" fillOpacity="0.85" />
        ))}
        {/* trendline */}
        {line && (
          <line x1={sx(minX)} y1={sy(line.m*minX + line.c)} x2={sx(maxX)} y2={sy(line.m*maxX + line.c)} stroke="hsl(var(--primary))" strokeOpacity="0.7" strokeWidth="2" />
        )}
        {/* axis labels */}
        <text x={(width)/2} y={height-6} fontSize="12" textAnchor="middle" fill="hsl(var(--muted-foreground))">{xLabel}{useLog ? ' (log)' : ''}</text>
        <text x={12} y={pad-14} fontSize="12" textAnchor="start" fill="hsl(var(--muted-foreground))">{yLabel}{useLog ? ' (log)' : ''}</text>
        {/* R^2 */}
        {line && (
          <text x={width-pad} y={pad+12} fontSize="11" textAnchor="end" fill="hsl(var(--muted-foreground))">R²: {r2.toFixed(3)}</text>
        )}
      </svg>
    );
  };

  const BarChart = ({ items }) => {
    if (!items || items.length === 0) return null;
    const max = Math.max(...items.map((i) => i.value));
    return (
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.code} className="flex items-center gap-3">
            <div className="w-36 truncate text-sm">{i.name}</div>
            <div className="flex-1 h-3 bg-muted rounded">
              <div
                className="h-3 rounded bg-primary"
                style={{ width: `${(i.value / max) * 100}%` }}
              />
            </div>
            <div className="w-28 text-right text-sm text-muted-foreground">
              {enhancedCountryService.formatNumber(i.value)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <Badge className="bg-primary text-primary-foreground px-3 py-1.5 inline-flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Demographics
          </Badge>
          <h1 className="text-4xl font-bold mt-3">Country Demographics</h1>
          <p className="text-base text-muted-foreground mt-2 max-w-2xl mx-auto">
            Explore population and geographic stats. Solid green/neutral colors only, fully dark-mode compatible.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6 items-end">
          <div className="lg:col-span-5">
            <CountrySearch onSelect={(c) => setSelected(c)} placeholder="Search a country..." />
          </div>
          <div className="lg:col-span-5">
            <CountrySearch onSelect={(c) => setCompare(c)} placeholder="Compare with another country (optional)" />
          </div>
          <div className="lg:col-span-2" />
        </div>

        {!selected && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Top 10 by {metric.replace(/_/g, ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart items={topGlobal} />
              </CardContent>
            </Card>
            <Card className="border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Global Heatmap</span>
                  <div className="w-[200px]">
                    <Select value={metric} onValueChange={setMetric}>
                      <SelectTrigger className="h-8 text-xs md:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {Object.keys(INDICATORS).map((k) => (
                          <SelectItem key={k} value={k} className="text-xs md:text-sm">{k.replace(/_/g,' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WorldMap
                  valuesMap={heatmap.map}
                  min={heatmap.min}
                  max={heatmap.max}
                  metricLabel={metric.replace(/_/g, ' ')}
                  onCountryClick={(c) => setSelected(c)}
                />
              </CardContent>
            </Card>
            <Card className="border bg-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base md:text-lg">
                  <span className="font-semibold">Correlation Explorer</span>
                  <div className="flex items-center gap-2">
                    <Select value={corrX} onValueChange={setCorrX}>
                      <SelectTrigger className="h-8 w-[180px] text-xs md:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {Object.keys(INDICATORS).map(k=> (
                          <SelectItem key={k} value={k} className="text-xs md:text-sm">{k.replace(/_/g,' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground text-xs md:text-sm">vs</span>
                    <Select value={corrY} onValueChange={setCorrY}>
                      <SelectTrigger className="h-8 w-[180px] text-xs md:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {Object.keys(INDICATORS).map(k=> (
                          <SelectItem key={k} value={k} className="text-xs md:text-sm">{k.replace(/_/g,' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <button className={`px-2 py-1 text-xs rounded border ${useLog ? 'bg-primary text-primary-foreground' : 'bg-card'}`} onClick={()=>setUseLog(v=>!v)}>Log scale</button>
                    <button className={`px-2 py-1 text-xs rounded border ${showTrend ? 'bg-primary text-primary-foreground' : 'bg-card'}`} onClick={()=>setShowTrend(v=>!v)}>Trendline</button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {corrLoading ? (
                  <div className="text-muted-foreground text-sm">Computing correlation…</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="overflow-hidden rounded-lg border bg-muted/30">
                      <ScatterPlot points={corrData} xLabel={prettyLabel(corrX)} yLabel={prettyLabel(corrY)} useLog={useLog} showTrend={showTrend} />
                    </div>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Pearson</span>
                        <span className="font-mono text-base">{corrStats.pearson != null ? corrStats.pearson.toFixed(3) : 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Spearman</span>
                        <span className="font-mono text-base">{corrStats.spearman != null ? corrStats.spearman.toFixed(3) : 'N/A'}</span>
                      </div>
                      {/* Simple rule-based insight */}
                      <div className="mt-3 text-muted-foreground">
                        <div className="font-semibold mb-1">Insight</div>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Relationship: {corrStats.pearson == null ? 'N/A' : Math.abs(corrStats.pearson) > 0.7 ? 'strong' : Math.abs(corrStats.pearson) > 0.4 ? 'moderate' : 'weak'} {corrStats.pearson > 0 ? 'positive' : 'negative'} correlation.
                          </li>
                          <li>
                            Distribution: {useLog ? 'log-scale applied to reduce skew.' : 'values appear skewed; apply log-scale if many points cluster.'}
                          </li>
                          <li>
                            Notable outliers: {(() => {
                              try {
                                if (!corrData || corrData.length < 3) return 'None';
                                // simple residuals against mean model
                                const mx = corrData.reduce((a,p)=>a+p.x,0)/corrData.length;
                                const my = corrData.reduce((a,p)=>a+p.y,0)/corrData.length;
                                const withRes = corrData.map(p=> ({...p, r: Math.abs((p.x-mx)*(p.y-my))}));
                                const top = withRes.sort((a,b)=>b.r-a.r).slice(0,3);
                                return top.map(t=> codeToName[t.code] || t.code).join(', ');
                              } catch { return 'None'; }
                            })()}
                          </li>
                        </ul>
                      </div>
                      <div className="mt-3">
                        <button
                          disabled={aiBusy}
                          className={`text-xs underline ${aiBusy ? 'text-muted-foreground' : 'text-primary'}`}
                          onClick={async ()=>{
                            try {
                              setAiBusy(true);
                              const text = await aiInsightsService.summarizeCorrelation({
                                indicatorX: prettyLabel(corrX),
                                indicatorY: prettyLabel(corrY),
                                pearson: corrStats.pearson,
                                spearman: corrStats.spearman,
                                topCountries: topGlobal.slice(0,5),
                                bottomCountries: topGlobal.slice(-5),
                                samplePoints: corrData,
                              });
                              setAiText(text);
                            } catch (e) {
                              setAiText('AI insight unavailable.');
                            } finally {
                              setAiBusy(false);
                            }
                          }}
                        >
                          {aiBusy ? 'Generating AI insight…' : 'Generate AI insight'}
                        </button>
                        {aiText && (
                          <div className="mt-2 p-3 border rounded bg-muted/20 text-[13px] space-y-2">
                            <div className="whitespace-pre-wrap">
                              {typeof aiText === 'string' ? aiText : (aiText.summary || '')}
                            </div>
                            {Array.isArray(aiText.bullets) && aiText.bullets.length > 0 && (
                              <ul className="list-disc pl-5 space-y-1">
                                {aiText.bullets.map((b,i)=> (<li key={i}>{b}</li>))}
                              </ul>
                            )}
                            {aiText.caveats && (
                              <div className="text-xs text-muted-foreground">Caveats: {aiText.caveats}</div>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        className="mt-2 text-xs underline text-primary"
                        onClick={() => {
                          const rows = corrData.map(p=> `${p.code},${p.x},${p.y}`);
                          const csv = `code,${corrX},${corrY}\n${rows.join('\n')}`;
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url; a.download = `correlation_${corrX}_${corrY}.csv`; a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {selected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric series + population/area cards */}
            <Card className="border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> {metric.replace(/_/g, ' ')} Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : error || !hasData ? (
                  <div className="text-muted-foreground">No data available.</div>
                ) : (
                  <div className="space-y-2">
                    <div className="mt-2">
                      <LineChart
                        dataPoints={series}
                        dataPoints2={seriesCompare}
                        label1={selected?.name}
                        label2={compare?.name}
                      />
                      {growthPct !== null && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {growthPct >= 0 ? "+" : ""}{growthPct.toFixed(2)}% since {series[0]?.year}
                        </div>
                      )}
                      <button
                        className="mt-2 text-xs underline text-primary"
                        onClick={() => {
                          const rows = (series || []).map((d) => `${d.year},${d.value}`);
                          const csv = `year,value\n${rows.join('\n')}`;
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url; a.download = `${selected?.code || 'series'}.csv`; a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <span className="inline-flex items-center gap-1"><Download className="w-3 h-3" /> Export CSV</span>
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Area */}
            <Card className="border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" /> Area
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : error || !hasData ? (
                  <div className="text-muted-foreground">No data available.</div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {enhancedCountryService.formatNumber(data.area)} km²
                    </div>
                    <div className="text-sm text-muted-foreground">Total land area</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Capital & Region */}
            <Card className="border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Capital & Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-muted-foreground">Loading...</div>
                ) : error || !hasData ? (
                  <div className="text-muted-foreground">No data available.</div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Capital</div>
                      <div className="font-semibold">{data.capital || 'N/A'}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Region</div>
                        <div className="font-semibold">{data.region}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Subregion</div>
                        <div className="font-semibold">{data.subregion || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

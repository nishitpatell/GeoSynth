/**
 * Demographics Service
 * Fetches population time-series and global rankings from World Bank Open Data (no API key required)
 */

const WB_BASE = 'https://api.worldbank.org/v2';
export const INDICATORS = {
  POPULATION: 'SP.POP.TOTL',
  GDP_PC: 'NY.GDP.PCAP.CD',
  LIFE_EXPECTANCY: 'SP.DYN.LE00.IN',
  LITERACY: 'SE.ADT.LITR.ZS',
  ELECTRICITY_ACCESS: 'EG.ELC.ACCS.ZS',
  UNEMPLOYMENT: 'SL.UEM.TOTL.ZS',
  TOURIST_ARRIVALS: 'ST.INT.ARVL',
  CO2_PC: 'EN.ATM.CO2E.PC',
  FERTILITY: 'SP.DYN.TFRT.IN',
};
const POP_INDICATOR = INDICATORS.POPULATION;

export const demographicsService = {
  /** Generic series by indicator */
  async getIndicatorSeries(iso3, indicator, start = 2000, end = new Date().getFullYear()) {
    try {
      const url = `${WB_BASE}/country/${iso3}/indicator/${indicator}?date=${start}:${end}&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`World Bank error: ${res.status}`);
      const data = await res.json();
      const rows = Array.isArray(data) && data[1] ? data[1] : [];
      const series = rows
        .filter((d) => d.value != null)
        .map((d) => ({ year: Number(d.date), value: Number(d.value) }))
        .sort((a, b) => a.year - b.year);
      return { series };
    } catch (e) {
      console.error('getIndicatorSeries failed', e);
      return { series: [], error: e.message };
    }
  },
  /**
   * Get population time-series for an ISO3 country code
   * Returns [{ year: number, value: number }]
   */
  async getPopulationSeries(iso3, start = 2000, end = new Date().getFullYear()) {
    try {
      return this.getIndicatorSeries(iso3, POP_INDICATOR, start, end);
    } catch (e) {
      console.error('getPopulationSeries failed', e);
      return { series: [], error: e.message };
    }
  },

  /**
   * Get top N countries by indicator for the most recent year available
   */
  async getTopCountriesByIndicator(indicator, limit = 10, year = new Date().getFullYear() - 1) {
    try {
      const url = `${WB_BASE}/country/all/indicator/${indicator}?date=${year}&format=json&per_page=20000`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`World Bank error: ${res.status}`);
      const data = await res.json();
      const rows = Array.isArray(data) && data[1] ? data[1] : [];
      const byPop = rows
        .filter((r) => r.value != null && r.countryiso3code && r.country && r.country.value)
        .map((r) => ({ code: r.countryiso3code, name: r.country.value, value: Number(r.value) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit);
      return { items: byPop };
    } catch (e) {
      console.error('getTopCountriesByPopulation failed', e);
      return { items: [], error: e.message };
    }
  },
  /**
   * Get a map of ISO3 -> value for a given indicator and year (for heatmaps)
   */
  async getAllByIndicatorYear(indicator, year = new Date().getFullYear() - 1) {
    try {
      const url = `${WB_BASE}/country/all/indicator/${indicator}?date=${year}&format=json&per_page=20000`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`World Bank error: ${res.status}`);
      const data = await res.json();
      const rows = Array.isArray(data) && data[1] ? data[1] : [];
      const map = {};
      let min = Infinity, max = -Infinity;
      for (const r of rows) {
        if (r.value == null || !r.countryiso3code) continue;
        const val = Number(r.value);
        map[r.countryiso3code] = val;
        if (val < min) min = val;
        if (val > max) max = val;
      }
      if (min === Infinity) { min = 0; max = 0; }
      return { map, min, max };
    } catch (e) {
      console.error('getAllByIndicatorYear failed', e);
      return { map: {}, min: 0, max: 0, error: e.message };
    }
  },
  // Backward-compat wrappers
  async getTopCountriesByPopulation(limit = 10, year = new Date().getFullYear() - 1) {
    return this.getTopCountriesByIndicator(POP_INDICATOR, limit, year);
  },
};

export default demographicsService;

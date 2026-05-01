const BASE_URL = "https://esgoo.net/api-tinhthanh";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

const _normalize = (item) => ({
  value: String(item.code || item.id || ""),
  label: item.name || "",
  type: item.full_name ? item.full_name.split(" ").slice(0, -1).join(" ") : "",
});

const _getCache = (key) => {
  if (!import.meta.client) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const _setCache = (key, data) => {
  if (!import.meta.client) return;
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch { /* ignore */ }
};

const _apiFetch = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (json.error !== 0) throw new Error(`API error: ${json.error_text}`);
  return json.data ?? [];
};

const _staticFetch = async (path) => {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Static file error: ${res.status}`);
  return res.json();
};

export const vietnamAddressApi = {
  async getProvinces() {
    const cacheKey = "vna_provinces_v2";
    const cached = _getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await _apiFetch(`${BASE_URL}/1/0.htm`);
      const normalized = data.map(_normalize);
      _setCache(cacheKey, normalized);
      return normalized;
    } catch {
      try {
        const data = await _staticFetch("/data/vn-addresses/provinces.json");
        if (Array.isArray(data) && data.length > 0) {
          return data.map(_normalize);
        }
      } catch { /* ignore */ }
      return [];
    }
  },

  async getDistricts(provinceCode) {
    if (!provinceCode) return [];
    const cacheKey = `vna_districts_v2_${provinceCode}`;
    const cached = _getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await _apiFetch(`${BASE_URL}/2/${provinceCode}.htm`);
      const normalized = data.map(_normalize);
      _setCache(cacheKey, normalized);
      return normalized;
    } catch {
      try {
        // esgoo IDs are already padded (e.g. "01", "79"), use as-is for static files
        const data = await _staticFetch(`/data/vn-addresses/districts/${provinceCode}.json`);
        if (Array.isArray(data) && data.length > 0) {
          return data.map(_normalize);
        }
      } catch { /* ignore */ }
      return [];
    }
  },

  async getWards(districtCode) {
    if (!districtCode) return [];
    const cacheKey = `vna_wards_v2_${districtCode}`;
    const cached = _getCache(cacheKey);
    if (cached) return cached;

    try {
      const data = await _apiFetch(`${BASE_URL}/3/${districtCode}.htm`);
      const normalized = data.map(_normalize);
      _setCache(cacheKey, normalized);
      return normalized;
    } catch {
      try {
        // esgoo IDs are already padded (e.g. "001", "079"), use as-is for static files
        const data = await _staticFetch(`/data/vn-addresses/wards/${districtCode}.json`);
        if (Array.isArray(data) && data.length > 0) {
          return data.map(_normalize);
        }
      } catch { /* ignore */ }
      return [];
    }
  },

  clearCache() {
    if (!import.meta.client) return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith("vna_"))
      .forEach((k) => localStorage.removeItem(k));
  },
};

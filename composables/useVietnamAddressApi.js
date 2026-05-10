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

  /**
   * Normalize a code value that might be a string code or a {value, label} object.
   * Returns the string code, or null if invalid.
   */
  _normalizeCode(code) {
    if (!code) return null;
    if (typeof code === "string") return code.trim() || null;
    if (typeof code === "object" && code !== null) {
      return String(code.value || code.code || "").trim() || null;
    }
    return String(code).trim() || null;
  },

  /**
   * Resolve address codes to full {value, label} objects.
   * Priority: esgoo API cache → esgoo API call → static files fallback.
   * Accepts codes as strings ("01") or as {value, label} objects (from resolved addresses).
   * Returns { province, district, ward } where each is {value, label} or null.
   */
  async resolveAddressCode({ province_code, district_code, ward_code }) {
    const result = { province: null, district: null, ward: null };

    const pCode = this._normalizeCode(province_code);
    if (!pCode) return result;

    // ── Province ────────────────────────────────────────────────
    const provinces = await this.getProvinces();
    const province = provinces.find((p) => String(p.value) === String(pCode));
    if (province) {
      result.province = { value: pCode, label: province.label };
    }

    const dCode = this._normalizeCode(district_code);
    if (!dCode) return result;

    // ── District ────────────────────────────────────────────────
    const districts = await this.getDistricts(pCode);
    const district = districts.find((d) => String(d.value) === String(dCode));
    if (district) {
      result.district = { value: dCode, label: district.label };
    }

    const wCode = this._normalizeCode(ward_code);
    if (!wCode) return result;

    // ── Ward ──────────────────────────────────────────────────
    const wards = await this.getWards(dCode);
    const ward = wards.find((w) => String(w.value) === String(wCode));
    if (ward) {
      result.ward = { value: wCode, label: ward.label };
    }

    return result;
  },
};

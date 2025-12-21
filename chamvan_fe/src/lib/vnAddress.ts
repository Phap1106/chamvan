// chamvan_fe/src/lib/vnAddress.ts
export type Province = { code: string; name: string };
export type District = { code: string; name: string; provinceCode: string };
export type Ward = { code: string; name: string; districtCode: string; provinceCode: string };

type AnyObj = Record<string, any>;

const DATA_URL = "/vn-address/vn_units.json";

// cache trong runtime để không fetch lại nhiều lần
let _cache:
  | Promise<{
      provinces: Province[];
      districts: District[];
      wards: Ward[];
    }>
  | null = null;

function s(v: any): string {
  return String(v ?? "").trim();
}

function safeArray(v: any): any[] {
  return Array.isArray(v) ? v : [];
}

/**
 * Hỗ trợ 2 schema:
 * A) FULL: Province { Code, FullName, Districts:[{Code,FullName,Wards:[...]}] }
 * B) SIMPLE (file của bạn hiện tại): Province { Code, FullName, Wards:[{Code,FullName,ProvinceCode}] }
 *    => fallback: tạo 1 District giả "Khác" cho mỗi Province để UI vẫn dùng được.
 */
function normalize(raw: any) {
  const root = raw;

  const provincesRaw = safeArray(root);
  const provinces: Province[] = [];
  const districts: District[] = [];
  const wards: Ward[] = [];

  for (const p of provincesRaw) {
    const pCode = s(p?.Code || p?.code);
    const pName = s(p?.FullName || p?.name || p?.Name);

    if (!pCode || !pName) continue;
    provinces.push({ code: pCode, name: pName });

    const districtsRaw = safeArray(p?.Districts || p?.districts);

    // ✅ Schema FULL có Districts
    if (districtsRaw.length) {
      for (const d of districtsRaw) {
        const dCode = s(d?.Code || d?.code);
        const dName = s(d?.FullName || d?.name || d?.Name);
        if (!dCode || !dName) continue;

        districts.push({ code: dCode, name: dName, provinceCode: pCode });

        const wardsRaw = safeArray(d?.Wards || d?.wards);
        for (const w of wardsRaw) {
          const wCode = s(w?.Code || w?.code);
          const wName = s(w?.FullName || w?.name || w?.Name);
          if (!wCode || !wName) continue;

          wards.push({
            code: wCode,
            name: wName,
            districtCode: dCode,
            provinceCode: pCode,
          });
        }
      }
      continue;
    }

    // ✅ Schema SIMPLE (file bạn đang có) chỉ có Wards + ProvinceCode
    const wardsOnlyRaw = safeArray(p?.Wards || p?.wards);

    // tạo 1 district giả để không làm “gãy” dropdown Quận/Huyện
    const fakeDistrictCode = `${pCode}__OTHER`;
    districts.push({
      code: fakeDistrictCode,
      name: "Khác",
      provinceCode: pCode,
    });

    for (const w of wardsOnlyRaw) {
      const wCode = s(w?.Code || w?.code);
      const wName = s(w?.FullName || w?.name || w?.Name);
      if (!wCode || !wName) continue;

      wards.push({
        code: wCode,
        name: wName,
        districtCode: fakeDistrictCode,
        provinceCode: pCode,
      });
    }
  }

  // sort nhẹ để dropdown đẹp
  provinces.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  districts.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  wards.sort((a, b) => a.name.localeCompare(b.name, "vi"));

  return { provinces, districts, wards };
}

async function loadAll() {
  if (_cache) return _cache;

  _cache = (async () => {
    const res = await fetch(DATA_URL, { cache: "force-cache" });
    if (!res.ok) {
      throw new Error(`Cannot load ${DATA_URL}. HTTP ${res.status}`);
    }
    const json = (await res.json()) as AnyObj;
    // json phải là array province
    return normalize(json);
  })();

  return _cache;
}

export async function getProvinces(): Promise<Province[]> {
  const { provinces } = await loadAll();
  return provinces;
}

export async function getDistrictsByProvinceCode(provinceCode: string): Promise<District[]> {
  const { districts } = await loadAll();
  const p = s(provinceCode);
  return districts.filter((d) => d.provinceCode === p);
}

export async function getWardsByDistrictCode(districtCode: string): Promise<Ward[]> {
  const { wards } = await loadAll();
  const d = s(districtCode);
  return wards.filter((w) => w.districtCode === d);
}

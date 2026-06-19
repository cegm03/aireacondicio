import { ref, get } from "firebase/database";
import { db } from "../firebase";

// ─── Shared type (same shape as the old csvParser) ───────────────────────────
export interface AirConditioner {
  id: number;
  brand: string;
  ton: string;
  condenserCoil: string;
  powerConsumption: string;
  refrigerant: string;
  noiseLevel: number;
  star: number;
  ratingsCount: number;
  price: number;
  imageUrl: string;
}

// ─── Raw shape coming from Firebase /data ────────────────────────────────────
interface RawACRecord {
  Brand_name?: string;
  TOn?: string | number;
  Condenser_Coil?: string;
  Power_Consumption?: string;
  RefrigeranT?: string;
  Noise_level?: string | number;
  STAR?: string | number;
  Ratings?: string | number;
  Price?: string | number;
  Image_url?: string;
  // allow any extra keys Firebase might include
  [key: string]: unknown;
}

// ─── Helpers (same normalisation logic as the old CSV parser) ─────────────────

function normalizeBrandAndTon(
  rawBrand: string,
  rawTon: string,
  columns: RawACRecord
): { brand: string; ton: string; overrides: Partial<RawACRecord> } {
  let brand = rawBrand;
  let ton = rawTon;
  let overrides: Partial<RawACRecord> = {};

  // Blue Star split anomaly
  if (brand.toLowerCase() === "blue" && ton.toLowerCase() === "star") {
    brand = "Blue Star";
    ton = "1.5";
    overrides = {
      Condenser_Coil: columns.Condenser_Coil || "Copper",
      Power_Consumption: columns.Power_Consumption || "N/A",
      RefrigeranT: String(columns.RefrigeranT || "").includes("No")
        ? "R-32"
        : String(columns.RefrigeranT || "R-32"),
      Noise_level: columns.Noise_level || "39 dB",
      STAR: columns.STAR || "0.0",
      Ratings: columns.Ratings || "0",
      Price: columns.Price || "0",
      Image_url: String(columns.Image_url || ""),
    };
  }

  // O General split anomaly
  if (brand.toLowerCase() === "o" && ton.toLowerCase() === "general") {
    brand = "O General";
    ton = "1.5";
    overrides = {
      Condenser_Coil: columns.Condenser_Coil || "Copper",
      Power_Consumption: columns.Power_Consumption || "N/A",
      RefrigeranT: String(columns.RefrigeranT || "").includes("No")
        ? "R-32"
        : String(columns.RefrigeranT || "R-32"),
      Noise_level: columns.Noise_level || "40 dB",
      STAR: columns.STAR || "0.0",
      Ratings: columns.Ratings || "0",
      Price: columns.Price || "0",
      Image_url: String(columns.Image_url || ""),
    };
  }

  // MarQ split anomaly
  if (brand.toLowerCase() === "marq" && ton.toLowerCase() === "by") {
    brand = "MarQ";
    ton = "1.5";
  }

  // Long / invalid brand names
  if (brand.length > 30) {
    if (ton === "-" || !ton) {
      const tonMatch = brand.match(/(\d+(?:\.\d+)?)\s*Ton/i);
      if (tonMatch) ton = tonMatch[1];
    }
    brand = "Generic";
  }

  // Normalize capacity
  const invalidTons = ["-", "by", "super", "flexicool", "."];
  if (!ton || invalidTons.includes(ton.toLowerCase())) {
    ton = "1.5";
  }

  // Brand casing
  const brandMap: Record<string, string> = {
    SAMSUNG: "Samsung",
    LG: "LG",
    CARRIER: "Carrier",
    MOTOROLA: "Motorola",
    ONIDA: "Onida",
    IFB: "IFB",
  };
  if (brandMap[brand.toUpperCase()]) brand = brandMap[brand.toUpperCase()];

  return { brand, ton, overrides };
}

function normalizeRefrigerant(raw: string): string {
  const upper = raw.trim().toUpperCase();
  if (upper.includes("R-32") || upper.includes("R32") || upper.includes("R - 32")) return "R-32";
  if (upper.includes("R-22") || upper.includes("R22")) return "R-22";
  if (upper.includes("R410A") || upper.includes("R410") || upper.includes("R-410A")) return "R-410A";
  return "R-32";
}

function normalizeCoil(raw: string): string {
  if (raw.toLowerCase().includes("copper")) return "Copper";
  if (raw.toLowerCase().includes("alloy")) return "Alloy";
  return "Copper";
}

function parseNoise(raw: string | number): number {
  const match = String(raw).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 40;
}

function parsePrice(raw: string | number): number {
  return parseInt(String(raw).replace(/[^\d]/g, ""), 10) || 0;
}

// ─── Main fetch function (replaces fetchAndParseDataset) ──────────────────────

export async function fetchAndParseDataset(): Promise<AirConditioner[]> {
  try {
    const snapshot = await get(ref(db, "data"));

    if (!snapshot.exists()) {
      console.warn("No data found at Firebase /data node.");
      return [];
    }

    const raw = snapshot.val() as Record<string, RawACRecord> | RawACRecord[];
    const records: RawACRecord[] = Array.isArray(raw)
      ? raw
      : Object.values(raw);

    const items: AirConditioner[] = [];

    records.forEach((record, index) => {
      let rawBrand = String(record.Brand_name || "Unknown");
      let rawTon = String(record.TOn || "1.5");
      let rawCoil = String(record.Condenser_Coil || "Copper");
      let rawPower = String(record.Power_Consumption || "N/A");
      let rawRefrigerant = String(record.RefrigeranT || "R-32");
      let rawNoise = record.Noise_level ?? "40 dB";
      let rawStar = String(record.STAR || "0");
      let rawRatings = String(record.Ratings || "0");
      let rawPrice = record.Price ?? "0";
      let rawImage = String(record.Image_url || "");

      const { brand, ton, overrides } = normalizeBrandAndTon(rawBrand, rawTon, record);
      if (Object.keys(overrides).length > 0) {
        rawCoil = String(overrides.Condenser_Coil || rawCoil);
        rawPower = String(overrides.Power_Consumption || rawPower);
        rawRefrigerant = String(overrides.RefrigeranT || rawRefrigerant);
        rawNoise = overrides.Noise_level ?? rawNoise;
        rawStar = String(overrides.STAR || rawStar);
        rawRatings = String(overrides.Ratings || rawRatings);
        rawPrice = overrides.Price ?? rawPrice;
        rawImage = String(overrides.Image_url || rawImage);
      }

      const price = parsePrice(rawPrice);
      if (price === 0) return;

      items.push({
        id: index,
        brand,
        ton,
        condenserCoil: normalizeCoil(rawCoil),
        powerConsumption: rawPower.trim(),
        refrigerant: normalizeRefrigerant(rawRefrigerant),
        noiseLevel: parseNoise(rawNoise),
        star: parseFloat(rawStar) || 0,
        ratingsCount: parseInt(String(rawRatings).replace(/[^\d]/g, ""), 10) || 0,
        price,
        imageUrl: rawImage.trim(),
      });
    });

    console.log(`Firebase: ${items.length} registros cargados correctamente.`);
    return items;
  } catch (error) {
    console.error("Error al conectar con Firebase:", error);
    return [];
  }
}

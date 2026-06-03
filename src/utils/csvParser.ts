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

// Custom parser to split CSV rows respecting quotes
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export async function fetchAndParseDataset(): Promise<AirConditioner[]> {
  try {
    const response = await fetch('/public/Air_condition_dataset.csv');
    // If fetching from /public/ fails (in some dev environments/production builds), try fetching from root path
    const finalResponse = response.ok ? response : await fetch('/Air_condition_dataset.csv');
    
    if (!finalResponse.ok) {
      throw new Error(`Failed to load dataset: ${finalResponse.statusText}`);
    }

    const text = await finalResponse.text();
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // The first line is the header
    // Brand_name,TOn,Condenser_Coil,Power_Consumption,RefrigeranT,Noise_level,STAR,Ratings,Price,Image_url
    const items: AirConditioner[] = [];

    for (let i = 1; i < lines.length; i++) {
      const columns = parseCSVLine(lines[i]);
      if (columns.length < 9) continue;

      let brand = columns[0] || 'Unknown';
      let ton = columns[1] || '1.5';
      let condenserCoil = columns[2] || 'Copper';
      let powerConsumption = columns[3] || 'N/A';
      let refrigerant = columns[4] || 'R-32';
      let noiseLevelStr = columns[5] || '0';
      let starStr = columns[6] || '0';
      let ratingsStr = columns[7] || '0';
      let priceStr = columns[8] || '0';
      let imageUrl = columns[9] || '';

      // Clean up common anomalies in the dataset
      
      // 1. Blue,Star -> Blue Star split anomaly
      if (brand.toLowerCase() === 'blue' && ton.toLowerCase() === 'star') {
        brand = 'Blue Star';
        ton = '1.5'; // Default or fallback tonnage
        condenserCoil = columns[2] || 'Copper';
        powerConsumption = columns[3] || 'N/A';
        refrigerant = columns[4]?.includes('No') ? 'R-32' : columns[4];
        noiseLevelStr = columns[5] || '39 dB';
        starStr = columns[6] || '0.0';
        ratingsStr = columns[7] || '0';
        priceStr = columns[8] || '0';
        imageUrl = columns[9] || '';
      }
      
      // 2. O,General -> O General split anomaly
      if (brand.toLowerCase() === 'o' && ton.toLowerCase() === 'general') {
        brand = 'O General';
        ton = '1.5';
        condenserCoil = columns[2] || 'Copper';
        powerConsumption = columns[3] || 'N/A';
        refrigerant = columns[4]?.includes('No') ? 'R-32' : columns[4];
        noiseLevelStr = columns[5] || '40 dB';
        starStr = columns[6] || '0.0';
        ratingsStr = columns[7] || '0';
        priceStr = columns[8] || '0';
        imageUrl = columns[9] || '';
      }

      // 3. MarQ,By -> MarQ split anomaly
      if (brand.toLowerCase() === 'marq' && ton.toLowerCase() === 'by') {
        brand = 'MarQ';
        ton = '1.5';
        condenserCoil = columns[2] || 'Copper';
        powerConsumption = columns[3] || 'N/A';
        refrigerant = columns[4] || 'R-32';
        noiseLevelStr = columns[5] || '40 dB';
        starStr = columns[6] || '0.0';
        ratingsStr = columns[7] || '0';
        priceStr = columns[8] || '0';
        imageUrl = columns[9] || '';
      }

      // 4. Clean long/invalid brand names (like "4-in-1 Convertible 1 Ton 4 Star Split Inverter ")
      if (brand.length > 30) {
        // Try to extract capacity if ton is '-' or empty
        if (ton === '-' || !ton) {
          const tonMatch = brand.match(/(\d+(?:\.\d+)?)\s*Ton/i);
          if (tonMatch) {
            ton = tonMatch[1];
          }
        }
        brand = 'Generic';
      }

      // Normalize capacity tonnage
      if (ton === '-' || ton.toLowerCase() === 'by' || ton.toLowerCase() === 'super' || ton.toLowerCase() === 'flexicool' || ton === '.') {
        ton = '1.5'; // reasonable default
      }

      // Parse numerical values
      const price = parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0;
      const star = parseFloat(starStr) || 0.0;
      const ratingsCount = parseInt(ratingsStr.replace(/[^\d]/g, ''), 10) || 0;

      // Extract noise level digit
      const noiseMatch = noiseLevelStr.match(/(\d+)/);
      const noiseLevel = noiseMatch ? parseInt(noiseMatch[1], 10) : 40; // Default 40 dB if not found

      // Normalize condenser coil name
      if (condenserCoil.toLowerCase().includes('copper')) {
        condenserCoil = 'Copper';
      } else if (condenserCoil.toLowerCase().includes('alloy')) {
        condenserCoil = 'Alloy';
      } else {
        condenserCoil = 'Copper'; // Default
      }

      // Normalize refrigerant
      let cleanRefrigerant = refrigerant.trim().toUpperCase();
      if (cleanRefrigerant.includes('R-32') || cleanRefrigerant.includes('R32') || cleanRefrigerant.includes('R - 32')) {
        cleanRefrigerant = 'R-32';
      } else if (cleanRefrigerant.includes('R-22') || cleanRefrigerant.includes('R22')) {
        cleanRefrigerant = 'R-22';
      } else if (cleanRefrigerant.includes('R410A') || cleanRefrigerant.includes('R410') || cleanRefrigerant.includes('R-410A')) {
        cleanRefrigerant = 'R-410A';
      } else {
        cleanRefrigerant = 'R-32'; // Most common
      }

      // Normalize Brand casing
      if (brand.toUpperCase() === 'SAMSUNG') brand = 'Samsung';
      if (brand.toUpperCase() === 'LG') brand = 'LG';
      if (brand.toUpperCase() === 'CARRIER') brand = 'Carrier';
      if (brand.toUpperCase() === 'MOTOROLA') brand = 'Motorola';
      if (brand.toUpperCase() === 'ONIDA') brand = 'Onida';
      if (brand.toUpperCase() === 'IFB') brand = 'IFB';

      // Ensure price is not 0 (if so, skip or assign a mock value for aesthetics, let's keep valid priced ones)
      if (price === 0) continue;

      items.push({
        id: i,
        brand,
        ton,
        condenserCoil,
        powerConsumption: powerConsumption.trim(),
        refrigerant: cleanRefrigerant,
        noiseLevel,
        star,
        ratingsCount,
        price,
        imageUrl: imageUrl.trim()
      });
    }

    return items;
  } catch (error) {
    console.error("Error reading or parsing dataset:", error);
    return [];
  }
}

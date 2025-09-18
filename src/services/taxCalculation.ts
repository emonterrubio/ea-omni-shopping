// Tax calculation service based on shipping location
// Office locations and their corresponding zip codes and tax rates

export interface OfficeLocation {
  name: string;
  zipCode: string;
  state: string; // State/Province/Region
  country: string; // Country code (US, CA, EU)
  taxRate: number; // Tax rate as decimal (e.g., 0.0725 for 7.25%)
}

// Office locations with their zip codes and tax rates
export const OFFICE_LOCATIONS: OfficeLocation[] = [
  // US Locations
  {
    name: "Austin",
    zipCode: "78701",
    state: "TX",
    country: "US",
    taxRate: 0.0825 // 8.25% (Texas state + local)
  },
  {
    name: "Kirkland", 
    zipCode: "98033",
    state: "WA",
    country: "US",
    taxRate: 0.1025 // 10.25% (Washington state + local)
  },
  {
    name: "Los Angeles - Chatsworth",
    zipCode: "91311",
    state: "CA", 
    country: "US",
    taxRate: 0.1025 // 10.25% (California state + local)
  },
  {
    name: "Los Angeles - Del Rey",
    zipCode: "90232",
    state: "CA",
    country: "US",
    taxRate: 0.1025 // 10.25% (California state + local)
  },
  {
    name: "Orlando",
    zipCode: "32801", 
    state: "FL",
    country: "US",
    taxRate: 0.0650 // 6.50% (Florida state + local)
  },
  {
    name: "Redwood Shores",
    zipCode: "94065",
    state: "CA",
    country: "US",
    taxRate: 0.1025 // 10.25% (California state + local)
  },
  // Canadian Locations
  {
    name: "Edmonton",
    zipCode: "T5J 0A1",
    state: "AB",
    country: "CA",
    taxRate: 0.05 // 5% (GST only - Alberta has no PST)
  },
  {
    name: "Montreal",
    zipCode: "H3A 0A1",
    state: "QC",
    country: "CA",
    taxRate: 0.14975 // 14.975% (GST 5% + QST 9.975%)
  },
  {
    name: "Vancouver",
    zipCode: "V6B 0A1",
    state: "BC",
    country: "CA",
    taxRate: 0.12 // 12% (GST 5% + PST 7%)
  },
  {
    name: "Vancouver - Great Northern Way",
    zipCode: "V5T 0A1",
    state: "BC",
    country: "CA",
    taxRate: 0.12 // 12% (GST 5% + PST 7%)
  },
  {
    name: "Victoria",
    zipCode: "V8W 0A1",
    state: "BC",
    country: "CA",
    taxRate: 0.12 // 12% (GST 5% + PST 7%)
  },
  // European Locations
  {
    name: "Birmingham",
    zipCode: "B1 1AA",
    state: "England",
    country: "UK",
    taxRate: 0.20 // 20% VAT (UK)
  },
  {
    name: "Brno (Tracab)",
    zipCode: "602 00",
    state: "South Moravia",
    country: "CZ",
    taxRate: 0.21 // 21% VAT (Czech Republic)
  },
  {
    name: "Bucharest",
    zipCode: "010001",
    state: "Bucharest",
    country: "RO",
    taxRate: 0.19 // 19% VAT (Romania)
  },
  {
    name: "Cologne",
    zipCode: "50667",
    state: "North Rhine-Westphalia",
    country: "DE",
    taxRate: 0.19 // 19% VAT (Germany)
  },
  {
    name: "Cologne (Tracab)",
    zipCode: "50667",
    state: "North Rhine-Westphalia",
    country: "DE",
    taxRate: 0.19 // 19% VAT (Germany)
  },
  {
    name: "Galway",
    zipCode: "H91",
    state: "Connacht",
    country: "IE",
    taxRate: 0.23 // 23% VAT (Ireland)
  },
  {
    name: "Geneva",
    zipCode: "1201",
    state: "Geneva",
    country: "CH",
    taxRate: 0.077 // 7.7% VAT (Switzerland)
  },
  {
    name: "Gothenburg",
    zipCode: "411 38",
    state: "Västra Götaland",
    country: "SE",
    taxRate: 0.25 // 25% VAT (Sweden)
  },
  {
    name: "Guildford",
    zipCode: "GU1 1AA",
    state: "England",
    country: "UK",
    taxRate: 0.20 // 20% VAT (UK)
  },
  {
    name: "Helsinki",
    zipCode: "00100",
    state: "Uusimaa",
    country: "FI",
    taxRate: 0.24 // 24% VAT (Finland)
  },
  {
    name: "Lyon",
    zipCode: "69001",
    state: "Auvergne-Rhône-Alpes",
    country: "FR",
    taxRate: 0.20 // 20% VAT (France)
  },
  {
    name: "Madrid",
    zipCode: "28001",
    state: "Community of Madrid",
    country: "ES",
    taxRate: 0.21 // 21% VAT (Spain)
  },
  {
    name: "Manchester",
    zipCode: "M1 1AA",
    state: "England",
    country: "UK",
    taxRate: 0.20 // 20% VAT (UK)
  },
  {
    name: "Southam",
    zipCode: "CV47 0AA",
    state: "England",
    country: "UK",
    taxRate: 0.20 // 20% VAT (UK)
  },
  {
    name: "Stockholm",
    zipCode: "111 22",
    state: "Stockholm",
    country: "SE",
    taxRate: 0.25 // 25% VAT (Sweden)
  },
  {
    name: "Stockholm (Tracab)",
    zipCode: "111 22",
    state: "Stockholm",
    country: "SE",
    taxRate: 0.25 // 25% VAT (Sweden)
  },
  {
    name: "Warsaw",
    zipCode: "00-001",
    state: "Masovian",
    country: "PL",
    taxRate: 0.23 // 23% VAT (Poland)
  }
];

// Default tax rate for residential addresses (fallback)
export const DEFAULT_TAX_RATE = 0.0725; // 7.25%

/**
 * Get tax rate based on shipping location
 * @param shippingType - 'residential' or 'office'
 * @param location - For office: office location name, For residential: zip code
 * @returns Tax rate as decimal
 */
export function getTaxRate(shippingType: 'residential' | 'office', location: string): number {
  if (shippingType === 'office') {
    // Find office location by name
    const office = OFFICE_LOCATIONS.find(office => 
      office.name.toLowerCase() === location.toLowerCase()
    );
    return office ? office.taxRate : DEFAULT_TAX_RATE;
  } else {
    // For residential, we would need to implement zip code lookup
    // For now, return default rate
    return DEFAULT_TAX_RATE;
  }
}

/**
 * Calculate tax amount based on subtotal and location
 * @param subtotal - Order subtotal
 * @param shippingType - 'residential' or 'office' 
 * @param location - Office location name or residential zip code
 * @returns Tax amount rounded to 2 decimal places
 */
export function calculateTax(
  subtotal: number, 
  shippingType: 'residential' | 'office', 
  location: string
): number {
  const taxRate = getTaxRate(shippingType, location);
  return Math.round((subtotal * taxRate) * 100) / 100;
}

/**
 * Get office location details by name
 * @param locationName - Office location name
 * @returns Office location details or null if not found
 */
export function getOfficeLocation(locationName: string): OfficeLocation | null {
  return OFFICE_LOCATIONS.find(office => 
    office.name.toLowerCase() === locationName.toLowerCase()
  ) || null;
}

/**
 * Get all available office locations
 * @returns Array of office locations
 */
export function getAllOfficeLocations(): OfficeLocation[] {
  return OFFICE_LOCATIONS;
}

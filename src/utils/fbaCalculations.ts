import type { ProductData, AmazonFees, ProfitAnalysis, CriteriaResult } from '../types/calculator';

// Updated 2025 FBA Fee Structure with Low-Price FBA rates
const FBA_FEES = {
  SMALL_STANDARD: {
    maxLength: 15,
    maxWidth: 12,
    maxHeight: 0.75,
    maxWeight: 1,
    standardFees: [
      { maxOz: 2, fee: 3.06 },
      { maxOz: 4, fee: 3.15 },
      { maxOz: 6, fee: 3.24 },
      { maxOz: 8, fee: 3.33 },
      { maxOz: 10, fee: 3.43 },
      { maxOz: 12, fee: 3.53 },
      { maxOz: 14, fee: 3.60 },
      { maxOz: 16, fee: 3.65 }
    ],
    lowPriceFees: [
      { maxOz: 2, fee: 2.29 },
      { maxOz: 4, fee: 2.38 },
      { maxOz: 6, fee: 2.47 },
      { maxOz: 8, fee: 2.56 },
      { maxOz: 10, fee: 2.66 },
      { maxOz: 12, fee: 2.76 },
      { maxOz: 14, fee: 2.83 },
      { maxOz: 16, fee: 2.88 }
    ]
  },
  LARGE_STANDARD: {
    maxLength: 18,
    maxWidth: 14,
    maxHeight: 8,
    maxWeight: 20,
    standardFees: [
      { maxOz: 4, fee: 3.68 },
      { maxOz: 8, fee: 3.90 },
      { maxOz: 12, fee: 4.15 },
      { maxOz: 16, fee: 4.55 },
      { maxLb: 1.25, fee: 4.99 },
      { maxLb: 1.5, fee: 5.37 },
      { maxLb: 1.75, fee: 5.52 },
      { maxLb: 2, fee: 5.77 },
      { maxLb: 2.25, fee: 5.87 },
      { maxLb: 2.5, fee: 6.05 },
      { maxLb: 2.75, fee: 6.21 },
      { maxLb: 3, fee: 6.62 }
    ],
    lowPriceFees: [
      { maxOz: 4, fee: 2.91 },   // $3.68 - $0.77
      { maxOz: 8, fee: 3.13 },   // $3.90 - $0.77
      { maxOz: 12, fee: 3.38 },  // $4.15 - $0.77
      { maxOz: 16, fee: 3.78 },  // $4.55 - $0.77
      { maxLb: 1.25, fee: 4.22 }, // $4.99 - $0.77
      { maxLb: 1.5, fee: 4.60 },  // $5.37 - $0.77
      { maxLb: 1.75, fee: 4.75 }, // $5.52 - $0.77
      { maxLb: 2, fee: 5.00 },    // $5.77 - $0.77
      { maxLb: 2.25, fee: 5.10 }, // $5.87 - $0.77
      { maxLb: 2.5, fee: 5.28 },  // $6.05 - $0.77
      { maxLb: 2.75, fee: 5.44 }, // $6.21 - $0.77
      { maxLb: 3, fee: 5.85 }     // $6.62 - $0.77
    ]
  },
  LARGE_BULKY: {
    maxWeight: 50,
    standardBaseFee: 9.61,
    lowPriceBaseFee: 8.84, // $9.61 - $0.77
    perLbInterval: 0.38
  },
  EXTRA_LARGE: {
    '0-50': { 
      standardBaseFee: 26.33, 
      lowPriceBaseFee: 25.56, // $26.33 - $0.77
      perLbInterval: 0.38, 
      aboveWeight: 1 
    },
    '50-70': { 
      standardBaseFee: 40.12, 
      lowPriceBaseFee: 39.35, // $40.12 - $0.77
      perLbInterval: 0.75, 
      aboveWeight: 51 
    },
    '70-150': { 
      standardBaseFee: 54.81, 
      lowPriceBaseFee: 54.04, // $54.81 - $0.77
      perLbInterval: 0.75, 
      aboveWeight: 71 
    },
    '150+': { 
      standardBaseFee: 194.95, 
      lowPriceBaseFee: 194.18, // $194.95 - $0.77
      perLbInterval: 0.19, 
      aboveWeight: 151 
    }
  }
};

function calculateFulfillmentFee(sizeTier: string, weight: number, sellingPrice: number): number {
  // Determine if product qualifies for Low-Price FBA (under $10)
  const isLowPrice = sellingPrice < 10;
  
  switch (sizeTier) {
    case 'SMALL_STANDARD':
      const ozWeightSmall = poundsToOz(weight);
      const smallFees = isLowPrice ? FBA_FEES.SMALL_STANDARD.lowPriceFees : FBA_FEES.SMALL_STANDARD.standardFees;
      
      for (const tier of smallFees) {
        if (ozWeightSmall <= tier.maxOz) {
          return tier.fee;
        }
      }
      return smallFees[smallFees.length - 1].fee;

    case 'LARGE_STANDARD':
      const ozWeightLarge = poundsToOz(weight);
      const largeFees = isLowPrice ? FBA_FEES.LARGE_STANDARD.lowPriceFees : FBA_FEES.LARGE_STANDARD.standardFees;
      
      // Check oz-based tiers first (up to 16 oz)
      for (const tier of largeFees) {
        if (tier.maxOz && ozWeightLarge <= tier.maxOz) {
          return tier.fee;
        }
      }
      
      // Check lb-based tiers (1 lb to 3 lb)
      for (const tier of largeFees) {
        if (tier.maxLb && weight <= tier.maxLb) {
          return tier.fee;
        }
      }
      
      // Above 3 lb: base fee + $0.08 per 4 oz interval above first 3 lb
      if (weight > 3) {
        const extraWeight = weight - 3;
        const fourOzIntervals = Math.ceil(extraWeight * 4);
        const baseFee = isLowPrice ? 6.15 : 6.92; // $6.92 - $0.77 = $6.15
        return baseFee + (fourOzIntervals * 0.08);
      }
      
      return largeFees[largeFees.length - 1].fee;

    case 'LARGE_BULKY':
      const extraWeightBulky = Math.max(0, weight - 1);
      const lbIntervals = Math.ceil(extraWeightBulky);
      const baseFee = isLowPrice ? FBA_FEES.LARGE_BULKY.lowPriceBaseFee : FBA_FEES.LARGE_BULKY.standardBaseFee;
      return baseFee + (lbIntervals * FBA_FEES.LARGE_BULKY.perLbInterval);

    case 'EXTRA_LARGE':
      if (weight <= 50) {
        const extraWeight = Math.max(0, weight - 1);
        const lbIntervals = Math.ceil(extraWeight);
        const baseFee = isLowPrice ? FBA_FEES.EXTRA_LARGE['0-50'].lowPriceBaseFee : FBA_FEES.EXTRA_LARGE['0-50'].standardBaseFee;
        return baseFee + (lbIntervals * FBA_FEES.EXTRA_LARGE['0-50'].perLbInterval);
      } else if (weight <= 70) {
        const extraWeight = Math.max(0, weight - 51);
        const lbIntervals = Math.ceil(extraWeight);
        const baseFee = isLowPrice ? FBA_FEES.EXTRA_LARGE['50-70'].lowPriceBaseFee : FBA_FEES.EXTRA_LARGE['50-70'].standardBaseFee;
        return baseFee + (lbIntervals * FBA_FEES.EXTRA_LARGE['50-70'].perLbInterval);
      } else if (weight <= 150) {
        const extraWeight = Math.max(0, weight - 71);
        const lbIntervals = Math.ceil(extraWeight);
        const baseFee = isLowPrice ? FBA_FEES.EXTRA_LARGE['70-150'].lowPriceBaseFee : FBA_FEES.EXTRA_LARGE['70-150'].standardBaseFee;
        return baseFee + (lbIntervals * FBA_FEES.EXTRA_LARGE['70-150'].perLbInterval);
      } else {
        const extraWeight = Math.max(0, weight - 151);
        const lbIntervals = Math.ceil(extraWeight);
        const baseFee = isLowPrice ? FBA_FEES.EXTRA_LARGE['150+'].lowPriceBaseFee : FBA_FEES.EXTRA_LARGE['150+'].standardBaseFee;
        return baseFee + (lbIntervals * FBA_FEES.EXTRA_LARGE['150+'].perLbInterval);
      }

    default:
      return 0;
  }
}

// Updated Amazon Referral Fee Structure (2025)
function calculateReferralFee(category: string, sellingPrice: number): number {
  const minimumFee = 0.30; // Most categories have $0.30 minimum
  
  let fee = 0;
  
  switch (category) {
    case 'electronics':
      // Consumer Electronics: 8%
      fee = sellingPrice * 0.08;
      break;
      
    case 'home-kitchen':
      // Home and Kitchen: 15%
      fee = sellingPrice * 0.15;
      break;
      
    case 'clothing':
      // Clothing and Accessories: tiered
      if (sellingPrice <= 15) {
        fee = sellingPrice * 0.05;
      } else if (sellingPrice <= 20) {
        fee = sellingPrice * 0.10;
      } else {
        fee = sellingPrice * 0.17;
      }
      break;
      
    case 'books':
      // Media - Books: 15%, no minimum fee
      return sellingPrice * 0.15;
      
    case 'toys-games':
      // Toys and Games: 15%
      fee = sellingPrice * 0.15;
      break;
      
    case 'sports':
      // Sports and Outdoors: 15%
      fee = sellingPrice * 0.15;
      break;
      
    case 'beauty':
      // Beauty, Health and Personal Care: tiered
      if (sellingPrice <= 10) {
        fee = sellingPrice * 0.08;
      } else {
        fee = sellingPrice * 0.15;
      }
      break;
      
    case 'automotive':
      // Automotive and Powersports: 12%
      fee = sellingPrice * 0.12;
      break;
      
    case 'other':
    default:
      // Everything Else: 15%
      fee = sellingPrice * 0.15;
      break;
  }
  
  // Apply minimum fee (except for books/media which have no minimum)
  if (category !== 'books') {
    fee = Math.max(fee, minimumFee);
  }
  
  return fee;
}

// Conversion utilities
export function cmToInches(cm: number): number {
  return cm / 2.54;
}

export function kgToPounds(kg: number): number {
  return kg * 2.20462;
}

export function ozToPounds(oz: number): number {
  return oz / 16;
}

export function poundsToOz(pounds: number): number {
  return pounds * 16;
}

// Convert dimensions to inches if needed
function normalizeDimensions(dimensions: ProductData['dimensions'], useMetric: boolean = false) {
  if (useMetric) {
    return {
      length: cmToInches(dimensions.length),
      width: cmToInches(dimensions.width),
      height: cmToInches(dimensions.height),
      weight: kgToPounds(dimensions.weight)
    };
  }
  return dimensions;
}

export function calculateFBASizeTier(dimensions: ProductData['dimensions'], useMetric: boolean = false): 'SMALL_STANDARD' | 'LARGE_STANDARD' | 'LARGE_BULKY' | 'EXTRA_LARGE' {
  const normalizedDims = normalizeDimensions(dimensions, useMetric);
  const { length, width, height, weight } = normalizedDims;

  // Sort dimensions to get longest side first
  const sortedDims = [length, width, height].sort((a, b) => b - a);
  const [longest, middle, shortest] = sortedDims;

  // Extra Large (50+ lbs)
  if (weight > 50) {
    return 'EXTRA_LARGE';
  }

  // Large Bulky (up to 50 lbs, but doesn't fit Large Standard)
  if (weight > FBA_FEES.LARGE_STANDARD.maxWeight ||
      longest > FBA_FEES.LARGE_STANDARD.maxLength ||
      middle > FBA_FEES.LARGE_STANDARD.maxWidth ||
      shortest > FBA_FEES.LARGE_STANDARD.maxHeight) {
    return 'LARGE_BULKY';
  }

  // Large Standard
  if (weight > FBA_FEES.SMALL_STANDARD.maxWeight ||
      longest > FBA_FEES.SMALL_STANDARD.maxLength ||
      middle > FBA_FEES.SMALL_STANDARD.maxWidth ||
      shortest > FBA_FEES.SMALL_STANDARD.maxHeight) {
    return 'LARGE_STANDARD';
  }

  // Small Standard
  return 'SMALL_STANDARD';
}

export function calculateAmazonFees(
  productData: ProductData, 
  useMetric: boolean = false,
  options: {
    averageUnitsStored?: number;
  } = {}
): AmazonFees {
  const { averageUnitsStored = 100 } = options;
  
  const sizeTier = calculateFBASizeTier(productData.dimensions, useMetric);
  const normalizedWeight = useMetric ? kgToPounds(productData.dimensions.weight) : productData.dimensions.weight;
  
  // Calculate referral fee
  const referralFee = calculateReferralFee(productData.category, productData.sellingPrice);

  // Calculate fulfillment fee with Low-Price FBA consideration
  const fulfillmentFee = calculateFulfillmentFee(sizeTier, normalizedWeight, productData.sellingPrice);

  // Closing fee (only for media items)
  const closingFee = productData.category === 'books' ? 1.80 : 0;

  // Storage fee calculation
  const normalizedDims = normalizeDimensions(productData.dimensions, useMetric);
  const cubicFeetPerUnit = (normalizedDims.length * normalizedDims.width * normalizedDims.height) / 1728;
  
  const isStandardSize = (
    normalizedDims.length <= 18 && 
    normalizedDims.width <= 14 && 
    normalizedDims.height <= 8 &&
    normalizedWeight <= 20
  );
  
  const storageRate = isStandardSize ? 0.78 : 0.56;
  const totalStorageFee = cubicFeetPerUnit * averageUnitsStored * storageRate;
  const storagePerUnitFee = totalStorageFee / averageUnitsStored;

  return {
    referralFee: Math.round(referralFee * 100) / 100,
    fulfillmentFee: Math.round(fulfillmentFee * 100) / 100,
    closingFee: Math.round(closingFee * 100) / 100,
    storageMonthlyFee: Math.round(storagePerUnitFee * 10000) / 10000,
  };
}

export function calculateProfitability(productData: ProductData, fees: AmazonFees): ProfitAnalysis {
  const totalFees = fees.referralFee + fees.fulfillmentFee + fees.closingFee + fees.storageMonthlyFee;
  const totalCosts = productData.costOfGoods + totalFees;
  
  const grossProfit = productData.sellingPrice - productData.costOfGoods;
  const netProfit = productData.sellingPrice - totalCosts;
  
  const profitMargin = productData.sellingPrice > 0 ? (netProfit / productData.sellingPrice) * 100 : 0;
  const returnOnInvestment = productData.costOfGoods > 0 ? (netProfit / productData.costOfGoods) * 100 : 0;
  const markup = productData.costOfGoods > 0 ? ((productData.sellingPrice - productData.costOfGoods) / productData.costOfGoods) * 100 : 0;
  
  const breakEvenPrice = totalCosts / (1 - (fees.referralFee / productData.sellingPrice));

  return {
    grossProfit: Math.round(grossProfit * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    profitMargin: Math.round(profitMargin * 100) / 100,
    returnOnInvestment: Math.round(returnOnInvestment * 100) / 100,
    markup: Math.round(markup * 100) / 100,
    totalFees: Math.round(totalFees * 100) / 100,
    totalCosts: Math.round(totalCosts * 100) / 100,
    breakEvenPrice: Math.round(breakEvenPrice * 100) / 100,
  };
}

export function evaluateSuccessCriteria(productData: ProductData, profitAnalysis: ProfitAnalysis, useMetric: boolean = false): CriteriaResult[] {
  const weight = useMetric ? kgToPounds(productData.dimensions.weight) : productData.dimensions.weight;
  const results: CriteriaResult[] = [];

  // Criterion 1: Under 1lb for easier shipping
  results.push({
    label: 'Lightweight Product',
    passed: weight <= 1,
    value: `${weight.toFixed(2)} lbs`,
    threshold: '≤ 1 lb',
    message: weight <= 1 ? 'Good for Small Standard size tier' : 'Consider lighter alternatives'
  });

  // Criterion 2: $5-25 price range (sweet spot for FBA)
  results.push({
    label: 'Optimal Price Range',
    passed: productData.sellingPrice >= 5 && productData.sellingPrice <= 25,
    value: `$${productData.sellingPrice}`,
    threshold: '$5 - $25',
    message: productData.sellingPrice >= 5 && productData.sellingPrice <= 25 
      ? 'Good price point for FBA' 
      : 'Consider pricing adjustments'
  });

  // Criterion 3: 3x markup (300% markup)
  const actualMarkup = profitAnalysis.markup;
  results.push({
    label: '3x Markup Rule',
    passed: actualMarkup >= 300,
    value: `${actualMarkup.toFixed(1)}%`,
    threshold: '≥ 300%',
    message: actualMarkup >= 300 
      ? 'Excellent profit margin' 
      : 'Consider sourcing cheaper or pricing higher'
  });

  // Criterion 4: Bundle-friendly (based on dimensions - compact products)
  const normalizedDims = normalizeDimensions(productData.dimensions, useMetric);
  const volume = normalizedDims.length * normalizedDims.width * normalizedDims.height;
  const isBundleFriendly = volume <= 500; // cubic inches threshold
  
  results.push({
    label: 'Bundle-Friendly Size',
    passed: isBundleFriendly,
    value: `${Math.round(volume)} cubic inches`,
    threshold: '≤ 500 cubic inches',
    message: isBundleFriendly 
      ? 'Good for creating product bundles' 
      : 'Large size may limit bundling opportunities'
  });

  return results;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatSmallCurrency(amount: number): string {
  if (amount > 0 && amount < 0.01) {
    return `$${amount.toFixed(4)}`;
  }
  return formatCurrency(amount);
}
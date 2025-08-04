export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface ProductData {
  name: string;
  sellingPrice: number;
  costOfGoods: number;
  unitShippingCost?: number;
  fbaShippingCost?: number;
  category: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
}

export interface AmazonFees {
  referralFee: number;
  fulfillmentFee: number;
  closingFee: number;
  storageMonthlyFee: number;
  totalStorageFee?: number;
}

export interface ProfitAnalysis {
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  returnOnInvestment: number;
  markup: number;
  totalFees: number;
  totalCosts: number;
  breakEvenPrice: number;
}

export interface CriteriaResult {
  label: string;
  passed: boolean;
  value?: number | string;
  threshold?: number | string;
  message?: string;
}

export interface CalculatorResult {
  productData: ProductData;
  fees: AmazonFees;
  profitAnalysis: ProfitAnalysis;
  criteriaResults: CriteriaResult[];
  isViable: boolean;
}

export interface CalculatorSettings {
  minProfitMargin: number;
  minROI: number;
  minNetProfit: number;
  maxStorageMonths: number;
}
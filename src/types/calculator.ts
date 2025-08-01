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
  category: string;
  dimensions: ProductDimensions;
  isOversized?: boolean;
  isDangerous?: boolean;
  isMedia?: boolean;
}

export interface AmazonFees {
  referralFee: number;
  fulfillmentFee: number;
  closingFee: number;
  storageMonthlyFee: number;
  totalStorageFee?: number; // Add this optional property
}

export interface ProfitAnalysis {
  grossProfit: number;
  netProfit: number;
  profitMargin: number; // as percentage
  returnOnInvestment: number; // as percentage
  markup: number; // as percentage
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
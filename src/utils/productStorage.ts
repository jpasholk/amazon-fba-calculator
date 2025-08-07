import type { ProductData } from '../types/calculator';

export interface SavedProduct extends ProductData {
  id: string;
  savedAt: string;
  calculations?: {
    profit: number;
    margin: number;
    roi: number;
    totalFees: number;
    adSpend?: number;
    sizeTier?: string;
    referralFee?: number;
    fulfillmentFee?: number;
    storageFee?: number;
    breakEvenPrice?: number;
    averageUnits?: number;
  };
}

const STORAGE_KEY = 'fba-saved-products';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getSavedProducts(): SavedProduct[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved products:', error);
    return [];
  }
}

export function saveProduct(productData: ProductData, calculations?: any): SavedProduct {
  const savedProducts = getSavedProducts();
  const newProduct: SavedProduct = {
    ...productData,
    id: generateId(),
    savedAt: new Date().toISOString(),
    calculations: calculations ? {
      profit: calculations.netProfit,
      margin: calculations.profitMargin,
      roi: calculations.roi,
      totalFees: calculations.totalFees,
      adSpend: calculations.adSpend,
      sizeTier: calculations.sizeTier,
      referralFee: calculations.referralFee,
      fulfillmentFee: calculations.fulfillmentFee,
      storageFee: calculations.storageFee,
      breakEvenPrice: calculations.breakEvenPrice,
      averageUnits: calculations.averageUnits
    } : undefined
  };
  
  savedProducts.unshift(newProduct);
  
  if (savedProducts.length > 20) {
    savedProducts.splice(20);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProducts));
  return newProduct;
}

export function deleteProduct(id: string): void {
  const savedProducts = getSavedProducts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProducts));
}

export function clearAllProducts(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCategoryDisplayName(categoryValue: string): string {
  const categoryMap: { [key: string]: string } = {
    'electronics': 'Electronics',
    'home-kitchen': 'Home & Kitchen',
    'clothing': 'Clothing & Accessories',
    'books': 'Books',
    'toys-games': 'Toys & Games',
    'sports': 'Sports & Outdoors',
    'beauty': 'Beauty & Personal Care',
    'other': 'Other'
  };
  return categoryMap[categoryValue] || categoryValue;
}
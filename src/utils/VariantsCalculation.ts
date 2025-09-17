interface PriceTier {
  id: number;
  name: string;
  display_name: string;
  discount_off_retail_price: string;
  created_at: string;
  updated_at: string;
  customers_count?: number;
  pivot?: {
    heat_option_id: number;
    price_tier_id: number;
    created_at: string;
    updated_at: string;
  };
}

interface CalculatedPriceTier extends PriceTier {
  calculated_price: number;
  discount_amount: number;
  override_price?: number;
  is_overridden?: boolean;
}

interface PriceTiersResponse {
  status: string;
  message: string;
  data: PriceTier[];
  errors: any;
  meta: {
    timestamp: string;
    request_id: string;
    pagination: {
      current_page: number;
      from: number;
      last_page: number;
      per_page: number;
      to: number;
      total: number;
      has_more_pages: boolean;
      links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
      };
    };
  };
}

export class VariantsCalculation {
  /**
   * Calculate discounted prices for all price tiers based on base price
   * @param basePrice - The base/retail price to calculate discounts from
   * @param priceTiers - Array of price tiers with discount percentages
   * @param overrides - Optional object with tier ID as key and override price as value
   * @returns Array of price tiers with calculated prices
   */
  static calculatePriceTiers(basePrice: number, priceTiers: PriceTier[], overrides?: Record<string, number>): CalculatedPriceTier[] {
    return priceTiers.map(tier => {
      const discountPercentage = parseFloat(tier.discount_off_retail_price) || 0;
      const discountAmount = (basePrice * discountPercentage) / 100;
      const calculatedPrice = basePrice - discountAmount;
      const overridePrice = overrides?.[tier.id.toString()];
      const isOverridden = overridePrice !== undefined && overridePrice !== null;
      
      return {
        ...tier,
        calculated_price: Math.max(0, calculatedPrice), // Ensure price is not negative
        discount_amount: discountAmount,
        override_price: overridePrice,
        is_overridden: isOverridden
      };
    });
  }

  /**
   * Get price tier by ID from calculated tiers
   * @param calculatedTiers - Array of calculated price tiers
   * @param tierId - The ID of the price tier to find
   * @returns Calculated price tier or undefined if not found
   */
  static getPriceTierById(calculatedTiers: CalculatedPriceTier[], tierId: number): CalculatedPriceTier | undefined {
    return calculatedTiers.find(tier => tier.id === tierId);
  }

  /**
   * Format price for display
   * @param price - The price to format
   * @returns Formatted price string
   */
  static formatPrice(price: number | string | undefined): string {
    if (price === undefined || price === null) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  }

  /**
   * Get the final price for a tier (override price if available, otherwise calculated price)
   * @param tier - The calculated price tier
   * @returns The final price to use
   */
  static getFinalPrice(tier: CalculatedPriceTier): number {
    return tier.is_overridden && tier.override_price !== undefined ? tier.override_price : tier.calculated_price;
  }

  /**
   * Get the retail price tier (usually the one with 0% discount)
   * @param calculatedTiers - Array of calculated price tiers
   * @returns Retail price tier or undefined if not found
   */
  static getRetailPriceTier(calculatedTiers: CalculatedPriceTier[]): CalculatedPriceTier | undefined {
    return calculatedTiers.find(tier => 
      tier.name.toLowerCase().includes('retail') || 
      parseFloat(tier.discount_off_retail_price) === 0
    );
  }

  /**
   * Get the wholesale price tier
   * @param calculatedTiers - Array of calculated price tiers
   * @returns Wholesale price tier or undefined if not found
   */
  static getWholesalePriceTier(calculatedTiers: CalculatedPriceTier[]): CalculatedPriceTier | undefined {
    return calculatedTiers.find(tier => 
      tier.name.toLowerCase().includes('wholesale')
    );
  }

  /**
   * Sort price tiers by discount percentage (ascending)
   * @param calculatedTiers - Array of calculated price tiers
   * @returns Sorted array of calculated price tiers
   */
  static sortByDiscountPercentage(calculatedTiers: CalculatedPriceTier[]): CalculatedPriceTier[] {
    return [...calculatedTiers].sort((a, b) => {
      const discountA = parseFloat(a.discount_off_retail_price) || 0;
      const discountB = parseFloat(b.discount_off_retail_price) || 0;
      return discountA - discountB;
    });
  }

  /**
   * Validate price tier data
   * @param priceTier - Price tier to validate
   * @returns Object with validation results
   */
  static validatePriceTier(priceTier: PriceTier): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!priceTier.id || priceTier.id <= 0) {
      errors.push('Invalid price tier ID');
    }
    
    if (!priceTier.name || priceTier.name.trim() === '') {
      errors.push('Price tier name is required');
    }
    
    if (!priceTier.display_name || priceTier.display_name.trim() === '') {
      errors.push('Price tier display name is required');
    }
    
    const discountPercentage = parseFloat(priceTier.discount_off_retail_price);
    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
      errors.push('Discount percentage must be between 0 and 100');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate price adjustment for a specific tier
   * @param basePrice - The base price
   * @param tierDiscountPercentage - The discount percentage for the tier
   * @returns Object with calculated price and adjustment amount
   */
  static calculatePriceAdjustment(basePrice: number, tierDiscountPercentage: number): {
    calculatedPrice: number;
    adjustmentAmount: number;
  } {
    const discountPercentage = Math.max(0, Math.min(100, tierDiscountPercentage)); // Clamp between 0-100
    const adjustmentAmount = (basePrice * discountPercentage) / 100;
    const calculatedPrice = Math.max(0, basePrice - adjustmentAmount);
    
    return {
      calculatedPrice,
      adjustmentAmount
    };
  }
}

export type { PriceTier, CalculatedPriceTier, PriceTiersResponse };

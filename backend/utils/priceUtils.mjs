// utils/priceUtils.mjs
export const extractPriceValue = (priceObj) => {
    if (!priceObj || typeof priceObj !== 'object') return NaN;
  
    const possibleFields = ['total', 'grandTotal', 'base'];
    for (const field of possibleFields) {
      const value = parseFloat(priceObj[field]);
      if (!isNaN(value)) return value;
    }
  
    return NaN;
};
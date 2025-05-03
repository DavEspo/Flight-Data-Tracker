// utils/pricingLogic.mjs
export const calculatePrice = (basePrice, totalBookings) => {
    const price = parseFloat(basePrice) + totalBookings;
    return Math.round(price * 100) / 100;
};
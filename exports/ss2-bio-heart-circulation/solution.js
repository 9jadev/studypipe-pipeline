/**
 * Calculate final prices including sales tax
 * @param {number[]} prices
 * @param {number} taxRate
 * @returns {number[]}
 */
function addSalesTax(prices, taxRate) {
  return prices.map(price => Number((price * (1 + taxRate)).toFixed(2)));
}

// Try it out:
console.log(addSalesTax([19.99, 49.50, 9.95], 0.08));

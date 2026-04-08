// constants.js
export const CURRENCY_SYMBOL_MAP = {
  GBP: "£", USD: "$", EUR: "€",
  AUD: "A$", CAD: "C$", NZD: "NZ$", DKK: "kr", ISK: "kr",
};

export function getCurrencySymbol(currency) {
  return CURRENCY_SYMBOL_MAP[currency] ?? "£";
}
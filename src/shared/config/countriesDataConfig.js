export const countries = [
  { code: "AD", label: "Andorra", phone: "376" },
  { code: "AE", label: "United Arab Emirates", phone: "971" },
  { code: "AF", label: "Afghanistan", phone: "93" },
  { code: "AG", label: "Antigua and Barbuda", phone: "1-268" },
  { code: "AI", label: "Anguilla", phone: "1-264" },
  { code: "AL", label: "Albania", phone: "355" },
  { code: "AM", label: "Armenia", phone: "374" },
  { code: "AO", label: "Angola", phone: "244" },
  { code: "AQ", label: "Antarctica", phone: "672", nonBusiness: true },
  { code: "AR", label: "Argentina", phone: "54" },
  { code: "AS", label: "American Samoa", phone: "1-684" },
  { code: "AT", label: "Austria", phone: "43" },
  { code: "AU", label: "Australia", phone: "61", suggested: true },
  { code: "AW", label: "Aruba", phone: "297" },
  { code: "AX", label: "Åland Islands", phone: "358" },
  { code: "AZ", label: "Azerbaijan", phone: "994" },
  { code: "BA", label: "Bosnia and Herzegovina", phone: "387" },
  { code: "BB", label: "Barbados", phone: "1-246" },
  { code: "BD", label: "Bangladesh", phone: "880" },
  { code: "BE", label: "Belgium", phone: "32" },
  { code: "BF", label: "Burkina Faso", phone: "226" },
  { code: "BG", label: "Bulgaria", phone: "359" },
  { code: "BH", label: "Bahrain", phone: "973" },
  { code: "BI", label: "Burundi", phone: "257" },
  { code: "BJ", label: "Benin", phone: "229" },
  { code: "BL", label: "Saint Barthélemy", phone: "590" },
  { code: "BM", label: "Bermuda", phone: "1-441" },
  { code: "BN", label: "Brunei", phone: "673" },
  { code: "BO", label: "Bolivia", phone: "591" },
  { code: "BR", label: "Brazil", phone: "55" },
  { code: "BS", label: "Bahamas", phone: "1-242" },
  { code: "BT", label: "Bhutan", phone: "975" },
  { code: "BV", label: "Bouvet Island", phone: "47", nonBusiness: true },
  { code: "BW", label: "Botswana", phone: "267" },
  { code: "BY", label: "Belarus", phone: "375" },
  { code: "BZ", label: "Belize", phone: "501" },
  { code: "CA", label: "Canada", phone: "1", suggested: true },
  { code: "CD", label: "DR Congo", phone: "243" },
  { code: "CG", label: "Republic of the Congo", phone: "242" },
  { code: "CH", label: "Switzerland", phone: "41" },
  { code: "CI", label: "Côte d’Ivoire", phone: "225" },
  { code: "CL", label: "Chile", phone: "56" },
  { code: "CN", label: "China", phone: "86" },
  { code: "CO", label: "Colombia", phone: "57" },
  { code: "CR", label: "Costa Rica", phone: "506" },
  { code: "CU", label: "Cuba", phone: "53" },
  { code: "CW", label: "Curaçao", phone: "599" },
  { code: "CZ", label: "Czech Republic", phone: "420" },
  { code: "DE", label: "Germany", phone: "49", suggested: true },
  { code: "DK", label: "Denmark", phone: "45" },
  { code: "EG", label: "Egypt", phone: "20" },
  { code: "ES", label: "Spain", phone: "34" },
  { code: "FR", label: "France", phone: "33", suggested: true },
  { code: "GB", label: "United Kingdom", phone: "44" },
  { code: "IN", label: "India", phone: "91" },
  { code: "IR", label: "Iran", phone: "98" },
  { code: "IT", label: "Italy", phone: "39" },
  { code: "JP", label: "Japan", phone: "81", suggested: true },
  { code: "KR", label: "South Korea", phone: "82" },
  { code: "KP", label: "North Korea", phone: "850" },
  { code: "RU", label: "Russia", phone: "7" },
  { code: "SA", label: "Saudi Arabia", phone: "966" },
  { code: "TR", label: "Turkey", phone: "90" },
  { code: "TW", label: "Taiwan", phone: "886" },
  { code: "US", label: "United States", phone: "1", suggested: true },
  { code: "ZA", label: "South Africa", phone: "27" },
  { code: "ZW", label: "Zimbabwe", phone: "263" },
];

export const countryBaseCurrencyMap = {
  AD: "EUR", // Andorra
  AE: "AED", // United Arab Emirates
  AF: "AFN", // Afghanistan
  AG: "XCD", // Antigua and Barbuda
  AI: "XCD", // Anguilla
  AL: "ALL", // Albania
  AM: "AMD", // Armenia
  AO: "AOA", // Angola
  AQ: null, // Antarctica (non-business)
  AR: "ARS", // Argentina
  AS: "USD", // American Samoa
  AT: "EUR", // Austria
  AU: "AUD", // Australia
  AW: "AWG", // Aruba
  AX: "EUR", // Åland Islands
  AZ: "AZN", // Azerbaijan
  BA: "BAM", // Bosnia and Herzegovina
  BB: "BBD", // Barbados
  BD: "BDT", // Bangladesh
  BE: "EUR", // Belgium
  BF: "XOF", // Burkina Faso
  BG: "BGN", // Bulgaria
  BH: "BHD", // Bahrain
  BI: "BIF", // Burundi
  BJ: "XOF", // Benin
  BL: "EUR", // Saint Barthélemy
  BM: "BMD", // Bermuda
  BN: "BND", // Brunei
  BO: "BOB", // Bolivia
  BR: "BRL", // Brazil
  BS: "BSD", // Bahamas
  BT: "BTN", // Bhutan
  BV: null, // Bouvet Island (non-business)
  BW: "BWP", // Botswana
  BY: "BYN", // Belarus
  BZ: "BZD", // Belize
  CA: "CAD", // Canada
  CD: "CDF", // DR Congo
  CG: "XAF", // Republic of the Congo
  CH: "CHF", // Switzerland
  CI: "XOF", // Côte d’Ivoire
  CL: "CLP", // Chile
  CN: "CNY", // China
  CO: "COP", // Colombia
  CR: "CRC", // Costa Rica
  CU: "CUP", // Cuba
  CW: "ANG", // Curaçao
  CZ: "CZK", // Czech Republic
  DE: "EUR", // Germany
  DK: "DKK", // Denmark
  EG: "EGP", // Egypt
  ES: "EUR", // Spain
  FR: "EUR", // France
  GB: "GBP", // United Kingdom
  IN: "INR", // India
  IR: "IRR", // Iran
  IT: "EUR", // Italy
  JP: "JPY", // Japan
  KR: "KRW", // South Korea
  KP: "KPW", // North Korea
  RU: "RUB", // Russia
  SA: "SAR", // Saudi Arabia
  TR: "TRY", // Turkey
  TW: "TWD", // Taiwan
  US: "USD", // United States
  ZA: "ZAR", // South Africa
  ZW: "ZWL", // Zimbabwe
};

export function getCountryOptions(list = countries) {
  return list
    .filter((c) => !c.nonBusiness)
    .map((c) => ({
      label: c.label,
      value: c.code,
    }));
}

export function getPhoneCodeOptions(list = countries) {
  return list
    .filter((c) => !c.nonBusiness && c.phone)
    .map((c) => ({
      label: `+${c.phone} (${c.label})`,
      value: `+${c.phone}`,
      countryCode: c.code,
    }));
}

export function derivePhoneCode(countryCode) {
  if (!countryCode) return "";
  const country = getCountryByCode(countryCode);
  return country?.phone ? `+${country.phone}` : "";
}

export const businessCountries = countries
  .filter((c) => !c.nonBusiness)
  .map((c) => ({
    ...c,
    label: c.label.toLowerCase(),
  }));

export const currencyOptions =
  getCurrenciesArrayFromCountries(businessCountries);

export function getCountryByCode(code) {
  return countries.find((c) => c.code === code) || null;
}

export function getCountryLabel(code) {
  return getCountryByCode(code)?.label || "";
}

export function getCountryWithLabel(label) {
  return countries.find((c) => c.label.toLowerCase() === label?.toLowerCase());
}

export function getCountryCode(label) {
  return (
    countries.find((c) => c.label.toLowerCase() === label?.toLowerCase())
      ?.code || null
  );
}

export function getCurrencyByCountry(countryCode) {
  if (!countryCode) return null;
  return countryBaseCurrencyMap[countryCode] ?? null;
}

export function getCurrenciesArrayFromCountries(countries) {
  const currencies = countries
    .map((c) => countryBaseCurrencyMap[c.code])
    .filter(Boolean);

  return Array.from(new Set(currencies));
}

export function isBusinessCountry(code) {
  const country = countries.find((c) => c.code === code);
  return !country?.nonBusiness;
}

export function getCountryWithCurrencyCode(code) {
  return countries.find((c) => countryBaseCurrencyMap[c.code] === code);
}

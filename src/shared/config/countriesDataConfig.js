import rawCountries from "world-countries";

export const countries = rawCountries.map((c) => {
  const phone =
    c.idd?.root && c.idd?.suffixes?.length
      ? `${c.idd.root}${c.idd.suffixes[0]}`.replace("+", "")
      : null;

  return {
    code: c.cca2,
    label: c.name.common,
    phone,
    nonBusiness: c.name.common === "Antarctica",
  };
});

export const countryBaseCurrencyMap = Object.fromEntries(
  rawCountries.map((c) => {
    const currencyCode = c.currencies
      ? Object.keys(c.currencies)[0]
      : null;

    return [c.cca2, currencyCode];
  }),
);

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

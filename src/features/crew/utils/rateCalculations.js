// Rate Calculation Engine — Film Agreement (PACT/BECTU Major Motion Pictures)
// Option A: 12.07% holiday uplift

export const defaultEngineSettings = {
  agreementMode: "FILM",
  crewType: "NON_SHOOTING",
  holidayUplift: 0.1207,
  isRiggingElectrician: false,
  standardHoursPerDay: 11,
  standardDaysPerWeek: 5,
  standardHoursPerWeek: 55,
};

const MAX_OT_BASE = 81.82;
const BTA_CAP_BASE = 45.0;
const CAMERA_OT_MIN = 25.0;

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const buildFromBase = (item, base, hf) => {
  const hol = round2(base * hf);
  const gross = round2(base + hol);
  return { item, rate: round2(base), hol, gross };
};

const splitGross = (gross, holidayFactor) => {
  const rate = gross / (1 + holidayFactor);
  const hol = gross - rate;
  return { rate: round2(rate), hol: round2(hol), gross: round2(gross) };
};

export const makeLine = (item, gross, hf) => {
  const s = splitGross(gross, hf);
  return { item, rate: s.rate, hol: s.hol, gross: s.gross };
};

export const zeroLine = (item) => ({ item, rate: 0, hol: 0, gross: 0 });

export function calculateFilmRates(feePerDayGross, settings) {
  const hf = settings.holidayUplift;
  const hpd = settings.isRiggingElectrician ? 9 : settings.standardHoursPerDay;
  const dpw = settings.standardDaysPerWeek;

  const dailyGross = round2(feePerDayGross);
  const dailyBase = round2(dailyGross / (1 + hf));
  const weeklyBase = round2(dailyBase * dpw);
  const hourlyBase = round2(dailyBase / hpd);

  const sixthDayHourlyBase = clamp(round2(hourlyBase * 1.5), 0, MAX_OT_BASE);
  const seventhDayHourlyBase = clamp(round2(hourlyBase * 2.0), 0, MAX_OT_BASE);
  const minHrsNum = settings.crewType === "SHOOTING" ? 8 : 6;
  const minHrs = String(minHrsNum);

  const sixthDayDailyBase = round2(sixthDayHourlyBase * minHrsNum);
  const seventhDayDailyBase = round2(seventhDayHourlyBase * minHrsNum);
  const publicHolidayDailyBase = round2(seventhDayHourlyBase * minHrsNum);

  const salary = [
    buildFromBase("Salary Weekly", weeklyBase, hf),
    buildFromBase("Salary Daily", dailyBase, hf),
    buildFromBase("Salary Hourly", hourlyBase, hf),
    buildFromBase("6th Day", sixthDayDailyBase, hf),
    buildFromBase("7th Day", seventhDayDailyBase, hf),
    buildFromBase("Public Holiday", publicHolidayDailyBase, hf),
    buildFromBase("Travel Day", dailyBase, hf),
    buildFromBase("Turnaround", dailyBase, hf),
    buildFromBase(`6th Day Hourly (MIN ${minHrs} HRS)`, sixthDayHourlyBase, hf),
    buildFromBase(`7th Day Hourly (MIN ${minHrs} HRS)`, seventhDayHourlyBase, hf),
  ];

  const addHourBase = hourlyBase;
  const nonCameraOTBase = clamp(round2(hourlyBase * 1.5), 0, MAX_OT_BASE);
  const cameraOTBase = clamp(Math.max(round2(hourlyBase * 2.0), CAMERA_OT_MIN), 0, MAX_OT_BASE);
  const dawnEarlyBase = clamp(round2(hourlyBase * 2.0), 0, MAX_OT_BASE);
  const btaBase = clamp(round2(hourlyBase * 1.5), 0, BTA_CAP_BASE);

  const overtime = [
    buildFromBase("Add Hour", addHourBase, hf),
    buildFromBase("Enhanced O/T", nonCameraOTBase, hf),
    buildFromBase("Camera O/T", cameraOTBase, hf),
    buildFromBase("Post O/T", nonCameraOTBase, hf),
    buildFromBase("Pre O/T", nonCameraOTBase, hf),
    buildFromBase("BTA", btaBase, hf),
    zeroLine("Late Meal"),
    zeroLine("Broken Meal"),
    zeroLine("Travel"),
    buildFromBase("Dawn / Early", dawnEarlyBase, hf),
    { item: "Night Pen", rate: 20, hol: 0, gross: 20 },
  ];

  return { salary, overtime };
}

export function calculateTvRates(feePerDayGross, settings) {
  const hf = settings.holidayUplift;
  const hpd = settings.standardHoursPerDay;
  const dpw = settings.standardDaysPerWeek;

  const dailyGross = round2(feePerDayGross);
  const dailyBase = round2(dailyGross / (1 + hf));
  const weeklyBase = round2(dailyBase * dpw);
  const hourlyBase = round2(dailyBase / hpd);

  const sixthDayHourlyBase = clamp(round2(hourlyBase * 1.5), 0, MAX_OT_BASE);
  const seventhDayHourlyBase = clamp(round2(hourlyBase * 2.0), 0, MAX_OT_BASE);
  const minHrsNum = 6;
  const minHrs = String(minHrsNum);

  const sixthDayDailyBase = round2(sixthDayHourlyBase * minHrsNum);
  const seventhDayDailyBase = round2(seventhDayHourlyBase * minHrsNum);
  const publicHolidayDailyBase = round2(seventhDayHourlyBase * minHrsNum);

  const salary = [
    buildFromBase("Salary Weekly", weeklyBase, hf),
    buildFromBase("Salary Daily", dailyBase, hf),
    buildFromBase("Salary Hourly", hourlyBase, hf),
    buildFromBase("6th Day", sixthDayDailyBase, hf),
    buildFromBase("7th Day", seventhDayDailyBase, hf),
    buildFromBase("Public Holiday", publicHolidayDailyBase, hf),
    buildFromBase("Travel Day", dailyBase, hf),
    buildFromBase("Turnaround", dailyBase, hf),
    buildFromBase(`6th Day Hourly (MIN ${minHrs} HRS)`, sixthDayHourlyBase, hf),
    buildFromBase(`7th Day Hourly (MIN ${minHrs} HRS)`, seventhDayHourlyBase, hf),
  ];

  const overtime = [
    buildFromBase("Add Hour", hourlyBase, hf),
    buildFromBase("Enhanced O/T", clamp(round2(hourlyBase * 1.5), 0, MAX_OT_BASE), hf),
    buildFromBase("Camera O/T", clamp(Math.max(round2(hourlyBase * 2.0), CAMERA_OT_MIN), 0, MAX_OT_BASE), hf),
    buildFromBase("Post O/T", clamp(round2(hourlyBase * 1.5), 0, MAX_OT_BASE), hf),
    buildFromBase("Pre O/T", clamp(round2(hourlyBase * 1.5), 0, MAX_OT_BASE), hf),
    buildFromBase("BTA", clamp(round2(hourlyBase * 1.5), 0, BTA_CAP_BASE), hf),
    zeroLine("Late Meal"),
    zeroLine("Broken Meal"),
    zeroLine("Travel"),
    buildFromBase("Dawn / Early", clamp(round2(hourlyBase * 2.0), 0, MAX_OT_BASE), hf),
    { item: "Night Pen", rate: 0, hol: 0, gross: 0 },
  ];

  return { salary, overtime };
}

export function calculateRates(feePerDayGross, settings) {
  if (!feePerDayGross || feePerDayGross <= 0) {
    return calculateFilmRates(0, settings);
  }
  if (settings.agreementMode === "FILM") {
    return calculateFilmRates(feePerDayGross, settings);
  }
  return calculateTvRates(feePerDayGross, settings);
}

export function formatCurrency(amount, symbol = "£") {
  if (amount === 0) return `${symbol}0.00`;
  return `${symbol}${amount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatRateHol(rate, hol, symbol = "£") {
  return `${formatCurrency(rate, symbol)} / ${formatCurrency(hol, symbol)}`;
}
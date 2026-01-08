/**
 * Get contract-specific configuration based on framework type
 */
function getContractConfig(framework, settings) {
  switch (framework) {
    case 'film':
      // PACT/BECTU Film Agreement 2024
      return {
        standardWeek: 55,
        standardDay: 11,
        continuousDay: 10, // CWD = Continuous Working Day
        overtimeThreshold: 10,
        nightStart: 20, // 20:00 (8pm)
        nightEnd: 6,    // 06:00 (6am)
        dawnStart: 5,   // 05:00 (5am)
        dawnEnd: 7,     // 07:00 (7am)
        sixthDayMultiplier: 1.5,
        seventhDayMultiplier: 2.0,
        turnaroundHours: 11,
        mealBreakMaxHours: 6,
        nightPremium: 1.5, // £20 or 1.5h equivalent
        dawnPremium: 1.5
      };
    
    case 'tv-band1':
      // PACT/BECTU TV Band 1 (High-budget drama)
      return {
        standardWeek: 48,
        standardDay: 10,
        continuousDay: 9,
        overtimeThreshold: 9,
        nightStart: 19, // 19:00 (7pm)
        nightEnd: 7,    // 07:00 (7am)
        dawnStart: 5,
        dawnEnd: 7,
        sixthDayMultiplier: 1.5,
        seventhDayMultiplier: 2.0,
        turnaroundHours: 11,
        mealBreakMaxHours: 5,
        nightPremium: 1.5,
        dawnPremium: 1.5
      };
    
    case 'tv-band2':
      // PACT/BECTU TV Band 2 (Mid-budget production)
      return {
        standardWeek: 40,
        standardDay: 9,
        continuousDay: 8,
        overtimeThreshold: 8,
        nightStart: 19,
        nightEnd: 7,
        dawnStart: 5,
        dawnEnd: 7,
        sixthDayMultiplier: 1.5,
        seventhDayMultiplier: 1.5, // Different from film!
        turnaroundHours: 10,
        mealBreakMaxHours: 5,
        nightPremium: 1.25,
        dawnPremium: 1.25
      };
    
    case 'tv-band3':
      // PACT/BECTU TV Band 3 (Lower-budget production)
      return {
        standardWeek: 37.5,
        standardDay: 8,
        continuousDay: 7.5,
        overtimeThreshold: 7.5,
        nightStart: 19,
        nightEnd: 7,
        dawnStart: 5,
        dawnEnd: 7,
        sixthDayMultiplier: 1.5,
        seventhDayMultiplier: 1.5,
        turnaroundHours: 10,
        mealBreakMaxHours: 5,
        nightPremium: 1.0,
        dawnPremium: 1.0
      };
    
    case 'equity':
      // Equity (Actors) agreement - typically different structure
      return {
        standardWeek: 40,
        standardDay: 8,
        continuousDay: 8,
        overtimeThreshold: 8,
        nightStart: 22, // 22:00 (10pm) - different for actors
        nightEnd: 6,
        dawnStart: 5,
        dawnEnd: 7,
        sixthDayMultiplier: 1.5,
        seventhDayMultiplier: 2.0,
        turnaroundHours: 12, // Actors need more rest
        mealBreakMaxHours: 6,
        nightPremium: 2.0, // Higher for actors
        dawnPremium: 2.0
      };
    
    case 'custom':
    default:
      // Use custom settings from project
      return {
        standardWeek: settings.standardWorkingWeek || 40,
        standardDay: settings.standardWorkingDay || 10,
        continuousDay: settings.continuousWorkingDay || 8,
        overtimeThreshold: settings.continuousWorkingDay || 8,
        nightStart: 19,
        nightEnd: 7,
        dawnStart: 5,
        dawnEnd: 7,
        sixthDayMultiplier: settings.sixthDayMultiplier || 1.5,
        seventhDayMultiplier: settings.seventhDayMultiplier || 2.0,
        turnaroundHours: settings.turnaroundHours || 11,
        mealBreakMaxHours: 6,
        nightPremium: settings.nightPremium || 1.5,
        dawnPremium: settings.dawnPremium || 1.5
      };
  }
}

/**
 * Check if a timesheet day is "complete" and should be counted
 * A day is complete if it has:
 * - Both in and out times, OR
 * - Flat Day is checked
 */
export function isDayComplete(entry) {
  // Rest days and non-work days are NOT counted as "complete" for working purposes
  if (entry.dayType === 'Rest' || entry.dayType === 'Holiday' || entry.dayType === 'Public holiday off') {
    return false;
  }
  
  // Check if flat day is marked
  if (entry.isFlatDay) {
    return true;
  }
  
  // Check if both in and out times exist
  if (entry.inTime && entry.outTime && entry.inTime.trim() !== '' && entry.outTime.trim() !== '') {
    return true;
  }
  
  return false;
}

/**
 * Count completed days in a week
 */
export function countCompletedDaysInWeek(entries) {
  return entries.filter(entry => isDayComplete(entry)).length;
}

/**
 * Round UP to nearest quarter hour (0.25h increments)
 * This is critical for PACT/BECTU compliance
 */
export function roundUpToQuarterHour(hours) {
  if (hours <= 0) return 0;
  return Math.ceil(hours * 4) / 4;
}

/**
 * Round minutes UP to nearest quarter hour
 */
export function roundMinutesToQuarterHour(minutes) {
  if (minutes <= 0) return 0;
  const hours = minutes / 60;
  return roundUpToQuarterHour(hours);
}

/**
 * Parse time string (HH:MM) to decimal hours
 */
function parseTimeToDecimal(timeStr) {
  if (!timeStr || timeStr.trim() === '') return 0;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return 0;
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  if (isNaN(hours) || isNaN(minutes)) return 0;
  return hours + (minutes / 60);
}

/**
 * Calculate hours between two times, handling next-day scenarios
 * Returns the duration in decimal hours
 */
function calculateHoursBetween(startTime, endTime, isNextDay = false) {
  if (!startTime || !endTime) return 0;
  
  const start = parseTimeToDecimal(startTime);
  let end = parseTimeToDecimal(endTime);
  
  if (isNextDay || end < start) {
    end += 24; // Add 24 hours for next day
  }
  
  return end - start;
}

/**
 * Determine if time falls in night hours (contract-specific)
 */
function isNightHours(timeStr, config) {
  if (!timeStr) return false;
  const decimal = parseTimeToDecimal(timeStr);
  const hour = Math.floor(decimal);
  
  // Night hours span across midnight (e.g., 20:00 to 06:00)
  if (config.nightStart > config.nightEnd) {
    return hour >= config.nightStart || hour < config.nightEnd;
  } else {
    return hour >= config.nightStart && hour < config.nightEnd;
  }
}

/**
 * Determine if time falls in dawn hours (contract-specific)
 */
function isDawnHours(timeStr, config) {
  if (!timeStr) return false;
  const decimal = parseTimeToDecimal(timeStr);
  const hour = Math.floor(decimal);
  return hour >= config.dawnStart && hour < config.dawnEnd;
}

/**
 * Extract standard working hours from calendar (e.g., "10 (CWD)" -> 10)
 */
function extractStandardHours(workingHoursStr) {
  if (!workingHoursStr) return 10;
  const match = workingHoursStr.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 10;
}

/**
 * Calculate overtime hours based on contract-specific rules
 */
function calculateOvertimeHours(
  actualHours,
  scheduledHours,
  mealBreakMinutes,
  config
) {
  // Deduct unpaid meal break if applicable
  const mealBreakHours = mealBreakMinutes > 0 ? mealBreakMinutes / 60 : 0;
  const workedHours = actualHours - mealBreakHours;
  
  // Calculate overtime (hours beyond threshold)
  const overtimeThreshold = scheduledHours > 0 ? scheduledHours : config.overtimeThreshold;
  const overtime = Math.max(0, workedHours - overtimeThreshold);
  
  // Round UP to nearest quarter hour
  return roundUpToQuarterHour(overtime);
}

/**
 * Calculate meal penalty for late meals
 */
function calculateMealPenalty(
  callTime,
  mealStatus,
  mealStart,
  config
) {
  if (!callTime || !mealStatus) return 0;
  
  // If meal status indicates a late or missed meal
  if (mealStatus.toLowerCase().includes('late') || mealStatus.toLowerCase().includes('missed')) {
    return 1; // 1 occurrence
  }
  
  // If we have meal start time, check if it's beyond max hours
  if (mealStart) {
    const hoursSinceCall = calculateHoursBetween(callTime, mealStart, false);
    if (hoursSinceCall > config.mealBreakMaxHours) {
      return 1; // Late meal penalty
    }
  }
  
  return 0;
}

/**
 * Calculate turnaround violation based on contract-specific minimum rest
 */
function calculateTurnaroundViolation(
  wrapTime,
  wrapIsNextDay,
  nextCallTime,
  config
) {
  if (!wrapTime || !nextCallTime) return 0;
  
  let wrap = parseTimeToDecimal(wrapTime);
  if (wrapIsNextDay) {
    wrap += 24;
  }
  
  const nextCall = parseTimeToDecimal(nextCallTime) + 24; // Next day's call
  const restHours = nextCall - wrap;
  
  if (restHours < config.turnaroundHours) {
    const violation = config.turnaroundHours - restHours;
    return roundUpToQuarterHour(violation);
  }
  
  return 0;
}

/**
 * Determine consecutive work day count for 6th/7th day calculations
 */
function getConsecutiveWorkDayCount(entry, weekEntries) {
  // Sort entries by date
  const sorted = [...weekEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const currentDate = new Date(entry.date);
  let consecutiveDays = 0;
  
  // Count backwards from current date to find consecutive work days
  for (let i = sorted.length - 1; i >= 0; i--) {
    const e = sorted[i];
    const eDate = new Date(e.date);
    
    if (eDate > currentDate) continue; // Skip future dates
    
    if (isDayComplete(e)) {
      consecutiveDays++;
      
      // If this is the current entry, we're done counting
      if (e.date === entry.date) {
        break;
      }
    } else {
      // Break in consecutive work days (rest day)
      if (eDate < currentDate) {
        consecutiveDays = 0; // Reset count
      }
    }
  }
  
  return consecutiveDays;
}

/**
 * Check if contract is a Television PACT agreement
 * Additional Hour and Enhanced OT are ONLY for TV contracts (NOT Film)
 */
export function isTelevisionContract(contractFramework) {
  return ['tv-band1', 'tv-band2', 'tv-band3'].includes(contractFramework);
}

/**
 * Main function: Auto-calculate overtime based on contract framework
 * Dynamically applies Film, TV (Band 1, 2, 3), Equity, or Custom contract rules
 */
export function calculatePACTBECTUOvertime(
  entry,
  calendarDay,
  projectSettings,
  weekEntries
) {
  // Get contract-specific configuration
  const config = getContractConfig(projectSettings.contractFramework, projectSettings);
  
  // Only calculate for completed work days
  if (!isDayComplete(entry)) {
    return {
      cameraOT: 0,
      nonCameraOT: 0,
      night: 0,
      dawn: 0,
      sixthDay: 0,
      seventhDay: 0,
      ot: 0,
      lateMeal: 0,
      turnaroundViolation: 0
    };
  }
  
  // If flat day, use scheduled hours with no overtime
  if (entry.isFlatDay) {
    const scheduledHours = calendarDay?.workingHours 
      ? extractStandardHours(calendarDay.workingHours) 
      : config.continuousDay;
    
    return {
      cameraOT: 0,
      nonCameraOT: 0,
      night: 0,
      dawn: 0,
      sixthDay: 0,
      seventhDay: 0,
      ot: scheduledHours, // Flat day = scheduled hours as straight time
      lateMeal: 0,
      turnaroundViolation: 0
    };
  }
  
  // ============================================
  // 1. CALCULATE ACTUAL WORKED HOURS
  // ============================================
  const actualHours = calculateHoursBetween(
    entry.inTime || '',
    entry.outTime || '',
    entry.nextDay || false
  );
  
  // ============================================
  // 2. GET SCHEDULED HOURS (Contract-specific)
  // ============================================
  let scheduledHours = config.continuousDay;
  if (calendarDay?.workingHours) {
    scheduledHours = extractStandardHours(calendarDay.workingHours);
  }
  
  // ============================================
  // 3. CALCULATE MEAL BREAK DEDUCTION
  // ============================================
  const mealBreakMinutes = entry.mealBreakMinutes || 0;
  
  // ============================================
  // 4. CALCULATE OVERTIME (Contract-specific, rounded UP to quarter hour)
  // ============================================
  const overtimeHours = calculateOvertimeHours(actualHours, scheduledHours, mealBreakMinutes, config);
  
  // ============================================
  // 5. CLASSIFY OVERTIME: Camera vs Non-Camera
  // ============================================
  let cameraOT = 0;
  let nonCameraOT = 0;
  
  // If calendar indicates camera OT, classify as camera work
  if (calendarDay?.cameraOT && parseFloat(calendarDay.cameraOT) > 0) {
    cameraOT = overtimeHours;
  } else {
    // Otherwise classify as non-camera OT
    nonCameraOT = overtimeHours;
  }
  
  // ============================================
  // 6. NIGHT PREMIUM (Contract-specific hours)
  // ============================================
  let nightPenalty = 0;
  const startIsNight = isNightHours(entry.inTime || '', config);
  const endIsNight = isNightHours(entry.outTime || '', config);
  
  if (startIsNight || endIsNight) {
    nightPenalty = config.nightPremium;
  }
  
  // Check if calendar explicitly marks night penalty
  if (calendarDay?.nightPenaltyPaid === 'Paid' || calendarDay?.nightPenalty === 'Paid') {
    nightPenalty = config.nightPremium;
  }
  
  // ============================================
  // 7. DAWN PREMIUM (Contract-specific)
  // ============================================
  let dawnPenalty = 0;
  const startIsDawn = isDawnHours(entry.inTime || '', config);
  
  if (startIsDawn) {
    dawnPenalty = config.dawnPremium;
  }
  
  // Check if calendar explicitly marks dawn
  if (calendarDay?.dawn === 'Paid') {
    dawnPenalty = config.dawnPremium;
  }
  
  // ============================================
  // 8. MEAL PENALTY (Contract-specific timing)
  // ============================================
  const lateMealPenalty = calculateMealPenalty(
    entry.inTime || '',
    entry.mealStatus || '',
    calendarDay?.mealStart,
    config
  );
  
  // ============================================
  // 9. CONSECUTIVE DAY CALCULATIONS (Contract-specific multipliers)
  // ============================================
  const consecutiveDays = getConsecutiveWorkDayCount(entry, weekEntries);
  
  let sixthDayHours = 0;
  let seventhDayHours = 0;
  
  // 6th Consecutive Day
  if (consecutiveDays === 6) {
    sixthDayHours = actualHours; // All hours count for 6th day premium
  }
  
  // 7th Consecutive Day
  if (consecutiveDays >= 7) {
    seventhDayHours = actualHours; // All hours count for 7th day premium
  }
  
  // ============================================
  // 10. TURNAROUND VIOLATION (Contract-specific minimum rest)
  // ============================================
  // Note: This requires previous day's data
  const turnaroundViolation = 0;
  
  // ============================================
  // 11. ROUND ALL VALUES TO QUARTER HOURS
  // ============================================
  return {
    cameraOT: roundUpToQuarterHour(cameraOT),
    nonCameraOT: roundUpToQuarterHour(nonCameraOT),
    night: nightPenalty,
    dawn: dawnPenalty,
    sixthDay: roundUpToQuarterHour(sixthDayHours),
    seventhDay: roundUpToQuarterHour(seventhDayHours),
    ot: roundUpToQuarterHour(overtimeHours),
    lateMeal: lateMealPenalty,
    turnaroundViolation: roundUpToQuarterHour(turnaroundViolation)
  };
}

/**
 * Get week completion status
 */
export function getWeekCompletionStatus(weekEntries) {
  const totalDays = 7;
  const completedDays = countCompletedDaysInWeek(weekEntries);
  const percentage = Math.round((completedDays / totalDays) * 100);
  
  const missingDays = weekEntries
    .filter(entry => !isDayComplete(entry))
    .map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    });
  
  return {
    completedDays,
    totalDays,
    percentage,
    missingDays
  };
}

/**
 * Calculate total weekly hours (contract-specific standard week)
 */
export function calculateWeeklyHours(
  weekEntries,
  projectSettings
) {
  const config = getContractConfig(projectSettings.contractFramework, projectSettings);
  const standardWeekHours = config.standardWeek;
  
  let totalHours = 0;
  let overtimeHours = 0;
  
  weekEntries.forEach(entry => {
    if (isDayComplete(entry)) {
      const hours = calculateHoursBetween(
        entry.inTime || '',
        entry.outTime || '',
        entry.nextDay || false
      );
      totalHours += hours;
      overtimeHours += entry.ot || 0;
    }
  });
  
  // Calculate weekly overtime (hours beyond standard week)
  const weeklyOvertimeHours = Math.max(0, totalHours - standardWeekHours);
  
  return {
    totalHours: roundUpToQuarterHour(totalHours),
    overtimeHours: roundUpToQuarterHour(overtimeHours),
    standardWeekHours,
    weeklyOvertimeHours: roundUpToQuarterHour(weeklyOvertimeHours)
  };
}
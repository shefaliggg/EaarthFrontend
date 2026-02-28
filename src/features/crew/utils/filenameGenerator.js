export function generatePdfFilename(data) {
  const nameParts = (data.fullName || "").trim().split(/\s+/);
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0] || "UNKNOWN";
  const firstName = nameParts.length > 1 ? nameParts[0] : "";
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const dateStr = `${yy}${mm}${dd}`;
  const dept = data.department
    ? data.department.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s+/g, "")
    : "Dept";
  const engMap = { paye: "PAYE", loan_out: "LoanOut", schd: "SCHD", long_form: "LongForm" };
  const contractType = engMap[data.engagementType] || "PAYE";
  const freq = data.dailyOrWeekly
    ? data.dailyOrWeekly.charAt(0).toUpperCase() + data.dailyOrWeekly.slice(1)
    : "Daily";
  const parts = [lastName, firstName, dateStr, dept, contractType, freq].filter(Boolean);
  return `${parts.join("_")}.pdf`;
}
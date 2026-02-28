export const ENGAGEMENT_TO_PAY_FAMILY = {
  paye: "PAYE",
  loan_out: "Loan Out",
  schd: "Self-Employed",
  long_form: "PAYE",
};

export const BUNDLE_FORMS = {
  PAYE: [
    { name: "PAYE Contract", isDefault: true },
    { name: "Policy Acknowledgement", isDefault: true },
    { name: "Crew Information Form", isDefault: true },
    { name: "Start Form", isDefault: true },
    { name: "P45 / P46", isDefault: false },
  ],
  "Self-Employed": [
    { name: "Self-Employed Contract", isDefault: true },
    { name: "Self-Assessment Declaration", isDefault: true },
    { name: "Certificate of Insurance", isDefault: true },
    { name: "NDA / Confidentiality", isDefault: false },
  ],
  "Direct Hire": [
    { name: "Direct Hire Agreement", isDefault: true },
    { name: "Policy Acknowledgement", isDefault: true },
    { name: "Crew Information Form", isDefault: true },
    { name: "Direct Deposit Form", isDefault: false },
  ],
  "Loan Out": [
    { name: "Loan Out Agreement", isDefault: true },
    { name: "Certificate of Insurance", isDefault: true },
    { name: "Company Details Form", isDefault: true },
    { name: "NDA / Confidentiality", isDefault: false },
  ],
};

export function getMatchedBundle(data) {
  const freq = data.dailyOrWeekly
    ? data.dailyOrWeekly.charAt(0).toUpperCase() + data.dailyOrWeekly.slice(1)
    : "Daily";
  const payFamily = ENGAGEMENT_TO_PAY_FAMILY[data.engagementType] || "PAYE";
  const tag = `${freq.toUpperCase()} ${
    payFamily === "Self-Employed" ? "SE" :
    payFamily === "Loan Out" ? "LO" :
    payFamily === "Direct Hire" ? "DH" : "PAYE"
  }`;
  const dept = data.department
    ? data.department.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Standard Crew";
  const bundleName = `${freq} ${payFamily} ${dept}`;
  const forms = BUNDLE_FORMS[payFamily] || BUNDLE_FORMS["PAYE"];
  return { bundleName, tag, dept, freq, payFamily, forms };
}
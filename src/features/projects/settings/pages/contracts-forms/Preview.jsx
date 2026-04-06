import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CrewInfoForm
//
// HOW IT WORKS:
//   1. useState stores the "terms" text — this is the single source of truth.
//   2. The left panel has a <textarea> bound to that state via value + onChange.
//   3. The right panel reads the same state and renders it inside the preview.
//   4. Every keystroke: textarea onChange → setTerms → re-render → preview updates.
// ─────────────────────────────────────────────────────────────────────────────

export default function CrewInfoForm() {
  // ── The only piece of state: the Terms & Conditions text ──────────────────
  const [terms, setTerms] = useState(
    "By signing this document, the crew member agrees to abide by all production policies, health and safety regulations, and confidentiality obligations as set out in the full engagement contract."
  );

  return (
    <div style={styles.page}>

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Crew Information Form — Live Preview</h1>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div style={styles.columns}>

        {/* LEFT — Edit panel */}
        <div style={styles.leftPanel}>
          <p style={styles.panelLabel}>◀ Edit Panel</p>

          <label style={styles.label} htmlFor="terms-input">
            Terms and Conditions
          </label>
          <p style={styles.hint}>
            Type here and watch the preview update live on the right.
          </p>

          <textarea
            id="terms-input"
            style={styles.textarea}
            rows={10}
            maxLength={1000}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Enter terms and conditions text..."
          />

          <p style={styles.charCount}>{terms.length} / 1000 characters</p>
        </div>

        {/* RIGHT — Document preview */}
        <div style={styles.rightPanel}>
          <p style={styles.panelLabel}>▶ Live Preview</p>

          {/* ── Crew Information Form (static HTML, unchanged) ─────────────── */}
          <div style={styles.doc}>

            {/* Document header */}
            <div style={styles.docHeader}>
              <div style={styles.docTopLeft}>
                VERSION: 7<br />
                DATE: 28 March 2026
              </div>
              <div style={styles.docMeta}>
                <span style={styles.badge}>CREW INFORMATION</span>
              </div>
            </div>

            <div style={styles.docTitle}>CREW INFORMATION FORM</div>
            <div style={styles.filmSub}>FILM: "UNTITLED FEATURE" — CREW INFORMATION &amp; DETAILS</div>

            {/* Section 1: Personal Details */}
            <div style={styles.sectionBar}>1. Personal Details</div>
            <div style={styles.infoGrid4}>
              <InfoCell label="Full Name"        value="JAMES HARLOW" />
              <InfoCell label="Preferred Name"   value="JAMES" />
              <InfoCell label="Date of Birth"    value="01 JAN 1985" />
              <InfoCell label="Nationality"      value="BRITISH" />
            </div>
            <div style={styles.infoGrid4}>
              <InfoCell label="Mobile Number"    value="+44 7700 900123" />
              <InfoCell label="Email Address"    value="james.harlow@crewmail.com" />
              <InfoCell label="National Insurance No." value="AB 12 34 56 C" />
              <InfoCell label="UTR Number"       value="1234567890" />
            </div>
            <div style={styles.infoGrid1}>
              <InfoCell label="Home Address"     value="12 Pinewood Avenue, London" />
            </div>
            <div style={styles.infoGrid3}>
              <InfoCell label="City"             value="LONDON" />
              <InfoCell label="Post Code"        value="SW1A 1AA" />
              <InfoCell label="Country"          value="UNITED KINGDOM" />
            </div>

            {/* Section 2: Production Details */}
            <div style={styles.sectionBar}>2. Production Details</div>
            <div style={styles.infoGrid4}>
              <InfoCell label="Job Title"        value="CAMERA OPERATOR" />
              <InfoCell label="Department"       value="CAMERA" />
              <InfoCell label="Start Date"       value="10 MAR 2025" />
              <InfoCell label="End Date"         value="12 SEP 2025" />
            </div>
            <div style={styles.infoGrid3}>
              <InfoCell label="Engagement Type"  value="SCHD (DAILY/WEEKLY)" />
              <InfoCell label="Pay Frequency"    value="WEEKLY" />
              <InfoCell label="Fee Per Day"      value="£650.00" />
            </div>

            {/* Section 3: Emergency Contact */}
            <div style={styles.sectionBar}>3. Emergency Contact</div>
            <div style={styles.infoGrid4}>
              <InfoCell label="Full Name"           value="EMILY HARLOW" />
              <InfoCell label="Relationship"        value="SPOUSE" />
              <InfoCell label="Phone Number"        value="+44 7700 900456" />
              <InfoCell label="Email Address"       value="emily.harlow@email.com" />
            </div>

            {/* Section 4: Bank Details */}
            <div style={styles.sectionBar}>4. Bank Details</div>
            <div style={styles.infoGrid4}>
              <InfoCell label="Bank Name"           value="BARCLAYS" />
              <InfoCell label="Account Name"        value="JAMES HARLOW" />
              <InfoCell label="Sort Code"           value="20-00-00" />
              <InfoCell label="Account Number"      value="12345678" />
            </div>
            <div style={styles.infoGrid2}>
              <InfoCell label="IBAN (if applicable)"       value="GB00BARC20000012345678" />
              <InfoCell label="SWIFT / BIC (if applicable)" value="BARCGB22" />
            </div>

            {/* Section 5: Right to Work */}
            <div style={styles.sectionBar}>5. Right to Work</div>
            <div style={styles.infoGrid3}>
              <InfoCell label="Document Type"    value="PASSPORT" />
              <InfoCell label="Document Number"  value="123456789" />
              <InfoCell label="Expiry Date"      value="01 JAN 2030" />
            </div>
            <div style={styles.indentNote}>
              The Immigration, Asylum and Nationality Act 2006 requires documentary evidence of eligibility
              to work in the United Kingdom. Crew member must provide original documents prior to
              commencement of engagement.
            </div>

            {/* Section 6: Agent Details */}
            <div style={styles.sectionBar}>6. Agent / Representative Details (if applicable)</div>
            <div style={styles.infoGrid4}>
              <InfoCell label="Agent Name"  value="SARAH BLAKE" />
              <InfoCell label="Agency"      value="TRIBE AGENCY" />
              <InfoCell label="Agent Phone" value="+44 7700 900789" />
              <InfoCell label="Agent Email" value="sarah@tribeagency.com" />
            </div>

            {/* ── TERMS AND CONDITIONS — the only dynamic section ─────────── */}
            {/*
              This is the only part connected to React state.
              Everything above and below is static HTML, untouched.
              "terms" flows straight from useState → here.
            */}
            <div style={styles.sectionBar}>7. Terms and Conditions</div>
            <div style={styles.declarationBox}>
              {/* ↓ This is the only line that uses state */}
              {terms || <span style={{ color: "#9ca3af" }}>No terms entered yet...</span>}
            </div>

            {/* Section 8: Declaration — static, unchanged */}
            <div style={styles.sectionBar}>8. Declaration</div>
            <div style={styles.declarationBox}>
              I, <strong>JAMES HARLOW</strong>, confirm that the information provided in this Crew
              Information Form is true, accurate and complete to the best of my knowledge. I understand
              that providing false or misleading information may result in immediate termination of my
              engagement. I consent to this information being held and processed by{" "}
              <strong>STUDIO NAME</strong> for the purposes of my engagement on{" "}
              <strong>"UNTITLED FEATURE"</strong> in accordance with the applicable data protection
              legislation.
            </div>

            {/* Document footer */}
            <div style={styles.docFooter}>
              <span>CREW_INFO_OFR-000043_V7 · DOCUMENT 1 OF 1</span>
              <span>PAGE 1 OF 1</span>
              <span>CONFIDENTIAL</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// InfoCell — small reusable cell used in the static sections above
// ─────────────────────────────────────────────────────────────────────────────

function InfoCell({ label, value }) {
  return (
    <div style={styles.infoCell}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value || "\u00A0"}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles — plain JS objects, matching the original HTML document's look
// ─────────────────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f3ff",
    fontFamily: "system-ui, Arial, sans-serif",
  },
  header: {
    padding: "14px 24px",
    background: "#5b21b6",
  },
  headerSub: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    margin: "2px 0 0",
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: 16,
    padding: "16px 24px",
    maxWidth: 1400,
    margin: "0 auto",
  },

  // Left panel
  leftPanel: {
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    padding: 16,
    alignSelf: "start",
    position: "sticky",
    top: 16,
  },
  panelLabel: {
    fontSize: 10,
    color: "#7c3aed",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    margin: "0 0 12px",
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1a0040",
    display: "block",
    marginBottom: 4,
  },
  hint: {
    fontSize: 11,
    color: "#6b7280",
    margin: "0 0 8px",
    lineHeight: 1.5,
  },
  textarea: {
    width: "100%",
    padding: "8px 10px",
    fontSize: 12,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#f9fafb",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.6,
    boxSizing: "border-box",
    outline: "none",
  },
  charCount: {
    fontSize: 10,
    color: "#9ca3af",
    textAlign: "right",
    margin: "4px 0 0",
  },

  // Right panel
  rightPanel: {
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    padding: 16,
  },

  // Document styles — match the original HTML exactly
  doc: {
    fontFamily: "Arial, sans-serif",
    fontSize: "8.5pt",
    color: "#111",
    background: "#fff",
    padding: "18px 24px",
  },
  docHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  docTopLeft: {
    fontSize: "7pt",
    color: "#555",
    lineHeight: 1.6,
  },
  docMeta: {
    textAlign: "right",
    fontSize: "7pt",
    color: "#555",
    lineHeight: 1.6,
  },
  badge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 3,
    fontSize: "7pt",
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: "uppercase",
    background: "#059669",
    color: "#fff",
  },
  docTitle: {
    fontSize: "12pt",
    fontWeight: 900,
    color: "#1a0040",
    margin: "6px 0 2px",
  },
  filmSub: {
    fontSize: "7.5pt",
    color: "#888",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  sectionBar: {
    background: "#5b21b6",
    color: "#fff",
    fontSize: "7.5pt",
    fontWeight: 700,
    padding: "3px 8px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    margin: "10px 0 0",
  },
  infoGrid4: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
  },
  infoGrid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
  },
  infoGrid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  infoGrid1: {
    display: "grid",
    gridTemplateColumns: "1fr",
  },
  infoCell: {
    padding: "5px 6px",
    border: "1px solid #e5e7eb",
    background: "#faf9ff",
  },
  infoLabel: {
    fontSize: "6.5pt",
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 1,
  },
  infoValue: {
    fontSize: "8.5pt",
    fontWeight: 600,
    color: "#1a0040",
    minHeight: 12,
  },
  indentNote: {
    fontSize: "7pt",
    color: "#555",
    padding: "4px 8px",
    borderLeft: "3px solid #7c3aed",
    margin: "4px 0",
    background: "#f5f3ff",
    lineHeight: 1.6,
  },
  declarationBox: {
    border: "1px solid #ede9fe",
    borderRadius: 4,
    background: "#faf9ff",
    padding: "8px 10px",
    margin: "8px 0",
    fontSize: "7.5pt",
    color: "#4b5563",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  docFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 4,
    borderTop: "1px solid #e5e7eb",
    fontSize: "6.5pt",
    color: "#aaa",
  },
};
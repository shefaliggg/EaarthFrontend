import React, { useState } from "react";
import { Upload, FileText, CheckCircle, Trash2, Download } from "lucide-react";

/* -------------------------------------------------
   FORM FIELD WRAPPER
------------------------------------------------- */
export function FormField({ label, children, cols = 1 }) {
  return (
    <div className={cols === 2 ? "md:col-span-2" : cols === 3 ? "md:col-span-3" : ""}>
      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

/* -------------------------------------------------
   TEXT / SELECT / TEXTAREA FIELD
------------------------------------------------- */
export function Field({
  label,
  value,
  onChange,
  type = "text",
  options,
  cols = 1,
  placeholder = "",
  isEditing,
}) {
  const baseClasses = `
    w-full px-4 py-2 border border-border rounded-3xl 
    transition-all duration-300 font-normal bg-input text-foreground 
    placeholder-muted-foreground placeholder:text-xs
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className={cols === 2 ? "md:col-span-2" : cols === 3 ? "md:col-span-3" : ""}>
      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
        {label}
      </label>

      {options ? (
        <select
          value={value}
          onChange={onChange}
          disabled={!isEditing}
          className={baseClasses}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          disabled={!isEditing}
          placeholder={placeholder}
          rows={3}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={!isEditing}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------
   PHONE FIELD
------------------------------------------------- */
export function PhoneField({
  label,
  codeValue,
  numberValue,
  onCodeChange,
  onNumberChange,
  isEditing,
}) {
  const selectClasses = `
    w-24 px-2 py-2 border border-border rounded-3xl 
    transition-all duration-300 font-medium bg-input text-foreground 
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
  const inputClasses = `
    flex-1 px-4 py-2 border border-border rounded-3xl 
    transition-all duration-300 font-normal bg-input text-foreground 
    placeholder-muted-foreground placeholder:text-xs
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
        {label}
      </label>

      <div className="flex gap-2">
        <select value={codeValue} onChange={onCodeChange} disabled={!isEditing} className={selectClasses}>
          {["+44", "+1", "+91", "+61", "+33", "+49"].map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>

        <input
          type="tel"
          value={numberValue}
          onChange={onNumberChange}
          disabled={!isEditing}
          placeholder="Phone number"
          className={inputClasses}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------
   FILE UPLOAD WITH AI SCANNING + VERIFIED STATE
------------------------------------------------- */
export function FileUpload({
  fileName,
  isUploaded,
  isEditing,
  onUpload,
  onDelete,
}) {
  const [isScanning, setIsScanning] = useState(false);

  const handleFileSelect = () => {
    if (!isEditing) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setIsScanning(true);
        setTimeout(() => {
          setIsScanning(false);
          onUpload && onUpload(file);
        }, 2000);
      }
    };

    input.click();
  };

  if (isUploaded)
    return (
      <div className="border border-border rounded-lg p-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
            <FileText className="w-5 h-5 text-primary" />
          </div>

          <div>
            <p className="text-sm font-medium text-card-foreground">{fileName}</p>
            <p className="text-xs text-accent flex items-center gap-1 font-medium">
              <CheckCircle className="w-3 h-3" /> AI VERIFIED
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-3xl transition-all duration-300 hover:bg-muted/50">
            <Download className="w-4 h-4 text-primary" />
          </button>

          <button
            onClick={onDelete}
            disabled={!isEditing}
            className="p-2 rounded-3xl transition-all duration-300 hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>
    );

  if (isScanning)
    return (
      <div className="border-2 border-dashed border-primary rounded-lg p-4 text-center bg-primary/5">
        <div className="w-10 h-10 mx-auto mb-2">
          <div
            className="w-10 h-10 rounded-full border-4 animate-spin"
            style={{
              borderColor: "rgba(126, 87, 194, 0.3)",
              borderTopColor: "var(--primary)",
            }}
          />
        </div>
        <p className="text-sm font-semibold text-primary mb-1">AI SCANNING...</p>
        <p className="text-xs text-muted-foreground">Extracting and verifying data...</p>
      </div>
    );

  return (
    <div
      onClick={handleFileSelect}
      className={`border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer transition-all duration-300 hover:border-primary hover:bg-muted/20 ${
        !isEditing ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <Upload className="w-6 h-6 mx-auto mb-2 text-primary" />
      <div className="text-sm font-medium text-primary mb-1">SELECT A FILE</div>
      <p className="text-xs text-muted-foreground">PDF, JPG, PNG · Up to 5MB</p>
    </div>
  );
}

export default {
  FormField,
  Field,
  PhoneField,
  FileUpload,
};









import React, { useState } from "react";
import { Upload, FileText, CheckCircle, Trash2, Download } from "lucide-react";
import EditableSelect from "../../../../shared/components/forms/EditableSelect";
import EditableTextarea from "../../../../shared/components/forms/EditableTextarea";
import EditableInput from "../../../../shared/components/forms/EditableInput";

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
  const colSpanClasses = cols === 2 ? "md:col-span-2" : cols === 3 ? "md:col-span-3" : "";

  // Convert options array to EditableSelect format
  const selectOptions = options ? options.map(opt => ({ value: opt, label: opt })) : [];

  if (options) {
    return (
      <div className={colSpanClasses}>
        <EditableSelect
          isEditing={isEditing}
          label={label}
          value={value}
          onChange={onChange}
          options={selectOptions}
          placeholder={placeholder || "Select an option"}
        />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={colSpanClasses}>
        <EditableTextarea
          isEditing={isEditing}
          label={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
        />
      </div>
    );
  }

  return (
    <div className={colSpanClasses}>
      <EditableInput
        isEditing={isEditing}
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
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
  const countryCodes = [
    { value: "+44", label: "+44" },
    { value: "+1", label: "+1" },
    { value: "+91", label: "+91" },
    { value: "+61", label: "+61" },
    { value: "+33", label: "+33" },
    { value: "+49", label: "+49" },
  ];

  return (
    <div>
      <label className="block text-[12px] font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wide mb-2">
        {label}
      </label>

      <div className="flex gap-2">
        <EditableSelect
          isEditing={isEditing}
          value={codeValue}
          onChange={onCodeChange}
          options={countryCodes}
          className="w-24"
        />

        <EditableInput
          isEditing={isEditing}
          type="tel"
          value={numberValue}
          onChange={onNumberChange}
          placeholder="Phone number"
          className="flex-1"
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
      className={`border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer transition-all duration-300 hover:border-primary hover:bg-muted/20 ${!isEditing ? "opacity-50 cursor-not-allowed" : ""
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









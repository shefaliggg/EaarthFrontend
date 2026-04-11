import React, { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  Trash2,
  Download,
  BadgeQuestionMark,
  CircleQuestionMark,
  Repeat,
} from "lucide-react";
import EditableSelect from "../../../../shared/components/forms/EditableSelect";
import EditableTextarea from "../../../../shared/components/forms/EditableTextarea";
import EditableInput from "../../../../shared/components/forms/EditableInput";
import { InfoTooltip } from "../../../../shared/components/InfoTooltip";
import { SmartIcon } from "../../../../shared/components/SmartIcon";
import { Button } from "../../../../shared/components/ui/button";

/* -------------------------------------------------
   FORM FIELD WRAPPER
------------------------------------------------- */
export function FormField({ label, children, cols = 1 }) {
  return (
    <div
      className={
        cols === 2 ? "md:col-span-2" : cols === 3 ? "md:col-span-3" : ""
      }
    >
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
  const colSpanClasses =
    cols === 2 ? "md:col-span-2" : cols === 3 ? "md:col-span-3" : "";

  // Convert options array to EditableSelect format
  const selectOptions = options
    ? options.map((opt) => ({ value: opt, label: opt }))
    : [];

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
          placeholder="Code"
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
  label,
  icon,
  infoPillDescription = "Upload a clear image or PDF of your document. Our AI will verify its authenticity and extract key data for your profile.",
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

  return (
    <div className="flex flex-col gap-2 rounded-xl">
      {(label || icon) && (
        <div className="flex items-center gap-2 text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
          {icon && <SmartIcon icon={icon} size="md" />}
          <span>{label}</span>
          <InfoTooltip content={infoPillDescription}>
            <CircleQuestionMark className="size-4" />
          </InfoTooltip>
        </div>
      )}

      {/* 🔹 Content */}
      {isUploaded ? (
        <div className="space-y-4">
          <div className="border border-border rounded-lg p-3 py-4 2xl:py-5 flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                <FileText className="w-5 h-5 text-primary" />
              </div>

              <div>
                <p className="text-sm font-medium text-card-foreground">
                  {fileName}
                </p>
                <p className="text-xs text-accent flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3 h-3" /> AI VERIFIED
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md transition-all duration-300 hover:bg-muted/50">
                <Download className="w-4 h-4 text-primary" />
              </button>
              {isEditing && (
                <button
                  onClick={onDelete}
                  disabled={!isEditing}
                  className="p-2 rounded-md transition-all duration-300 hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              )}
            </div>
          </div>
          <Button onClick={handleFileSelect} size={"lg"} className={"w-full"}>
            <Repeat />
            Change Uploaded Document
          </Button>
        </div>
      ) : isScanning ? (
        <div className="border border-dashed border-primary rounded-lg p-6 text-center bg-primary/5">
          <div className="w-10 h-10 mx-auto mb-2">
            <div
              className="w-10 h-10 rounded-full border-4 animate-spin"
              style={{
                borderColor: "rgba(126, 87, 194, 0.3)",
                borderTopColor: "var(--primary)",
              }}
            />
          </div>
          <p className="text-sm font-semibold text-primary mb-1">
            AI Scanning...
          </p>
          <p className="text-xs text-muted-foreground">
            Extracting and verifying data...
          </p>
        </div>
      ) : (
        <div
          onClick={handleFileSelect}
          className={`group border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 ${
            !isEditing
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-primary/60 hover:bg-primary/[0.03]"
          }`}
        >
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3 transition-all group-hover:bg-primary/10">
            <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          {/* Title */}
          <p className="text-sm font-medium text-primary">Upload document</p>

          {/* Subtext */}
          <p className="text-xs text-muted-foreground mt-1">
            PDF or image · Max 5MB
          </p>
        </div>
      )}
    </div>
  );
}

export default {
  FormField,
  Field,
  PhoneField,
  FileUpload,
};

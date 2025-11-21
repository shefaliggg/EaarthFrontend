import React, { useState } from "react";
import { Upload, FileText, CheckCircle, Sparkles, Trash2, Download } from "lucide-react";

/* -------------------------------------------------
   FORM FIELD WRAPPER
------------------------------------------------- */
export function FormField({ label, children, cols = 1, isDarkMode }) {
  return (
    <div className={cols === 2 ? "md:col-span-2" : cols === 3 ? "md:col-span-3" : ""}>
      <label
        className={`block text-xs font-medium mb-2 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
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
  isDarkMode,
}) {
  return (
    <div className={cols === 2 ? "md:col-span-2" : cols === 3 ? "md:col-span-3" : ""}>
      <label
        className={`block text-xs font-medium mb-2 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {label}
      </label>

      {options ? (
        <select
          value={value}
          onChange={onChange}
          disabled={!isEditing}
          className={`w-full px-4 py-3 border rounded-xl text-sm ${
            isDarkMode
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-gray-50 border-gray-200 text-gray-900"
          }`}
        >
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          disabled={!isEditing}
          placeholder={placeholder}
          rows={3}
          className={`w-full px-4 py-3 border rounded-xl text-sm ${
            isDarkMode
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-gray-50 border-gray-200 text-gray-900"
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={!isEditing}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-xl text-sm ${
            isDarkMode
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-gray-50 border-gray-200 text-gray-900"
          }`}
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
  isDarkMode,
}) {
  return (
    <div>
      <label
        className={`block text-xs font-medium mb-2 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {label}
      </label>

      <div className="flex gap-2">
        <select
          value={codeValue}
          onChange={onCodeChange}
          disabled={!isEditing}
          className={`w-24 px-2 py-3 border rounded-xl text-sm ${
            isDarkMode
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-gray-50 border-gray-200 text-gray-900"
          }`}
        >
          {["+44", "+1", "+91", "+61", "+33", "+49"].map((code) => (
            <option key={code}>{code}</option>
          ))}
        </select>

        <input
          type="tel"
          value={numberValue}
          onChange={onNumberChange}
          disabled={!isEditing}
          className={`flex-1 px-4 py-3 border rounded-xl text-sm ${
            isDarkMode
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-gray-50 border-gray-200 text-gray-900"
          }`}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------
   FILE UPLOAD WITH AI SCANNING + VERIFIED STATE
------------------------------------------------- */
export function FileUpload({
  fieldLabel,
  fileName,
  isUploaded,
  isEditing,
  onUpload,
  onDelete,
  isDarkMode,
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

  // AI Verified State
  if (isUploaded)
    return (
      <div
        className={`border rounded-lg p-4 flex items-center justify-between ${
          isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded ${
              isDarkMode ? "bg-gray-600" : "bg-gray-200"
            }`}
          >
            <FileText className="w-6 h-6 text-gray-500" />
          </div>

          <div>
            <p
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              {fileName}
            </p>

            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> AI VERIFIED & SAVED
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded hover:bg-opacity-80 ${
              isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
            }`}
          >
            <Download className="w-4 h-4 text-[#7e57c2]" />
          </button>

          <button
            onClick={onDelete}
            disabled={!isEditing}
            className="p-2 rounded hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    );

  // AI Scanning State
  if (isScanning)
    return (
      <div
        className={`border rounded-lg p-4 text-center ${
          isDarkMode
            ? "border-[#7e57c2] bg-transparent"
            : "border-[#7e57c2] bg-transparent"
        }`}
      >
        <div className="w-6 h-6 mx-auto mb-2 animate-spin">
          <Sparkles className="w-6 h-6 text-[#7e57c2]" />
        </div>

        <p className="text-sm font-medium text-[#7e57c2]">
          EAARTH AI SCANNING...
        </p>

        <p
          className={`text-xs mt-1 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Extracting and verifying data...
        </p>
      </div>
    );

  // Default Upload UI
  return (
    <div
      onClick={handleFileSelect}
      className={`border border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
        isDarkMode
          ? "border-gray-600 bg-gray-700/30 hover:border-[#7e57c2]"
          : "border-gray-300 bg-[#ede7f6]/30 hover:border-[#7e57c2]"
      } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Upload
        className={`w-6 h-6 mx-auto mb-2 ${
          isDarkMode ? "text-gray-400" : "text-[#7e57c2]"
        }`}
      />

      <div
        className={`text-sm font-medium ${
          isDarkMode ? "text-[#9575cd]" : "text-[#7e57c2]"
        }`}
      >
        SELECT A FILE
      </div>

      <p
        className={`text-xs mt-1 ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        PDF, JPG, PNG • Up to 5MB • AI Powered
      </p>
    </div>
  );
}

export default {
  FormField,
  Field,
  PhoneField,
  FileUpload
};
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/config/utils";
import FilterPillTabs from "../../../../shared/components/FilterPillTabs";
import { Upload, Type, PenTool, X, Trash2, Trash, Eraser } from "lucide-react";

const SignaturePad = forwardRef(
  ({ onSave, onCancel, showActions = true }, ref) => {
    const [activeTab, setActiveTab] = useState("draw");
    const [typedValue, setTypedValue] = useState("");
    const [font, setFont] = useState("Festive");
    const [uploadedImage, setUploadedImage] = useState(null);
    const [drawnSignature, setDrawnSignature] = useState(null);

    const sigRef = useRef(null);

    useImperativeHandle(ref, () => ({
      async getData() {
        return await getSignatureData();
      },
    }));

    const getSignatureData = async () => {
      if (activeTab === "draw") {
        return {
          type: "drawn",
          data: sigRef.current?.toDataURL(),
        };
      }

      if (activeTab === "type") {
        await document.fonts.ready;

        return {
          type: "typed",
          data: generateSignatureImage({
            text: typedValue,
            font,
          }),
        };
      }

      if (activeTab === "upload") {
        return {
          type: "uploaded",
          data: uploadedImage,
        };
      }
    };

    function generateSignatureImage({ text, font }) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const padding = 20;
      const fontSize = 48;

      ctx.font = `${font === "Qwitcher Grypen" ? "700" : "400"} ${fontSize}px "${font}"`;

      const textWidth = ctx.measureText(text).width;

      canvas.width = textWidth + padding * 2;
      canvas.height = fontSize + padding * 2;

      // Reapply font after resizing (important!)
      ctx.font = `${font === "Qwitcher Grypen" ? "700" : "400"} ${fontSize}px "${font}"`;
      ctx.fillStyle = "#111827"; // dark ink
      ctx.textBaseline = "middle";

      ctx.fillText(text, padding, canvas.height / 2);

      return canvas.toDataURL("image/png");
    }

    const handleSave = async () => {
      const data = await getSignatureData();
      onSave(data);
    };

    return (
      <div className="w-full overflow-hidden">
        {/* Tabs */}
        <div className="px-4 pt-4">
          <FilterPillTabs
            options={[
              { value: "draw", label: "Draw", icon: PenTool },
              { value: "type", label: "Type", icon: Type },
              { value: "upload", label: "Upload", icon: Upload },
            ]}
            value={activeTab}
            onChange={(value) => setActiveTab(value)}
            size="md"
            transparentBg={false}
          />
        </div>

        <div className="grid grid-cols-[2fr_1fr]">
          {/* Content Area */}
          <div className="p-6 min-h-[240px] flex items-center justify-center bg-gray-50/30">
            {activeTab === "draw" && (
              <DrawSignature sigRef={sigRef} onChange={setDrawnSignature} />
            )}

            {activeTab === "type" && (
              <TypeSignature
                value={typedValue}
                setValue={setTypedValue}
                font={font}
                setFont={setFont}
              />
            )}

            {activeTab === "upload" && (
              <UploadSignature
                setUploadedImage={setUploadedImage}
                image={uploadedImage}
              />
            )}
          </div>

          {/* Preview Section */}
          <SignaturePreview
            type={activeTab}
            drawnSignature={drawnSignature}
            typedValue={typedValue}
            font={font}
            uploadedImage={uploadedImage}
          />
        </div>

        {showActions && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="px-6 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              className="px-6 bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all duration-200"
            >
              Save Signature
            </Button>
          </div>
        )}
      </div>
    );
  },
);

export default SignaturePad;

function DrawSignature({ sigRef, onChange }) {
  const [hasSignature, setHasSignature] = useState(false);

  const handleEnd = () => {
    const isNotEmpty = !sigRef.current.isEmpty();
    setHasSignature(isNotEmpty);

    if (isNotEmpty) {
      onChange(sigRef.current.toDataURL());
    }
  };

  const handleClear = () => {
    sigRef.current.clear();
    setHasSignature(false);
    onChange(null);
  };

  return (
    <div className="w-full space-y-3">
      <SignatureCanvas
        ref={sigRef}
        penColor="#1f2937"
        velocityFilterWeight={0.7}
        minWidth={1}
        maxWidth={2.5}
        onEnd={handleEnd}
        canvasProps={{
          className:
            "w-full h-54 bg-white rounded-xl border-2 border-gray-200 shadow-sm",
          style: { touchAction: "none" },
        }}
      />
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>Sign above</span>
        {hasSignature && (
          <button
            onClick={handleClear}
            className="text-purple-600 hover:text-purple-700 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Eraser className="size-4" />
            Clear signature
          </button>
        )}
      </div>
    </div>
  );
}

function TypeSignature({ value, setValue, font = "Festive", setFont }) {
  const fonts = [
    { name: "Festive", label: "Artistic Signature" },
    { name: "Sacramento", label: "Clean Signature" },
    { name: "Qwitcher Grypen", label: "Flourish Signature" },
    { name: "Inspiration", label: "Classic Ink" },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your name here..."
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {fonts.map((f) => {
          const isActive = font === f.name;

          return (
            <button
              key={f.name}
              onClick={() => setFont(f.name)}
              className={cn(
                "p-3 rounded-xl border-2 transition-all text-left",
                "bg-white hover:border-purple-300",
                isActive
                  ? "border-purple-500 ring-2 ring-purple-200"
                  : "border-gray-200",
              )}
            >
              <div
                className="text-[28px] tracking-wide text-gray-900 truncate"
                style={{
                  fontFamily: f.name,
                  fontWeight: f.name === "Qwitcher Grypen" ? 700 : 400,
                }}
              >
                {value || "Your Signature"}
              </div>

              <div className="text-xs text-gray-500 mt-1">{f.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UploadSignature({ setUploadedImage, image }) {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setUploadedImage(null);
  };

  return (
    <div className="text-center space-y-4 w-full">
      {!image ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 min-h-54 flex items-center justify-center hover:border-purple-400 transition-all duration-200 bg-white">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            id="signature-upload"
            className="hidden"
          />
          <label
            htmlFor="signature-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="p-3 bg-purple-50 rounded-full">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-sm text-gray-600">
              Click to upload signature image
            </div>
            <div className="text-xs text-gray-400">PNG, JPG up to 2MB</div>
          </label>
        </div>
      ) : (
        <div className="relative inline-block">
          <img
            src={image}
            alt="signature"
            className="h-50 object-contain bg-white rounded-lg p-2 shadow-sm"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
}

function SignaturePreview({
  type,
  drawnSignature,
  typedValue,
  font,
  uploadedImage,
}) {
  let content = null;

  if (type === "draw" && drawnSignature) {
    content = <img src={drawnSignature} className="h-12 object-contain" />;
  }

  if (type === "type" && typedValue) {
    content = (
      <div style={{ fontFamily: font }} className="text-2xl text-gray-900">
        {typedValue}
      </div>
    );
  }

  if (type === "upload" && uploadedImage) {
    content = <img src={uploadedImage} className="h-12 object-contain" />;
  }

  const hasContent = type === "type" ? typedValue : content;

  return (
    <div className="px-6 py-4 bg-gray-50/50 border-l border-gray-100">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
        Preview
      </p>
      <div className="min-h-[80px] flex items-center bg-white rounded-lg p-3 border border-gray-200">
        {hasContent ? (
          content
        ) : (
          <span className="text-gray-400 text-sm px-2">
            No signature added yet
          </span>
        )}
      </div>
    </div>
  );
}

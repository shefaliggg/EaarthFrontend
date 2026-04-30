import { useEffect, useRef } from "react";
import { ImagePlus, Share2, Trash2, X } from "lucide-react";
import EditableTextDataField from "../../../../../../shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "../../../../../../shared/components/wrappers/EditableSelectField";
import { Button } from "../../../../../../shared/components/ui/button";
import { SmartIcon } from "../../../../../../shared/components/SmartIcon";
import { InfoTooltip } from "../../../../../../shared/components/InfoTooltip";
import {
  MODAL_TYPES,
  useModalStore,
} from "../../../../../../shared/stores/useModalStore";

export default function AllowanceItemCard({
  data,
  onChange,
  placeholders = {
    icon: "Camera",
    itemName: "e.g. Multi-tool, Camera Rig",
    description: "e.g. Used for on-site repairs",
  },
  onDelete,
  isDisableDelete,
  isEditing = false,
  errors,
}) {
  const fileInputRef = useRef(null);
  const { openModal } = useModalStore();

  console.log("Allowance data:", data);
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // 🔥 Image logic (new + old merged)
  const imagePreview = data.imageFile
    ? URL.createObjectURL(data.imageFile)
    : data.image?.url || null;

    const hasImage = Boolean(imagePreview);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onChange({ ...data, imageFile: file });
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    onChange({ ...data, imageFile: null, image: null });
  };

  useEffect(() => {
    if (!data.imageFile) return;

    const url = URL.createObjectURL(data.imageFile);

    return () => URL.revokeObjectURL(url);
  }, [data.imageFile]);

  const lineTotal = (data.qty || 0) * (data.amount || 0);

  return (
    <div className="flex items-center gap-3 border rounded-xl p-3 bg-card shadow-md">
      {/* ── Image ───────────────────────────────────────── */}
      <div className="relative w-20 h-20 bg-muted rounded-md flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <>
            <img
              src={imagePreview}
              alt=""
              className="w-full h-full object-cover"
            />

            {/* ❌ Remove button (editing only) */}
            {isEditing && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-destructive text-white rounded-full p-0.5"
              >
                <X size={10} />
              </button>
            )}

            {/* ✅ Share button (view mode only) */}
            {!isEditing && (
              <div className="absolute bottom-1 right-1">
                <InfoTooltip content="Share image">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-6 w-6 rounded-full shadow-md"
                    onClick={() =>
                      openModal(MODAL_TYPES.SHARE_DOCUMENT, {
                        document: {
                          key: data.image?.key,
                          name: data.itemName || "Allowance Item",
                          mime: data.image?.mimeType,
                          documentType: "Image"
                        },
                      })
                    }
                  >
                    <Share2 size={12} />
                  </Button>
                </InfoTooltip>
              </div>
            )}
          </>
        ) : isEditing ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex items-center justify-center"
          >
            <SmartIcon
              icon={ImagePlus}
              className={"text-muted-foreground/50"}
              size="lg"
            />
          </button>
        ) : (
          <SmartIcon
            icon={placeholders.icon}
            className={"text-primary"}
            size="lg"
          />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* ── Fields ───────────────────────────────────────── */}
      <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_0.6fr] gap-3 flex-1">
        <EditableTextDataField
          label="Item Name"
          placeholder={placeholders.itemName}
          value={data.itemName}
          onChange={(value) => handleChange("itemName", value)}
          isEditing={isEditing}
          error={errors?.itemName?._errors?.[0]}
        />

        <EditableTextDataField
          label="Description"
          placeholder={placeholders.description}
          value={data.description}
          onChange={(value) => handleChange("description", value)}
          isEditing={isEditing}
          isRequired={false}
        />

        <EditableTextDataField
          label="Quantity"
          value={data.qty}
          onChange={(value) => handleChange("qty", Number(value))}
          isEditing={isEditing}
          type="number"
          error={errors?.qty?._errors?.[0]}
        />

        <EditableTextDataField
          label="Amount"
          value={data.amount}
          onChange={(value) => handleChange("amount", Number(value))}
          isEditing={isEditing}
          type="number"
          error={errors?.amount?._errors?.[0]}
        />

        <EditableSelectField
          label="Condition"
          value={data.condition}
          onChange={(value) => handleChange("condition", value)}
          items={[
            { label: "New", value: "new" },
            { label: "Good", value: "good" },
            { label: "Used", value: "used" },
          ]}
          isEditing={isEditing}
          isRequired={false}
        />

        {/* ── TOTAL ───────────────────────────────────────── */}
        <div className="flex flex-col justify-center px-2">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            TOTAL
          </span>
          <div className="h-[40px] flex items-center text-lg font-bold">
            £{lineTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* ── Delete ───────────────────────────────────────── */}
      {isEditing && (
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={onDelete}
          disabled={isDisableDelete}
          className="text-red-500 hover:text-red-700 hover:bg-red-100 border-transparent"
        >
          <Trash2 size={16} />
        </Button>
      )}
    </div>
  );
}

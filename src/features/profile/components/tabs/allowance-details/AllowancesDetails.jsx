import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableDateField from "@/shared/components/wrappers/EditableDateField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import EditableDocumentField from "@/shared/components/wrappers/EditableDocumentField";
import {
  getDisplayDocument,
  getDocumentsByType,
} from "../../../../user-documents/store/document.selector";
import ProfileCardLoadingSkelton from "../../skeltons/ProfileCardLoadingSkelton";
import ProfileCardErrorSkelton from "../../skeltons/ProfileCardErrorSkelton";
import AllowanceItemsList from "./components/AllowanceItemsList";
import {
  fetchProfileThunk,
  updateVehicleAllowanceThunk,
  updateAllowanceEquipmentsThunk,
} from "../../../store/crew/crewProfile.thunk";
import { fetchDocumentsThunk } from "../../../../user-documents/store/document.thunk";
import {
  allowanceEquipmentsSchema,
  vehicleAllowanceSchema,
} from "../../../config/profileValidationShemas";
import ReuseDocumentPromptPanel from "../../common/ReuseDocumentPromptPanel";
import {
  MODAL_TYPES,
  useModalStore,
} from "../../../../../shared/stores/useModalStore";
import { formatFileSize } from "../../../../../shared/config/utils";
import { removeVehicleAllowanceConfig } from "../../../../../shared/config/ConfirmActionsConfig";

// ── Helpers ──────────────────────────────────────────────────────────────────

const ALLOWANCE_TYPES = [
  { type: "computer", title: "Computer", icon: "Laptop" },
  { type: "mobile", title: "Mobile Phone", icon: "Smartphone" },
  { type: "software", title: "Software", icon: "AppWindow" },
  { type: "equipment", title: "Equipment", icon: "Camera" },
  { type: "boxRentals", title: "Box Rental", icon: "Package" },
];

const emptyItem = () => ({
  id: Date.now() + Math.random(),
  image: "",
  imageFile: null,
  itemName: "",
  description: "",
  qty: 1,
  amount: 0,
  condition: "",
});

const profileItemsToFormItems = (allowances, type) => {
  const stored = allowances?.[type];
  if (!stored?.length) return [];
  return stored.map((item) => ({
    ...item,
    id: Date.now() + Math.random(),
    imageFile: null,
  }));
};

const initVehicleForm = (vehicle) => ({
  usesOwnVehicle: vehicle?.usesOwnVehicle ?? false,
  make: vehicle?.make ?? "",
  model: vehicle?.model ?? "",
  colour: vehicle?.colour ?? "",
  registration: vehicle?.registration ?? "",
  insuranceExpiryDate: vehicle?.insuranceExpiryDate ?? null,
});

// ── Component ─────────────────────────────────────────────────────────────────

export default function AllowanceDetails() {
  const dispatch = useDispatch();
  const { crewProfile, isFetching, isUpdating, error } = useSelector(
    (state) => state.crewProfile,
  );
  const { userDocuments, isFetching: isFetchingDocs } = useSelector(
    (state) => state.userDocuments,
  );

  const [editingSection, setEditingSection] = useState(null);
  const [errors, setErrors] = useState({});
  const [vehicleForm, setVehicleForm] = useState(null);
  const [vehicleFiles, setVehicleFiles] = useState({
    drivingLicence: null,
    vehicleInsurance: null,
  });
  const [vehicleDocIds, setVehicleDocIds] = useState({
    drivingLicence: null,
    vehicleInsurance: null,
  });
  const [initialVehicleDocIds, setInitialVehicleDocIds] = useState({
    drivingLicence: null,
    vehicleInsurance: null,
  });

  const [allowanceForms, setAllowanceForms] = useState({});
  const { openModal, closeModal } = useModalStore();

  useEffect(() => {
    if (!crewProfile && !isFetching) dispatch(fetchProfileThunk());
  }, []);

  useEffect(() => {
    if (!userDocuments && !isFetchingDocs) dispatch(fetchDocumentsThunk());
  }, []);

  // ── Selectors ───────────────────────────────────────────────────────────────

  const drivingLicenceDocs = getDocumentsByType(
    userDocuments,
    "DRIVING_LICENCE",
  );
  const vehicleInsuranceDocs = getDocumentsByType(
    userDocuments,
    "VEHICLE_INSURANCE",
  );

  const resolvedDrivingLicence = getDisplayDocument(
    crewProfile?.vehicle?.drivingLicenceId,
    vehicleDocIds.drivingLicence,
    vehicleFiles.drivingLicence,
    userDocuments,
  );

  const resolvedVehicleInsurance = getDisplayDocument(
    crewProfile?.vehicle?.insuranceCertificateId,
    vehicleDocIds.vehicleInsurance,
    vehicleFiles.vehicleInsurance,
    userDocuments,
  );

  const hasVehicleData =
    crewProfile?.vehicle?.make || crewProfile?.vehicle?.model;

  // ── Editing controls ────────────────────────────────────────────────────────

  const startEditing = (section) => {
    if (section === "vehicle") {
      setVehicleForm(initVehicleForm(crewProfile?.vehicle));
      setVehicleFiles({ drivingLicence: null, vehicleInsurance: null });
      setVehicleDocIds({
        drivingLicence: crewProfile?.vehicle?.drivingLicenceId ?? null,
        vehicleInsurance: crewProfile?.vehicle?.insuranceCertificateId ?? null,
      });
      setInitialVehicleDocIds({
        drivingLicence: crewProfile?.vehicle?.drivingLicenceId ?? null,
        vehicleInsurance: crewProfile?.vehicle?.insuranceCertificateId ?? null,
      });
    } else {
      setAllowanceForms((prev) => ({
        ...prev,
        [section]: profileItemsToFormItems(crewProfile?.allowances, section),
      }));
    }
    setEditingSection(section);
  };

  const cancelEditing = () => {
    setErrors({});
    setEditingSection(null);
    setVehicleForm(null);
    setVehicleFiles({ drivingLicence: null, vehicleInsurance: null });
    setVehicleDocIds({ drivingLicence: null, vehicleInsurance: null });
    setAllowanceForms({});
  };

  // ── Save handlers ───────────────────────────────────────────────────────────

  const handleSaveVehicle = async () => {
    setErrors({});

    const validationData = {
      ...vehicleForm,
      _meta: {
        files: vehicleFiles,
        reuseDocIds: vehicleDocIds,
      },
    };

    const result = vehicleAllowanceSchema.safeParse(validationData);

    if (!result.success) {
      const formatted = result.error.flatten().fieldErrors;
      setErrors(formatted);
      return;
    }

    if (hasVehicleData && !vehicleForm.usesOwnVehicle) {
      const payload = {
        usesOwnVehicle: false,
      };

      openModal(MODAL_TYPES.CONFIRM_ACTION, {
        config: removeVehicleAllowanceConfig,
        onConfirm: async () => {
          closeModal();
          try {
            await dispatch(updateVehicleAllowanceThunk(payload)).unwrap();
            toast.success("Vehicle allowance disabled", {
              description:
                "All vehicle allowance details have been removed. You can add them again anytime.",
            });
            cancelEditing();
          } catch (err) {
            toast.error(err?.message || "Failed to disable vehicle allowance");
          }
        },
        autoClose: true,
      });

      return;
    }

    const fd = new FormData();

    fd.append("usesOwnVehicle", String(vehicleForm.usesOwnVehicle));

    if (vehicleForm.usesOwnVehicle) {
      if (vehicleForm.make) fd.append("make", vehicleForm.make);
      if (vehicleForm.model) fd.append("model", vehicleForm.model);
      if (vehicleForm.colour) fd.append("colour", vehicleForm.colour);
      if (vehicleForm.registration)
        fd.append("registration", vehicleForm.registration);
      if (vehicleForm.insuranceExpiryDate)
        fd.append("insuranceExpiryDate", vehicleForm.insuranceExpiryDate);

      if (vehicleFiles.drivingLicence) {
        fd.append("drivingLicence", vehicleFiles.drivingLicence);
      } else if (vehicleDocIds.drivingLicence) {
        fd.append("drivingLicenceId", vehicleDocIds.drivingLicence);
      }

      if (vehicleFiles.vehicleInsurance) {
        fd.append("vehicleInsurance", vehicleFiles.vehicleInsurance);
      } else if (vehicleDocIds.vehicleInsurance) {
        fd.append("insuranceCertificateId", vehicleDocIds.vehicleInsurance);
      }
    }

    try {
      await dispatch(updateVehicleAllowanceThunk(fd)).unwrap();
      toast.success("Vehicle allowance details updated", {
        description:
          "Your vehicle and allowance details have been successfully updated.",
      });
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update vehicle details");
    }
  };

  const handleSaveAllowance = async (type) => {
    const items = allowanceForms[type] || [];

    setErrors({});

    const hasAnyData = (item) =>
      item.itemName?.trim() ||
      item.description?.trim() ||
      item.qty > 0 ||
      item.amount > 0;

    const filteredItems = items.filter(hasAnyData);

    const cleanedItems = filteredItems.map((item) => ({
      ...item,
      qty: Number(item.qty),
      amount: Number(item.amount),
    }));

    const result = allowanceEquipmentsSchema.safeParse(cleanedItems);

    if (!result.success) {
      const formatted = result.error.format();
      console.log("error :", formatted);
      setErrors({
        allowance: formatted,
      });
      return;
    }

    const fd = new FormData();

    const itemsData = cleanedItems.map(({ imageFile, id, ...rest }) => rest);
    fd.append("items", JSON.stringify(itemsData));

    filteredItems.forEach((item, index) => {
      if (item.imageFile) {
        fd.append(`image_${index}`, item.imageFile);
      }
    });

    try {
      await dispatch(
        updateAllowanceEquipmentsThunk({ type, formData: fd }),
      ).unwrap();

      toast.success(
        `${type.replace("_", " ")} allowances updated successfully`,
      );
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || `Failed to update ${type} allowances`);
    }
  };

  const getDisplayVehicle = () =>
    editingSection === "vehicle" ? vehicleForm : crewProfile?.vehicle;

  const getDisplayItems = (type) => {
    if (editingSection === type) return allowanceForms[type] || [];
    return profileItemsToFormItems(crewProfile?.allowances, type);
  };

  const getGrossTotal = (type) => {
    const items = getDisplayItems(type);
    return items.reduce(
      (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.amount) || 0),
      0,
    );
  };

  const vehicle = getDisplayVehicle();
  const isEditingVehicle = editingSection === "vehicle";
  const isSavingVehicle = isUpdating && editingSection === "vehicle";

  const handleViewDocument = ({ url, fileName, mimeType }) => {
    if (!url) return;

    const isImage = mimeType?.startsWith("image/");

    if (isImage) {
      openModal(MODAL_TYPES.IMAGE_PREVIEW, {
        imageFile: { url },
      });
    } else {
      openModal(MODAL_TYPES.DOCUMENT_PREVIEW, {
        fileUrl: url,
        fileName,
      });
    }
  };

  if (isFetching) {
    return (
      <>
        <ProfileCardLoadingSkelton fields={6} columns={2} />
        <ProfileCardLoadingSkelton fields={3} columns={2} />
      </>
    );
  }

  if (error) {
    return (
      <ProfileCardErrorSkelton
        message={
          typeof error === "string"
            ? error
            : error?.message || "Something went wrong"
        }
        onRetry={() => dispatch(fetchProfileThunk())}
      />
    );
  }

  return (
    <>
      {/* ── Personal Vehicle ─────────────────────────────────────── */}
      <CardWrapper
        title="Personal Vehicle"
        subtitle="Your vehicle details for site access and parking arrangements."
        icon="Car"
        actions={
          <EditToggleButtons
            isEditing={isEditingVehicle}
            isLoading={isSavingVehicle}
            onEdit={() => startEditing("vehicle")}
            onSave={handleSaveVehicle}
            onCancel={cancelEditing}
          />
        }
      >
        <EditableSwitchField
          label="I will use my own vehicle"
          checked={vehicle?.usesOwnVehicle ?? false}
          isEditing={isEditingVehicle}
          onChange={(val) =>
            setVehicleForm((prev) => ({ ...prev, usesOwnVehicle: val }))
          }
          disabled={isSavingVehicle}
        />

        {vehicle?.usesOwnVehicle && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableTextDataField
                label="VEHICLE MAKE"
                placeholder="Eg. Toyota"
                value={vehicle?.make ?? ""}
                isEditing={isEditingVehicle}
                onChange={(val) => setVehicleForm((p) => ({ ...p, make: val }))}
                error={errors?.make?.[0]}
                disabled={isSavingVehicle}
              />
              <EditableTextDataField
                label="VEHICLE MODEL"
                placeholder="Eg. Corolla"
                value={vehicle?.model ?? ""}
                isEditing={isEditingVehicle}
                onChange={(val) =>
                  setVehicleForm((p) => ({ ...p, model: val }))
                }
                error={errors?.model?.[0]}
                disabled={isSavingVehicle}
              />
              <EditableTextDataField
                label="VEHICLE COLOUR"
                value={vehicle?.colour ?? ""}
                isEditing={isEditingVehicle}
                onChange={(val) =>
                  setVehicleForm((p) => ({ ...p, colour: val }))
                }
                isRequired={false}
                disabled={isSavingVehicle}
              />
              <EditableTextDataField
                label="VEHICLE REGISTRATION"
                value={vehicle?.registration ?? ""}
                isEditing={isEditingVehicle}
                onChange={(val) =>
                  setVehicleForm((p) => ({
                    ...p,
                    registration: val.toUpperCase(),
                  }))
                }
                error={errors?.registration?.[0]}
                disabled={isSavingVehicle}
              />
              <EditableDateField
                label="INSURANCE EXPIRY DATE"
                value={vehicle?.insuranceExpiryDate ?? null}
                isEditing={isEditingVehicle}
                onChange={(val) =>
                  setVehicleForm((p) => ({ ...p, insuranceExpiryDate: val }))
                }
                error={errors?.insuranceExpiryDate?.[0]}
                disabled={isSavingVehicle}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 mt-2">
              <EditableDocumentField
                label="DRIVING LICENCE"
                isEditing={isEditingVehicle}
                fileName={
                  resolvedDrivingLicence?.originalName ?? "No file uploaded"
                }
                fileUrl={resolvedDrivingLicence?.url ?? null}
                isUploaded={!!resolvedDrivingLicence}
                status={resolvedDrivingLicence?.verificationStatus || "Pending"}
                expiresAt={resolvedDrivingLicence?.expiresAt}
                meta={formatFileSize(resolvedDrivingLicence?.sizeBytes)}
                onUpload={(file) => {
                  setVehicleFiles((p) => ({ ...p, drivingLicence: file }));
                  setVehicleDocIds((p) => ({ ...p, drivingLicence: null }));
                }}
                onView={(url) =>
                  handleViewDocument({
                    url,
                    fileName: resolvedDrivingLicence?.originalName,
                    mimeType: resolvedDrivingLicence?.mimeType,
                  })
                }
                infoPillDescription="Upload a valid government-issued driving licence."
                error={errors?.drivingLicence?.[0]}
                disabled={isSavingVehicle}
                actionSlot={
                  isEditingVehicle &&
                  drivingLicenceDocs?.length > 0 && (
                    <ReuseDocumentPromptPanel
                      label="driving licence"
                      docs={drivingLicenceDocs}
                      selectedId={vehicleDocIds.drivingLicence}
                      docType="DRIVING_LICENCE"
                      onSelect={(id) => {
                        setVehicleDocIds((prev) => ({
                          ...prev,
                          drivingLicence: id,
                        }));

                        if (id) {
                          setVehicleFiles((f) => ({
                            ...f,
                            drivingLicence: null,
                          }));
                        }
                      }}
                      disabled={isSavingVehicle}
                      existingDocId={initialVehicleDocIds.drivingLicence}
                    />
                  )
                }
              />

              <EditableDocumentField
                label="VEHICLE INSURANCE CERTIFICATE"
                isEditing={isEditingVehicle}
                fileName={
                  resolvedVehicleInsurance?.originalName ?? "No file uploaded"
                }
                fileUrl={resolvedVehicleInsurance?.url ?? null}
                isUploaded={!!resolvedVehicleInsurance}
                status={
                  resolvedVehicleInsurance?.verificationStatus || "Pending"
                }
                expiresAt={resolvedVehicleInsurance?.expiresAt}
                meta={formatFileSize(resolvedVehicleInsurance?.sizeBytes)}
                load={(file) => {
                  setVehicleFiles((p) => ({ ...p, vehicleInsurance: file }));
                  setVehicleDocIds((p) => ({ ...p, vehicleInsurance: null }));
                }}
                onView={(url) =>
                  handleViewDocument({
                    url,
                    fileName: resolvedVehicleInsurance?.originalName,
                    mimeType: resolvedVehicleInsurance?.mimeType,
                  })
                }
                infoPillDescription="Upload a valid vehicle insurance certificate."
                error={errors?.vehicleInsurance?.[0]}
                disabled={isSavingVehicle}
                actionSlot={
                  isEditingVehicle &&
                  vehicleInsuranceDocs?.length > 0 && (
                    <ReuseDocumentPromptPanel
                      label="vehicle insurance certificate"
                      docs={vehicleInsuranceDocs}
                      selectedId={vehicleDocIds.vehicleInsurance}
                      docType="VEHICLE_INSURANCE"
                      onSelect={(id) => {
                        setVehicleDocIds((prev) => ({
                          ...prev,
                          vehicleInsurance: id,
                        }));

                        if (id) {
                          setVehicleFiles((f) => ({
                            ...f,
                            vehicleInsurance: null,
                          }));
                        }
                      }}
                      disabled={isSavingVehicle}
                      existingDocId={initialVehicleDocIds.vehicleInsurance}
                    />
                  )
                }
              />
            </div>
          </div>
        )}
      </CardWrapper>

      {/* ── Allowance Cards ──────────────────────────────────────── */}
      {ALLOWANCE_TYPES.map(({ type, title, icon }) => {
        const isEditingThis = editingSection === type;
        const isSavingThis = isUpdating && editingSection === type;
        const grossTotal = getGrossTotal(type);

        return (
          <CardWrapper
            key={type}
            title={title}
            icon={icon}
            actions={
              <>
                {grossTotal > 0 && (
                  <div className="flex items-center gap-2 px-3 text-sm text-muted-foreground">
                    <span>Gross Total</span>
                    <span className="text-[16px] font-semibold text-primary">
                      £{grossTotal.toFixed(2)}
                    </span>
                  </div>
                )}
                <EditToggleButtons
                  isEditing={isEditingThis}
                  isLoading={isSavingThis}
                  onEdit={() => startEditing(type)}
                  onSave={() => handleSaveAllowance(type)}
                  onCancel={cancelEditing}
                />
              </>
            }
          >
            <AllowanceItemsList
              allowanceType={type}
              isEditing={isEditingThis}
              items={getDisplayItems(type)}
              errors={errors?.allowance}
              onChange={(updatedItems) =>
                setAllowanceForms((prev) => ({ ...prev, [type]: updatedItems }))
              }
            />
          </CardWrapper>
        );
      })}
    </>
  );
}

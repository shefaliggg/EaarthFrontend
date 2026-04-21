import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditablePhoneField from "@/shared/components/wrappers/EditablePhoneField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import {
  getCountryOptions,
  getPhoneCodeOptions,
} from "@/shared/config/countriesDataConfig";
import { toast } from "sonner";
import {
  fetchProfileThunk,
  setupAgencyThunk,
  updateAgencyDetailsThunk,
  updateAgentContactThunk,
  updateAgentBankThunk,
} from "../../store/crew/crewProfile.thunk";
import ProfileCardLoadingSkelton from "../skeltons/ProfileCardLoadingSkelton";
import ProfileCardErrorSkelton from "../skeltons/ProfileCardErrorSkelton";
import {
  agencySetupSchema,
  agencyDetailsSchema,
  agentContactSchema,
  agentBankSchema,
} from "../../config/profileValidationShemas";
import { AutoHeight } from "../../../../shared/components/wrappers/AutoHeight";
import { Upload } from "lucide-react";
import { Button } from "../../../../shared/components/ui/button";
import {
  MODAL_TYPES,
  useModalStore,
} from "../../../../shared/stores/useModalStore";
import { removeAgencyDetailsConfig } from "../../../../shared/config/ConfirmActionsConfig";

const EMPTY_AGENCY_DETAILS = {
  hasAgent: false,
  agencyName: "",
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  postcode: "",
  country: "",
};

const EMPTY_AGENT_CONTACT = {
  agentCountryCode: "",
  agentNumber: "",
  agentCorrespondenceName: "",
  agentCorrespondenceEmail: "",
  sendEmailToCrewMember: false,
  agentSignatoryName: "",
  agentSignatoryEmail: "",
};

const EMPTY_AGENT_BANK = {
  bankName: "",
  branch: "",
  accountName: "",
  sortCode: "",
  accountNumber: "",
  iban: "",
  swiftBic: "",
};

export default function AgencyDetails() {
  const [isEditing, setIsEditing] = useState({ section: null });
  const [isSetupStarted, setIsSetupStarted] = useState(false);
  const [showConfirm, setIsShowConfirm] = useState(false);
  const [formState, setFormState] = useState({
    agencyDetails: null,
    agentContact: null,
    agentBank: null,
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { crewProfile, isFetching, isUpdating, error } = useSelector(
    (state) => state.crewProfile,
  );
  const { openModal, closeModal } = useModalStore();

  useEffect(() => {
    if (!crewProfile && !isFetching) dispatch(fetchProfileThunk());
  }, [crewProfile, isFetching]);

  const agency = crewProfile?.agency;
  const hasAgencyData = agency?.agencyName || agency?.bank?.accountNumber;
  const isConfigured = agency?.configured === true;
  const isSetupMode = !isConfigured && isSetupStarted;

  useEffect(() => {
    if (isSetupMode && crewProfile && !formState.agencyDetails) {
      setFormState({
        agencyDetails: { ...EMPTY_AGENCY_DETAILS },
        agentContact: { ...EMPTY_AGENT_CONTACT },
        agentBank: { ...EMPTY_AGENT_BANK },
      });
    }
  }, [isConfigured, crewProfile]);

  const isEditingAgencyDetails =
    isSetupMode || isEditing.section === "agencyDetails";
  const isEditingAgentContact =
    isSetupMode || isEditing.section === "agentContact";
  const isEditingAgentBank = isSetupMode || isEditing.section === "agentBank";

  const isSavingSetup = isUpdating && isSetupMode;
  const isSavingAgencyDetails =
    isUpdating && isEditing.section === "agencyDetails";
  const isSavingAgentContact =
    isUpdating && isEditing.section === "agentContact";
  const isSavingAgentBank = isUpdating && isEditing.section === "agentBank";

  // ── Display values ────────────────────────────────────────────────────────
  const ad = isEditingAgencyDetails
    ? formState.agencyDetails
    : {
        hasAgent: agency?.hasAgent ?? false,
        agencyName: agency?.agencyName ?? "",
        addressLine1: agency?.address?.line1 ?? "",
        addressLine2: agency?.address?.line2 ?? "",
        addressLine3: agency?.address?.line3 ?? "",
        postcode: agency?.address?.postcode ?? "",
        country: agency?.address?.country ?? "",
      };

  const ac = isEditingAgentContact
    ? formState.agentContact
    : {
        agentCountryCode: agency?.agentPhone?.countryCode ?? "",
        agentNumber: agency?.agentPhone?.number ?? "",
        agentCorrespondenceName: agency?.agentCorrespondenceName ?? "",
        agentCorrespondenceEmail: agency?.agentCorrespondenceEmail ?? "",
        sendEmailToCrewMember: agency?.sendEmailToCrewMember ?? false,
        agentSignatoryName: agency?.agentSignatoryName ?? "",
        agentSignatoryEmail: agency?.agentSignatoryEmail ?? "",
      };

  const ab = isEditingAgentBank
    ? formState.agentBank
    : {
        bankName: agency?.bank?.bankName ?? "",
        branch: agency?.bank?.branch ?? "",
        accountName: agency?.bank?.accountName ?? "",
        sortCode: agency?.bank?.sortCode ?? "",
        accountNumber: agency?.bank?.accountNumber ?? "",
        iban: agency?.bank?.iban ?? "",
        swiftBic: agency?.bank?.swiftBic ?? "",
      };

  const haveAgent = ad?.hasAgent;

  // ── Editing controls ──────────────────────────────────────────────────────
  const startEditing = (section) => {
    setErrors({});
    const snapshots = {
      agencyDetails: {
        hasAgent: agency?.hasAgent ?? false,
        agencyName: agency?.agencyName ?? "",
        addressLine1: agency?.address?.line1 ?? "",
        addressLine2: agency?.address?.line2 ?? "",
        addressLine3: agency?.address?.line3 ?? "",
        postcode: agency?.address?.postcode ?? "",
        country: agency?.address?.country ?? "",
      },
      agentContact: {
        agentCountryCode: agency?.agentPhone?.countryCode ?? "",
        agentNumber: agency?.agentPhone?.number ?? "",
        agentCorrespondenceName: agency?.agentCorrespondenceName ?? "",
        agentCorrespondenceEmail: agency?.agentCorrespondenceEmail ?? "",
        sendEmailToCrewMember: agency?.sendEmailToCrewMember ?? false,
        agentSignatoryName: agency?.agentSignatoryName ?? "",
        agentSignatoryEmail: agency?.agentSignatoryEmail ?? "",
      },
      agentBank: {
        bankName: agency?.bank?.bankName ?? "",
        branch: agency?.bank?.branch ?? "",
        accountName: agency?.bank?.accountName ?? "",
        sortCode: agency?.bank?.sortCode ?? "",
        accountNumber: agency?.bank?.accountNumber ?? "",
        iban: agency?.bank?.iban ?? "",
        swiftBic: agency?.bank?.swiftBic ?? "",
      },
    };
    setFormState((prev) => ({ ...prev, [section]: snapshots[section] }));
    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setErrors({});

    setIsSetupStarted(false);

    setFormState({
      agencyDetails: null,
      agentContact: null,
      agentBank: null,
    });
  };

  const handleSaveSetup = async () => {
    setErrors({});

    const combined = {
      hasAgent: true,
      ...formState.agencyDetails,
      ...formState.agentContact,
      ...formState.agentBank,
    };

    const result = agencySetupSchema.safeParse(combined);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const payload = {
      hasAgent: true,
      agencyName: formState.agencyDetails.agencyName,
      address: {
        line1: formState.agencyDetails.addressLine1,
        line2: formState.agencyDetails.addressLine2,
        line3: formState.agencyDetails.addressLine3,
        postcode: formState.agencyDetails.postcode,
        country: formState.agencyDetails.country,
      },
      agentPhone: {
        countryCode: formState.agentContact.agentCountryCode,
        number: formState.agentContact.agentNumber,
      },
      agentCorrespondenceName: formState.agentContact.agentCorrespondenceName,
      agentCorrespondenceEmail: formState.agentContact.agentCorrespondenceEmail,
      sendEmailToCrewMember: formState.agentContact.sendEmailToCrewMember,
      agentSignatoryName: formState.agentContact.agentSignatoryName,
      agentSignatoryEmail: formState.agentContact.agentSignatoryEmail,
      bank: {
        bankName: formState.agentBank.bankName,
        branch: formState.agentBank.branch,
        accountName: formState.agentBank.accountName,
        sortCode: formState.agentBank.sortCode,
        accountNumber: formState.agentBank.accountNumber,
        iban: formState.agentBank.iban,
        swiftBic: formState.agentBank.swiftBic,
      },
    };

    try {
      await dispatch(setupAgencyThunk(payload)).unwrap();
      toast.success("Agency setup complete", {
        description:
          "Your agency is now configured. You can update each section individually anytime.",
      });
    } catch (err) {
      toast.error(err?.message || "Failed to complete agency setup");
    }
  };

  // ── Individual section saves (configured mode only) ───────────────────────
  const handleSaveAgencyDetails = async () => {
    setErrors({});
    const result = agencyDetailsSchema.safeParse(formState.agencyDetails);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    if (hasAgencyData && !formState.agencyDetails.hasAgent) {
      const payload = {
        hasAgent: false,
        agencyName: "",
        address: {
          line1: "",
          line2: "",
          line3: "",
          postcode: "",
          country: "",
        },
      };

      openModal(MODAL_TYPES.CONFIRM_ACTION, {
        config: removeAgencyDetailsConfig,
        onConfirm: async () => {
          closeModal();
          try {
            await dispatch(updateAgencyDetailsThunk(payload)).unwrap();
            toast.success("Agency removed successfully");
            cancelEditing();
          } catch (err) {
            toast.error(err?.message || "Failed to remove agency");
          }
        },
        autoClose: true,
      });

      return;
    }

    const payload = {
      hasAgent: formState.agencyDetails.hasAgent,
      agencyName: formState.agencyDetails.agencyName,
      address: {
        line1: formState.agencyDetails.addressLine1,
        line2: formState.agencyDetails.addressLine2,
        line3: formState.agencyDetails.addressLine3,
        postcode: formState.agencyDetails.postcode,
        country: formState.agencyDetails.country,
      },
    };
    try {
      await dispatch(updateAgencyDetailsThunk(payload)).unwrap();
      toast.success("Agency details updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update agency details");
    }
  };

  const handleSaveAgentContact = async () => {
    setErrors({});
    const result = agentContactSchema.safeParse({
      ...formState.agentContact,
      hasAgent: agency?.hasAgent,
    });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const payload = {
      hasAgent: agency?.hasAgent,
      agentPhone: {
        countryCode: formState.agentContact.agentCountryCode,
        number: formState.agentContact.agentNumber,
      },
      agentCorrespondenceName: formState.agentContact.agentCorrespondenceName,
      agentCorrespondenceEmail: formState.agentContact.agentCorrespondenceEmail,
      sendEmailToCrewMember: formState.agentContact.sendEmailToCrewMember,
      agentSignatoryName: formState.agentContact.agentSignatoryName,
      agentSignatoryEmail: formState.agentContact.agentSignatoryEmail,
    };
    try {
      await dispatch(updateAgentContactThunk(payload)).unwrap();
      toast.success("Agent contact updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update agent contact");
    }
  };

  const handleSaveAgentBank = async () => {
    setErrors({});
    const result = agentBankSchema.safeParse({
      ...formState.agentBank,
      hasAgent: agency?.hasAgent,
    });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    try {
      await dispatch(
        updateAgentBankThunk({
          hasAgent: agency?.hasAgent,
          bank: formState.agentBank,
        }),
      ).unwrap();
      toast.success("Agent bank updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update agent bank");
    }
  };

  // ── Loading / error ───────────────────────────────────────────────────────
  if (isFetching) {
    return (
      <>
        <ProfileCardLoadingSkelton fields={5} columns={2} />
        <ProfileCardLoadingSkelton fields={5} columns={2} />
        <ProfileCardLoadingSkelton fields={4} columns={2} />
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

  if (!isConfigured && !isSetupStarted) {
    return (
      <CardWrapper
        title="Agency Configuration"
        icon="BriefcaseBusiness"
        actions={
          <EditToggleButtons
            isEditing={isSetupStarted}
            onEdit={() => setIsSetupStarted(true)}
            onCancel={cancelEditing}
          />
        }
      >
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-border rounded-xl">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Upload className="size-6" />
          </div>

          <p className="text-sm font-medium mb-1">
            No agency details added yet
          </p>

          <p className="text-xs text-muted-foreground mb-6 max-w-xs">
            Set up your agency information.
          </p>

          <Button onClick={() => setIsSetupStarted(true)}>Set Up Agency</Button>
        </div>
      </CardWrapper>
    );
  }

  return (
    <AutoHeight className="space-y-4">
      <CardWrapper
        title="Agency Details"
        icon="BriefcaseBusiness"
        actions={
          <EditToggleButtons
            isEditing={isEditingAgencyDetails}
            isLoading={isSetupMode ? isSavingSetup : isSavingAgencyDetails}
            onEdit={
              isSetupMode ? undefined : () => startEditing("agencyDetails")
            }
            onSave={isSetupMode ? handleSaveSetup : handleSaveAgencyDetails}
            onCancel={cancelEditing}
          />
        }
      >
        <div className="grid grid-cols-1 gap-4">
          {!isSetupMode && (
            <EditableSwitchField
              label="Represented by an agent"
              checked={haveAgent}
              isEditing={isEditingAgencyDetails}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  agencyDetails: { ...prev.agencyDetails, hasAgent: val },
                }))
              }
              disabled={isSetupMode ? isSavingSetup : isSavingAgencyDetails}
            />
          )}

          {(isSetupMode || haveAgent) && (
            <div className="grid grid-cols-1 gap-4">
              <EditableTextDataField
                label="AGENCY NAME"
                value={ad?.agencyName}
                isEditing={isEditingAgencyDetails}
                isRequired={true}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agencyDetails: { ...prev.agencyDetails, agencyName: val },
                  }))
                }
                error={errors?.agencyName?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingAgencyDetails}
              />

              <EditableTextDataField
                label="ADDRESS LINE 1"
                value={ad?.addressLine1}
                isEditing={isEditingAgencyDetails}
                isRequired={true}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agencyDetails: { ...prev.agencyDetails, addressLine1: val },
                  }))
                }
                error={errors?.addressLine1?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingAgencyDetails}
              />

              <EditableTextDataField
                label="ADDRESS LINE 2"
                value={ad?.addressLine2}
                isEditing={isEditingAgencyDetails}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agencyDetails: { ...prev.agencyDetails, addressLine2: val },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingAgencyDetails}
              />

              <EditableTextDataField
                label="ADDRESS LINE 3"
                value={ad?.addressLine3}
                isEditing={isEditingAgencyDetails}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agencyDetails: { ...prev.agencyDetails, addressLine3: val },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingAgencyDetails}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableTextDataField
                  label="POSTCODE"
                  value={ad?.postcode}
                  isEditing={isEditingAgencyDetails}
                  isRequired={true}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      agencyDetails: {
                        ...prev.agencyDetails,
                        postcode: val.toUpperCase(),
                      },
                    }))
                  }
                  error={errors?.postcode?.[0]}
                  disabled={isSetupMode ? isSavingSetup : isSavingAgencyDetails}
                />

                <EditableSelectField
                  label="COUNTRY"
                  value={ad?.country}
                  isEditing={isEditingAgencyDetails}
                  isRequired={true}
                  items={getCountryOptions()}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      agencyDetails: { ...prev.agencyDetails, country: val },
                    }))
                  }
                  error={errors?.country?.[0]}
                  disabled={isSetupMode ? isSavingSetup : isSavingAgencyDetails}
                />
              </div>
            </div>
          )}
        </div>
      </CardWrapper>

      {(isSetupMode || haveAgent) && (
        <>
          {/* ── Agent Contact ─────────────────────────────────────────────── */}
          <CardWrapper
            title="Agent Contact"
            icon="UserCheck"
            actions={
              !isSetupMode ? (
                <EditToggleButtons
                  isEditing={isEditingAgentContact}
                  isLoading={isSetupMode ? isSavingSetup : isSavingAgentContact}
                  onEdit={
                    isSetupMode ? undefined : () => startEditing("agentContact")
                  }
                  onSave={
                    isSetupMode ? handleSaveSetup : handleSaveAgentContact
                  }
                  onCancel={cancelEditing}
                />
              ) : null
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditablePhoneField
                label="AGENT PHONE NUMBER"
                value={{
                  countryCode: ac?.agentCountryCode,
                  phoneNumber: ac?.agentNumber,
                }}
                isEditing={isEditingAgentContact}
                isRequired={haveAgent}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentContact: {
                      ...prev.agentContact,
                      agentCountryCode: val.countryCode,
                      agentNumber: val.phoneNumber,
                    },
                  }))
                }
                codeOptions={getPhoneCodeOptions()}
                error={
                  errors?.agentNumber?.[0] || errors?.agentCountryCode?.[0]
                }
                disabled={isSetupMode ? isSavingSetup : isSavingAgentContact}
              />

              <EditableTextDataField
                label="CORRESPONDENCE NAME"
                value={ac?.agentCorrespondenceName}
                isEditing={isEditingAgentContact}
                isRequired={haveAgent}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentContact: {
                      ...prev.agentContact,
                      agentCorrespondenceName: val,
                    },
                  }))
                }
                error={errors?.agentCorrespondenceName?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingAgentContact}
              />

              <EditableTextDataField
                label="CORRESPONDENCE EMAIL"
                value={ac?.agentCorrespondenceEmail}
                isEditing={isEditingAgentContact}
                isRequired={haveAgent}
                type="email"
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentContact: {
                      ...prev.agentContact,
                      agentCorrespondenceEmail: val,
                    },
                  }))
                }
                error={errors?.agentCorrespondenceEmail?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingAgentContact}
              />

              <EditableTextDataField
                label="SIGNATORY NAME"
                value={ac?.agentSignatoryName}
                isEditing={isEditingAgentContact}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentContact: {
                      ...prev.agentContact,
                      agentSignatoryName: val,
                    },
                  }))
                }
                error={errors?.agentSignatoryName?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingAgentContact}
              />

              <EditableTextDataField
                label="SIGNATORY EMAIL"
                value={ac?.agentSignatoryEmail}
                isEditing={isEditingAgentContact}
                isRequired={false}
                type="email"
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentContact: {
                      ...prev.agentContact,
                      agentSignatoryEmail: val,
                    },
                  }))
                }
                error={errors?.agentSignatoryEmail?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingAgentContact}
              />
            </div>

            <div className="mt-4">
              <EditableSwitchField
                label="Send project emails to crew member via agent"
                checked={ac?.sendEmailToCrewMember}
                isEditing={isEditingAgentContact}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentContact: {
                      ...prev.agentContact,
                      sendEmailToCrewMember: val,
                    },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingAgentContact}
              />
            </div>
          </CardWrapper>

          {/* ── Agent Bank ────────────────────────────────────────────────── */}
          <CardWrapper
            title="Agent Bank Details"
            icon="Landmark"
            actions={
              !isSetupMode ? (
                <EditToggleButtons
                  isEditing={isEditingAgentBank}
                  isLoading={isSetupMode ? isSavingSetup : isSavingAgentBank}
                  onEdit={
                    isSetupMode ? undefined : () => startEditing("agentBank")
                  }
                  onSave={isSetupMode ? handleSaveSetup : handleSaveAgentBank}
                  onCancel={cancelEditing}
                />
              ) : null
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableTextDataField
                label="BANK NAME"
                value={ab?.bankName}
                isEditing={isEditingAgentBank}
                isRequired={haveAgent}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentBank: { ...prev.agentBank, bankName: val },
                  }))
                }
                error={errors?.bankName?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingAgentBank}
              />

              <EditableTextDataField
                label="BRANCH"
                value={ab?.branch}
                isEditing={isEditingAgentBank}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentBank: { ...prev.agentBank, branch: val },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingAgentBank}
              />

              <EditableTextDataField
                label="ACCOUNT NAME"
                value={ab?.accountName}
                isEditing={isEditingAgentBank}
                isRequired={haveAgent}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentBank: { ...prev.agentBank, accountName: val },
                  }))
                }
                error={errors?.accountName?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingAgentBank}
              />

              <EditableTextDataField
                label="SORT CODE"
                value={ab?.sortCode}
                isEditing={isEditingAgentBank}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentBank: { ...prev.agentBank, sortCode: val },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingAgentBank}
              />

              <EditableTextDataField
                label="ACCOUNT NUMBER"
                value={ab?.accountNumber}
                isEditing={isEditingAgentBank}
                isRequired={haveAgent}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentBank: { ...prev.agentBank, accountNumber: val },
                  }))
                }
                error={errors?.accountNumber?.[0]}
                disabled={isSetupMode ? isSavingSetup : isSavingAgentBank}
              />

              <EditableTextDataField
                label="IBAN"
                value={ab?.iban}
                isEditing={isEditingAgentBank}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentBank: { ...prev.agentBank, iban: val.toUpperCase() },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingAgentBank}
              />

              <EditableTextDataField
                label="SWIFT / BIC"
                value={ab?.swiftBic}
                isEditing={isEditingAgentBank}
                isRequired={false}
                onChange={(val) =>
                  setFormState((prev) => ({
                    ...prev,
                    agentBank: {
                      ...prev.agentBank,
                      swiftBic: val.toUpperCase(),
                    },
                  }))
                }
                disabled={isSetupMode ? isSavingSetup : isSavingAgentBank}
              />
            </div>
          </CardWrapper>
        </>
      )}
    </AutoHeight>
  );
}

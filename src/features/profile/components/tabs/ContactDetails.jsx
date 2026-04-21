import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditablePhoneField from "@/shared/components/wrappers/EditablePhoneField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import {
  derivePhoneCode,
  getCountryByCode,
  getCountryOptions,
  getPhoneCodeOptions,
} from "@/shared/config/countriesDataConfig";
import { toast } from "sonner";
import {
  fetchProfileThunk,
  updateHomeAddressThunk,
  updateContactInfoThunk,
  updateEmergencyContactThunk,
} from "../../store/crew/crewProfile.thunk";
import ProfileCardLoadingSkelton from "../skeltons/ProfileCardLoadingSkelton";
import ProfileCardErrorSkelton from "../skeltons/ProfileCardErrorSkelton";
import {
  contactInfoSchema,
  emergencyContactSchema,
  homeAddressSchema,
} from "../../config/profileValidationShemas";
import z from "zod";

function syncEmptyPhoneCodes(contactInfo, changedKey, newCode) {
  const phoneCodeKeys = ["mobileCountryCode", "otherCountryCode"];
  const updated = { ...contactInfo, [changedKey]: newCode };

  for (const key of phoneCodeKeys) {
    if (key !== changedKey && !contactInfo[key]) {
      updated[key] = newCode;
    }
  }

  return updated;
}

export default function ContactDetails() {
  const [isEditing, setIsEditing] = useState({ section: null });
  const [formState, setFormState] = useState({
    homeAddress: null,
    contactInfo: null,
    emergencyContact: null,
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { crewProfile, isFetching, isUpdating, error } = useSelector(
    (state) => state.crewProfile,
  );
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!crewProfile && !isFetching) {
      dispatch(fetchProfileThunk());
    }
  }, [crewProfile, isFetching]);

  const isEditingHome = isEditing.section === "homeAddress";
  const isEditingContact = isEditing.section === "contactInfo";
  const isEditingEmergency = isEditing.section === "emergencyContact";

  const isSavingHome = isUpdating && isEditingHome;
  const isSavingContact = isUpdating && isEditingContact;
  const isSavingEmergency = isUpdating && isEditingEmergency;

  const ha = isEditingHome
    ? formState.homeAddress
    : {
        addressLine1: crewProfile?.homeAddress?.line1 ?? "",
        addressLine2: crewProfile?.homeAddress?.line2 ?? "",
        addressLine3: crewProfile?.homeAddress?.line3 ?? "",
        postcode: crewProfile?.homeAddress?.postcode ?? "",
        country: crewProfile?.homeAddress?.country ?? "",
      };

  const ci = isEditingContact
    ? formState.contactInfo
    : {
        mobileCountryCode: currentUser?.phone?.countryCode ?? "",
        mobileNumber: currentUser?.phone?.number ?? "",
        otherCountryCode: crewProfile?.otherPhone?.countryCode ?? "",
        otherNumber: crewProfile?.otherPhone?.number ?? "",
        email: currentUser?.email ?? "",
        emailPayslip: crewProfile?.emailPayslip ?? "",
        emailPension: crewProfile?.emailPension ?? "",
        sendProjectEmailsToCrewMember:
          crewProfile?.sendProjectEmailsToCrewMember ?? true,
      };

  const ec = isEditingEmergency
    ? formState.emergencyContact
    : {
        emergencyName: crewProfile?.emergencyContact?.fullName ?? "",
        emergencyRelationship:
          crewProfile?.emergencyContact?.relationship ?? "",
        emergencyCountryCode:
          crewProfile?.emergencyContact?.phone?.countryCode ?? "",
        emergencyNumber: crewProfile?.emergencyContact?.phone?.number ?? "",
      };

  const startEditing = (section) => {
    setErrors({});

    if (section === "homeAddress") {
      setFormState((prev) => ({
        ...prev,
        homeAddress: {
          addressLine1: crewProfile?.homeAddress?.line1 ?? "",
          addressLine2: crewProfile?.homeAddress?.line2 ?? "",
          addressLine3: crewProfile?.homeAddress?.line3 ?? "",
          postcode: crewProfile?.homeAddress?.postcode ?? "",
          country: crewProfile?.homeAddress?.country ?? "",
        },
      }));
    }

    if (section === "contactInfo") {
      const derived = derivePhoneCode(crewProfile?.homeAddress?.country);

      setFormState((prev) => ({
        ...prev,
        contactInfo: {
          mobileCountryCode: currentUser?.phone?.countryCode || derived,
          mobileNumber: currentUser?.phone?.number ?? "",
          otherCountryCode: crewProfile?.otherPhone?.countryCode || derived,
          otherNumber: crewProfile?.otherPhone?.number ?? "",
          email: currentUser?.email ?? "",
          emailPayslip: crewProfile?.emailPayslip ?? "",
          emailPension: crewProfile?.emailPension ?? "",
          sendProjectEmailsToCrewMember:
            crewProfile?.sendProjectEmailsToCrewMember ?? true,
        },
      }));
    }

    if (section === "emergencyContact") {
      setFormState((prev) => ({
        ...prev,
        emergencyContact: {
          emergencyName: crewProfile?.emergencyContact?.fullName ?? "",
          emergencyRelationship:
            crewProfile?.emergencyContact?.relationship ?? "",
          emergencyCountryCode:
            crewProfile?.emergencyContact?.phone?.countryCode ?? "",
          emergencyNumber: crewProfile?.emergencyContact?.phone?.number ?? "",
        },
      }));
    }

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({
      homeAddress: null,
      contactInfo: null,
      emergencyContact: null,
    });
    setErrors({});
  };

  const handleSaveHomeAddress = async () => {
    setErrors({});

    const result = homeAddressSchema.safeParse(formState.homeAddress);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const payload = {
      line1: formState.homeAddress.addressLine1,
      line2: formState.homeAddress.addressLine2,
      line3: formState.homeAddress.addressLine3,
      postcode: formState.homeAddress.postcode,
      country: formState.homeAddress.country,
    };

    try {
      await dispatch(updateHomeAddressThunk(payload)).unwrap();
      toast.success("Home address updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update home address");
    }
  };

  const handleSaveContactInfo = async () => {
    setErrors({});

    const result = contactInfoSchema.safeParse(formState.contactInfo);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const payload = {
      mobilePhone: {
        countryCode: formState.contactInfo.mobileCountryCode,
        number: formState.contactInfo.mobileNumber,
      },
      otherPhone: {
        countryCode: formState.contactInfo.otherCountryCode,
        number: formState.contactInfo.otherNumber,
      },
      emailPayslip: formState.contactInfo.emailPayslip,
      emailPension: formState.contactInfo.emailPension,
      sendProjectEmailsToCrewMember:
        formState.contactInfo.sendProjectEmailsToCrewMember,
    };

    await dispatch(updateContactInfoThunk(payload)).unwrap();

    try {
      await dispatch(updateContactInfoThunk(payload)).unwrap();
      toast.success("Contact information updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update contact information");
    }
  };

  const handleSaveEmergencyContact = async () => {
    setErrors({});

    const result = emergencyContactSchema.safeParse(formState.emergencyContact);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const payload = {
      fullName: formState.emergencyContact.emergencyName,
      relationship: formState.emergencyContact.emergencyRelationship,
      phone: {
        countryCode: formState.emergencyContact.emergencyCountryCode,
        number: formState.emergencyContact.emergencyNumber,
      },
    };

    try {
      await dispatch(updateEmergencyContactThunk(payload)).unwrap();
      toast.success("Emergency contact updated successfully");
      cancelEditing();
    } catch (err) {
      toast.error(err?.message || "Failed to update emergency contact");
    }
  };

  const handleHomeCountryChange = (val) => {
    setFormState((prev) => ({
      ...prev,
      homeAddress: { ...prev.homeAddress, country: val },
    }));
  };

  const makeContactPhoneHandler = (codeKey, numberKey) => (val) => {
    setFormState((prev) => {
      const prevCode = prev.contactInfo?.[codeKey];
      const codeChanged = val.countryCode !== prevCode;

      const updated = {
        ...prev.contactInfo,
        [numberKey]: val.phoneNumber,
      };

      const synced = codeChanged
        ? syncEmptyPhoneCodes(updated, codeKey, val.countryCode)
        : { ...updated, [codeKey]: val.countryCode };

      return { ...prev, contactInfo: synced };
    });
  };

  // ── loading / error states ─────────────────────────────────────────────────

  if (isFetching) {
    return (
      <>
        <ProfileCardLoadingSkelton fields={5} columns={2} />
        <ProfileCardLoadingSkelton fields={5} columns={2} />
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
      {/* ── Home Address ──────────────────────────────────────────────────── */}
      <CardWrapper
        title="Home Address"
        icon="Home"
        actions={
          <EditToggleButtons
            isEditing={isEditingHome}
            isLoading={isSavingHome}
            onEdit={() => startEditing("homeAddress")}
            onSave={handleSaveHomeAddress}
            onCancel={cancelEditing}
          />
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <EditableTextDataField
            label="ADDRESS LINE 1"
            value={ha?.addressLine1}
            isEditing={isEditingHome}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                homeAddress: {
                  ...prev.homeAddress,
                  addressLine1: val,
                },
              }))
            }
            error={errors?.addressLine1?.[0]}
            disabled={isSavingHome}
          />

          <EditableTextDataField
            label="ADDRESS LINE 2"
            value={ha?.addressLine2}
            isEditing={isEditingHome}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                homeAddress: {
                  ...prev.homeAddress,
                  addressLine2: val,
                },
              }))
            }
            error={errors?.addressLine2?.[0]}
            disabled={isSavingHome}
          />

          <EditableTextDataField
            label="ADDRESS LINE 3"
            value={ha?.addressLine3}
            isEditing={isEditingHome}
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                homeAddress: {
                  ...prev.homeAddress,
                  addressLine3: val,
                },
              }))
            }
            error={errors?.addressLine3?.[0]}
            disabled={isSavingHome}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableTextDataField
              label="POSTCODE"
              value={ha?.postcode}
              isEditing={isEditingHome}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  homeAddress: {
                    ...prev.homeAddress,
                    postcode: val.toUpperCase(),
                  },
                }))
              }
              error={errors?.postcode?.[0]}
              disabled={isSavingHome}
            />

            <EditableSelectField
              label="COUNTRY"
              value={ha?.country}
              isEditing={isEditingHome}
              items={getCountryOptions()}
              onChange={handleHomeCountryChange}
              error={errors?.country?.[0]}
              disabled={isSavingHome}
            />
          </div>
        </div>
      </CardWrapper>

      {/* ── Contact Information ───────────────────────────────────────────── */}
      <CardWrapper
        title="Contact Information"
        icon="Phone"
        actions={
          <EditToggleButtons
            isEditing={isEditingContact}
            isLoading={isSavingContact}
            onEdit={() => startEditing("contactInfo")}
            onSave={handleSaveContactInfo}
            onCancel={cancelEditing}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditablePhoneField
            label="PERSONAL MOBILE NUMBER"
            badge={"Primary"}
            value={{
              countryCode: ci?.mobileCountryCode,
              phoneNumber: ci?.mobileNumber,
            }}
            isEditing={isEditingContact}
            onChange={makeContactPhoneHandler(
              "mobileCountryCode",
              "mobileNumber",
            )}
            codeOptions={getPhoneCodeOptions()}
            error={errors?.mobileNumber?.[0]}
            disabled={isSavingContact}
            infoPillDescription={
              "This is your primary contact number for account-related and official communication."
            }
          />

          <EditablePhoneField
            label="OTHER TELEPHONE NUMBER"
            value={{
              countryCode: ci?.otherCountryCode,
              phoneNumber: ci?.otherNumber,
            }}
            isEditing={isEditingContact}
            onChange={makeContactPhoneHandler(
              "otherCountryCode",
              "otherNumber",
            )}
            codeOptions={getPhoneCodeOptions()}
            isRequired={false}
            error={errors?.otherNumber?.[0]}
            disabled={isSavingContact}
          />

          <EditableTextDataField
            label="EMAIL ADDRESS"
            badge={"Primary"}
            infoPillDescription={
              "This is your primary email from account settings. It cannot be edited here."
            }
            value={ci?.email}
            isEditing={isEditingContact}
            type="email"
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, email: val },
              }))
            }
            error={errors?.email?.[0]}
            disabled={true}
          />

          <EditableTextDataField
            label="EMAIL FOR PAYSLIP"
            value={ci?.emailPayslip}
            isEditing={isEditingContact}
            type="email"
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, emailPayslip: val },
              }))
            }
            error={errors?.emailPayslip?.[0]}
            disabled={isSavingContact}
          />

          <EditableTextDataField
            label="EMAIL FOR PENSION"
            value={ci?.emailPension}
            isEditing={isEditingContact}
            type="email"
            isRequired={false}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, emailPension: val },
              }))
            }
            error={errors?.emailPension?.[0]}
            disabled={isSavingContact}
          />
        </div>

        <div className="mt-4">
          <EditableSwitchField
            label="Send Project emails to crew member"
            checked={ci?.sendProjectEmailsToCrewMember}
            isEditing={isEditingContact}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                contactInfo: {
                  ...prev.contactInfo,
                  sendProjectEmailsToCrewMember: val,
                },
              }))
            }
            disabled={isSavingContact}
          />
        </div>
      </CardWrapper>

      {/* ── Emergency Contact ─────────────────────────────────────────────── */}
      <CardWrapper
        title="Emergency Contact"
        icon="AlertCircle"
        actions={
          <EditToggleButtons
            isEditing={isEditingEmergency}
            isLoading={isSavingEmergency}
            onEdit={() => startEditing("emergencyContact")}
            onSave={handleSaveEmergencyContact}
            onCancel={cancelEditing}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableTextDataField
            label="EMERGENCY CONTACT FULL NAME"
            value={ec?.emergencyName}
            isEditing={isEditingEmergency}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                emergencyContact: {
                  ...prev.emergencyContact,
                  emergencyName: val,
                },
              }))
            }
            error={errors?.emergencyName?.[0]}
            disabled={isSavingEmergency}
          />

          <EditableTextDataField
            label="RELATIONSHIP"
            value={ec?.emergencyRelationship}
            isEditing={isEditingEmergency}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                emergencyContact: {
                  ...prev.emergencyContact,
                  emergencyRelationship: val,
                },
              }))
            }
            error={errors?.emergencyRelationship?.[0]}
            disabled={isSavingEmergency}
          />

          <EditablePhoneField
            label="EMERGENCY CONTACT TELEPHONE"
            value={{
              countryCode: ec?.emergencyCountryCode,
              phoneNumber: ec?.emergencyNumber,
            }}
            isEditing={isEditingEmergency}
            onChange={(val) =>
              setFormState((prev) => ({
                ...prev,
                emergencyContact: {
                  ...prev.emergencyContact,
                  emergencyCountryCode: val.countryCode,
                  emergencyNumber: val.phoneNumber,
                },
              }))
            }
            codeOptions={getPhoneCodeOptions()}
            error={errors?.emergencyNumber?.[0]}
            disabled={isSavingEmergency}
          />
        </div>
      </CardWrapper>
    </>
  );
}

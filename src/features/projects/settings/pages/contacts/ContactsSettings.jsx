/**
 * ContactsSettings.jsx
 * Path: src/features/projects/settings/pages/ContactsSettings.jsx
 */

import { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { Building2, Plus, Trash2 } from "lucide-react";
import * as FramerMotion from "framer-motion";

import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import EditableToggleGroupField from "@/shared/components/wrappers/EditableToggleGroupField";
import { Badge } from "@/shared/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import SettingsCardLoadingSkelton from "../../components/skeltons/SettingsCardLoadingSkelton";
import SettingsCardErrorSkelton from "../../components/skeltons/SettingsCardErrorSkelton";
import { useContactsSettings } from "./useContactsSettings";
import {
  getCountryOptions,
  currencyOptions,
  getCurrencyByCountry,
  getCountryLabel,
} from "@/shared/config/countriesDataConfig";

// ── Empty company draft ───────────────────────────────────────────────────────
const EMPTY_COMPANY = {
  companyName: "",
  registrationNumber: "",
  vatNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postcode: "",
  telephone: "",
  email: "",
  country: "GB",
  currencies: ["GBP"],
  isPrimary: false,
};

function ContactsSettings() {
  const { projectId } = useOutletContext();

  const {
    settings,
    isFetching,
    isUpdating,
    isSubmitting,
    error,
    addCompany,
    updateCompany,
    removeCompany,
    updateProductionBase,
    updateProjectCreator,
    updateBilling,
  } = useContactsSettings(projectId);

  const [editingSection, setEditingSection] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [companyDrafts, setCompanyDrafts] = useState({});
  const [saveError, setSaveError] = useState(null);

  // ── Generic section edit/cancel ───────────────────────────────────────────
  const startEditing = (section, initialData) => {
    setSaveError(null);
    setDrafts((prev) => ({ ...prev, [section]: { ...initialData } }));
    setEditingSection(section);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setDrafts({});
    setSaveError(null);
  };

  const patchDraft = (section, key) => (val) =>
    setDrafts((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: val },
    }));

  // ── Company edit/cancel ───────────────────────────────────────────────────
  const startEditingCompany = (companyId, data) => {
    setSaveError(null);
    setCompanyDrafts((prev) => ({ ...prev, [companyId]: { ...data } }));
  };

  const cancelEditingCompany = (companyId) => {
    setCompanyDrafts((prev) => {
      const next = { ...prev };
      delete next[companyId];
      return next;
    });
    setSaveError(null);
  };

  const patchCompanyDraft = (companyId, key) => (val) =>
    setCompanyDrafts((prev) => ({
      ...prev,
      [companyId]: { ...prev[companyId], [key]: val },
    }));

  // ── Save helpers ──────────────────────────────────────────────────────────
  const save = useCallback(async (thunkFn, draft, afterSave) => {
    setSaveError(null);
    try {
      await thunkFn(draft).unwrap();
      afterSave();
    } catch (err) {
      setSaveError(err?.message ?? "Save failed. Please try again.");
    }
  }, []);

  const handleSaveSection = (section, thunkFn) =>
    save(thunkFn, drafts[section], cancelEditing);

  const handleSaveCompany = async (companyId) => {
    setSaveError(null);
    try {
      await updateCompany(companyId, companyDrafts[companyId]).unwrap();
      toast.success("Company updated");
      cancelEditingCompany(companyId);
    } catch (err) {
      setSaveError(err?.message ?? "Save failed.");
      toast.error(err?.message || "Failed to update company");
    }
  };

  const handleAddCompany = async () => {
    setSaveError(null);
    try {
      await addCompany({ ...EMPTY_COMPANY }).unwrap();
      toast.success("Company added");
    } catch (err) {
      setSaveError(err?.message ?? "Failed to add company.");
      toast.error(err?.message || "Failed to add company");
    }
  };

  const handleDeleteCompany = async (companyId) => {
    setSaveError(null);
    try {
      await removeCompany(companyId).unwrap();
      toast.success("Company removed");
    } catch (err) {
      setSaveError(err?.message ?? "Failed to remove company.");
      toast.error(err?.message || "Failed to remove company");
    }
  };

  // ── Loading / error ───────────────────────────────────────────────────────
  if (isFetching && !settings.companies.length) {
    return <SettingsCardLoadingSkelton fields={4} columns={2} />;
  }

  if (error) {
    return (
      <SettingsCardErrorSkelton
        message={
          typeof error === "string"
            ? error
            : error?.message || "Something went wrong"
        }
        onRetry={() => dispatch(fetchContactsSettingsThunk(projectId))}
      />
    );
  }

  const { productionBase, projectCreator, billing } = settings;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {saveError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
          {saveError}
        </div>
      )}

      {/* ── Companies ── */}
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">Companies</h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Add one or more companies operating on this project. Each can
                have its own address, contact details, and currencies
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-muted-foreground text-[11px]">
            {settings.companies.length}{" "}
            {settings.companies.length === 1 ? "company" : "companies"}{" "}
            registered
          </p>
          <FramerMotion.motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            onClick={handleAddCompany}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[0.7rem] font-medium bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Company
          </FramerMotion.motion.button>
        </div>

        {settings.companies.length > 0 && (
          <Accordion
            type="single"
            collapsible
            className="mt-4 px-4 rounded-3xl border"
          >
            {settings.companies.map((company) => {
              const cid = String(company._id);
              const isEditingC = Boolean(companyDrafts[cid]);
              const data = isEditingC ? companyDrafts[cid] : company;

              return (
                <AccordionItem key={cid} value={cid} className="border-none">
                  {/* ── Trigger ── */}
                  <AccordionTrigger className="hover:no-underline w-full">
                    <div className="flex items-center justify-between gap-4 w-full pr-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex flex-col gap-1 text-left">
                          <div className="flex items-center gap-2">
                            <h2 className="text-foreground font-medium text-[0.95rem]">
                              {company.companyName || "New Company"}
                            </h2>
                            {company.isPrimary && (
                              <Badge className="h-4 rounded-full px-2 text-[0.49rem] font-semibold uppercase tracking-[0.14em] bg-primary text-primary-foreground">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {(company.city || company.country) && (
                              <p className="text-[0.7rem] text-muted-foreground">
                                {[
                                  company.city,
                                  getCountryLabel(company.country),
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            )}
                            {company.vatNumber && (
                              <>
                                <span className="text-[0.7rem] text-muted-foreground">
                                  •
                                </span>
                                <p className="text-[0.7rem] text-muted-foreground">
                                  VAT Number: {company.vatNumber}
                                </p>
                              </>
                            )}
                            {company.currencies?.map((c) => (
                              <Badge
                                key={c}
                                className="h-5 rounded-full bg-primary/20 px-2 text-[0.55rem] font-semibold text-primary"
                              >
                                {c}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Delete — blocks accordion toggle via onPointerDown */}
                      <div
                        className="shrink-0"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleDeleteCompany(cid)}
                          className="p-2 text-destructive hover:text-destructive/80 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </AccordionTrigger>

                  {/* ── Content ── */}
                  <AccordionContent className="mb-4">
                    <div className="flex items-center justify-end mb-4">
                      <EditToggleButtons
                        isEditing={isEditingC}
                        isLoading={isUpdating}
                        onEdit={() => startEditingCompany(cid, company)}
                        onSave={() => handleSaveCompany(cid)}
                        onCancel={() => cancelEditingCompany(cid)}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <EditableTextDataField
                        label="Company Name"
                        value={data.companyName}
                        isEditing={isEditingC}
                        onChange={patchCompanyDraft(cid, "companyName")}
                      />
                      <EditableTextDataField
                        label="Company Registration Number"
                        value={data.registrationNumber}
                        isEditing={isEditingC}
                        onChange={patchCompanyDraft(cid, "registrationNumber")}
                      />
                    </div>

                    <div className="mt-4">
                      <EditableTextDataField
                        label="VAT Number"
                        value={data.vatNumber}
                        isEditing={isEditingC}
                        onChange={patchCompanyDraft(cid, "vatNumber")}
                        infoPillDescription="UK Value Added Tax registration number"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                      <EditableTextDataField
                        label="Address Line 1"
                        value={data.addressLine1}
                        isEditing={isEditingC}
                        onChange={patchCompanyDraft(cid, "addressLine1")}
                        infoPillDescription="The address of the Production Base for this project."
                      />
                      <EditableTextDataField
                        label="Address Line 2"
                        value={data.addressLine2}
                        isEditing={isEditingC}
                        isRequired={false}
                        onChange={patchCompanyDraft(cid, "addressLine2")}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                      <EditableTextDataField
                        label="City"
                        value={data.city}
                        isEditing={isEditingC}
                        onChange={patchCompanyDraft(cid, "city")}
                      />
                      <EditableTextDataField
                        label="Postcode"
                        value={data.postcode}
                        isEditing={isEditingC}
                        onChange={patchCompanyDraft(cid, "postcode")}
                      />
                    </div>

                    <div className="mt-4">
                      <EditableSelectField
                        label="Country"
                        items={getCountryOptions()}
                        value={data.country}
                        isEditing={isEditingC}
                        onChange={(val) =>
                          setCompanyDrafts((prev) => ({
                            ...prev,
                            [cid]: {
                              ...prev[cid],
                              country: val,
                              currencies: [getCurrencyByCountry(val)].filter(
                                Boolean,
                              ),
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                      <EditableTextDataField
                        label="Telephone Number"
                        value={data.telephone}
                        isEditing={isEditingC}
                        onChange={patchCompanyDraft(cid, "telephone")}
                      />
                      <EditableTextDataField
                        label="Email Address"
                        value={data.email}
                        isEditing={isEditingC}
                        type="email"
                        onChange={patchCompanyDraft(cid, "email")}
                      />
                    </div>

                    <div className="mt-6 p-4 rounded-3xl border bg-background">
                      <EditableToggleGroupField
                        label="Currencies"
                        type="multiple"
                        items={currencyOptions.map((code) => ({
                          label: code,
                          value: code,
                        }))}
                        value={data.currencies}
                        isEditing={isEditingC}
                        onChange={patchCompanyDraft(cid, "currencies")}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </CardWrapper>

      {/* ── Production Base ── */}
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">
                Production Base
              </h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Shown to crew in their offer so they can contact you for help,
                and possibly in documents regarding mileage
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <EditToggleButtons
              isEditing={editingSection === "productionBase"}
              isLoading={isUpdating && editingSection === "productionBase"}
              onEdit={() => startEditing("productionBase", productionBase)}
              onSave={() =>
                handleSaveSection("productionBase", updateProductionBase)
              }
              onCancel={cancelEditing}
            />
          </div>
        </div>

        {(() => {
          const d =
            editingSection === "productionBase"
              ? drafts.productionBase
              : productionBase;
          const isE = editingSection === "productionBase";
          return (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EditableTextDataField
                  label="Address Line 1"
                  value={d.addressLine1}
                  isEditing={isE}
                  onChange={patchDraft("productionBase", "addressLine1")}
                  infoPillDescription="The address of the Production Base for this project (from which mileage might be charged)."
                />
                <EditableTextDataField
                  label="Address Line 2"
                  value={d.addressLine2}
                  isEditing={isE}
                  isRequired={false}
                  onChange={patchDraft("productionBase", "addressLine2")}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <EditableTextDataField
                  label="City"
                  value={d.city}
                  isEditing={isE}
                  onChange={patchDraft("productionBase", "city")}
                />
                <EditableTextDataField
                  label="Postcode"
                  value={d.postcode}
                  isEditing={isE}
                  onChange={patchDraft("productionBase", "postcode")}
                />
              </div>
              <div className="mt-4">
                <EditableSelectField
                  label="Country"
                  items={getCountryOptions()}
                  value={d.country}
                  isEditing={isE}
                  onChange={patchDraft("productionBase", "country")}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <EditableTextDataField
                  label="Telephone Number"
                  value={d.telephone}
                  isEditing={isE}
                  onChange={patchDraft("productionBase", "telephone")}
                  infoPillDescription="Helpful information shown to crew in their offer, so they can contact you with any questions."
                />
                <EditableTextDataField
                  label="Email Address"
                  type="email"
                  value={d.email}
                  isEditing={isE}
                  onChange={patchDraft("productionBase", "email")}
                  infoPillDescription="Helpful information shown to crew in their offer, so they can contact you with any questions."
                />
              </div>
            </>
          );
        })()}
      </CardWrapper>

      {/* ── Project Creator ── */}
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">
                Project Creator
              </h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Contact details of who created this project
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <EditToggleButtons
              isEditing={editingSection === "projectCreator"}
              isLoading={isUpdating && editingSection === "projectCreator"}
              onEdit={() => startEditing("projectCreator", projectCreator)}
              onSave={() =>
                handleSaveSection("projectCreator", updateProjectCreator)
              }
              onCancel={cancelEditing}
            />
          </div>
        </div>

        {(() => {
          const d =
            editingSection === "projectCreator"
              ? drafts.projectCreator
              : projectCreator;
          const isE = editingSection === "projectCreator";
          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EditableTextDataField
                label="Project Creator Name"
                value={d.name}
                isEditing={isE}
                onChange={patchDraft("projectCreator", "name")}
              />
              <EditableTextDataField
                label="Project Creator Email Address"
                type="email"
                value={d.email}
                isEditing={isE}
                onChange={patchDraft("projectCreator", "email")}
              />
            </div>
          );
        })()}
      </CardWrapper>

      {/* ── Billing ── */}
      <CardWrapper showLabel={false}>
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
            <div>
              <h3 className="text-foreground text-sm font-medium">Billing</h3>
              <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                Contact details for EAARTH to send invoices to
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <EditToggleButtons
              isEditing={editingSection === "billing"}
              isLoading={isUpdating && editingSection === "billing"}
              onEdit={() => startEditing("billing", billing)}
              onSave={() => handleSaveSection("billing", updateBilling)}
              onCancel={cancelEditing}
            />
          </div>
        </div>

        {(() => {
          const d = editingSection === "billing" ? drafts.billing : billing;
          const isE = editingSection === "billing";
          return (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EditableTextDataField
                  label="Billing Contact Name"
                  value={d.name}
                  isEditing={isE}
                  onChange={patchDraft("billing", "name")}
                />
                <EditableTextDataField
                  label="Billing Contact Email(s)"
                  type="email"
                  value={d.email}
                  isEditing={isE}
                  onChange={patchDraft("billing", "email")}
                  infoPillDescription="Enter one or more email addresses, separated by commas."
                />
              </div>
              <div className="mt-4">
                <EditableTextDataField
                  label="SPV Company VAT Number"
                  value={d.vatNumber}
                  isEditing={isE}
                  onChange={patchDraft("billing", "vatNumber")}
                />
              </div>
              <div className="mt-4">
                <EditableSwitchField
                  label="Billing address is same as SPV company"
                  checked={d.sameAsSpv}
                  isEditing={isE}
                  onChange={patchDraft("billing", "sameAsSpv")}
                />
              </div>
              {!d.sameAsSpv && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    <EditableTextDataField
                      label="Billing Address Line 1"
                      value={d.addressLine1}
                      isEditing={isE}
                      onChange={patchDraft("billing", "addressLine1")}
                    />
                    <EditableTextDataField
                      label="Billing Address Line 2"
                      value={d.addressLine2}
                      isEditing={isE}
                      isRequired={false}
                      onChange={patchDraft("billing", "addressLine2")}
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    <EditableTextDataField
                      label="City"
                      value={d.city}
                      isEditing={isE}
                      onChange={patchDraft("billing", "city")}
                    />
                    <EditableTextDataField
                      label="Postcode"
                      value={d.postcode}
                      isEditing={isE}
                      onChange={patchDraft("billing", "postcode")}
                    />
                  </div>
                  <div className="mt-4">
                    <EditableSelectField
                      label="Country"
                      items={getCountryOptions()}
                      value={d.country}
                      isEditing={isE}
                      onChange={patchDraft("billing", "country")}
                    />
                  </div>
                </>
              )}
            </>
          );
        })()}
      </CardWrapper>
    </div>
  );
}

export default ContactsSettings;

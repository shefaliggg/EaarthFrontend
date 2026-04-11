import * as FramerMotion from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { Building2, ChevronDown, HelpCircle, Plus, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { APP_CONFIG } from "@/features/crew/config/appConfig";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import { SettingsSection } from "@/features/projects/settings/components/shared/SettingsSection";
import { InfoTooltip } from "@/shared/components/InfoTooltip";
import { SelectMenu } from "@/shared/components/menus/SelectMenu";
import {
  loadContactsOptionsThunk,
  loadContactsSettingsThunk,
} from "@/features/projects/settings/store/settings.thunks";
import {
  DEFAULT_CONTACTS_FORM,
  selectContactsSettings,
  setContactsForm,
  setContactsFormValidity,
} from "@/features/projects/settings/store/settingsSlice";
import { contactsSettingsSchema } from "./contactsSettingsSchema";

const EMPTY_COMPANY = {
  id: "",
  name: "",
  registrationNumber: "",
  taxId: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postcode: "",
  country: "",
  telephone: "",
  email: "",
  currencies: [],
  isPrimary: true,
};

const createCompany = ({ defaultCountry, defaultCurrency, isPrimary }) => ({
  ...EMPTY_COMPANY,
  id: `company-${Date.now()}`,
  country: defaultCountry,
  currencies: defaultCurrency ? [defaultCurrency] : [],
  isPrimary,
});

const buildCompanies = (companies, defaults) => {
  if (Array.isArray(companies) && companies.length > 0) {
    return companies.map((company, index) => ({
      ...EMPTY_COMPANY,
      ...company,
      id: company.id || `company-${index + 1}`,
      country: company.country || defaults.country,
      currencies:
        Array.isArray(company.currencies) && company.currencies.length > 0
          ? company.currencies
          : defaults.currency
            ? [defaults.currency]
            : [],
    }));
  }

  return [];
};

const buildContactsForm = (form, defaults) => ({
  companies: buildCompanies(form?.companies, defaults),
  productionBase: {
    ...DEFAULT_CONTACTS_FORM.productionBase,
    ...form?.productionBase,
    country: form?.productionBase?.country || defaults.country,
  },
  projectCreator: {
    ...DEFAULT_CONTACTS_FORM.projectCreator,
    ...form?.projectCreator,
  },
  billing: {
    ...DEFAULT_CONTACTS_FORM.billing,
    ...form?.billing,
    country: form?.billing?.country || defaults.country,
  },
});

const isSavedCompany = (companyId) => {
  return /^[0-9a-fA-F]{24}$/.test(String(companyId || ""));
};

function ContactsSettings() {
  const dispatch = useDispatch();
  const { registerPageLockHandler } = useOutletContext();
  const { form, hasLoaded, hasLoadedOptions, isLocked, options } =
    useSelector(selectContactsSettings);
  const didApplyLoadedContactsRef = useRef(false);
  const [expandedCompanyId, setExpandedCompanyId] = useState(null);

  const defaultOptions = useMemo(() => {
    return options?.defaults || { country: "", currency: "" };
  }, [options]);
  const countryItems = useMemo(() => {
    return (options?.countries || []).map((country) => ({
      label: country.label,
      value: country.label,
    }));
  }, [options]);
  const currencyCodes = useMemo(() => {
    return (options?.currencies || []).map((currency) => currency.code);
  }, [options]);
  const countryByLabel = useMemo(() => {
    return new Map(
      (options?.countries || []).map((country) => [country.label, country]),
    );
  }, [options]);

  const {
    control,
    formState: { errors, isValid },
    getValues,
    register,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(contactsSettingsSchema),
    defaultValues: DEFAULT_CONTACTS_FORM,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "companies",
  });
  const contactsForm = useWatch({ control });
  const billingSameAsSpv = useWatch({
    control,
    name: "billing.sameAsSpv",
  });

  useEffect(() => {
    dispatch(loadContactsSettingsThunk(APP_CONFIG.PROJECT_ID));
    dispatch(loadContactsOptionsThunk(APP_CONFIG.PROJECT_ID));
  }, [dispatch]);

  useEffect(() => {
    if (!hasLoaded || !hasLoadedOptions || didApplyLoadedContactsRef.current) {
      return;
    }

    const nextForm = buildContactsForm(form, defaultOptions);
    reset(nextForm);
    didApplyLoadedContactsRef.current = true;
  }, [defaultOptions, form, hasLoaded, hasLoadedOptions, reset]);

  useEffect(() => {
    if (contactsForm) {
      dispatch(setContactsForm(contactsForm));
    }
  }, [contactsForm, dispatch]);

  useEffect(() => {
    dispatch(setContactsFormValidity(isValid));
  }, [dispatch, isValid]);

  useEffect(() => {
    const unregisterPageLockHandler = registerPageLockHandler(
      "contacts",
      () => getValues(),
    );

    return unregisterPageLockHandler;
  }, [getValues, registerPageLockHandler]);

  const addCompany = () => {
    const company = createCompany({
      defaultCountry: defaultOptions.country,
      defaultCurrency: defaultOptions.currency,
      isPrimary: fields.length === 0,
    });
    append(company);
    setExpandedCompanyId(company.id);
  };

  const deleteCompany = (index) => {
    if (fields.length === 1) {
      return;
    }

    const companies = getValues("companies");
    const companyToDelete = companies[index];
    const nextCompanies = companies.filter(
      (_, companyIndex) => companyIndex !== index,
    );

    if (companyToDelete?.isPrimary && nextCompanies[0]) {
      nextCompanies[0].isPrimary = true;
      setValue("companies", nextCompanies, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setExpandedCompanyId(nextCompanies[0].id);
      return;
    }

    remove(index);
    setExpandedCompanyId(nextCompanies[0]?.id || null);
  };

  const setPrimaryCompany = (index) => {
    const nextCompanies = getValues("companies").map(
      (company, companyIndex) => ({
        ...company,
        isPrimary: companyIndex === index,
      }),
    );

    setValue("companies", nextCompanies, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleCompanyCountryChange = (companyIndex, countryLabel) => {
    const selectedCountry = countryByLabel.get(countryLabel);
    const currentCurrencies =
      getValues(`companies.${companyIndex}.currencies`) || [];
    const defaultCurrency =
      selectedCountry?.defaultCurrency || defaultOptions.currency;

    setValue(`companies.${companyIndex}.country`, countryLabel, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (currentCurrencies.length === 0 && defaultCurrency) {
      setValue(`companies.${companyIndex}.currencies`, [defaultCurrency], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const toggleCurrency = (companyIndex, currency) => {
    const currentCurrencies =
      getValues(`companies.${companyIndex}.currencies`) || [];
    const nextCurrencies = currentCurrencies.includes(currency)
      ? currentCurrencies.filter((item) => item !== currency)
      : [...currentCurrencies, currency];

    setValue(`companies.${companyIndex}.currencies`, nextCurrencies, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const visibleExpandedCompanyId =
    expandedCompanyId || getValues("companies.0.id") || null;
  const companies = getValues("companies") || [];
  const registeredCompanyCount = companies.filter((company) =>
    isSavedCompany(company.id),
  ).length;
  const draftCompanyCount = companies.length - registeredCompanyCount;

  return (
    <FramerMotion.motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-5"
    >
      <SettingsSection
        title="Companies"
        subtitle="Add the company details used for this project."
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                {registeredCompanyCount === 0
                  ? "No registered company yet"
                  : `${registeredCompanyCount} ${registeredCompanyCount === 1 ? "company" : "companies"} registered`}
              </Label>
              {draftCompanyCount > 0 ? (
                <span className="text-[0.65rem] text-amber-500">
                  {draftCompanyCount} draft {draftCompanyCount === 1 ? "company" : "companies"} not saved yet
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={addCompany}
              disabled={isLocked}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white shadow-sm text-xs bg-violet-600 hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Company
            </button>
          </div>

          {fields.map((field, companyIndex) => {
            const companyId = getValues(`companies.${companyIndex}.id`);
            const isExpanded = visibleExpandedCompanyId === companyId;
            const isPrimary = getValues(`companies.${companyIndex}.isPrimary`);
            const currencies =
              getValues(`companies.${companyIndex}.currencies`) || [];
            const companyName = getValues(`companies.${companyIndex}.name`);

            return (
              <div
                key={field.id}
                className="rounded-lg border overflow-hidden"
                style={{ borderColor: isPrimary ? "#8b5cf650" : undefined }}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                  onClick={() =>
                    setExpandedCompanyId(isExpanded ? null : companyId)
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${isPrimary ? "bg-violet-600" : "bg-muted-foreground/40"}`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-foreground uppercase truncate">
                        {companyName || `Company ${companyIndex + 1}`}
                      </span>
                      {isPrimary ? (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full text-white uppercase tracking-wider text-[0.55rem] bg-violet-600">
                          Primary
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isExpanded ? (
                  <div className="px-4 py-4 border-t border-border">
                    <input
                      type="hidden"
                      {...register(`companies.${companyIndex}.id`)}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <TextInput
                        label="Company Name"
                        error={errors.companies?.[companyIndex]?.name?.message}
                        inputProps={register(`companies.${companyIndex}.name`)}
                        disabled={isLocked}
                      />
                      <TextInput
                        label="Email Address"
                        type="email"
                        error={errors.companies?.[companyIndex]?.email?.message}
                        inputProps={register(`companies.${companyIndex}.email`)}
                        disabled={isLocked}
                      />
                      <TextInput
                        label="Registration Number"
                        inputProps={register(
                          `companies.${companyIndex}.registrationNumber`,
                        )}
                        disabled={isLocked}
                      />
                      <TextInput
                        label="VAT / Tax ID"
                        inputProps={register(`companies.${companyIndex}.taxId`)}
                        disabled={isLocked}
                      />
                      <TextInput
                        label="Address Line 1"
                        inputProps={register(
                          `companies.${companyIndex}.addressLine1`,
                        )}
                        disabled={isLocked}
                      />
                      <TextInput
                        label="Address Line 2"
                        inputProps={register(
                          `companies.${companyIndex}.addressLine2`,
                        )}
                        disabled={isLocked}
                      />
                      <TextInput
                        label="City"
                        inputProps={register(`companies.${companyIndex}.city`)}
                        disabled={isLocked}
                      />
                      <TextInput
                        label="Postcode"
                        inputProps={register(
                          `companies.${companyIndex}.postcode`,
                        )}
                        disabled={isLocked}
                      />

                      <Controller
                        control={control}
                        name={`companies.${companyIndex}.country`}
                        render={({ field: countryField }) => (
                          <SelectField
                            disabled={isLocked}
                            label="Country"
                            error={
                              errors.companies?.[companyIndex]?.country
                                ?.message
                            }
                            selected={countryField.value}
                            items={countryItems}
                            onSelect={(value) =>
                              handleCompanyCountryChange(companyIndex, value)
                            }
                          />
                        )}
                      />

                      <TextInput
                        label="Telephone"
                        inputProps={register(
                          `companies.${companyIndex}.telephone`,
                        )}
                        disabled={isLocked}
                      />

                      <FieldError
                        className="lg:col-span-2"
                        message={
                          errors.companies?.[companyIndex]?.currencies?.message
                        }
                      >
                        <Label className="text-xs font-medium">
                          Currencies
                        </Label>
                        <div className="flex flex-wrap gap-1.5">
                          {currencyCodes.map((currency) => {
                            const isSelected = currencies.includes(currency);

                            return (
                              <button
                                key={currency}
                                type="button"
                                disabled={isLocked}
                                onClick={() =>
                                  toggleCurrency(companyIndex, currency)
                                }
                                className={`px-2.5 py-1 rounded-md border text-[0.65rem] transition-colors disabled:opacity-50 ${isSelected ? "bg-violet-600 text-white border-violet-600" : "border-border text-muted-foreground hover:border-violet-400 hover:text-foreground"}`}
                              >
                                {currency}
                              </button>
                            );
                          })}
                        </div>
                      </FieldError>

                      <div className="lg:col-span-2 flex items-center gap-2">
                        {!isPrimary ? (
                          <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => setPrimaryCompany(companyIndex)}
                            className="px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors text-[0.65rem] disabled:opacity-50"
                          >
                            Set Primary
                          </button>
                        ) : null}

                        {fields.length > 1 ? (
                          <button
                            type="button"
                            disabled={isLocked}
                            onClick={() => deleteCompany(companyIndex)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-destructive transition-colors text-[0.65rem] disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}

          {fields.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-6 text-xs text-muted-foreground">
              Click <span className="font-medium text-foreground">Add Company</span> to create the first company for this project.
            </div>
          ) : null}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Production Base"
        subtitle="Shown to crew so they can contact the production."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <TextInput
            label="Address Line 1"
            error={errors.productionBase?.addressLine1?.message}
            inputProps={register("productionBase.addressLine1")}
            disabled={isLocked}
          />
          <TextInput
            label="Address Line 2"
            inputProps={register("productionBase.addressLine2")}
            disabled={isLocked}
          />
          <TextInput
            label="City"
            error={errors.productionBase?.city?.message}
            inputProps={register("productionBase.city")}
            disabled={isLocked}
          />
          <TextInput
            label="Postcode"
            error={errors.productionBase?.postcode?.message}
            inputProps={register("productionBase.postcode")}
            disabled={isLocked}
          />
          <Controller
            control={control}
            name="productionBase.country"
            render={({ field }) => (
              <SelectField
                disabled={isLocked}
                label="Country"
                error={errors.productionBase?.country?.message}
                selected={field.value}
                items={countryItems}
                onSelect={field.onChange}
              />
            )}
          />
          <TextInput
            label="Telephone"
            error={errors.productionBase?.telephone?.message}
            inputProps={register("productionBase.telephone")}
            disabled={isLocked}
          />
          <div className="lg:col-span-2">
            <TextInput
              label="Email"
              type="email"
              error={errors.productionBase?.email?.message}
              inputProps={register("productionBase.email")}
              disabled={isLocked}
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Project Creator"
        subtitle="Who created this project."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <TextInput
            label="Project Creator Name"
            error={errors.projectCreator?.name?.message}
            inputProps={register("projectCreator.name")}
            disabled={isLocked}
          />
          <TextInput
            label="Project Creator Email"
            type="email"
            error={errors.projectCreator?.email?.message}
            inputProps={register("projectCreator.email")}
            disabled={isLocked}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Billing"
        subtitle="Where EAARTH should send invoices."
      >
        <div className="flex flex-col gap-5 p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextInput
              label="Billing Contact Name"
              error={errors.billing?.contactName?.message}
              inputProps={register("billing.contactName")}
              disabled={isLocked}
            />
            <TextInput
              label="Billing Contact Email(s)"
              error={errors.billing?.contactEmails?.message}
              inputProps={register("billing.contactEmails")}
              disabled={isLocked}
            />
            <FieldError>
              <div className="flex items-center gap-1">
                <Label className="text-xs font-medium">
                  SPV Company VAT Number
                </Label>
                <InfoTooltip content="The VAT number of the Special Purpose Vehicle company for this production.">
                  <span className="text-foreground hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-help">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </InfoTooltip>
              </div>
              <Input
                {...register("billing.spvVatNumber")}
                disabled={isLocked}
                className="placeholder:text-xs"
                placeholder="SPV Company VAT Number"
              />
              {errors.billing?.spvVatNumber?.message ? (
                <p className="text-[0.65rem] text-red-500">
                  {errors.billing.spvVatNumber.message}
                </p>
              ) : null}
            </FieldError>
          </div>

          <div className="flex justify-between items-center">
            <Label className="text-xs text-muted-foreground">
              Billing address is same as SPV company?
            </Label>
            <Controller
              control={control}
              name="billing.sameAsSpv"
              render={({ field }) => (
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  spacing={0}
                  value={field.value}
                  onValueChange={(value) => value && field.onChange(value)}
                  disabled={isLocked}
                >
                  <ToggleGroupItem value="yes" className="text-[0.6rem] px-2.5">
                    YES
                  </ToggleGroupItem>
                  <ToggleGroupItem value="no" className="text-[0.6rem] px-2.5">
                    NO
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            />
          </div>

          {billingSameAsSpv === "no" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TextInput
                label="Billing Address Line 1"
                error={errors.billing?.addressLine1?.message}
                inputProps={register("billing.addressLine1")}
                disabled={isLocked}
              />
              <TextInput
                label="Billing Address Line 2"
                inputProps={register("billing.addressLine2")}
                disabled={isLocked}
              />
              <TextInput
                label="Billing City"
                error={errors.billing?.city?.message}
                inputProps={register("billing.city")}
                disabled={isLocked}
              />
              <TextInput
                label="Billing Postcode"
                error={errors.billing?.postcode?.message}
                inputProps={register("billing.postcode")}
                disabled={isLocked}
              />
              <Controller
                control={control}
                name="billing.country"
                render={({ field }) => (
                  <SelectField
                    disabled={isLocked}
                    label="Billing Country"
                    error={errors.billing?.country?.message}
                    selected={field.value}
                    items={countryItems}
                    onSelect={field.onChange}
                  />
                )}
              />
            </div>
          ) : null}
        </div>
      </SettingsSection>
    </FramerMotion.motion.div>
  );
}

function TextInput({ disabled, error, inputProps, label, type = "text" }) {
  return (
    <FieldError message={error}>
      <Label className="text-xs font-medium">{label}</Label>
      <Input
        {...inputProps}
        className="placeholder:text-xs"
        disabled={disabled}
        placeholder={label}
        type={type}
      />
    </FieldError>
  );
}

function SelectField({ disabled, error, items, label, onSelect, selected }) {
  return (
    <FieldError message={error}>
      <Label className="text-xs font-medium">{label}</Label>
      {disabled ? (
        <Input value={selected || ""} disabled className="placeholder:text-xs" />
      ) : (
        <SelectMenu
          label={`Select ${label.toLowerCase()}`}
          selected={selected}
          onSelect={onSelect}
          items={items}
        />
      )}
    </FieldError>
  );
}

function FieldError({ children, className = "", message }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
      {children}
      {message ? <p className="text-[0.65rem] text-red-500">{message}</p> : null}
    </div>
  );
}

export default ContactsSettings;

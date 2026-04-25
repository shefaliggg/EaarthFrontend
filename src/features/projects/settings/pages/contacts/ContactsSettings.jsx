import { useState } from "react";
import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import {
  getCountryOptions,
  currencyOptions,
  getCurrencyByCountry,
  getCountryLabel,
} from "@/shared/config/countriesDataConfig";

import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import EditableSelectField from "@/shared/components/wrappers/EditableSelectField";
import EditableSwitchField from "@/shared/components/wrappers/EditableSwitchField";
import EditableToggleGroupField from "@/shared/components/wrappers/EditableToggleGroupField";
import { Building2, Plus } from "lucide-react";
import * as FramerMotion from "framer-motion";
import { Badge } from "@/shared/components/ui/badge";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";

function ContactsSettings() {
  const [isEditing, setIsEditing] = useState({ section: null });

  const [formState, setFormState] = useState({
    company: null,
    productionBase: null,
    projectCreator: null,
    billing: null,
  });
  const companyData =
    isEditing.section === "company"
      ? formState.company
      : {
          companyName: "Mirage Pictures Limited",
          registrationNumber: "12345678",
          vatNumber: "GB 987 6543 21",
          addressLine1: "1 Central St Giles",
          addressLine2: "St Giles High Street",
          city: "London",
          postcode: "WC2H 8NU",
          telephone: "+44 20 7946 0958",
          email: "info@miragepictures.co.uk",
          country: "GB",
          currencies: [getCurrencyByCountry("GB")],
        };

  const productionBaseData =
    isEditing.section === "productionBase"
      ? formState.productionBase
      : {
          addressLine1: "",
          addressLine2: "",
          city: "",
          postcode: "",
          telephone: "",
          email: "",
          country: "GB",
        };

  const projectCreatorData =
    isEditing.section === "projectCreator"
      ? formState.projectCreator
      : {
          name: "",
          email: "",
        };

  const billingData =
    isEditing.section === "billing"
      ? formState.billing
      : {
          name: "",
          email: "",
          vatNumber: "",
          sameAsSpv: false,
          addressLine1: "",
          addressLine2: "",
          city: "",
          postcode: "",
          country: "GB",
        };

  const startEditing = (section) => {
    if (section === "company") {
      setFormState((prev) => ({
        ...prev,
        company: {
          companyName: companyData.companyName,
          registrationNumber: companyData.registrationNumber,
          vatNumber: companyData.vatNumber,
          addressLine1: companyData.addressLine1,
          addressLine2: companyData.addressLine2,
          city: companyData.city,
          postcode: companyData.postcode,
          telephone: companyData.telephone,
          email: companyData.email,
          country: companyData.country,
          currencies: companyData.currencies,
        },
      }));
    }

    if (section === "productionBase") {
      setFormState((prev) => ({
        ...prev,
        productionBase: {
          addressLine1: productionBaseData.addressLine1,
          addressLine2: productionBaseData.addressLine2,
          city: productionBaseData.city,
          postcode: productionBaseData.postcode,
          telephone: productionBaseData.telephone,
          email: productionBaseData.email,
          country: productionBaseData.country,
        },
      }));
    }

    if (section === "projectCreator") {
      setFormState((prev) => ({
        ...prev,
        projectCreator: {
          name: projectCreatorData.name,
          email: projectCreatorData.email,
        },
      }));
    }

    if (section === "billing") {
      setFormState((prev) => ({
        ...prev,
        billing: {
          name: billingData.name,
          email: billingData.email,
          vatNumber: billingData.vatNumber,
          sameAsSpv: billingData.sameAsSpv,
          addressLine1: billingData.addressLine1,
          addressLine2: billingData.addressLine2,
          city: billingData.city,
          postcode: billingData.postcode,
          country: billingData.country,
        },
      }));
    }

    setIsEditing({ section });
  };

  const cancelEditing = () => {
    setIsEditing({ section: null });
    setFormState({
      company: null,
      productionBase: null,
      projectCreator: null,
      billing: null,
    });
  };
  return (
    <>
      <div className="space-y-4">
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">
                  Companies
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Add one or more companies operating on this project. Each can
                  have its own address, contact details, and currencies
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-muted-foreground text-[11px]">
              1 company registered
            </p>

            <FramerMotion.motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[0.7rem] font-medium bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Company
            </FramerMotion.motion.button>
          </div>
          <Accordion
            type="single"
            collapsible
            className="mt-4 px-4 rounded-3xl border"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="hover:no-underline w-full">
                <div className="flex items-center justify-between gap-4 w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 ">
                        <h2 className="text-foreground font-medium text-[0.95rem]">
                          {companyData.companyName}
                        </h2>

                        <Badge className="h-4 rounded-full px-2 text-[0.49rem] font-semibold uppercase tracking-[0.14em] bg-primary text-primary-foreground">
                          Primary
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-[0.7rem] text-muted-foreground">
                          {companyData.city},{" "}
                          {getCountryLabel(companyData.country)}
                        </p>

                        <span className="text-[0.7rem] text-muted-foreground">
                          •
                        </span>

                        <p className="text-[0.7rem] text-muted-foreground">
                          VAT Number: {companyData.vatNumber}
                        </p>

                        {companyData.currencies.map((currency) => (
                          <Badge
                            key={currency}
                            className="h-5 rounded-full bg-primary/20 px-2 text-[0.55rem] font-semibold text-primary"
                          >
                            {currency}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-1">
                    <div
                      className="p-2 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="mb-4 space-y-4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-end gap-1 ">
                    <EditToggleButtons
                      isEditing={isEditing.section === "company"}
                      onEdit={() => startEditing("company")}
                      onSave={() => setIsEditing({ section: null })}
                      onCancel={cancelEditing}
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <EditableTextDataField
                      label="Company Name"
                      value={companyData.companyName}
                      isEditing={isEditing.section === "company"}
                      onChange={(val) =>
                        setFormState((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
                            companyName: val,
                          },
                        }))
                      }
                    />
                    <EditableTextDataField
                      label="Company Registration Number"
                      value={companyData.registrationNumber}
                      isEditing={isEditing.section === "company"}
                      onChange={(val) =>
                        setFormState((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
                            registrationNumber: val,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <EditableTextDataField
                      label="VAT Number"
                      value={companyData.vatNumber}
                      isEditing={isEditing.section === "company"}
                      onChange={(val) =>
                        setFormState((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
                            vatNumber: val,
                          },
                        }))
                      }
                      infoPillDescription="UK Value Added Tax registration number"
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    <EditableTextDataField
                      label="Address Line 1"
                      value={companyData.addressLine1}
                      isEditing={isEditing.section === "company"}
                      onChange={(val) =>
                        setFormState((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
                            addressLine1: val,
                          },
                        }))
                      }
                      infoPillDescription="The address of the Production Base for this project (from which mileage might be charged)."
                    />
                    <EditableTextDataField
                      label="Address Line 2"
                      value={companyData.addressLine2}
                      isEditing={isEditing.section === "company"}
                      isRequired={false}
                      onChange={(val) =>
                        setFormState((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
                            addressLine2: val,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                    <EditableTextDataField
                      label="City"
                      value={companyData.city}
                      isEditing={isEditing.section === "company"}
                      onChange={(val) =>
                        setFormState((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
                            city: val,
                          },
                        }))
                      }
                    />

                    <EditableTextDataField
                      label="Postcode"
                      value={companyData.postcode}
                      isEditing={isEditing.section === "company"}
                      onChange={(val) =>
                        setFormState((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
                            postcode: val,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <EditableSelectField
                      label="Country"
                      items={getCountryOptions()}
                      value={companyData.country}
                      isEditing={isEditing.section === "company"}
                      onChange={(val) =>
                        setFormState((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
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
                      value={companyData.telephone}
                      isEditing={isEditing.section === "company"}
                      onChange={(val) =>
                        setFormState((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
                            telephone: val,
                          },
                        }))
                      }
                    />

                    <EditableTextDataField
                      label="Email Address"
                      value={companyData.email}
                      isEditing={isEditing.section === "company"}
                      type="email"
                      onChange={(val) =>
                        setFormState((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
                            email: val,
                          },
                        }))
                      }
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
                      value={companyData.currencies}
                      isEditing={isEditing.section === "company"}
                      onChange={(val) =>
                        setFormState((prev) => ({
                          ...prev,
                          company: {
                            ...prev.company,
                            currencies: val,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardWrapper>
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
                isEditing={isEditing.section === "productionBase"}
                onEdit={() => startEditing("productionBase")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableTextDataField
              label="Address Line 1"
              value={productionBaseData.addressLine1}
              isEditing={isEditing.section === "productionBase"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  productionBase: {
                    ...prev.productionBase,
                    addressLine1: val,
                  },
                }))
              }
              infoPillDescription="The address of the Production Base for this project (from which mileage might be charged)."
            />
            <EditableTextDataField
              label="Address Line 2"
              value={productionBaseData.addressLine2}
              isEditing={isEditing.section === "productionBase"}
              isRequired={false}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  productionBase: {
                    ...prev.productionBase,
                    addressLine2: val,
                  },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableTextDataField
              label="City"
              value={productionBaseData.city}
              isEditing={isEditing.section === "productionBase"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  productionBase: {
                    ...prev.productionBase,
                    city: val,
                  },
                }))
              }
            />

            <EditableTextDataField
              label="Postcode"
              value={productionBaseData.postcode}
              isEditing={isEditing.section === "productionBase"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  productionBase: {
                    ...prev.productionBase,
                    postcode: val,
                  },
                }))
              }
            />
          </div>

          <div className="mt-4">
            <EditableSelectField
              label="Country"
              items={getCountryOptions()}
              value={productionBaseData.country}
              isEditing={isEditing.section === "productionBase"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  productionBase: {
                    ...prev.productionBase,
                    country: val,
                  },
                }))
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <EditableTextDataField
              label="Telephone Number"
              value={productionBaseData.telephone}
              isEditing={isEditing.section === "productionBase"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  productionBase: {
                    ...prev.productionBase,
                    telephone: val,
                  },
                }))
              }
              infoPillDescription="Helpful information shown to crew in their offer, so they can contact you with any questions."
            />

            <EditableTextDataField
              label="Email Address"
              type="email"
              value={productionBaseData.email}
              isEditing={isEditing.section === "productionBase"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  productionBase: {
                    ...prev.productionBase,
                    email: val,
                  },
                }))
              }
              infoPillDescription="Helpful information shown to crew in their offer, so they can contact you with any questions"
            />
          </div>
        </CardWrapper>
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
                isEditing={isEditing.section === "projectCreator"}
                onEdit={() => startEditing("projectCreator")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableTextDataField
              label="Project Creator Name"
              value={projectCreatorData.name}
              isEditing={isEditing.section === "projectCreator"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectCreator: {
                    ...prev.projectCreator,
                    name: val,
                  },
                }))
              }
            />

            <EditableTextDataField
              label="Project Creator Email Address"
              type="email"
              value={projectCreatorData.email}
              isEditing={isEditing.section === "projectCreator"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  projectCreator: {
                    ...prev.projectCreator,
                    email: val,
                  },
                }))
              }
            />
          </div>
        </CardWrapper>
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
                isEditing={isEditing.section === "billing"}
                onEdit={() => startEditing("billing")}
                onSave={() => setIsEditing({ section: null })}
                onCancel={cancelEditing}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableTextDataField
              label="Billing Contact Name"
              value={billingData.name}
              isEditing={isEditing.section === "billing"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  billing: {
                    ...prev.billing,
                    name: val,
                  },
                }))
              }
            />

            <EditableTextDataField
              label="Billing Contact Email(s)"
              type="email"
              value={billingData.email}
              isEditing={isEditing.section === "billing"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  billing: {
                    ...prev.billing,
                    email: val,
                  },
                }))
              }
              infoPillDescription="Enter one or more email addresses, separated by commas."
            />
          </div>
          <div className="mt-4">
            <EditableTextDataField
              label="SPV Company VAT Number"
              value={billingData.vatNumber}
              isEditing={isEditing.section === "billing"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  billing: {
                    ...prev.billing,
                    vatNumber: val,
                  },
                }))
              }
            />
          </div>
          <div className="mt-4">
            <EditableSwitchField
              label="Billing address is same as SPV company"
              checked={billingData.sameAsSpv}
              isEditing={isEditing.section === "billing"}
              onChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  billing: {
                    ...prev.billing,
                    sameAsSpv: val,
                  },
                }))
              }
            />
          </div>
          {!billingData.sameAsSpv && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <EditableTextDataField
                  label="Billing Address Line 1"
                  value={billingData.addressLine1}
                  isEditing={isEditing.section === "billing"}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      billing: {
                        ...prev.billing,
                        addressLine1: val,
                      },
                    }))
                  }
                />

                <EditableTextDataField
                  label="Billing Address Line 2"
                  value={billingData.addressLine2}
                  isEditing={isEditing.section === "billing"}
                  isRequired={false}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      billing: {
                        ...prev.billing,
                        addressLine2: val,
                      },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <EditableTextDataField
                  label="City"
                  value={billingData.city}
                  isEditing={isEditing.section === "billing"}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      billing: {
                        ...prev.billing,
                        city: val,
                      },
                    }))
                  }
                />

                <EditableTextDataField
                  label="Postcode"
                  value={billingData.postcode}
                  isEditing={isEditing.section === "billing"}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      billing: {
                        ...prev.billing,
                        postcode: val,
                      },
                    }))
                  }
                />
              </div>

              <div className="mt-4">
                <EditableSelectField
                  label="Country"
                  items={getCountryOptions()}
                  value={billingData.country}
                  isEditing={isEditing.section === "billing"}
                  onChange={(val) =>
                    setFormState((prev) => ({
                      ...prev,
                      billing: {
                        ...prev.billing,
                        country: val,
                      },
                    }))
                  }
                />
              </div>
            </>
          )}
        </CardWrapper>
      </div>
    </>
  );
}

export default ContactsSettings;

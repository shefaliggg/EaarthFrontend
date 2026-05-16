import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import { Eye, FileText, Lock, Shield, Unlock } from "lucide-react";
import { cn } from "@/shared/config/utils";
import { useState } from "react";
import FilterPillTabs from "@/shared/components/FilterPillTabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../../../../auth/config/axiosConfig";

function ContractsFormsSettings() {
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();

  const formGroups = [
    {
      id: "group-1",
      name: "Contractual Forms",
      forms: [
        { id: "form-1", name: "Box Rental", isDefault: true, isLocked: true },
        {
          id: "form-2",
          name: "Computer Allowance",
          isDefault: true,
          isLocked: true,
        },
        {
          id: "form-3",
          name: "Crew Information Form",
          isDefault: true,
          isLocked: true,
        },
        {
          id: "form-4",
          name: "Software Allowance",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-5",
          name: "Equipment Rental",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-6",
          name: "Mobile Allowance",
          isDefault: true,
          isLocked: false,
        },
        {
          id: "form-7",
          name: "Vehicle Allowance",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-8",
          name: "Living Allowance",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-9",
          name: "Deal Memo (PACT/BECTU)",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-10",
          name: "Status Determination",
          isDefault: false,
          isLocked: false,
        },
        { id: "form-11", name: "Start Form", isDefault: true, isLocked: false },
      ],
    },
    {
      id: "group-2",
      name: "Standard Forms",
      forms: [
        {
          id: "form-1",
          name: "Child Protection Declaration",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-2",
          name: "Conflict of Interest",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-3",
          name: "Driver Declaration",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-4",
          name: "NDA / Confidentiality",
          isDefault: true,
          isLocked: true,
        },
        {
          id: "form-5",
          name: "Policy Acknowledgement",
          isDefault: true,
          isLocked: true,
        },
        {
          id: "form-6",
          name: "Self-Assessment Declaration",
          isDefault: false,
          isLocked: false,
        },
      ],
    },
    {
      id: "group-3",
      name: "Tax & Compliance",
      forms: [
        {
          id: "form-1",
          name: "W-4 (Federal)",
          isDefault: false,
          isLocked: false,
        },
        { id: "form-2", name: "I-9", isDefault: false, isLocked: false },
        {
          id: "form-3",
          name: "State Tax Exemption",
          isDefault: false,
          isLocked: false,
        },
      ],
    },
    {
      id: "group-4",
      name: "Insurance & Legal",
      forms: [
        {
          id: "form-1",
          name: "Certificate of Insurance",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-2",
          name: "Child Support Notice",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-3",
          name: "Direct Deposit",
          isDefault: false,
          isLocked: false,
        },
      ],
    },
    {
      id: "group-5",
      name: "Welfare & State",
      forms: [
        {
          id: "form-1",
          name: "Disability Disclosure",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-2",
          name: "Emergency Contact",
          isDefault: false,
          isLocked: false,
        },
        {
          id: "form-3",
          name: "Picture ID Release",
          isDefault: false,
          isLocked: false,
        },
      ],
    },
  ];

  const categories = [
    {
      id: "category-1",
      name: "Standard Crew",
      bundles: [
        {
          id: "bundle-1",
          name: "Weekly PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-2",
          name: "Weekly Self-Employed",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-3",
          name: "Weekly Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Policy Acknowledgement",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-4",
          name: "Weekly Loan Out",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-5",
          name: "Daily PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-6",
          name: "Daily Self-Employed",
          isLocked: false,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-7",
          name: "Daily Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-8",
          name: "Daily Loan Out",
          isLocked: false,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
      ],
    },
    {
      id: "category-2",
      name: "Senior / Buyout",
      bundles: [
        {
          id: "bundle-1",
          name: "Weekly PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-2",
          name: "Weekly Self-Employed",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-3",
          name: "Weekly Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-4",
          name: "Weekly Loan Out",
          isLocked: false,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-5",
          name: "Daily PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-6",
          name: "Daily Self-Employed",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-7",
          name: "Daily Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-8",
          name: "Daily Loan Out",
          isLocked: false,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
      ],
    },
    {
      id: "category-3",
      name: "Construction",
      bundles: [
        {
          id: "bundle-1",
          name: "Weekly PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-2",
          name: "Weekly Self-Employed",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-3",
          name: "Weekly Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-4",
          name: "Weekly Loan Out",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-5",
          name: "Daily PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-6",
          name: "Daily Self-Employed",
          isLocked: false,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-7",
          name: "Daily Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
      ],
    },
    {
      id: "category-4",
      name: "Electrical",
      bundles: [
        {
          id: "bundle-1",
          name: "Weekly PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-2",
          name: "Weekly Self-Employed",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-3",
          name: "Weekly Direct Hire",
          isLocked: false,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-4",
          name: "Weekly Loan Out",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-5",
          name: "Daily PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-6",
          name: "Daily Self-Employed",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-7",
          name: "Daily Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
      ],
    },
    {
      id: "category-5",
      name: "HOD",
      bundles: [
        {
          id: "bundle-1",
          name: "Weekly PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-2",
          name: "Weekly Self-Employed",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-3",
          name: "Weekly Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-4",
          name: "Weekly Loan Out",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-5",
          name: "Daily PAYE",
          isLocked: false,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-6",
          name: "Daily Self-Employed",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-7",
          name: "Daily Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-8",
          name: "Daily Loan Out",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
      ],
    },
    {
      id: "category-6",
      name: "Rigging",
      bundles: [
        {
          id: "bundle-1",
          name: "Weekly PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-2",
          name: "Weekly Self-Employed",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-3",
          name: "Weekly Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-4",
          name: "Weekly Loan Out",
          isLocked: false,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-5",
          name: "Daily PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-6",
          name: "Daily Self-Employed",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-7",
          name: "Daily Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-8",
          name: "Daily Loan Out",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
      ],
    },
    {
      id: "category-7",
      name: "Transport",
      bundles: [
        {
          id: "bundle-1",
          name: "Weekly PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-2",
          name: "Weekly Self-Employed",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-3",
          name: "Weekly Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-4",
          name: "Weekly Loan Out",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-5",
          name: "Daily PAYE",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Paye Contract",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-6",
          name: "Daily Self-Employed",
          isLocked: false,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Self-Employed Contract",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Self-Assessment Declaration",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-7",
          name: "Daily Direct Hire",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Direct Hire Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Start Form",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
        {
          id: "bundle-8",
          name: "Daily Loan Out",
          isLocked: true,
          forms: [
            {
              id: "form-1",
              name: "Box Rental",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-2",
              name: "Computer Allowance",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-3",
              name: "Crew Information Form",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-4",
              name: "Mobile Allowance",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-5",
              name: "Start Form",
              isDefault: true,
              isLocked: false,
            },
            {
              id: "form-6",
              name: "NDA / Confidentiality",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-7",
              name: "Policy Acknowledgement",
              isDefault: true,
              isLocked: true,
            },
            {
              id: "form-8",
              name: "Loan Out Agreement",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-9",
              name: "Certificate of Insurance",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-10",
              name: "Company Details Form",
              isDefault: false,
              isLocked: false,
            },
            {
              id: "form-11",
              name: "NDA / Confidentiality",
              isDefault: false,
              isLocked: false,
            },
          ],
        },
      ],
    },
  ];

  //   async function openPreview(bundle, categoryName) {
  //   const toastId = toast.loading(
  //     "Preparing contract preview and loading template..."
  //   );

  //   // TODO: swap this for a per-form S3 URL from backend
  //     const S3_URL =
  //       "https://eaarthuploads.s3.eu-west-2.amazonaws.com/EaarthTemplates/standard_crew_daily_paye.html?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAVUJJ2KPXB7MZKQCR%2F20260516%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260516T054151Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEL7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMiJHMEUCIFQ7x6XZYwH5wyQtkTdRQ8m5CocN8mpX%2F93foxy9qOdIAiEAs7sYNQBiRkPCh1cVLDxfFiyiyi%2F0i92uVMCkZ1aAaxsq4wIIh%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwzODcxNzE2MzYyMDYiDEOj63sz4g6ZBT2PBSq3AvYFh89cX131a4qpaAlLZQN%2F0CdXlrM7CxYHj%2BFQRaH0lY%2F18Cgz72cUUKTxGzF3kW0%2FPzAYPCnO58HgfkNM1Khl8UATWfZsBA74yvC91s%2BOd5nHfyT%2FZvrvT4CconhM%2BnTVrBQA3tQj0akgvmcuAyvpYecyFQ2RbC1YTJlRGH6VkwWli1U1h%2FN95EkI8Vz15QGRS4YLfhQenihCuM8alVCmG36xflBMTVIPll722iOmjD6RB6bm%2FHzXtwOq8ddRWdr3FS5yDjrv0ywfBcpaPcgZUyr6CoqI41hBAa%2BugDH8pY2pgt3u8KWMy3cCBaxIeYwEu%2FXvif6TQpTn7vGOS1G7z9s3ycIE2bdFZrERUfZp8BEoRJRFNgJJLM7oVlTPEMV%2BanusI8T4CFZDVnrzRpE3wkQ380ARMOrgn9AGOq0CpUcejTQzMHJYTYKgb98wgvGPimebuHsFlcfmcBreXEPInrWf5KbVdL1rAC5P7DFIDXxFIz%2BgZRCJePXbOvGcdM3spliCUEiZDQPFKk1q0BHzS7hsitvoms79igY2545hL6f1gcWWlcfNeNu3WKwbp60aXYSwPoA7Lfdph%2FaR27aNsTPQKoSk5c8xy7PdJMrrPS0JqsycPcm%2Beg%2F3VKPoQuRlXrcCB5ae4eTzaCXH3mzSyBg59nJGtS4N%2FcneSuWLF7uv%2FwoduQHc4mqZP6I4QLj8T89ubsPJJj4BkQMa%2FTI9A5bORBsJv2CGyQHirPrj%2BTe4oAgh9owpyuX9ZjriRsbdQ16kNPqyynZivFU8I7b5VrsVbKE7DbwaOIR4kT5%2FSBi%2FGXG74UNgu%2BIqbg%3D%3D&X-Amz-Signature=280939e3b4c07aad91d533360499ebe857a4a10b627e22cef493ca3061e9b722&X-Amz-SignedHeaders=host&response-content-disposition=inline";

  //   let htmlTemplate = "";

  //   try {
  //     const res = await fetch(S3_URL);

  //     if (!res.ok) {
  //       throw new Error(`S3 fetch failed: ${res.status}`);
  //     }

  //     htmlTemplate = await res.text();
  //   } catch (err) {
  //     toast.error(
  //       "Unable to load the contract template. Please try again in a moment.",
  //       {
  //         id: toastId,
  //       }
  //     );

  //     console.error(err);
  //     return;
  //   }

  //   const override = {
  //     bundle: {
  //       name: `${bundle.name} · ${categoryName}`,
  //       forms: bundle.forms.map((form) => ({
  //         formKey: form.id,
  //         formName: form.name,
  //         displayType: "contract",
  //         formGroupId: {
  //           forms: [{ key: form.id, htmlTemplate }],
  //         },
  //       })),
  //     },
  //   };

  //   toast.success("Contract preview loaded successfully.", {
  //     id: toastId,
  //   });

  //   navigate("review-edit", {
  //     state: { override },
  //   });
  // }

  // console.log(categories);

  async function openPreview(bundle, categoryName) {
    const toastId = toast.loading("Preparing contract preview...");

    // TODO: replace with the real per-bundle key from the API
    const TEMP_S3_KEY = "EaarthTemplates/standard_crew_daily_paye.html";

    let htmlTemplate = "";

    try {
      // Step 1: Get fresh signed URL
      const { data } = await axiosConfig.post("/settings/template-url", {
        key: TEMP_S3_KEY,
      });

      const { url } = data;

      if (!url) {
        throw new Error("Signed URL missing from response");
      }

      // Step 2: Fetch template HTML from S3
      const htmlRes = await fetch(url);

      if (!htmlRes.ok) {
        throw new Error(`S3 fetch failed: ${htmlRes.status}`);
      }

      htmlTemplate = await htmlRes.text();
    } catch (err) {
      toast.error("Unable to load the contract template. Please try again.", {
        id: toastId,
      });

      console.error(err);
      return;
    }

    const override = {
      bundle: {
        name: `${bundle.name} · ${categoryName}`,
        forms: bundle.forms.map((form) => ({
          formKey: form.id,
          formName: form.name,
          displayType: "contract",
          formGroupId: {
            forms: [{ key: form.id, htmlTemplate }],
          },
        })),
      },
    };

    toast.success("Contract preview loaded successfully.", {
      id: toastId,
    });

    navigate("review-edit", {
      state: { override },
    });
  }

  const filteredCategories =
    activeCategory === "all"
      ? categories
      : categories.filter((c) => c.id === activeCategory);

  return (
    <>
      <div className="space-y-4">
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">
                  Contract Form Categories
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Department-based contract form categories with per-form upload
                  and default status.
                </p>
              </div>
            </div>
            <span className="text-muted-foreground text-[0.6rem]">
              7 departments
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-5">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-xl border bg-background hover:border-primary/40 transition-colors p-2"
              >
                <p className="truncate mx-3 mt-3 mb-2 text-foreground uppercase text-xs font-medium tracking-wide">
                  {category.name}
                </p>
                <div className="h-px mx-3 mb-3 bg-linear-to-r from-primary/40 via-primary/20 to-transparent" />
                {category.bundles.map((bundle) => (
                  <div
                    key={bundle.id}
                    className="flex items-center justify-between mx-3 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      {bundle.isLocked && (
                        <Lock className="h-3 w-3 text-peach-500" />
                      )}
                      <span className="truncate text-muted-foreground text-[0.6rem]">
                        {bundle.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        // disabled={bundle.isLocked}
                        type="button"
                        onClick={() => openPreview(bundle, category.name)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-peach-500/10 text-peach-500 hover:bg-peach-500/20 transition-colors text-[0.6rem]"
                      >
                        <Eye className="h-3 w-3" />
                        Review / Edit
                      </button>

                      <button
                        disabled={bundle.isLocked}
                        className={cn(
                          "flex items-center justify-center p-1 rounded transition-colors",
                          bundle.isLocked
                            ? "bg-peach-100 text-peach-700 dark:bg-peach-500/20 dark:text-peach-300 cursor-not-allowed"
                            : "bg-muted/60 text-muted-foreground/70 hover:bg-muted/80",
                        )}
                      >
                        {bundle.isLocked ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          <Unlock className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardWrapper>
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">
                  Contract Form Groups
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Organized form groups with default and lock controls for
                  cross-bundle inheritance.
                </p>
              </div>
            </div>
            <span className="text-muted-foreground text-[0.6rem]">
              5 groups
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-5">
            {formGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border bg-background hover:border-primary/40 transition-colors p-2"
              >
                <p className="truncate mx-3 mt-3 mb-2 text-foreground uppercase text-xs font-medium tracking-wide">
                  {group.name}
                </p>
                <div className="h-px mx-3 mb-3 bg-linear-to-r from-primary/40 via-primary/20 to-transparent" />
                {group.forms.map((form) => (
                  <div
                    key={form.id}
                    className="flex items-center justify-between mx-3 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      {form.isLocked && (
                        <Lock className="h-3 w-3 text-peach-500" />
                      )}
                      <span className="truncate text-muted-foreground text-[0.6rem]">
                        {form.name}
                      </span>
                      {form.isDefault && (
                        <span className="px-1 py-0.5 leading-none rounded-full uppercase tracking-wider text-[0.45rem] font-semibold bg-primary text-primary-foreground">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-peach-500/10 text-peach-500 hover:bg-peach-500/20 transition-colors text-[0.6rem]"
                      >
                        <Eye className="h-3 w-3" />
                        Review / Edit
                      </button>
                      <button
                        className={cn(
                          "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[0.6rem]",
                          form.isDefault
                            ? "bg-primary/10 text-primary"
                            : "bg-muted/60 text-muted-foreground/70",
                        )}
                      >
                        <Shield className="h-3 w-3" />
                        {form.isDefault ? "Unset" : "Default"}
                      </button>
                      <button
                        disabled={form.isLocked}
                        className={cn(
                          "flex items-center justify-center p-1 rounded transition-colors",
                          form.isLocked
                            ? "bg-peach-100 text-peach-700 dark:bg-peach-500/20 dark:text-peach-300 cursor-not-allowed"
                            : "bg-muted/60 text-muted-foreground/70 hover:bg-muted/80",
                        )}
                      >
                        {form.isLocked ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          <Unlock className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardWrapper>
        <CardWrapper showLabel={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 rounded-full bg-linear-to-b from-primary to-primary/40" />
              <div>
                <h3 className="text-foreground text-sm font-medium">
                  Contract Template Bundles
                </h3>
                <p className="text-muted-foreground text-[0.7rem] mt-0.5">
                  Auto-generated from categories × form types — 56 bundles
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <FilterPillTabs
              size="sm"
              options={[
                { label: "All", value: "all" },
                ...categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                })),
              ]}
              value={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {filteredCategories.map((category) =>
              category.bundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="rounded-xl border bg-background hover:border-primary/40 transition-colors p-2"
                >
                  <div className="flex items-center justify-between px-3 pt-3 pb-2">
                    <span className="text-muted-foreground truncate text-[0.65rem] font-medium">
                      {bundle.name} {category.name}
                    </span>
                    <span className="ml-2 px-2 py-0.5 rounded-full border uppercase tracking-wider whitespace-nowrap text-[0.4rem] text-(--color-lavender-500) border-(--color-lavender-400)">
                      {bundle.name}
                    </span>
                  </div>
                  <div className="h-px mx-3 mb-3 bg-linear-to-r from-primary/40 via-primary/20 to-transparent" />
                  <div className="px-3 py-2.5 flex flex-wrap gap-1">
                    {bundle.forms.map((form) => (
                      <div
                        key={form.id}
                        className={cn(
                          "flex items-center gap-0.5 px-1.5 py-1 rounded-md border",
                          form.isDefault
                            ? "bg-primary/5 text-primary/70 border-primary/20"
                            : "bg-muted/60 text-muted-foreground/70 border-border/50",
                        )}
                      >
                        {form.isLocked ? (
                          <Lock className="h-2.5 w-2.5 text-peach-500" />
                        ) : form.isDefault ? (
                          <Shield className="h-2.5 w-2.5 text-primary/70" />
                        ) : (
                          <FileText className="h-3 w-3 text-primary/70" />
                        )}
                        <span className="uppercase tracking-wide text-[0.44rem]">
                          {form.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )),
            )}
          </div>
        </CardWrapper>
      </div>
    </>
  );
}

export default ContractsFormsSettings;

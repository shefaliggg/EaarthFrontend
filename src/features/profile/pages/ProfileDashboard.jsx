import React, { useEffect, useState } from "react";
import ProfileSummary from "../components/ProfileSummary";
import IdentityDetails from "../components/tabs/IdentityDetails";
import ContactDetails from "../components/tabs/ContactDetails";
import FinancialDetails from "../components/tabs/FinancialDetails";
import AllowanceDetails from "../components/tabs/allowance-details/AllowancesDetails";
import HealthDetails from "../components/tabs/HealthDetails";
import MySignature from "../components/tabs/my-signature/MySignature";
import FilterPillTabs from "../../../shared/components/FilterPillTabs";
import {
  Briefcase,
  BriefcaseBusiness,
  Car,
  DollarSign,
  FileText,
  Heart,
  MapPin,
  PenTool,
  User,
} from "lucide-react";
import DocumentsDetails from "../components/tabs/documents-details/DocumentsDetails";
import AgencyDetails from "../components/tabs/AgencyDetails";
import CompanyDetails from "../components/tabs/CompanyDetails";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfileThunk } from "../store/crew/crewProfile.thunk";
import { fetchDocumentsThunk } from "../../user-documents/store/document.thunk";

export default function ProfileDashboard() {
  const location = useLocation();
  const dispatch = useDispatch();

  const { crewProfile, isFetching } = useSelector(
    (state) => state.crewProfile,
  );
  const { userDocuments, isFetching: isFetchingDocs } = useSelector(
    (state) => state.userDocuments,
  );

  // ── Fetch on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!crewProfile && !isFetching) dispatch(fetchProfileThunk());
  }, []);

  useEffect(() => {
    if (!userDocuments && !isFetchingDocs) dispatch(fetchDocumentsThunk());
  }, []);

  const tabs = [
    { route: "/profile", label: "Identity", icon: User },
    { route: "/profile/contact", label: "Contact", icon: MapPin },
    { route: "/profile/agency", label: "Agency", icon: BriefcaseBusiness },
    { route: "/profile/company", label: "Company", icon: Briefcase },
    { route: "/profile/financial", label: "Financial", icon: DollarSign },
    { route: "/profile/allowance", label: "Allowances", icon: Car },
    { route: "/profile/health", label: "Health", icon: Heart },
    { route: "/profile/documents", label: "Documents", icon: FileText },
    { route: "/profile/signature", label: "My Signature", icon: PenTool },
  ];

  return (
    <div className="mx-auto space-y-6">
      <ProfileSummary />

      <div className="space-y-4">
        <FilterPillTabs
          options={tabs}
          value={location.pathname}
          onChange={(value) => setActiveTab(value)}
          size="md"
          fullWidth
          showActiveIndicator
          navigatable
        />

        <Outlet />
      </div>
    </div>
  );
}

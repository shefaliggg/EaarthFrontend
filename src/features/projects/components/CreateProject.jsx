// src/features/projects/pages/CreateProject.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  Clapperboard,
  ArrowRight,
  Loader2,
  Shield,
} from "lucide-react";

import { PageHeader } from "../../../shared/components/PageHeader";
import ProjectDetails from "../pages/ProjectDetails";
import ConfirmActionDialog from "../../../shared/components/modals/ConfirmActionDialog";
import { INITIALIZE_PROJECT_CONFIG } from "../../../shared/config/ConfirmActionsConfig";

import { createProjectThunk } from "../store/project.thunks";
import { clearError, clearSuccessMessage } from "../store/project.slice";

// ── Pending Approval Overlay ──────────────────────────────────────────────────
function PendingApprovalOverlay({ productionName, onContinue }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) {
      onContinue();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onContinue]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -16 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

        <div className="px-8 py-10 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 20 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-200"
          >
            <Clock className="h-10 w-10 text-amber-500" strokeWidth={1.5} />
          </motion.div>

          {/* Heading */}
          <h2 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">
            PENDING APPROVAL
          </h2>
          <p className="mb-2 text-sm font-medium text-amber-500 uppercase">
            {productionName}
          </p>
          <p className="mb-8 text-sm leading-relaxed text-gray-500">
            Your production has been created as a draft and submitted for admin
            review. Applications will be unlocked once approved.
          </p>

          {/* Steps */}
          <div className="mb-8 space-y-3 text-left">
            {[
              { icon: CheckCircle2, label: "PRODUCTION CREATED", done: true },
              { icon: Shield, label: "AWAITING ADMIN APPROVAL", done: false, active: true },
              { icon: Clapperboard, label: "APPLICATIONS UNLOCKED", done: false },
            ].map(({ icon: Icon, label, done, active }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    done
                      ? "bg-emerald-100 text-emerald-600"
                      : active
                      ? "bg-amber-100 text-amber-500"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span
                  className={`text-sm ${
                    done
                      ? "text-emerald-600"
                      : active
                      ? "text-amber-500 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onContinue}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-700"
          >
            VIEW PROJECT DASHBOARD
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold tabular-nums">
              {countdown}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Derive the URL slug the same way DashboardLayout and ProjectDashboard do */
function toSlug(name = "") {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// ── Main ──────────────────────────────────────────────────────────────────────
function CreateProject() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isCreating     = useSelector((s) => s.project.isCreating);
  const error          = useSelector((s) => s.project.error);

  const [modalOpen, setModalOpen]                 = useState(false);
  const [pendingPayload, setPendingPayload]       = useState(null);
  const [createdProduction, setCreatedProduction] = useState(null);
  const [showPendingOverlay, setShowPendingOverlay] = useState(false);

  // Clean up on unmount
  useEffect(() => () => {
    dispatch(clearSuccessMessage());
    dispatch(clearError());
  }, [dispatch]);

  const handleModalOpenChange = (open) => {
    setModalOpen(open);
    if (!open) dispatch(clearError());
  };

  const handleProjectComplete = (payload) => {
    setPendingPayload(payload);
    setModalOpen(true);
  };

  const handleConfirmInitialize = async () => {
    if (!pendingPayload) return;

    const body = {
      productionName:  pendingPayload.productionName,
      productionType:  pendingPayload.productionType,
      studioId:        pendingPayload.studioId,
      country:         pendingPayload.country,
      prepStartDate:   pendingPayload.prepStartDate,
      prepEndDate:     pendingPayload.prepEndDate,
      shootStartDate:  pendingPayload.shootStartDate,
      shootEndDate:    pendingPayload.shootEndDate,
      wrapStartDate:   pendingPayload.wrapStartDate,
      wrapEndDate:     pendingPayload.wrapEndDate,
      applications:    pendingPayload.applications    ?? [],
      packageTier:     pendingPayload.packageTier     ?? "basic",
      projectContacts: pendingPayload.projectContacts ?? [],
    };

    const result = await dispatch(createProjectThunk(body));

    if (createProjectThunk.fulfilled.match(result)) {
      const production = result.payload;
      setCreatedProduction(production);
      setModalOpen(false);
      dispatch(clearSuccessMessage());
      setShowPendingOverlay(true);
    }
  };

  const handleContinueToDashboard = () => {
    if (!createdProduction) return;

    const slug = toSlug(createdProduction.productionName || createdProduction._id);

    navigate(`/projects/${slug}`, {
      state: { production: createdProduction },
      replace: true,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CREATE PROJECT"
        icon="FolderPlus"
        secondaryActions={[
          {
            label: "CANCEL",
            icon: "X",
            variant: "outline",
            clickAction: () => navigate(-1),
          },
        ]}
      />

      <ProjectDetails onComplete={handleProjectComplete} />

      <ConfirmActionDialog
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
        config={INITIALIZE_PROJECT_CONFIG}
        loading={isCreating}
        error={error}
        onConfirm={handleConfirmInitialize}
      />

      <AnimatePresence>
        {showPendingOverlay && createdProduction && (
          <PendingApprovalOverlay
            productionName={createdProduction.productionName}
            onContinue={handleContinueToDashboard}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreateProject;
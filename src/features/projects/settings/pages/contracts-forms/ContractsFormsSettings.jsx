import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProjectSettings } from "@/features/projects/settings/service/settings.service.js";
import { APP_CONFIG } from "@/features/crew/config/appConfig.js";
import { FileText, Lock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { SettingsSection } from "@/features/projects/settings/components/shared/SettingsSection";
import { SettingsCard } from "@/features/projects/settings/components/shared/SettingsCard.jsx";
import { FormItemRow } from "@/features/projects/settings/components/contracts-forms/FormItemRow";

const accentColor = "#7c3aed";

function ContractsFormsSettings() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [formGroups, setFormGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await getProjectSettings(APP_CONFIG.PROJECT_ID);
      setCategories(response.categories);
      setFormGroups(response.formGroups);
      console.log(response);
    };
    fetchSettings();
  }, []);

  // ─── Derived bundle list for section 3 ────────────────────────────────────
  const visibleBundles =
    activeCategory === "all"
      ? categories.flatMap((cat) =>
          cat.bundleOverrides.map((override) => ({
            overrideId: override.id,
            bundleName: override.bundle?.name || "No Name",
            engagementType: override.engagementType,
            forms: override.bundle?.forms || [],
          })),
        )
      : (categories
          .find((cat) => cat.id === activeCategory)
          ?.bundleOverrides.map((override) => ({
            overrideId: override.id,
            bundleName: override.bundle?.name || "No Name",
            engagementType: override.engagementType,
            forms: override.bundle?.forms || [],
          })) ?? []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-5"
    >
      {/* ── Section 1: Contract Form Categories ─────────────────────────── */}
      <SettingsSection
        title="Contract Form Categories"
        subtitle="Department-based contract form categories with per-form upload and default status."
        headerRight={
          <span
            className="text-gray-400 dark:text-gray-500"
            style={{ fontSize: "0.5rem" }}
          >
            {categories.length} department{categories.length !== 1 ? "s" : ""}
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          {categories.map((category) => (
            <SettingsCard key={category.id} title={category.name}>
              {category.bundleOverrides.map((override) => (
                <FormItemRow
                  key={override.id}
                  name={override.bundle.name}
                  isLocked
                  showUnlock
                  onReviewEdit={() =>
                    navigate("review-edit", { state: { override } })
                  }
                />
              ))}
            </SettingsCard>
          ))}
        </div>
      </SettingsSection>

      {/* ── Section 2: Contract Form Groups ─────────────────────────────── */}
      <SettingsSection
        title="Contract Form Groups"
        subtitle="Organised form groups with default and lock controls for cross-bundle inheritance."
        headerRight={
          <span
            className="text-gray-400 dark:text-gray-500"
            style={{ fontSize: "0.5rem" }}
          >
            {formGroups.length} group{formGroups.length !== 1 ? "s" : ""}
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          {formGroups.map((group) => (
            <SettingsCard key={group._id} title={group.name}>
              {group.forms.map((form) => (
                <FormItemRow
                  key={form.key}
                  name={form.name}
                  isLocked={form.isLocked}
                  isDefault={form.isDefault}
                  showDefaultToggle
                  onReviewEdit={() => {}}
                  onToggleDefault={() => {}}
                  onToggleLock={() => {}}
                />
              ))}
            </SettingsCard>
          ))}
        </div>
      </SettingsSection>

      {/* ── Section 3: Contract Template Bundles ────────────────────────── */}
      <SettingsSection title="Contract Template Bundles">
        {/* Category filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {[{ id: "all", name: "All" }, ...categories].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-2.5 py-1 rounded-full transition-all"
              style={
                activeCategory === cat.id
                  ? {
                      background: accentColor,
                      color: "white",
                      fontSize: "0.5rem",
                    }
                  : {
                      background: "#f3f4f6",
                      color: "#6b7280",
                      fontSize: "0.5rem",
                    }
              }
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Bundles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3">
          {visibleBundles.map((bundle) => (
            <div
              key={bundle.overrideId}
              className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-gray-900/20 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between px-3 pt-3 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: `${accentColor}80` }}
                  />
                  <span
                    className="text-gray-800 dark:text-gray-200 truncate"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {bundle.bundleName}
                  </span>
                </div>
                <span
                  className="shrink-0 ml-2 px-2 py-0.5 rounded-full border uppercase tracking-wider whitespace-nowrap"
                  style={{
                    borderColor: `${accentColor}50`,
                    color: accentColor,
                    fontSize: "0.4rem",
                  }}
                >
                  {bundle.engagementType}
                </span>
              </div>

              <div
                className="h-px mx-3"
                style={{
                  background: `linear-gradient(to right, ${accentColor}60, ${accentColor}20, transparent)`,
                }}
              />

              <div className="px-3 py-2.5">
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {bundle.forms.map((form) => (
                    <div
                      key={form.formKey}
                      className="flex items-center gap-0.5 px-1.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800"
                    >
                      {form.isLocked ? (
                        <Lock className="h-2 w-2 text-amber-500" />
                      ) : (
                        <Shield className="h-2 w-2 text-indigo-400" />
                      )}
                      <span
                        className="text-indigo-700 dark:text-indigo-400 uppercase tracking-wide"
                        style={{ fontSize: "0.4rem" }}
                      >
                        {form.formName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>
    </motion.div>
  );
}

export default ContractsFormsSettings;

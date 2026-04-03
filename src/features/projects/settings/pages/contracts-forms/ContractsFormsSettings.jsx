import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProjectSettings } from "@/features/projects/settings/service/settings.service.js";
import { APP_CONFIG } from "@/features/crew/config/appConfig.js";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Lock,
  Pencil,
  Plus,
  Shield,
  Unlock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const accentColor = "#7c3aed";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col gap-5"
      >
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.05,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="relative rounded-2xl overflow-hidden group"
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${accentColor}15, transparent 60%)`,
            }}
          />
          <div className="rounded-2xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm transition-shadow duration-300">
            <div className="flex items-center p-4 gap-3 border-b border-gray-50/80 dark:border-gray-800/40">
              {/* Colored accent bar on the left */}
              <div
                className="w-1.5 h-5 rounded-full origin-center transition-transform duration-300 ease-out group-hover:scale-y-125"
                style={{
                  background: `linear-gradient(180deg, ${accentColor}, ${accentColor}60)`,
                }}
              />
              <div className="flex flex-col">
                <h3 className="text-gray-900 dark:text-gray-100 text-sm">
                  Contract Form Categories
                </h3>

                <p className="text-gray-400 dark:text-gray-500 text-[0.6rem] mt-0.5">
                  Department-based contract form categories with per-form upload
                  and default status.
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-end mb-3">
                <span
                  className="text-gray-400 dark:text-gray-500"
                  style={{ fontSize: "0.48rem" }}
                >
                  {categories.length} department
                  {categories.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-gray-900/20 hover:border-purple-200 dark:hover:border-purple-800 transition-colors group/card"
                  >
                    {/* Category card header */}
                    <div className="flex items-center justify-between px-3 pt-3 pb-2 gap-1">
                      <div className="flex items-center gap-1.5 min-w-0 group/name">
                        <span
                          className={`truncate text-gray-800 dark:text-gray-200 uppercase`}
                        >
                          {category.name}
                        </span>
                        <button className="shrink-0 opacity-0 group-hover/name:opacity-100 transition-opacity text-gray-400 hover:text-purple-600">
                          <Pencil className="h-2.5 w-2.5" />
                        </button>
                      </div>
                      <button className="shrink-0 text-purple-600 hover:text-purple-700 transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    {/* Divider */}
                    <div
                      className="h-px mx-3"
                      style={{
                        background: `linear-gradient(to right, ${accentColor}40, ${accentColor}15, transparent)`,
                      }}
                    />
                    <div className="px-3 py-2 space-y-0.5">
                      {category.bundleOverrides.map((override, index) => (
                        <div
                          key={override.id}
                          className="flex items-center justify-between py-1 group/row"
                        >
                          <div className="flex items-center gap-1 min-w-0">
                            <div className="flex flex-col shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity">
                              <button
                                disabled={index === 0}
                                className="text-gray-400 hover:text-purple-600 disabled:opacity-20"
                              >
                                <ChevronUp className="h-2.5 w-2.5" />
                              </button>
                              <button
                                disabled={
                                  index === category.bundleOverrides.length - 1
                                }
                                className="text-gray-400 hover:text-purple-600 disabled:opacity-20"
                              >
                                <ChevronDown className="h-2.5 w-2.5" />
                              </button>
                            </div>
                            <span
                              className="truncate text-gray-600 dark:text-gray-400"
                              style={{ fontSize: "0.52rem" }}
                            >
                              {override.bundle.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span
                              style={{ fontSize: "0.4rem" }}
                              onClick={() =>
                                navigate("preview", {
                                  state: { override },
                                })
                              }
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 cursor-pointer hover:bg-amber-100 transition-colors"
                            >
                              <Eye className="h-2.5 w-2.5" /> preview
                            </span>
                            <button
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors"
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#9ca3af",
                                fontSize: "0.4rem",
                              }}
                            >
                              <Unlock className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
                style={{ fontSize: "0.56rem", borderColor: `${accentColor}40` }}
              >
                <Plus className="h-3.5 w-3.5" /> Add Category
              </button>
            </div>
          </div>
        </motion.section>
        {/* section 2 */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.05,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="relative rounded-2xl overflow-hidden group"
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${accentColor}15, transparent 60%)`,
            }}
          />
          <div className="rounded-2xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm transition-shadow duration-300">
            <div className="flex items-center p-4 gap-3 border-b border-gray-50/80 dark:border-gray-800/40">
              {/* Colored accent bar on the left */}
              <div
                className="w-1.5 h-5 rounded-full origin-center transition-transform duration-300 ease-out group-hover:scale-y-125"
                style={{
                  background: `linear-gradient(180deg, ${accentColor}, ${accentColor}60)`,
                }}
              />
              <div className="flex flex-col">
                <h3 className="text-gray-900 dark:text-gray-100 text-sm">
                  Contract Form Groups
                </h3>

                <p className="text-gray-400 dark:text-gray-500 text-[0.6rem] mt-0.5">
                  Organised form groups with default and lock controls for
                  cross-bundle inheritance.
                </p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-end mb-3">
                <span
                  className="text-gray-400 dark:text-gray-500"
                  style={{ fontSize: "0.48rem" }}
                >
                  {formGroups.length} group{formGroups.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {formGroups.map((group) => (
                  <div
                    key={group._id}
                    className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-gray-900/20 hover:border-purple-200 dark:hover:border-purple-800 transition-colors group/card"
                  >
                    {/* Group card header */}
                    <div className="flex items-center justify-between px-3 pt-3 pb-2 gap-1">
                      <div className="flex items-center gap-1.5 min-w-0 group/name">
                        <span
                          className={`truncate text-gray-800 dark:text-gray-200 uppercase`}
                        >
                          {group.name}
                        </span>
                        <button className="shrink-0 opacity-0 group-hover/name:opacity-100 transition-opacity text-gray-400 hover:text-purple-600">
                          <Pencil className="h-2.5 w-2.5" />
                        </button>
                      </div>
                      <button className="shrink-0 text-purple-600 hover:text-purple-700 transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Divider */}
                    <div
                      className="h-px mx-3"
                      style={{
                        background: `linear-gradient(to right, ${accentColor}40, ${accentColor}15, transparent)`,
                      }}
                    />
                    <div className="px-3 py-2 space-y-0.5">
                      {group.forms.map((form, formIndex) => (
                        <div
                          key={form.key}
                          className="flex items-center justify-between py-1 group/row"
                        >
                          <div className="flex items-center gap-1 min-w-0">
                            <div className="flex flex-col shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity">
                              <button
                                disabled={formIndex === group.forms.length - 1}
                                className="text-gray-400 hover:text-purple-600 disabled:opacity-20"
                              >
                                <ChevronDown className="h-2.5 w-2.5" />
                              </button>
                            </div>
                            <Lock className="h-2.5 w-2.5 text-amber-500 shrink-0" />
                            <span
                              className="truncate text-gray-600 dark:text-gray-400"
                              style={{ fontSize: "0.52rem" }}
                            >
                              {form.name}
                            </span>
                            <span
                              className="shrink-0 px-1 py-px rounded uppercase tracking-wider text-white"
                              style={{
                                fontSize: "0.36rem",
                                background: accentColor,
                              }}
                            >
                              Default
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Review button */}
                            <span
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 cursor-pointer hover:bg-amber-100 transition-colors"
                              style={{ fontSize: "0.4rem" }}
                            >
                              <Eye className="h-2.5 w-2.5" /> Review
                            </span>
                            <button
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors"
                              style={
                                form.isDefault
                                  ? {
                                      backgroundColor: `${accentColor}25`,
                                      color: accentColor,
                                      fontSize: "0.4rem",
                                    }
                                  : {
                                      backgroundColor: "#f3f4f6",
                                      color: "#9ca3af",
                                      fontSize: "0.4rem",
                                    }
                              }
                            >
                              <Shield className="h-2.5 w-2.5" />
                              {form.isDefault ? "Unset" : "Default"}
                            </button>
                            <button
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors"
                              style={
                                form.isLocked
                                  ? {
                                      backgroundColor: "#fef3c7",
                                      color: "#b45309",
                                      fontSize: "0.4rem",
                                    }
                                  : {
                                      backgroundColor: "#f3f4f6",
                                      color: "#9ca3af",
                                      fontSize: "0.4rem",
                                    }
                              }
                            >
                              {form.isLocked ? (
                                <Lock className="h-2.5 w-2.5" />
                              ) : (
                                <Unlock className="h-2.5 w-2.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Form rows */}
                  </div>
                ))}
              </div>

              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed text-gray-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
                style={{ fontSize: "0.56rem", borderColor: `${accentColor}40` }}
              >
                <Plus className="h-3.5 w-3.5" /> Add Group
              </button>
            </div>
          </div>
        </motion.section>
        {/* section 3  */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.05,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="relative rounded-2xl overflow-hidden group"
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${accentColor}15, transparent 60%)`,
            }}
          />
          <div className="rounded-2xl bg-card border border-gray-100/80 dark:border-gray-800/50 shadow-sm transition-shadow duration-300">
            <div className="flex items-center p-4 gap-3 border-b border-gray-50/80 dark:border-gray-800/40">
              {/* Colored accent bar on the left */}
              <div
                className="w-1.5 h-5 rounded-full origin-center transition-transform duration-300 ease-out group-hover:scale-y-125"
                style={{
                  background: `linear-gradient(180deg, ${accentColor}, ${accentColor}60)`,
                }}
              />
              <div className="flex flex-col">
                <h3 className="text-gray-900 dark:text-gray-100 text-sm">
                  Contract Template Bundles
                </h3>
              </div>
            </div>
            <div className="p-4">
              {/* Toggle pills */}
              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                {/* All pill */}
                <button
                  onClick={() => setActiveCategory("all")}
                  className="px-2.5 py-1 rounded-full transition-all"
                  style={
                    activeCategory === "all"
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
                  All
                </button>

                {/* One pill per category */}
                {categories.map((cat) => (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(activeCategory === "all"
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
                      })) ?? [])
                ).map((bundle) => (
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
                          style={{ fontSize: "0.52rem" }}
                        >
                          {bundle.bundleName}
                        </span>
                      </div>
                      <span
                        className="shrink-0 ml-2 px-2 py-0.5 rounded-full border uppercase tracking-wider whitespace-nowrap"
                        style={{
                          borderColor: `${accentColor}50`,
                          color: accentColor,
                          fontSize: "0.38rem",
                        }}
                      >
                        {bundle.engagementType}
                      </span>
                    </div>

                    {/* Divider */}
                    <div
                      className="h-px mx-3"
                      style={{
                        background: `linear-gradient(to right, ${accentColor}60, ${accentColor}20, transparent)`,
                      }}
                    />

                    <div className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {(bundle.forms || []).map((form) => (
                          <div
                            key={form.formKey}
                            className="flex items-center gap-0.5 px-1.5 py-1 rounded-md 
                  bg-indigo-50 dark:bg-indigo-900/20 
                  border border-indigo-200 dark:border-indigo-800"
                          >
                            {form.isLocked ? (
                              <Lock className="h-2 w-2 text-amber-500" />
                            ) : (
                              <Shield className="h-2 w-2 text-indigo-400" />
                            )}
                            <span
                              className="text-indigo-700 dark:text-indigo-400 uppercase tracking-wide"
                              style={{ fontSize: "0.38rem" }}
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
            </div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
}

export default ContractsFormsSettings;

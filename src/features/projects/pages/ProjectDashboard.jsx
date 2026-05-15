// src/features/projects/pages/ProjectDashboard.jsx
import { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Calendar, FileText, Clock, MessageSquare, DollarSign, ShoppingCart,
  Truck, Play, Car, MapPin, Cloud, Star, Clapperboard, Archive, Shirt,
  UtensilsCrossed, ScrollText, ClipboardList, Package, PawPrint, Megaphone,
  BarChart2, FileSearch, Users, UserCheck, Wallet, FolderOpen, PenLine,
  Lock, Loader2, Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "../../../shared/components/PageHeader";
import { Button } from "../../../shared/components/ui/button";
import {
  getProjectByIdThunk,
  getAllProjectsThunk,
  submitProjectForApprovalThunk,
} from "../store/project.thunks";
import { clearSuccessMessage, clearError } from "../store/project.slice";

// ── App registry ──────────────────────────────────────────────────────────────
const ALL_APPS = [
  { id: "calendar",     name: "CALENDAR",           icon: Calendar,        notifications: 3  },
  { id: "callsheets",   name: "CALL SHEETS",        icon: FileText,        notifications: 7  },
  { id: "schedule",     name: "SHOOTING SCHEDULE",  icon: Clapperboard,    notifications: 2  },
  { id: "asset",        name: "ASSET",              icon: Archive                            },
  { id: "costume",      name: "COSTUME",            icon: Shirt,           notifications: 1  },
  { id: "catering",     name: "CATERING",           icon: UtensilsCrossed                    },
  { id: "accounts",     name: "ACCOUNTS",           icon: DollarSign,      notifications: 5  },
  { id: "script",       name: "SCRIPT",             icon: ScrollText,      notifications: 1  },
  { id: "market",       name: "MARKET",             icon: ShoppingCart                       },
  { id: "transport",    name: "TRANSPORT",          icon: Truck                              },
  { id: "eplayer",      name: "E PLAYER",           icon: Play                               },
  { id: "forms",        name: "FORMS",              icon: ClipboardList                      },
  { id: "props",        name: "PROPS",              icon: Package                            },
  { id: "animals",      name: "ANIMALS",            icon: PawPrint                           },
  { id: "vehicles",     name: "VEHICLES",           icon: Car                                },
  { id: "locations",    name: "LOCATIONS",          icon: MapPin,          notifications: 2  },
  { id: "cloud",        name: "CLOUD",              icon: Cloud                              },
  { id: "timesheets",   name: "TIMESHEETS",         icon: Clock,           notifications: 12 },
  { id: "noticeboard",  name: "NOTICE BOARD",       icon: Megaphone,       notifications: 4  },
  { id: "chat",         name: "PROJECT CHAT",       icon: MessageSquare,   notifications: 18 },
  { id: "breakdown",    name: "SCRIPT BREAKDOWN",   icon: FileSearch                         },
  { id: "reports",      name: "PRODUCTION REPORTS", icon: BarChart2,       notifications: 1  },
  { id: "casting",      name: "CASTING CALLS",      icon: Star                               },
  { id: "crew",         name: "CREW",               icon: Users,           notifications: 3  },
  { id: "cast",         name: "CAST",               icon: UserCheck                          },
  { id: "budget",       name: "BUDGET",             icon: Wallet,          notifications: 2  },
  { id: "documents",    name: "DOCUMENTS",          icon: FolderOpen                         },
  { id: "eearth_sign",  name: "EAARTH SIGN",        icon: PenLine                            },
  { id: "petty_cash",   name: "PETTY CASH",         icon: DollarSign                         },
  { id: "fuel_mileage", name: "FUEL & MILEAGE",     icon: Car                                },
];

const APP_ROUTE_MAP = {
  calendar: "calendar", callsheets: "call-sheets", schedule: "calendar/shooting",
  asset: "asset", costume: "costume", catering: "catering", accounts: "accounts",
  script: "script", market: "market", transport: "transport", eplayer: "eplayer",
  forms: "forms", props: "props", animals: "animals", vehicles: "vehicles",
  locations: "locations", cloud: "cloud", timesheets: "timesheets",
  noticeboard: "noticeboard", chat: "chat", breakdown: "breakdown",
  reports: "reports", casting: "casting", crew: "crew", cast: "cast",
  budget: "budget", documents: "documents", eearth_sign: "eaarth-sign",
  petty_cash: "petty-cash", fuel_mileage: "fuel-mileage",
};

function toSlug(name = "") { return name.toLowerCase().replace(/\s+/g, "-"); }
function matchesSlug(p, slug) {
  return toSlug(p?.productionName ?? "") === slug || p?._id === slug;
}

// ── App card ──────────────────────────────────────────────────────────────────
function AppCard({ app, projectName, isApproved, index, color = "#7c3aed" }) {
  const Icon = app.icon;
  const count    = app.notifications || 0;
  const disabled = !isApproved;

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: index * 0.018 }}
      className={`relative group flex flex-col items-center justify-center gap-3 p-4 rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed select-none" : "hover:-translate-y-1 hover:shadow-md cursor-pointer"
      }`}
    >
      {!disabled && (
        <div className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full opacity-0 transition-opacity group-hover:opacity-100" style={{ backgroundColor: color }} />
      )}
      {disabled && (
        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700/80">
          <Lock className="h-2.5 w-2.5 text-gray-400" />
        </div>
      )}
      <div className="relative">
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-transform ${!disabled ? "group-hover:scale-110" : ""}`}
          style={{ backgroundColor: disabled ? "rgba(100,100,100,0.12)" : `${color}1A`, color: disabled ? "#6b7280" : color }}
        >
          <Icon className="w-5 h-5" />
        </div>
        {count > 0 && !disabled && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.15 + index * 0.018 }}
            className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 rounded-full bg-destructive text-primary-foreground text-[10px] font-semibold ring-2 ring-card"
          >
            {count > 9 ? "9+" : count}
          </motion.span>
        )}
      </div>
      <span className="text-xs text-center text-muted-foreground">{app.name}</span>
    </motion.div>
  );

  if (disabled) return inner;
  return <Link to={`/projects/${projectName}/${APP_ROUTE_MAP[app.id] || app.id}`}>{inner}</Link>;
}

// ── Main ──────────────────────────────────────────────────────────────────────
function ProjectDashboard() {
  const { projectName } = useParams();
  const location        = useLocation();
  const navigate        = useNavigate();
  const dispatch        = useDispatch();

  const { currentProject, projects, isFetchingDetails, isSubmitting, successMessage, error } =
    useSelector((s) => s.project);

  const slug = projectName?.toLowerCase();

  const effectiveProduction =
    (currentProject && matchesSlug(currentProject, slug) ? currentProject : null) ??
    (location.state?.production && matchesSlug(location.state.production, slug) ? location.state.production : null);

  useEffect(() => {
    if (effectiveProduction) return;
    const found = projects.find((p) => matchesSlug(p, slug));
    if (found?._id) { dispatch(getProjectByIdThunk(found._id)); return; }
    if (location.state?.production?._id) { dispatch(getProjectByIdThunk(location.state.production._id)); return; }
    dispatch(getAllProjectsThunk({}));
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (location.state?.production?._id) {
      if (currentProject?._id !== location.state.production._id) {
        dispatch(getProjectByIdThunk(location.state.production._id));
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (successMessage) { toast.success(successMessage); dispatch(clearSuccessMessage()); }
  }, [successMessage]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error]);

  const production     = effectiveProduction ?? currentProject;
  const isApproved     = production?.approvalStatus === "approved";
  const color          = "#7c3aed";
  const appsToShow     = production
    ? ALL_APPS.filter((a) => (production.applications ?? []).includes(a.id))
    : [];

  // ── Only show this button when status is draft ────────────────────────────
  const showSendButton = production?.approvalStatus === "draft";

  return (
    <div className="space-y-6 mx-auto">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title={production?.productionName?.toUpperCase() ?? "PROJECT DASHBOARD"}
          subtitle={production?.productionType?.toUpperCase()}
          icon="Film"
          secondaryActions={[]}
        />

        {showSendButton && (
          <div className="pt-1 shrink-0">
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={() => dispatch(submitProjectForApprovalThunk(production._id))}
              className="gap-2"
            >
              {isSubmitting
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />
              }
              {isSubmitting ? "SENDING..." : "SEND TO ADMIN"}
            </Button>
          </div>
        )}
      </div>

      {isFetchingDetails && !production && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {production && (
        appsToShow.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {appsToShow.map((app, i) => (
              <AppCard key={app.id} app={app} projectName={projectName} isApproved={isApproved} index={i} color={color} />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-8">
            NO APPLICATIONS WERE SELECTED DURING SETUP. EDIT THE PRODUCTION TO ADD APPS.
          </p>
        )
      )}

      {!production && !isFetchingDetails && (
        <div className="text-center py-16 text-muted-foreground text-sm">
          PRODUCTION NOT FOUND.
        </div>
      )}
    </div>
  );
}

export default ProjectDashboard;
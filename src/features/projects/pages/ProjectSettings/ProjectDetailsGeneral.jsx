import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Check, Sun, Moon, Monitor, Lock, Unlock, Settings2,
  Palette, LayoutGrid, AppWindow, Rocket, Shield, ChevronRight,
  ChevronLeft, MessageCircle, Brain,
  CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/app/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Checkbox } from "@/app/components/ui/checkbox";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/app/components/ui/tooltip";

/* =========================================================
   PROJECT DETAILS TAB
========================================================= */

export function ProjectDetails() {
  const [projectName, setProjectName] = useState("");
  const [productionCompany, setProductionCompany] = useState("");
  const [projectType, setProjectType] = useState("Feature Film");
  const [showProjectTypeInOffers, setShowProjectTypeInOffers] = useState(true);
  const [legalTerritory, setLegalTerritory] = useState("United Kingdom");
  const [unionAgreement, setUnionAgreement] = useState("PACT/BECTU Agreement (2021)");
  const [constructionUnionAgreement, setConstructionUnionAgreement] = useState("None");
  const [budgetLevel, setBudgetLevel] = useState("Major (over £30 million)");
  const [showBudgetToCrew, setShowBudgetToCrew] = useState(false);

  const [genre, setGenre] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");

  const [producer, setProducer] = useState("");
  const [director, setDirector] = useState("");
  const [productionManager, setProductionManager] = useState("");

  return (
    <div className="max-w-[1500px] mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Project Details</h1>
          <p className="text-muted-foreground mt-1">
            Manage your project information and settings
          </p>
        </div>

        <Button className="bg-primary hover:bg-primary/90">
          Save Changes
        </Button>
      </div>

      {/* BASIC INFO */}
      <section className="bg-white rounded-xl shadow-sm border p-5 mb-5">
        <h2 className="text-xl font-semibold mb-5">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <Label>Project Name *</Label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>

          <div>
            <Label>Production Company *</Label>
            <Input
              value={productionCompany}
              onChange={(e) => setProductionCompany(e.target.value)}
            />
          </div>

          <div>
            <Label>Genre</Label>
            <Input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </section>

      {/* PROJECT CONFIG */}
      <section className="bg-white rounded-xl shadow-sm border p-5 mb-5">

        <h2 className="text-xl font-semibold mb-5">Project Configuration</h2>

        {/* PROJECT TYPE */}
        <div className="mb-5">

          <div className="flex items-center gap-2 mb-3">
            <Label>Project Type</Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                Select production type
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setProjectType("Feature Film")}
              className={`px-6 py-2 rounded-md border-2 ${
                projectType === "Feature Film"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-300"
              }`}
            >
              Feature Film
            </button>

            <button
              onClick={() => setProjectType("Television")}
              className={`px-6 py-2 rounded-md border-2 ${
                projectType === "Television"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-300"
              }`}
            >
              Television
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Checkbox
              checked={showProjectTypeInOffers}
              onCheckedChange={(checked) =>
                setShowProjectTypeInOffers(!!checked)
              }
            />
            <Label>Show project type in offers?</Label>
          </div>
        </div>

        {/* LEGAL TERRITORY */}
        <div className="mb-5">
          <Label className="mb-3 block">Legal Territory</Label>

          <div className="flex flex-wrap gap-3">
            {["United Kingdom", "Ireland", "Malta"].map((territory) => (
              <button
                key={territory}
                onClick={() => setLegalTerritory(territory)}
                className={`px-6 py-2 border rounded-md ${
                  legalTerritory === territory
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-300"
                }`}
              >
                {territory}
              </button>
            ))}
          </div>
        </div>

        {/* UNION */}
        <div className="mb-5">

          <Label>Union Agreement</Label>

          <RadioGroup
            value={unionAgreement}
            onValueChange={setUnionAgreement}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="None" />
              <Label>None</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="PACT/BECTU Agreement (2021)" />
              <Label>PACT/BECTU Agreement (2021)</Label>
            </div>
          </RadioGroup>

        </div>

        {/* BUDGET */}
        <div>

          <Label>Budget Level</Label>

          <Select value={budgetLevel} onValueChange={setBudgetLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Major (over £30 million)">
                Major
              </SelectItem>
              <SelectItem value="Medium (£15-30 million)">
                Medium
              </SelectItem>
              <SelectItem value="Low (under £15 million)">
                Low
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 mt-4">
            <Checkbox
              checked={showBudgetToCrew}
              onCheckedChange={(checked) =>
                setShowBudgetToCrew(!!checked)
              }
            />
            <Label>Show budget to crew?</Label>
          </div>

        </div>

      </section>
    </div>
  );
}

/* =========================================================
   SETTINGS TAB SYSTEM
========================================================= */

const SETTINGS_MENU = [
  { id: "details", label: "Details" },
  { id: "style", label: "Style" },
  { id: "layout", label: "Layout" },
  { id: "apps", label: "Apps" }
];

const ALL_TAB_IDS = SETTINGS_MENU.map((t) => t.id);

export default function ProjectSettings() {

  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="max-w-full">

      {/* TAB BAR */}

      <div className="flex gap-3 mb-6">

        {SETTINGS_MENU.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg border ${
              activeTab === tab.id
                ? "bg-purple-600 text-white"
                : "bg-white"
            }`}
          >
            {tab.label}
          </button>
        ))}

      </div>

      {/* TAB CONTENT */}

      <AnimatePresence mode="wait">

        {activeTab === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProjectDetails />
          </motion.div>
        )}

        {activeTab === "style" && (
          <div className="p-10 text-gray-500">
            Style Settings
          </div>
        )}

        {activeTab === "layout" && (
          <div className="p-10 text-gray-500">
            Layout Settings
          </div>
        )}

        {activeTab === "apps" && (
          <div className="p-10 text-gray-500">
            App Settings
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
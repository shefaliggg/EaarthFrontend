import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import ViewToggleButton from "../../../../../shared/components/buttons/ViewToggleButton";
import { useState, useMemo, useEffect } from "react";
import DataTable from "../../../../../shared/components/tables/DataTable/DataTable";
import { DocumentTableColumns } from "../../../config/documentsTableConfig";
import { DocumentListCard } from "./components/DocumentListCard";
import { DocumentPreviewCard } from "./components/DocumentPreviewCard";
import SearchBar from "../../../../../shared/components/SearchBar";
import { SelectMenu } from "../../../../../shared/components/menus/SelectMenu";
import { useDispatch, useSelector } from "react-redux";
import {
  MODAL_TYPES,
  useModalStore,
} from "../../../../../shared/stores/useModalStore";
import FilterPillTabs from "../../../../../shared/components/FilterPillTabs";
import { DocumentPreviewCardSkeleton } from "./components/skeltons/DocumentPreviewCardSkeleton";
import StateDisplay from "../../../../../shared/components/StateDisplay";
import { DocumentListCardSkeleton } from "./components/skeltons/DocumentListCardSkeleton";
import { useDocumentActions } from "../../../../user-documents/hooks/useDocumentActions";
import { fetchDocumentsThunk } from "../../../../user-documents/store/document.thunk";
import { InfoPanel } from "../../../../../shared/components/panels/InfoPanel";
import { Archive, Trash2 } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Last Added", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Used", value: "most_used" },
  { label: "Least Used", value: "least_used" },
  { label: "A → Z", value: "az" },
  { label: "Z → A", value: "za" },
];

const CATEGORY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Identity", value: "IDENTITY" },
  { label: "Address", value: "ADDRESS" },
  { label: "Finance", value: "FINANCE" },
  { label: "Vehicle", value: "VEHICLE" },
  { label: "Company", value: "COMPANY" },
  { label: "Signature", value: "SIGNATURE" },
  { label: "General", value: "GENERAL" },
];

const VIEW_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
  { label: "Trash", value: "trash" },
];

export default function DocumentsDetails({
  profile,
  setProfile,
  isEditing,
  setIsEditing,
}) {
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("active");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const dispatch = useDispatch();

  const {
    userDocuments = [],
    isFetching: isFetchingDocs,
    error,
  } = useSelector((state) => state.userDocuments);
  const { openModal } = useModalStore();

  useEffect(() => {
    dispatch(
      fetchDocumentsThunk(
        viewMode === "trash" ? { includeDeleted: "true" } : {},
      ),
    );
  }, [viewMode, view]);

  // ── filter + search ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = [...(userDocuments || [])];

    // 🔹 View mode filter
    if (viewMode === "trash") {
      data = data.filter((doc) => doc.isDeleted === true);
    } else if (viewMode === "active") {
      data = data.filter((doc) => !doc.isDeleted && doc.status !== "ARCHIVED");
    } else if (viewMode === "archived") {
      data = data.filter((doc) => !doc.isDeleted && doc.status === "ARCHIVED");
    }

    // 🔹 Category filter
    if (selectedCategory !== "all") {
      data = data.filter((doc) => doc.documentPurpose === selectedCategory);
    }

    // 🔹 Search filter
    const term = search.toLowerCase();
    if (term) {
      data = data.filter(
        (doc) =>
          doc.originalName?.toLowerCase().includes(term) ||
          doc.documentType?.toLowerCase().includes(term) ||
          doc.label?.toLowerCase().includes(term),
      );
    }

    // 🔹 Sorting
    switch (sortBy) {
      case "latest":
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "most_used":
        data.sort((a, b) => (b.usage?.length || 0) - (a.usage?.length || 0));
        break;
      case "least_used":
        data.sort((a, b) => (a.usage?.length || 0) - (b.usage?.length || 0));
        break;
      case "az":
        data.sort((a, b) => {
          const nameA = a.label || a.originalName || a.documentType || "";
          const nameB = b.label || b.originalName || b.documentType || "";

          return nameA.localeCompare(nameB, undefined, {
            sensitivity: "base",
          });
        });
        break;
      case "za":
        data.sort((a, b) => {
          const nameA = a.label || a.originalName || a.documentType || "";
          const nameB = b.label || b.originalName || b.documentType || "";

          return nameB.localeCompare(nameA, undefined, {
            sensitivity: "base",
          });
        });
        break;
    }

    return data;
  }, [userDocuments, search, selectedCategory, viewMode, sortBy]);

  // ── preview handler ──────────────────────────────────────────────────────────
  const handleViewDocument = (doc) => {
    if (!doc.url) return;
    const isImage = doc.mimeType?.startsWith("image/");

    if (isImage) {
      openModal(MODAL_TYPES.IMAGE_PREVIEW, { imageFile: { url: doc.url } });
    } else {
      openModal(MODAL_TYPES.DOCUMENT_PREVIEW, {
        fileUrl: doc.url,
        fileName: doc.originalName,
      });
    }
  };

  const columns = DocumentTableColumns({
    onView: handleViewDocument,
  });

  return (
    <CardWrapper
      title="Provided Documents"
      subtitle="Manage your provided important documents securely."
      icon="FileText"
      actions={
        <ViewToggleButton view={view} onViewChange={setView} showTable />
      }
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <SearchBar
          placeholder="Search documents…"
          value={search}
          onValueChange={setSearch}
        />
        <div className="flex items-center gap-3 flex-wrap">
          <SelectMenu
            label="Category"
            items={CATEGORY_OPTIONS}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            className="w-40 bg-background border-1 border-border! h-9!"
          />

          <SelectMenu
            label="Sort"
            items={SORT_OPTIONS}
            selected={sortBy}
            onSelect={setSortBy}
            className="w-40 bg-background border-1 border-border! h-9!"
          />
          <FilterPillTabs
            options={VIEW_OPTIONS}
            value={viewMode}
            onChange={setViewMode}
            transparentBg={false}
          />
        </div>
      </div>

      {viewMode === "archived" && (
        <InfoPanel
          title="Archived documents"
          icon={Archive}
          variant="warning"
          dismissible
          storageKey="hide_archived_info"
        >
          <ul className="list-disc pl-4 space-y-1">
            <li>Removed from active use but kept safely stored</li>
            <li>
              Automatically moved to trash after{" "}
              <span className="font-medium">6 months</span> if no action is
              taken
            </li>
            <li>Can be restored anytime before moving to trash</li>
          </ul>
        </InfoPanel>
      )}

      {viewMode === "trash" && (
        <InfoPanel
          title="Trash"
          icon={Trash2}
          variant="danger"
          dismissible
          storageKey="hide_trash_info"
        >
          <ul className="list-disc pl-4 space-y-1">
            <li>Scheduled for permanent deletion</li>
            <li>
              Automatically removed after{" "}
              <span className="font-medium">30 days</span>
            </li>
            <li>Can be restored anytime before deletion</li>
          </ul>
        </InfoPanel>
      )}

      {/* ── Views ── */}
      {view === "table" && (
        <DataTable
          data={filtered}
          columns={columns}
          currentPage={1}
          ItemsPerPage={10}
          totalItemsSize={filtered?.length}
          setItemsPerPage={() => {}}
          onPageChange={() => {}}
          loading={isFetchingDocs}
          error={error}
          emptyStateConfig={
            viewMode === "archived"
              ? {
                  title: "No archived documents",
                  description:
                    "Archived documents will appear here once you move them.",
                }
              : null
          }
          hideExport
          hidePagination
          rowClassName={(row) =>
            row.isDeleted
              ? "bg-red-50/60 hover:bg-red-100/70 dark:bg-red-900/10"
              : ""
          }
        />
      )}

      {view === "list" && (
        <div className="flex flex-col gap-3 pt-2">
          {/* 🔹 Loading */}
          {isFetchingDocs &&
            Array.from({ length: 6 }).map((_, i) => (
              <DocumentListCardSkeleton key={i} />
            ))}

          {/* 🔹 Error */}
          {!isFetchingDocs && error && (
            <StateDisplay
              type="error"
              title="Failed to load documents"
              description="Please try again or refresh."
            />
          )}

          {/* 🔹 Empty */}
          {!isFetchingDocs && !error && filtered.length === 0 && (
            <StateDisplay
              type="empty"
              icon={viewMode === "archived" ? "Archive" : "FileText"}
              title={
                viewMode === "archived"
                  ? "No archived documents"
                  : "No documents found"
              }
              description={
                viewMode === "archived"
                  ? "Archived documents will appear here."
                  : "Try adjusting your filters or upload a new document."
              }
            />
          )}

          {/* 🔹 Data */}
          {!isFetchingDocs &&
            !error &&
            filtered.length > 0 &&
            filtered.map((doc) => (
              <DocumentListCard
                key={doc._id}
                row={doc}
                onView={handleViewDocument}
              />
            ))}
        </div>
      )}

      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4 pt-2">
          {/* 🔹 Loading */}
          {isFetchingDocs &&
            Array.from({ length: 8 }).map((_, i) => (
              <DocumentPreviewCardSkeleton key={i} />
            ))}

          {/* 🔹 Error */}
          {!isFetchingDocs && error && (
            <div className="col-span-full">
              <StateDisplay
                type="error"
                title="Failed to load documents"
                description="Something went wrong while fetching data."
              />
            </div>
          )}

          {/* 🔹 Empty */}
          {!isFetchingDocs && !error && filtered.length === 0 && (
            <div className="col-span-full">
              <StateDisplay
                type="empty"
                icon={viewMode === "archived" ? "Archive" : "FileText"}
                title={
                  viewMode === "archived"
                    ? "No archived documents"
                    : "No documents found"
                }
                description="Try adjusting filters or upload a document."
              />
            </div>
          )}

          {/* 🔹 Data */}
          {!isFetchingDocs &&
            !error &&
            filtered.length > 0 &&
            filtered.map((doc) => (
              <DocumentPreviewCard
                key={doc._id}
                row={doc}
                onView={handleViewDocument}
              />
            ))}
        </div>
      )}
    </CardWrapper>
  );
}

import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import ViewToggleButton from "../../../../../shared/components/buttons/ViewToggleButton";
import { useState, useMemo } from "react";
import DataTable from "../../../../../shared/components/tables/DataTable/DataTable";
import { DocumentTableColumns } from "../../../config/documentsTableConfig";
import { DocumentListCard } from "./components/DocumentListCard";
import { DocumentPreviewCard } from "./components/DocumentPreviewCard";
import SearchBar from "../../../../../shared/components/SearchBar";
import { SelectMenu } from "../../../../../shared/components/menus/SelectMenu";
import { useSelector } from "react-redux";
import {
  MODAL_TYPES,
  useModalStore,
} from "../../../../../shared/stores/useModalStore";
import FilterPillTabs from "../../../../../shared/components/FilterPillTabs";

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

export default function DocumentsDetails({
  profile,
  setProfile,
  isEditing,
  setIsEditing,
}) {
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { userDocuments = [], isFetching: isFetchingDocs } = useSelector(
    (state) => state.userDocuments,
  );
  const { openModal } = useModalStore();

  // ── filter + search ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return userDocuments?.filter((doc) => {
      const matchesCategory =
        selectedCategory === "all" || doc.documentPurpose === selectedCategory;

      const term = search.toLowerCase();
      const matchesSearch =
        !term ||
        doc.originalName?.toLowerCase().includes(term) ||
        doc.documentType?.toLowerCase().includes(term) ||
        doc.label?.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [userDocuments, search, selectedCategory]);

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
      <div className="flex items-center  gap-3">
        <SearchBar
          placeholder="Search documents…"
          value={search}
          onValueChange={setSearch}
        />
        <FilterPillTabs
          options={CATEGORY_OPTIONS}
          value={selectedCategory}
          onChange={setSelectedCategory}
          transparentBg={false}
          // fullWidth
        />
        {/* <SelectMenu
          label="All"
          items={CATEGORY_OPTIONS}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          className="w-40 bg-background border h-10! border-border rounded-3xl"
        /> */}
      </div>

      {/* ── Views ── */}
      {view === "table" && (
        <DataTable
          data={filtered}
          columns={DocumentTableColumns({ onView: handleViewDocument })}
          currentPage={1}
          ItemsPerPage={10}
          totalItemsSize={filtered?.length}
          setItemsPerPage={() => {}}
          onPageChange={() => {}}
          loading={isFetchingDocs}
          hideExport
          hidePagination
        />
      )}

      {view === "list" && (
        <div className="flex flex-col gap-3 pt-2">
          {filtered.map((doc) => (
            <DocumentListCard
              key={doc._id}
              row={doc}
              onView={handleViewDocument}
            />
          ))}
        </div>
      )}

      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pt-2">
          {filtered.map((doc) => (
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

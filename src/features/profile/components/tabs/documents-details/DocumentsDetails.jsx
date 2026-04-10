import CardWrapper from "@/shared/components/wrappers/CardWrapper";
import EditToggleButtons from "@/shared/components/buttons/EditToggleButtons";
import EditableTextDataField from "@/shared/components/wrappers/EditableTextDataField";
import ViewToggleButton from "../../../../../shared/components/buttons/ViewToggleButton";
import { useState } from "react";
import DataTable from "../../../../../shared/components/tables/DataTable/DataTable";
import { DocumentTableColumns } from "../../../config/documentsTableConfig";
import { DocumentListCard } from "./components/DocumentListCard";
import { DocumentPreviewCard } from "./components/DocumentPreviewCard";
import SearchBar from "../../../../../shared/components/SearchBar";
import { SelectMenu } from "../../../../../shared/components/menus/SelectMenu";

const documentsDummyData = [
  {
    documentName: "PASSPORT_SHEFALI_GAJBHIYE.pdf",
    fileSize: "3.2 MB",
    type: "passport",
    uploadDate: "15/01/2024",
    expiryDate: "01/01/2025",
    status: "expired",
    shared: false,
  },
  {
    documentName: "VISA_SHEFALI_GAJBHIYE.pdf",
    fileSize: "2.1 MB",
    type: "visa",
    uploadDate: "10/01/2024",
    expiryDate: "15/06/2024",
    status: "expired",
    shared: true,
  },
  {
    documentName: "DRIVING_LICENSE_SHEFALI_GAJBHIYE.jpg",
    fileSize: "1.8 MB",
    type: "driving_license",
    uploadDate: "08/01/2024",
    expiryDate: "20/12/2025",
    status: "expired",
    shared: false,
  },
  {
    documentName: "INSURANCE_SHEFALI_GAJBHIYE.pdf",
    fileSize: "890 KB",
    type: "insurance",
    uploadDate: "05/01/2024",
    expiryDate: "31/12/2024",
    status: "expired",
    shared: false,
  },
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

  const CATEGORY_OPTIONS = [
    { label: "All", value: "all" },
    { label: "Identity", value: "identity" },
    { label: "Insurance", value: "insurance" },
    { label: "Financial", value: "financial" },
    { label: "Tax", value: "tax" },
    { label: "Contracts", value: "contracts" },
  ];
  return (
    <CardWrapper
      title={"Provided Documents"}
      subtitle={"Manage your provided important documents securely."}
      icon={"FileText"}
      actions={
        <>
          <ViewToggleButton view={view} onViewChange={setView} showTable />
        </>
      }
    >
      <div className="flex items-center gap-3">
        <SearchBar
          placeholder="Search documents…"
          value={search}
          onValueChange={setSearch}
        />
        <SelectMenu
          label="All"
          items={CATEGORY_OPTIONS}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          className="w-40 bg-background border h-10! border-border rounded-3xl"
        />
      </div>
      {view === "table" && (
        <DataTable
          data={documentsDummyData}
          columns={DocumentTableColumns()}
          currentPage={1}
          ItemsPerPage={10}
          totalItemsSize={documentsDummyData.length}
          setItemsPerPage={() => {}}
          onPageChange={() => {}}
          hideExport
          hidePagination
        />
      )}
      {view === "list" && (
        <div className="flex flex-col gap-3 pt-2">
          {documentsDummyData.map((row, index) => (
            <DocumentListCard key={index} row={row} />
          ))}
        </div>
      )}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pt-2">
          {documentsDummyData.map((row, index) => (
            <DocumentPreviewCard key={index} row={row} />
          ))}
        </div>
      )}
    </CardWrapper>
  );
}

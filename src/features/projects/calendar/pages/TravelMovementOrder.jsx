import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import TmoSidebar from "../components/tmo/TmoSidebar";
import TmoPreview from "../components/tmo/TmoPreview";
import TmoFormModal from "../components/tmo/TmoFormModal";
import useTmo from "../hooks/useTmo";

function TravelMovementOrder() {
  const { projectId: routeProjectId } = useParams();
  const validProjectId = "697c899668977a7ca2b27462";
  
  const { tmos, isLoading, isCreating, isUpdating, getTmos, createTmo, updateTmo, deleteTmo } = useTmo();

  const [searchText, setSearchText] = useState("");
  const [selectedTmo, setSelectedTmo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingTmo, setEditingTmo] = useState(null);

  useEffect(() => {
    getTmos(validProjectId);
  }, [validProjectId]);

  const filteredTmos = tmos.filter(
    (tmo) =>
      tmo.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      tmo.tmoCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      tmo.department?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleCreateNew = () => {
    setEditingTmo(null); 
    setIsModalOpen(true);
  };

  const handleEditTmo = (tmo, e) => {
    if (e) e.stopPropagation(); 
    setEditingTmo(tmo); 
    setIsModalOpen(true);
  };

  const handleDeleteTmo = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this TMO?")) return;

    try {
      const resultAction = await deleteTmo(id);
      if (resultAction.type.endsWith("fulfilled")) {
        toast.success("TMO deleted successfully");
        if (selectedTmo?._id === id || selectedTmo?.id === id) {
          setSelectedTmo(null);
        }
      } else {
        toast.error("Failed to delete TMO");
      }
    } catch (err) {
      toast.error("Error deleting TMO");
    }
  };

  const handleSaveTmo = async (data, attachments) => {
    try {
      const formData = new FormData();
      formData.append("projectId", validProjectId);
      formData.append("name", data.name);
      if (data.department) formData.append("department", data.department);
      if (data.status) formData.append("status", data.status);
      
      if (data.sections) formData.append("sections", JSON.stringify(data.sections));
      if (data.contacts) formData.append("contacts", JSON.stringify(data.contacts));

      attachments?.forEach((att) => {
        if (att.file) formData.append("attachments", att.file);
      });

      let resultAction;
      
      if (editingTmo?._id || editingTmo?.id) {
        const tmoId = editingTmo._id || editingTmo.id;
        resultAction = await updateTmo(tmoId, formData); 
      } else {
        resultAction = await createTmo(formData);
      }
      
      if (resultAction.type.endsWith("fulfilled")) {
        toast.success(editingTmo ? "TMO updated successfully" : "TMO created successfully");
        setIsModalOpen(false);
        setSelectedTmo(resultAction.payload); 
        setEditingTmo(null);
      } else {
        toast.error(resultAction.payload || "Failed to save TMO");
      }
    } catch (err) {
      toast.error("Error saving TMO");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-337px)] rounded-xl overflow-hidden border border-primary/20 bg-card shadow-lg">
        <TmoSidebar
          filteredTmos={filteredTmos}
          searchText={searchText}
          onSearchChange={setSearchText}
          selectedTmo={selectedTmo}
          onSelectTmo={setSelectedTmo}
          onCreateNew={handleCreateNew}
          onEditTmo={handleEditTmo}
          onDeleteTmo={handleDeleteTmo} 
          isLoading={isLoading}
        />
        <TmoPreview 
          selectedTmo={selectedTmo} 
          onCreateNew={handleCreateNew}
          onEditTmo={handleEditTmo} 
        />
      </div>

      <TmoFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTmo(null);
        }}
        onSave={handleSaveTmo}
        initialData={editingTmo}
        isSaving={isCreating || isUpdating}
      />
    </>
  );
}

export default TravelMovementOrder;
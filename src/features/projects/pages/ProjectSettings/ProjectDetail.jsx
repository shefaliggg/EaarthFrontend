import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Edit, Save, X } from "lucide-react";

export function ProjectDetails() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [projectName, setProjectName] = useState("");
  const [productionCompany, setProductionCompany] = useState("");
  const [genre, setGenre] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [producer, setProducer] = useState("");
  const [director, setDirector] = useState("");
  const [productionManager, setProductionManager] = useState("");
  const [description, setDescription] = useState("");
  const [otherProvisions, setOtherProvisions] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSave = () => {
    console.log("Saving project details...");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Helper to display field value or placeholder
  const renderFieldValue = (value, placeholder = "Enter value") => {
    return value ? <span className="font-semibold text-gray-900">{value}</span> : <span className="italic text-gray-400">{placeholder}</span>;
  };

  return (
    <div className="space-y-2 pb-3">
      {/* Basic Information Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        {/* Header with Edit/Save/Cancel Buttons */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold">📋</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Project Details</h2>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="default"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="default"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          // Edit Mode
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium uppercase text-gray-400 block mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-gray-400 block mb-1">Production Company</label>
                <input
                  type="text"
                  value={productionCompany}
                  onChange={(e) => setProductionCompany(e.target.value)}
                  placeholder="Enter production company"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-gray-400 block mb-1">Genre</label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="e.g., Drama, Action"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium uppercase text-gray-400 block mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-gray-400 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-gray-400 block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium uppercase text-gray-400 block mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium uppercase text-gray-400 block mb-1">Budget Amount</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium uppercase text-gray-400 block mb-1">Producer</label>
                <input
                  type="text"
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                  placeholder="Enter producer name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-gray-400 block mb-1">Director</label>
                <input
                  type="text"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  placeholder="Enter director name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase text-gray-400 block mb-1">Production Manager</label>
                <input
                  type="text"
                  value={productionManager}
                  onChange={(e) => setProductionManager(e.target.value)}
                  placeholder="Enter production manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium uppercase text-gray-400 block mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm placeholder:text-gray-300"
              />
            </div>
          </div>
        ) : (
          // View Mode
          <div className="space-y-3">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <p className="text-xs font-medium uppercase text-gray-400 mb-1">Project Name</p>
                {renderFieldValue(projectName, "Enter project name")}
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-400 mb-1">Production Company</p>
                {renderFieldValue(productionCompany, "Enter production company")}
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-400 mb-1">Genre</p>
                {renderFieldValue(genre, "Enter genre")}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
              <div>
                <p className="text-xs font-medium uppercase text-gray-400 mb-1">Location</p>
                {renderFieldValue(location, "Enter location")}
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-400 mb-1">Start Date</p>
                {renderFieldValue(startDate, "Not set")}
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-400 mb-1">End Date</p>
                {renderFieldValue(endDate, "Not set")}
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
              <div>
                <p className="text-xs font-medium uppercase text-gray-400 mb-1">Currency</p>
                {renderFieldValue(currency, "USD")}
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-medium uppercase text-gray-400 mb-1">Budget</p>
                {renderFieldValue(budget ? `${currency} ${budget}` : "", "Not set")}
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3">
              <div>
                <p className="text-xs font-medium uppercase text-gray-400 mb-1">Producer</p>
                {renderFieldValue(producer, "Not assigned")}
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-400 mb-1">Director</p>
                {renderFieldValue(director, "Not assigned")}
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-400 mb-1">Production Manager</p>
                {renderFieldValue(productionManager, "Not assigned")}
              </div>
            </div>

            {/* Row 5 */}
            <div className="pt-3">
              <p className="text-xs font-medium uppercase text-gray-400 mb-1">Description</p>
              {renderFieldValue(description, "No description")}
            </div>
          </div>
        )}
      </div>

      {/* Other Provisions Card */}
      {isEditing || otherProvisions ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <h3 className="font-semibold text-yellow-800 mb-2">Other Provisions</h3>
          <textarea
            value={otherProvisions}
            onChange={(e) => setOtherProvisions(e.target.value)}
            placeholder="Enter other provisions..."
            rows={isEditing ? "3" : "1"}
            className={`w-full px-3 py-2 placeholder:text-gray-300 ${isEditing ? 'border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm' : 'bg-transparent border-0 p-0'}`}
            readOnly={!isEditing}
          />
        </div>
      ) : null}

      {/* Additional Notes Card */}
      {isEditing || additionalNotes ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Enter additional notes..."
            rows={isEditing ? "3" : "1"}
            className={`w-full px-3 py-2 placeholder:text-gray-300 ${isEditing ? 'border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm' : 'bg-transparent border-0 p-0'}`}
            readOnly={!isEditing}
          />
        </div>
      ) : null}
    </div>
  );
}

export default ProjectDetails;
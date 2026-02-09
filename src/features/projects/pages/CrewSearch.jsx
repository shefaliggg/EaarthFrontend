import { useState, useMemo } from 'react';
import { Search, Shield, ShieldOff } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import CardWrapper from '@/shared/components/wrappers/CardWrapper';
import { PageHeader } from '@/shared/components/PageHeader';

function CrewSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  const crewData = [
    { id: 1, name: 'Sarah Johnson', role: 'Director of Photography', department: 'Camera', contract: 'Weekly', status: 'Standard', protection: false },
    { id: 2, name: 'Michael Chen', role: '1st AC', department: 'Camera', contract: 'Weekly', status: 'Penny contract', protection: true },
    { id: 3, name: 'Emily Rodriguez', role: 'Sound Mixer', department: 'Sound', contract: 'Weekly', status: 'Penny contract', protection: true },
    { id: 4, name: 'James Wilson', role: 'Key Grip', department: 'Grip', contract: 'Daily', status: 'Standard', protection: false },
    { id: 5, name: 'Lisa Anderson', role: 'Gaffer', department: 'Electric', contract: 'Weekly', status: 'Standard', protection: false },
    { id: 6, name: 'David Martinez', role: 'Production Designer', department: 'Art', contract: 'Weekly', status: 'Penny contract', protection: true },
    { id: 7, name: 'Jennifer Lee', role: 'Costume Designer', department: 'Costume', contract: 'Weekly', status: 'Standard', protection: false },
    { id: 8, name: 'Robert Taylor', role: '2nd AC', department: 'Camera', contract: 'Daily', status: 'Standard', protection: false },
  ];

  const departments = ['All Departments', ...new Set(crewData.map(crew => crew.department))];

  // Filter and search logic
  const filteredCrew = useMemo(() => {
    return crewData.filter(crew => {
      const matchesSearch = 
        crew.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crew.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = 
        selectedDepartment === 'All Departments' || 
        crew.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, selectedDepartment]);

  const handleProtectionToggle = (id) => {
    // TODO: Implement protection toggle logic
    console.log('Toggle protection for crew:', id);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <PageHeader
        title="Crew Management"
        icon="Users"
      />

      {/* Search Bar */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search crew by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Department Filter */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDepartment === dept
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Crew Table */}
      <CardWrapper
        title={`Crew Members (${filteredCrew.length})`}
        icon="Users"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Crew Member</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Contract</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCrew.length > 0 ? (
                filteredCrew.map((crew) => (
                  <tr key={crew.id} className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{crew.name}</td>
                    <td className="px-4 py-3 text-gray-700">{crew.role}</td>
                    <td className="px-4 py-3 text-gray-700">{crew.department}</td>
                    <td className="px-4 py-3 text-gray-700">{crew.contract}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        crew.status === 'Standard'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {crew.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleProtectionToggle(crew.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          crew.protection
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {crew.protection ? (
                          <>
                            <ShieldOff className="w-4 h-4" />
                            Remove Protection
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4" />
                            Enable Protection
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No crew members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardWrapper>
    </div>
  );
}

export default CrewSearch;

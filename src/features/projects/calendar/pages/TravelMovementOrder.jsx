import { useState } from "react";
import TmoSidebar from "../components/tmo/TmoSidebar";
import TmoPreview from "../components/tmo/TmoPreview";
import TmoFormModal from "../components/tmo/TmoFormModal";

const MOCK_TMOS = [
  //tmo 1
  {
    id: "tmo-001",
    tmoNumber: "#445",
    name: "Muhammad Razik",
    department: "Cast (Lead)",
    createdAt: "2026-02-10",
    status: "CONFIRMED",
    contacts: [
      { id: "c1", role: "Travel Coord", name: "Lexi Milligan", phone: "+44 7527 579 724" },
      { id: "c2", role: "Accommodation", name: "Abdul Casal", phone: "+44 7307 380 624" }
    ],
    attachments: [
      {
        id: "att-1",
        name: "BA_Flight_Ticket.pdf",
        type: "pdf",
        size: "1.2 MB",
      },
      {
        id: "att-2",
        name: "Hotel_Voucher_Ritz.pdf",
        type: "pdf",
        size: "850 KB",
      },
    ],
    sections: [
      {
        id: "sec-1",
        type: "travel",
        title: "LONDON LHR ➔ GENEVA GVA",
        travelDetails: {
          date: "2026-02-14",
          transportToAirport:
            "Addison Lee Car Service (Booking #88291) - Pick up at 07:00 AM from Home Address.",
          airline: "British Airways",
          flightNumber: "BA 728",
          bookingRef: "XY72LM",
          departTime: "09:45",
          departLocation: "London Heathrow (LHR) T5",
          arriveTime: "12:25",
          arriveLocation: "Geneva (GVA)",
          luggage: "2x Checked Bags (23kg), 1x Carry-on",
          transportOnArrival:
            "Production Driver (Steve) will meet at arrivals hall with 'WERWULF' sign.",
        },
      },
      {
        id: "sec-2",
        type: "accommodation",
        title: "THE RITZ-CARLTON GENEVA",
        accommodationDetails: {
          startDate: "2026-02-14",
          endDate: "2026-02-20",
          hotelName: "The Ritz-Carlton Hotel de la Paix",
          address: "Quai du Mont-Blanc 11, 1201 Genève, Switzerland",
          checkIn: "From 15:00",
          checkOut: "By 11:00",
          roomType: "Lake View Suite",
          notes:
            "Late checkout requested for 20th Feb due to night shoot. Breakfast included.",
        },
      },
    ],
  },
  //tmo 2
  {
    id: "tmo-002",
    tmoNumber: "#446",
    name: "Arun KK",
    department: "Director of Photography",
    createdAt: "2026-02-11",
    status: "DRAFT",
    contacts: [
      { id: "c3", role: "Production Office", name: "Main Desk", phone: "+44 207 999 8888" }
    ],
    attachments: [],
    sections: [
      {
        id: "sec-3",
        type: "travel",
        title: "LOS ANGELES LAX ➔ LONDON LHR",
        travelDetails: {
          date: "2026-02-15",
          transportToAirport: "Self Drive - Parking Validated",
          airline: "Virgin Atlantic",
          flightNumber: "VS 024",
          bookingRef: "VS99PL",
          departTime: "17:30",
          departLocation: "Los Angeles (LAX) TB",
          arriveTime: "11:50",
          arriveLocation: "London Heathrow (LHR) T3",
          transportOnArrival: "Unit Driver pickup.",
        },
      },
    ],
  },
  //tmo 3
  {
    id: "tmo-003",
    tmoNumber: "#447",
    name: "Camera Crew (Unit A)",
    department: "Camera",
    createdAt: "2026-02-12",
    status: "PENDING",
    contacts: [
      { id: "c4", role: "Travel Coord", name: "Emergency Line", phone: "+44 7527 579 724" }
    ],
    attachments: [
      {
        id: "att-3",
        name: "Equipment_Carnet_List.xlsx",
        type: "xls",
        size: "45 KB",
      },
    ],
    sections: [
      {
        id: "sec-4",
        type: "accommodation",
        title: "IBIS STYLES LONDON",
        accommodationDetails: {
          startDate: "2026-02-15",
          endDate: "2026-02-28",
          hotelName: "Ibis Styles London Ealing",
          address: "Uxbridge Rd, London W5 2BS",
          checkIn: "14:00",
          checkOut: "10:00",
          roomType: "6x Twin Rooms",
          notes: "Parking for 2x Lutons arranged.",
        },
      },
    ],
  },
];

function TravelMovementOrder() {
  const [tmos, setTmos] = useState(MOCK_TMOS);
  const [searchText, setSearchText] = useState("");
  const [selectedTmo, setSelectedTmo] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTmo, setEditingTmo] = useState(null);

  const filteredTmos = tmos.filter(
    (tmo) =>
      tmo.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      tmo.tmoNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      tmo.department.toLowerCase().includes(searchText.toLowerCase()),
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

  const handleDeleteTmo = (id, e) => {
    if (e) e.stopPropagation();
    setTmos((prev) => prev.filter((t) => t.id !== id));
    if (selectedTmo?.id === id) {
      setSelectedTmo(null);
    }
  };

  const handleSaveTmo = (data) => {
    if (editingTmo) {
      setTmos((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      if (selectedTmo?.id === data.id) {
        setSelectedTmo(data);
      }
    } else {
      setTmos((prev) => [data, ...prev]);
      setSelectedTmo(data); 
    }
    setIsModalOpen(false);
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
        />
        <TmoPreview 
          selectedTmo={selectedTmo} 
          onCreateNew={handleCreateNew}
          onEditTmo={handleEditTmo}
        />
      </div>

      <TmoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTmo}
        initialData={editingTmo}
      />
    </>
  );
}

export default TravelMovementOrder;
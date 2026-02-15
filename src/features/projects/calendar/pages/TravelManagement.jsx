import React, { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import { 
  Search, Plus, FileText, Paperclip, Download, Pencil, Trash2, 
  Loader2, Plane, Hotel, X, GripVertical, Briefcase 
} from 'lucide-react';
import { toast } from 'sonner';

// NOTE: Uncomment these if you install jspdf/html2canvas later
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';

// UI Components
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { cn } from "@/shared/config/utils";

/* ==================================================================================
   0. MOCK DATA (PREMIUM EXAMPLES)
   ================================================================================== */

const MOCK_TMOS = [
  {
    id: "tmo-001",
    tmoNumber: "#445",
    name: "Elidan Arzoni",
    department: "Cast (Lead)",
    createdAt: "2026-02-10",
    status: "CONFIRMED",
    contactInfo: "Lexi Milligan (Travel Coord): +44 7527 579 724\nAbdul Casal (Accomms): +44 7307 380 624",
    attachments: [
      { id: "att-1", name: "BA_Flight_Ticket.pdf", type: "pdf", size: "1.2 MB" },
      { id: "att-2", name: "Hotel_Voucher_Ritz.pdf", type: "pdf", size: "850 KB" }
    ],
    sections: [
      {
        id: "sec-1",
        type: "travel",
        title: "LONDON LHR ➔ GENEVA GVA",
        travelDetails: {
          date: "2026-02-14",
          transportToAirport: "Addison Lee Car Service (Booking #88291) - Pick up at 07:00 AM from Home Address.",
          airline: "British Airways",
          flightNumber: "BA 728",
          bookingRef: "XY72LM",
          departTime: "09:45",
          departLocation: "London Heathrow (LHR) T5",
          arriveTime: "12:25",
          arriveLocation: "Geneva (GVA)",
          luggage: "2x Checked Bags (23kg), 1x Carry-on",
          transportOnArrival: "Production Driver (Steve) will meet at arrivals hall with 'WERWULF' sign."
        }
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
          notes: "Late checkout requested for 20th Feb due to night shoot. Breakfast included."
        }
      }
    ]
  },
  {
    id: "tmo-002",
    tmoNumber: "#446",
    name: "Sarah Jenkins",
    department: "Director of Photography",
    createdAt: "2026-02-11",
    status: "DRAFT",
    contactInfo: "Production Office: +44 207 999 8888",
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
          transportOnArrival: "Unit Driver pickup."
        }
      }
    ]
  },
  {
    id: "tmo-003",
    tmoNumber: "#447",
    name: "Camera Crew (Unit A)",
    department: "Camera",
    createdAt: "2026-02-12",
    status: "PENDING",
    contactInfo: "Travel Coord: +44 7527 579 724",
    attachments: [
        { id: "att-3", name: "Equipment_Carnet_List.xlsx", type: "xls", size: "45 KB" }
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
          notes: "Parking for 2x Lutons arranged."
        }
      }
    ]
  }
];

/* ==================================================================================
   1. INTERNAL COMPONENTS (TravelDocument & TravelForm)
   ================================================================================== */

const TravelDocument = ({ tmo }) => {
  if (!tmo) return null;

  return (
    <div className="bg-white text-zinc-900 p-8 md:p-10 max-w-[800px] mx-auto text-sm font-sans leading-relaxed print:p-0 min-h-[1000px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-primary">
        <div>
           <h1 className="text-3xl font-black tracking-tight uppercase text-zinc-900">Werwulf</h1>
           <p className="text-xs uppercase tracking-wider text-primary font-bold mt-1">Production Travel Memo</p>
        </div>
        <div className="text-right">
           <h2 className="text-xl font-bold uppercase text-zinc-900">{tmo.tmoNumber}</h2>
           <p className="text-xs text-zinc-500 mt-1">
             {tmo.createdAt ? format(parseISO(tmo.createdAt), 'dd MMM yyyy') : 'Date N/A'}
           </p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-zinc-50 p-6 rounded-lg mb-8 grid grid-cols-2 gap-8 border border-zinc-200">
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Traveler Name</div>
          <div className="font-bold text-lg">{tmo.name}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Department</div>
          <div className="font-bold text-lg">{tmo.department}</div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {tmo.sections?.map((section) => (
          <div key={section.id} className="relative">
            {/* Timeline Line (Visual only) */}
            <div className="absolute left-[-16px] top-2 bottom-0 w-[2px] bg-zinc-100 hidden print:hidden"></div>

            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4">
               <div className="bg-primary text-primary-foreground font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                 {section.type}
               </div>
               <h3 className="font-black text-base uppercase text-zinc-900">{section.title}</h3>
            </div>

            <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
            
            {/* --- FLIGHT / TRAVEL DETAILS --- */}
            {section.type === 'travel' && section.travelDetails && (
              <div className="space-y-5">
                <div className="grid grid-cols-[140px_1fr] gap-4 items-baseline">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Date</div>
                  <div className="font-bold text-base">
                    {section.travelDetails.date ? format(parseISO(section.travelDetails.date), 'EEEE do MMMM yyyy') : 'TBD'}
                  </div>
                </div>

                {section.travelDetails.transportToAirport && (
                  <div className="grid grid-cols-[140px_1fr] gap-4 items-baseline">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase">Airport Transfer</div>
                    <div>{section.travelDetails.transportToAirport}</div>
                  </div>
                )}

                <div className="border-t border-zinc-100 pt-4 mt-2">
                   <div className="grid grid-cols-3 gap-6 mb-4">
                      <div>
                         <div className="text-[10px] text-zinc-400 uppercase mb-1">Airline</div>
                         <div className="font-bold">{section.travelDetails.airline}</div>
                      </div>
                      <div>
                         <div className="text-[10px] text-zinc-400 uppercase mb-1">Flight No</div>
                         <div className="font-bold">{section.travelDetails.flightNumber}</div>
                      </div>
                      <div>
                         <div className="text-[10px] text-zinc-400 uppercase mb-1">Booking Ref</div>
                         <div className="font-mono bg-zinc-50 px-2 py-1 rounded border border-zinc-200 inline-block text-xs">
                           {section.travelDetails.bookingRef}
                         </div>
                      </div>
                   </div>

                   <div className="bg-zinc-50 p-4 rounded border border-zinc-200 grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                      <div>
                         <div className="text-2xl font-black text-primary">{section.travelDetails.departTime}</div>
                         <div className="text-xs font-bold text-zinc-500 uppercase mt-1">{section.travelDetails.departLocation}</div>
                      </div>
                      <div className="text-zinc-300">
                         ✈
                      </div>
                      <div className="text-right">
                         <div className="text-2xl font-black text-primary">{section.travelDetails.arriveTime}</div>
                         <div className="text-xs font-bold text-zinc-500 uppercase mt-1">{section.travelDetails.arriveLocation}</div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-[140px_1fr] gap-4 items-baseline pt-2">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Arrival Transfer</div>
                  <div className="whitespace-pre-wrap text-zinc-700">{section.travelDetails.transportOnArrival}</div>
                </div>
              </div>
            )}

            {/* --- ACCOMMODATION DETAILS --- */}
            {section.type === 'accommodation' && section.accommodationDetails && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-6 pb-4 border-b border-zinc-100">
                   <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Check In</div>
                      <div className="font-bold text-base">
                        {section.accommodationDetails.startDate ? format(parseISO(section.accommodationDetails.startDate), 'EEE do MMM') : 'TBD'}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{section.accommodationDetails.checkIn}</div>
                   </div>
                   <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Check Out</div>
                      <div className="font-bold text-base">
                        {section.accommodationDetails.endDate ? format(parseISO(section.accommodationDetails.endDate), 'EEE do MMM yyyy') : 'TBD'}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{section.accommodationDetails.checkOut}</div>
                   </div>
                </div>

                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Hotel Details</div>
                  <div>
                     <div className="font-bold text-lg text-primary">{section.accommodationDetails.hotelName}</div>
                     <div className="text-zinc-600 whitespace-pre-line mt-1">{section.accommodationDetails.address}</div>
                  </div>
                </div>

                <div className="grid grid-cols-[140px_1fr] gap-4 items-baseline">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase">Room Type</div>
                  <div className="font-medium">{section.accommodationDetails.roomType}</div>
                </div>

                {section.accommodationDetails.notes && (
                  <div className="bg-amber-50 p-3 rounded border border-amber-100 text-amber-900 text-xs mt-2">
                     <span className="font-bold mr-2">NOTE:</span>
                     {section.accommodationDetails.notes}
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Contact */}
      <div className="mt-12 pt-8 border-t border-zinc-100">
         <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-4">Travel Coordinators</h4>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-600">
            {tmo.contactInfo?.split('\n').map((line, i) => (
              <div key={i} className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                 {line}
              </div>
            ))}
         </div>
      </div>
      
      <div className="mt-8 text-center text-[10px] text-zinc-300 uppercase tracking-widest">
         Mirage Pictures Ltd • Werwulf Production
      </div>
    </div>
  );
};

const TravelForm = ({ isOpen, onClose, onSave, initialData }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      id: Math.random().toString(36).substr(2, 9),
      tmoNumber: '#448',
      name: '',
      department: '',
      createdAt: new Date().toISOString().split('T')[0],
      sections: [],
      contactInfo: 'Travel Coordinator: +1 555 0192 384\nAccommodation Manager: +1 555 0192 385'
    }
  });

  const [attachments, setAttachments] = useState(initialData?.attachments || []);
  const { fields, append, remove } = useFieldArray({ control, name: "sections" });

  const handleAddSection = (type) => {
    append({
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: type === 'travel' ? 'LONDON TO ...' : '... HOTEL',
      travelDetails: type === 'travel' ? {
        date: new Date().toISOString().split('T')[0],
        airline: '',
        flightNumber: ''
      } : undefined,
      accommodationDetails: type === 'accommodation' ? {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        hotelName: '',
        address: ''
      } : undefined
    });
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAttachment = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'other',
        size: `${(file.size / 1024).toFixed(1)} KB`
      };
      setAttachments([...attachments, newAttachment]);
      toast.success('File attached');
    }
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const onSubmit = (data) => {
    onSave({ ...data, attachments });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Travel Movement Order' : 'Create New TMO'}</DialogTitle>
          <DialogDescription>
            Fill in the details for the travel memo. These details will generate the printable PDF.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4 border-b border-primary/20 pb-4">
            <div className="space-y-2">
              <Label>TMO Number</Label>
              <Input {...register('tmoNumber', { required: true })} placeholder="#001" />
              {errors.tmoNumber && <span className="text-destructive text-xs">Required</span>}
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register('createdAt')} />
            </div>
            <div className="space-y-2">
              <Label>Traveler Name</Label>
              <Input {...register('name', { required: true })} placeholder="e.g. Elidan Arzoni" />
              {errors.name && <span className="text-destructive text-xs">Required</span>}
            </div>
             <div className="space-y-2">
              <Label>Department</Label>
              <Input {...register('department')} placeholder="e.g. Cast" />
            </div>
          </div>

          <div className="space-y-2 border-b border-primary/20 pb-4">
             <Label>Attachments (Tickets, Vouchers)</Label>
             <div className="flex flex-wrap gap-2 mb-2">
               {attachments.map(att => (
                 <div key={att.id} className="bg-muted border border-primary/20 rounded-md px-3 py-1 text-xs flex items-center gap-2">
                    <FileText size={12} className="text-primary" />
                    <span className="truncate max-w-[150px]">{att.name}</span>
                    <button type="button" onClick={() => removeAttachment(att.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X size={12} />
                    </button>
                 </div>
               ))}
             </div>
             <div className="relative">
                <Input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <Label htmlFor="file-upload" className="inline-flex items-center justify-center rounded-md text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 cursor-pointer">
                   <Plus size={14} className="mr-1.5" /> Attach File
                </Label>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold">Document Sections</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleAddSection('travel')}>
                  + Flight
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleAddSection('accommodation')}>
                  + Hotel
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-primary/20 rounded-lg p-4 bg-muted/20 relative group">
                  <div className="absolute right-2 top-2 flex gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground cursor-grab">
                       <GripVertical size={14} />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                       <Trash2 size={14} />
                    </Button>
                  </div>

                  <div className="mb-4 pr-10">
                    <Label className="text-[10px] text-muted-foreground uppercase">Section Title</Label>
                    <Input {...register(`sections.${index}.title`)} className="font-bold uppercase bg-background" placeholder="e.g. LONDON TO GENEVA" />
                  </div>

                  {field.type === 'travel' && (
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs">Date</Label>
                            <Input type="date" {...register(`sections.${index}.travelDetails.date`)} className="bg-background" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Transport to Airport</Label>
                            <Input {...register(`sections.${index}.travelDetails.transportToAirport`)} placeholder="Own arrangements..." className="bg-background" />
                          </div>
                       </div>
                       
                       <div className="border border-primary/10 p-3 rounded bg-background space-y-3">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground">Flight Details</Label>
                          <div className="grid grid-cols-3 gap-2">
                             <Input {...register(`sections.${index}.travelDetails.airline`)} placeholder="Airline" />
                             <Input {...register(`sections.${index}.travelDetails.flightNumber`)} placeholder="Flight No." />
                             <Input {...register(`sections.${index}.travelDetails.bookingRef`)} placeholder="Booking Ref" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                             <Input {...register(`sections.${index}.travelDetails.departTime`)} placeholder="Depart Time" />
                             <Input {...register(`sections.${index}.travelDetails.departLocation`)} placeholder="Depart Location" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                             <Input {...register(`sections.${index}.travelDetails.arriveTime`)} placeholder="Arrive Time" />
                             <Input {...register(`sections.${index}.travelDetails.arriveLocation`)} placeholder="Arrive Location" />
                          </div>
                       </div>

                       <div className="space-y-1">
                          <Label className="text-xs">Transport on Arrival</Label>
                          <Textarea {...register(`sections.${index}.travelDetails.transportOnArrival`)} className="bg-background" />
                       </div>
                    </div>
                  )}

                  {field.type === 'accommodation' && (
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs">Check In</Label>
                            <Input type="date" {...register(`sections.${index}.accommodationDetails.startDate`)} className="bg-background" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Check Out</Label>
                            <Input type="date" {...register(`sections.${index}.accommodationDetails.endDate`)} className="bg-background" />
                          </div>
                       </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Hotel Name</Label>
                          <Input {...register(`sections.${index}.accommodationDetails.hotelName`)} className="bg-background" />
                       </div>
                       <div className="space-y-1">
                          <Label className="text-xs">Address</Label>
                          <Input {...register(`sections.${index}.accommodationDetails.address`)} className="bg-background" />
                       </div>
                       
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                             <Label className="text-xs">Check In Time</Label>
                             <Input {...register(`sections.${index}.accommodationDetails.checkIn`)} placeholder="e.g. From 15:00" className="bg-background" />
                           </div>
                           <div className="space-y-1">
                             <Label className="text-xs">Check Out Time</Label>
                             <Input {...register(`sections.${index}.accommodationDetails.checkOut`)} placeholder="e.g. By 11:00" className="bg-background" />
                           </div>
                        </div>

                         <div className="space-y-1">
                          <Label className="text-xs">Room Type</Label>
                          <Input {...register(`sections.${index}.accommodationDetails.roomType`)} className="bg-background" />
                       </div>
                       <div className="space-y-1">
                          <Label className="text-xs">Notes</Label>
                          <Textarea {...register(`sections.${index}.accommodationDetails.notes`)} className="bg-background" />
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
           <div className="space-y-2 border-t border-primary/20 pt-4">
              <Label>Footer Contact Info</Label>
              <Textarea {...register('contactInfo')} rows={3} placeholder="Enter contact details for travel coordinators..." />
           </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Document</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

/* ==================================================================================
   2. MAIN VIEW COMPONENT (Export Default)
   ================================================================================== */

export default function TravelManagement({ tmos = MOCK_TMOS, onTmoChange }) {
  // Use passed in TMOs or fallback to state initialized with MOCK data if empty
  const [localTmos, setLocalTmos] = useState(tmos && tmos.length > 0 ? tmos : MOCK_TMOS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTmo, setSelectedTmo] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTmo, setEditingTmo] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const printRef = useRef(null);

  // Filter Logic
  const filteredTmos = localTmos.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.tmoNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleCreateNew = () => {
    setEditingTmo(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tmo, e) => {
    e.stopPropagation();
    setEditingTmo(tmo);
    setIsFormOpen(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this TMO?')) {
      const updated = localTmos.filter(t => t.id !== id);
      setLocalTmos(updated);
      if (onTmoChange) onTmoChange(updated);
      if (selectedTmo?.id === id) setSelectedTmo(null);
      toast.success('TMO Deleted');
    }
  };

  const handleSave = (tmo) => {
    let updatedTmos;
    if (editingTmo) {
      updatedTmos = localTmos.map(t => t.id === tmo.id ? tmo : t);
      if (selectedTmo?.id === tmo.id) setSelectedTmo(tmo);
      toast.success('TMO Updated');
    } else {
      updatedTmos = [tmo, ...localTmos];
      toast.success('TMO Created');
    }
    setLocalTmos(updatedTmos);
    if (onTmoChange) onTmoChange(updatedTmos);
    setIsFormOpen(false);
  };

  const handleExportPDF = async () => {
    if (!printRef.current || !selectedTmo) return;
    
    // NOTE: Requires 'html2canvas' and 'jspdf' installed to work.
    toast.error("Install 'html2canvas' and 'jspdf' to enable PDF export.");
    /*
    try {
      setIsExporting(true);
      toast.info('Generating PDF...');
      await new Promise(resolve => setTimeout(resolve, 100)); // allow toast to render
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`TMO_${selectedTmo.tmoNumber}_${selectedTmo.name.replace(' ', '_')}.pdf`);
      toast.success('PDF Downloaded!');
    } catch (error) {
      console.error('PDF Export failed:', error);
      toast.error('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
    */
  };

  return (
    <div className="min-h-[calc(100vh-200px)] rounded-xl overflow-hidden border border-primary/20 shadow-lg bg-card flex flex-col md:flex-row">
      
      {/* ================= SIDEBAR ================= */}
      <div className="w-full md:w-[350px] border-b md:border-b-0 md:border-r border-primary/20 flex flex-col bg-card">
        
        {/* Sidebar Header */}
        <div className="bg-purple-50/80 dark:bg-purple-900/20 border-b border-primary/20 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-black text-lg text-purple-800 dark:text-purple-300">
                Travel Orders
              </h3>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                {filteredTmos.length} Documents
              </p>
            </div>
            <Button 
              size="sm" 
              onClick={handleCreateNew} 
              className="h-8 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-1" /> New
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search name, dept..." 
              className="pl-9 bg-card border-primary/20 focus-visible:ring-primary/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Sidebar List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTmos.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center text-muted-foreground/60 h-40">
              <FileText className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-sm font-medium">No documents found</p>
            </div>
          ) : (
            <div className="divide-y divide-primary/10">
              {filteredTmos.map(tmo => {
                const isSelected = selectedTmo?.id === tmo.id;
                return (
                  <div 
                    key={tmo.id}
                    onClick={() => setSelectedTmo(tmo)}
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-200 group hover:bg-purple-50/50 dark:hover:bg-purple-900/10 border-l-4",
                      isSelected 
                        ? "bg-purple-50/80 dark:bg-purple-900/20 border-l-primary" 
                        : "border-l-transparent bg-transparent"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground bg-muted/50 border-primary/20">
                        {tmo.tmoNumber}
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                        {tmo.createdAt}
                      </span>
                    </div>
                    
                    <h4 className={cn(
                      "font-bold text-sm mb-1 truncate",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {tmo.name}
                    </h4>
                    
                    <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                      <Briefcase className="w-3 h-3" />
                      <span className="truncate">{tmo.department}</span>
                    </div>
                    
                    {/* Tags & Actions Row */}
                    <div className="flex justify-between items-end">
                      <div className="flex gap-1.5">
                         {tmo.sections?.some(s => s.type === 'travel') && (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800" title="Travel">
                               <Plane className="w-3 h-3" />
                            </div>
                         )}
                         {tmo.sections?.some(s => s.type === 'accommodation') && (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-peach-100 dark:bg-peach-900/30 text-peach-600 dark:text-peach-400 border border-peach-200 dark:border-peach-800" title="Accommodation">
                               <Hotel className="w-3 h-3" />
                            </div>
                         )}
                         {tmo.attachments?.length > 0 && (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted border border-primary/10 text-muted-foreground" title="Attachments">
                               <Paperclip className="w-3 h-3" />
                            </div>
                         )}
                      </div>

                      <div className={cn(
                        "flex gap-1 transition-opacity duration-200",
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10" 
                          onClick={(e) => handleEdit(tmo, e)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
                          onClick={(e) => handleDelete(tmo.id, e)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= PREVIEW AREA ================= */}
      <div className="flex-1 flex flex-col bg-muted/10 dark:bg-muted/5 relative overflow-hidden">
        {selectedTmo ? (
          <>
            {/* Preview Header */}
            <div className="sticky top-0 z-20 bg-card/80 backdrop-blur-sm border-b border-primary/20 px-6 py-3 flex justify-between items-center shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                     <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-lg text-foreground leading-none">
                        {selectedTmo.tmoNumber}
                      </h2>
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-background border-primary/20">
                        {selectedTmo.status || "DRAFT"}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {selectedTmo.name} • {selectedTmo.department}
                    </p>
                  </div>
               </div>
               
               <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={(e) => handleEdit(selectedTmo, e)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit Order
                  </Button>
                  <Button 
                    onClick={handleExportPDF} 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" 
                    disabled={isExporting}
                  >
                    {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Download PDF
                  </Button>
               </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              
              {/* Document Paper Container */}
              <div className="max-w-4xl mx-auto">
                <div 
                  ref={printRef} 
                  className="bg-white text-zinc-900 shadow-2xl rounded-sm overflow-hidden border border-zinc-200"
                >
                  <TravelDocument tmo={selectedTmo} />
                </div>
              </div>

              {/* Attachments Footer */}
              {selectedTmo.attachments?.length > 0 && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-card border border-primary/20 rounded-xl p-5 shadow-sm">
                     <h4 className="font-bold text-foreground mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                       <Paperclip className="w-4 h-4 text-primary" /> Attached Files ({selectedTmo.attachments.length})
                     </h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedTmo.attachments.map(att => (
                          <div key={att.id} className="flex items-center justify-between p-3 border border-primary/10 bg-muted/30 rounded-lg hover:bg-card hover:border-primary/30 hover:shadow-md transition-all group">
                             <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 bg-card border border-primary/10 rounded flex items-center justify-center font-bold text-[10px] uppercase text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
                                  {att.type || "DOC"}
                                </div>
                                <div className="min-w-0">
                                   <div className="font-medium text-sm text-foreground truncate">{att.name}</div>
                                   <div className="text-xs text-muted-foreground">{att.size || "Unknown Size"}</div>
                                </div>
                             </div>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                <Download className="w-4 h-4" />
                             </Button>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
             <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 border-4 border-card shadow-sm">
                <Plane className="w-10 h-10 text-muted-foreground/50" />
             </div>
             <h3 className="text-xl font-black text-foreground mb-2">Select a Travel Order</h3>
             <p className="text-sm max-w-xs text-center mb-8 opacity-80">
               Select an existing TMO from the sidebar to view logistics details, or create a new movement order.
             </p>
             <Button onClick={handleCreateNew} size="lg" className="shadow-md">
                <Plus className="w-4 h-4 mr-2" /> Create New Order
             </Button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <TravelForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSave} 
        initialData={editingTmo}
      />
    </div>
  );
}
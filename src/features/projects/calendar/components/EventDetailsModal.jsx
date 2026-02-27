import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription, 
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Edit2,
  Trash2,
  AlertTriangle,
  Video,
  Building2
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { useSelector } from "react-redux";

const getPhaseColor = (phase) => {
  switch (phase) {
    case "shoot": return "bg-peach-100 text-peach-800 border-peach-200 dark:bg-peach-900/30 dark:text-peach-200";
    case "prep": return "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-200";
    case "wrap": return "bg-mint-100 text-mint-800 border-mint-200 dark:bg-mint-900/30 dark:text-mint-200";
    default: return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-200";
  }
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "tentative": return "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300";
    case "cancelled": return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300";
    case "completed": return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300";
    case "confirmed": default: return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300";
  }
};

const getAudienceHeading = (audienceType) => {
  switch (audienceType) {
    case "DEPARTMENT": return "Required Departments";
    case "USERS": return "Required Crew Members";
    case "ALL": return "Required Attendance";
    default: return "Scheduled For";
  }
};

export default function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  isDeleting,
  canModify = true
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { departments } = useSelector((state) => state.calendar);

  if (!event) return null;

  const currentStatus = event.status || "confirmed";

  const handleClose = () => {
    setConfirmDelete(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => { if(!v) handleClose(); }}>
      <DialogContent aria-describedby={undefined} className="max-w-lg p-0 overflow-hidden border-0 gap-0">
        
        <div className={`h-3 w-full ${getPhaseColor(event.productionPhase).split(" ")[0]}`} />
        
        <div className="p-6 pb-2">
           <div className="flex justify-between items-start mb-4">
              <div className="space-y-1 w-full">
                 <div className="flex flex-wrap gap-2 items-center w-full">
                   
                   <Badge variant="outline" className={`capitalize font-bold border ${getPhaseColor(event.productionPhase)}`}>
                      {event.productionPhase}
                   </Badge>

                   {event.eventCategory && event.eventCategory !== "general" && (
                     <Badge variant="outline" className="capitalize font-bold border bg-muted/60 text-muted-foreground border-primary/20">
                       {event.eventCategory.replace("_", " ")}
                     </Badge>
                   )}

                   <Badge variant="outline" className={`capitalize font-bold border ${getStatusColor(currentStatus)}`}>
                      {currentStatus}
                   </Badge>

                   {event.meeting?.enabled && event.meeting?.roomId && (
                     <Badge variant="secondary" className="flex gap-1 items-center bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300">
                       <Video className="w-3 h-3" /> Video Room: {event.meeting.roomId}
                     </Badge>
                   )}
                 </div>
                 
                 <DialogTitle className={`text-2xl font-bold leading-tight mt-3 ${currentStatus === 'cancelled' ? 'line-through opacity-70' : ''}`}>
                    {event.title}
                 </DialogTitle>
                 
                 <DialogDescription className="sr-only">
                    Details for event {event.title}
                 </DialogDescription>
              </div>
           </div>
        </div>

        <div className="px-6 space-y-6">
           <div className="flex items-start gap-3">
              <div className="p-2 bg-muted/50 rounded-md">
                 <CalendarDays className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                 <p className="font-semibold text-sm">
                    {format(new Date(event.startDateTime), "EEEE, MMMM do, yyyy")}
                 </p>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {event.allDay ? (
                       <span>All Day Event</span>
                    ) : (
                       <span>
                          {format(new Date(event.startDateTime), "h:mm a")} - {format(new Date(event.endDateTime), "h:mm a")}
                       </span>
                    )}
                 </div>
              </div>
           </div>

           {event.location && (
              <div className="flex items-start gap-3">
                 <div className="p-2 bg-muted/50 rounded-md">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                 </div>
                 <div>
                     <p className="font-semibold text-sm">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                 </div>
              </div>
           )}

           {event.description && (
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border">
                 {event.description}
              </div>
           )}

           <div className="space-y-4 pt-2">
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-sm font-semibold">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span>{getAudienceHeading(event.audience?.type)}</span>
                 </div>
                 <div className="flex flex-wrap gap-2 pl-6">
                    {event.audience?.type === "ALL" && (
                       <Badge variant="secondary" className="font-normal bg-purple-100 text-purple-800">
                          Everyone (All Crew)
                       </Badge>
                    )}
                    
                    {event.audience?.type === "DEPARTMENT" && event.audience.departments?.map(deptId => {
                       const dept = departments?.find(d => d._id === deptId);
                       return (
                          <Badge key={deptId} variant="secondary" className="font-normal bg-indigo-100 text-indigo-800">
                             {dept ? dept.name : "Department"}
                          </Badge>
                       )
                    })}

                    {event.audience?.type === "USERS" && (
                       <Badge variant="secondary" className="font-normal bg-sky-100 text-sky-800">
                          Specific Crew Members
                       </Badge>
                    )}
                 </div>
              </div>

              {event.attendees && event.attendees.length > 0 && event.audience?.type !== "ALL" && (
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                       <Users className="w-4 h-4 text-muted-foreground" />
                       <span>Included Members ({event.attendees.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-6">
                       {event.attendees.map((attendee, index) => {
                          const userObj = attendee.userId || attendee;
                          return (
                            <Badge key={userObj._id || `crew-member-${index}`} variant="outline" className="text-xs font-normal text-muted-foreground">
                               {userObj.displayName || userObj.email || "Crew Member"}
                            </Badge>
                          );
                       })}
                    </div>
                 </div>
              )}
           </div>
        </div>

        <Separator className="mt-6" />

        <DialogFooter className="p-6 bg-muted/10 border-t">
           {confirmDelete ? (
              <div className="w-full flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                 <div className="flex items-center gap-2 text-destructive text-sm font-medium justify-center bg-destructive/10 p-2 rounded-md border border-destructive/20">
                    <AlertTriangle className="w-4 h-4" />
                    Are you sure you want to delete this event?
                 </div>
                 <div className="flex gap-3 w-full sm:flex-row flex-col">
                    <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                    <Button 
                       variant="destructive" 
                       className="flex-1" 
                       onClick={() => onDelete(event.eventCode)}
                       disabled={isDeleting}
                    >
                       {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </Button>
                 </div>
              </div>
           ) : (
              <div className="flex w-full justify-between items-center sm:flex-row flex-col-reverse gap-3">
                 <Button variant="ghost" onClick={handleClose} className="sm:w-auto w-full">Close</Button>
                 
                 {canModify && (
                    <div className="flex gap-2 sm:w-auto w-full">
                       <Button 
                          variant="outline" 
                          className="flex-1 sm:flex-none gap-2 text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
                          onClick={() => setConfirmDelete(true)}
                       >
                          <Trash2 className="w-4 h-4" />
                          Delete
                       </Button>
                       <Button className="flex-1 sm:flex-none gap-2" onClick={() => { setConfirmDelete(false); onEdit(event); }}>
                          <Edit2 className="w-4 h-4" />
                          Edit
                       </Button>
                    </div>
                 )}
              </div>
           )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/ui/dialog";

import { tmoSchema } from "../../config/tmoSchema";
import { tmoFormConfig } from "../../config/tmoFormConfig";
import TmoStepsRenderer from "./TmoStepsRenderer";

export default function TmoFormModal({ isOpen, onClose, onSave, initialData, isSaving }) {
  const [attachments, setAttachments] = useState([]);

  const defaultContacts = [
    { id: 'c1', role: 'Travel Coordinator', name: 'Lexi Milligan', phone: '+44 7527 579 724' },
    { id: 'c2', role: 'Accommodation Manager', name: 'Abdul Casal', phone: '+44 7307 380 624' }
  ];

  const form = useForm({
    resolver: zodResolver(tmoSchema),
    defaultValues: {
      name: '',
      department: '',
      status: 'DRAFT',
      sections: [],
      contacts: defaultContacts, 
    },
    mode: "onChange", 
  });

  const { isValid } = form.formState;

  useEffect(() => {
    if (isOpen) {
      form.reset(initialData || {
        name: '',
        department: '',
        status: 'DRAFT',
        sections: [],
        contacts: defaultContacts,
      });
      
      setTimeout(() => {
        setAttachments(initialData?.attachments || []);
      }, 0);
    }
  }, [isOpen, initialData, form]);

  const onSubmit = (data) => {
    const formattedSections = data.sections.map((section) => {
      if (section.type === "travel" && section.travelDetails) {
        const td = section.travelDetails;
        if (td.date && td.departTime) {
           td.startDateTime = new Date(`${td.date} ${td.departTime}`).toISOString();
        }
        if (td.date && td.arriveTime) {
           td.endDateTime = new Date(`${td.date} ${td.arriveTime}`).toISOString();
        }
      }
      return section;
    });

    onSave({ ...data, sections: formattedSections }, attachments);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <DialogTitle>{initialData ? 'Edit Travel Movement Order' : 'Create New TMO'}</DialogTitle>
          <DialogDescription className="mt-1.5 text-xs">
            {tmoFormConfig.subtitle}
          </DialogDescription>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          <form id="tmo-form" onSubmit={form.handleSubmit(onSubmit)}>
             <TmoStepsRenderer 
                form={form} 
                attachments={attachments} 
                setAttachments={setAttachments} 
             />
          </form>
        </div>

        <div className="px-6 py-4 border-t border-border bg-background flex justify-end gap-3 shrink-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          
          <Button type="submit" form="tmo-form" disabled={!isValid || isSaving}>
             {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
             {isSaving ? "Saving..." : "Save Document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
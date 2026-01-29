import {
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCreateTicket } from "../hooks/useCreateTicket";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";

export default function SupportTicketModal({ open, onClose }) {
  const { submitTicket, loading } = useCreateTicket();

  const [form, setForm] = useState({
    subject: "",
    category: "technical",
    priority: "medium",
    initialDescription: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim()) return toast.error("Please enter a ticket subject");
    if (!form.initialDescription.trim()) return toast.error("Please describe your issue");

    const success = await submitTicket(form, [], null);

    if (success) {
      setForm({ subject: "", category: "technical", priority: "medium", initialDescription: "" });
      onClose();
    }
  };

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-card dark:bg-card rounded-3xl shadow-2xl w-full max-w-2xl max-h-[98vh] overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="relative px-6 py-6">
              <button
                onClick={onClose}
                disabled={loading}
                className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full transition-all disabled:opacity-50 z-10"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <h2 className="text-xl font-bold text-foreground mb-1">Create Support Ticket</h2>
              <p className="text-sm text-muted-foreground">We're here to help you resolve any issues quickly</p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block text-foreground">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter ticket subject"
                  value={form.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  required
                  disabled={loading}
                  className="h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block text-foreground">
                    Category
                  </Label>
                  <select
                    value={form.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    disabled={loading}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="account">Account</option>
                    <option value="payment">Payment</option>
                    <option value="technical">Technical</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block text-foreground">
                    Priority
                  </Label>
                  <select
                    value={form.priority}
                    onChange={(e) => updateField('priority', e.target.value)}
                    disabled={loading}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-2 block text-foreground">
                  Description <span className="text-red-500">*</span>
                </Label>
                <textarea
                  placeholder="Describe your issue..."
                  value={form.initialDescription}
                  onChange={(e) => updateField('initialDescription', e.target.value)}
                  required
                  disabled={loading}
                  rows={6}
                  className="w-full rounded-md border border-transparent shadow-none bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none resize-none"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 font-bold">
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
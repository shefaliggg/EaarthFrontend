import {
  Send,
  X,
  Upload,
  Mic,
  Trash2,
  Image,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCreateTicket } from "../hooks/useCreateTicket";

export default function SupportTicketModal({ open, onClose }) {
  const { submitTicket, loading } = useCreateTicket();

  const [form, setForm] = useState({
    subject: "",
    category: "technical",
    priority: "medium",
    initialDescription: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [voiceNote, setVoiceNote] = useState(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = attachments.length + (voiceNote ? 1 : 0) + files.length;

    if (totalFiles > 5) {
      toast.error(`You can only upload up to 5 files. Currently have ${attachments.length + (voiceNote ? 1 : 0)}.`);
      return;
    }
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => setAttachments((prev) => prev.filter((_, i) => i !== index));

  const handleVoiceNote = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (attachments.length + (voiceNote ? 1 : 0) >= 5) {
      toast.error("You can only upload up to 5 files.");
      return;
    }
    setVoiceNote(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim()) return toast.error("Please enter a ticket subject");
    if (!form.initialDescription.trim()) return toast.error("Please describe your issue");

    const success = await submitTicket(form, attachments, voiceNote);

    if (success) {
      setForm({ subject: "", category: "technical", priority: "medium", initialDescription: "" });
      setAttachments([]);
      setVoiceNote(null);
      onClose();
    }
  };

  const getFileIcon = (file) => (
    file.type.startsWith("image/")
      ? <Image className="w-5 h-5 text-sky-500" />
      : <FileText className="w-5 h-5 text-lavender-500" />
  );

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
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all disabled:opacity-50 z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-3xl font-normal text-foreground mb-2">Create Support Ticket</h2>
              <p className="text-foreground">We're here to help you resolve any issues quickly</p>
            </div>


            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-foreground dark:text-foreground tracking-wide">
                  SUBJECT <span className="text-destructive">*</span>
                </label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Brief summary of the issue"
                  disabled={loading}
                  className="w-full px-4 py-3.5 border-2 border-border bg-input rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 focus:bg-card transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-foreground dark:text-foreground tracking-wide">
                    CATEGORY <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3.5 border-2 border-border bg-input rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                  >
                    <option value="account">Account Issue</option>
                    <option value="payment">Payment Issue</option>
                    <option value="technical">Technical Issue</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-foreground dark:text-foreground tracking-wide">PRIORITY</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    disabled={loading}
                    className="w-full px-4 py-3.5 border-2 border-border bg-input rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
                  >
                    <option value="low">Low - Minor issue</option>
                    <option value="medium">Medium - Standard issue</option>
                    <option value="high">High - Needs attention</option>
                    <option value="urgent">Urgent - Critical issue</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-foreground dark:text-foreground tracking-wide">
                  DESCRIPTION <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={form.initialDescription}
                  onChange={(e) => setForm({ ...form, initialDescription: e.target.value })}
                  rows={5}
                  placeholder="Please describe what happened in detail..."
                  disabled={loading}
                  className="w-full px-4 py-3.5 border-2 border-border bg-input rounded-xl outline-none resize-none focus:border-primary focus:ring-4 focus:ring-primary/20 focus:bg-card transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-muted-foreground text-foreground"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground dark:text-foreground tracking-wide">
                  ATTACHMENTS & EVIDENCE <span className="text-muted-foreground font-normal ml-2">(Max 5 files)</span>
                </label>
                <div className="flex gap-3">
                  <label className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed px-4 py-3.5 rounded-xl cursor-pointer transition-all ${loading || attachments.length + (voiceNote ? 1 : 0) >= 5
                      ? "bg-muted border-border cursor-not-allowed opacity-50"
                      : "bg-lavender-50 border-lavender-300 hover:bg-lavender-100 hover:border-lavender-400 dark:bg-lavender-900/20 dark:border-lavender-700"
                    }`}>
                    <Upload size={20} className="text-foreground" />
                    <span className="text-sm font-semibold text-foreground">Upload Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={loading || attachments.length + (voiceNote ? 1 : 0) >= 5}
                    />
                  </label>

                  <label className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed px-4 py-3.5 rounded-xl cursor-pointer transition-all ${loading || voiceNote || attachments.length + (voiceNote ? 1 : 0) >= 5
                      ? "bg-muted border-border cursor-not-allowed opacity-50"
                      : "bg-lavender-50 border-lavender-300 hover:bg-lavender-100 hover:border-lavender-400 dark:bg-lavender-900/20 dark:border-lavender-700"
                    }`}>
                    <Mic size={20} className="text-foreground" />
                    <span className="text-sm font-semibold text-foreground">Voice Note</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleVoiceNote}
                      disabled={loading || voiceNote !== null || attachments.length + (voiceNote ? 1 : 0) >= 5}
                    />
                  </label>
                </div>


                {(attachments.length > 0 || voiceNote) && (
                  <div className="space-y-2 pt-2">
                    {attachments.map((file, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between bg-gradient-to-r from-lavender-50 to-pastel-pink-50 dark:from-lavender-900/20 dark:to-pastel-pink-900/20 border border-lavender-200 dark:border-lavender-800 p-3 rounded-xl group hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getFileIcon(file)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          disabled={loading}
                          className="ml-2 p-2 hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 group"
                        >
                          <Trash2 size={18} className="text-destructive group-hover:text-destructive" />
                        </button>
                      </motion.div>
                    ))}

                    {voiceNote && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-between bg-gradient-to-r from-pastel-pink-50 to-lavender-50 dark:from-pastel-pink-900/20 dark:to-lavender-900/20 border border-pastel-pink-200 dark:border-pastel-pink-800 p-3 rounded-xl group hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-pastel-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Mic className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">🎤 {voiceNote.name}</p>
                            <p className="text-xs text-muted-foreground">{(voiceNote.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setVoiceNote(null)}
                          disabled={loading}
                          className="ml-2 p-2 hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={18} className="text-destructive hover:text-destructive" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>


              <button
                type="submit"
                disabled={loading || !form.subject.trim() || !form.initialDescription.trim()}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>SUBMITTING...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>SUBMIT TICKET</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
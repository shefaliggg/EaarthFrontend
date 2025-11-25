import {
  Send,
  X,
  Upload,
  Mic,
  Trash2,
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
    
    // Check total file count (including existing attachments and voice note)
    const currentFileCount = attachments.length + (voiceNote ? 1 : 0);
    const newFileCount = currentFileCount + files.length;
    
    if (newFileCount > 5) {
      toast.error(`You can only upload up to 5 files total. Currently have ${currentFileCount} files.`);
      return;
    }
    
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVoiceNote = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check total file count
    const currentFileCount = attachments.length + (voiceNote ? 1 : 0);
    
    if (currentFileCount >= 5) {
      toast.error("You can only upload up to 5 files total");
      return;
    }
    
    setVoiceNote(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.subject.trim()) {
      toast.error("Please enter a ticket subject");
      return;
    }

    if (!form.initialDescription.trim()) {
      toast.error("Please describe your issue");
      return;
    }

    const success = await submitTicket(form, attachments, voiceNote);

    if (success) {
      // Reset form
      setForm({
        subject: "",
        category: "technical",
        priority: "medium",
        initialDescription: "",
      });
      setAttachments([]);
      setVoiceNote(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-extrabold tracking-tight text-[#9333ea]">
                CREATE SUPPORT TICKET
              </h2>
              <button 
                onClick={onClose}
                type="button"
                disabled={loading}
              >
                <X className="w-6 h-6 text-gray-500 hover:text-red-500" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Describe the issue you're facing. You can include screenshots, recordings, or notes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* SUBJECT */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  ISSUE TITLE <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Brief summary of the issue"
                  disabled={loading}
                  className="w-full px-4 py-2.5 border-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  CATEGORY <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="account">Account Issue</option>
                  <option value="payment">Payment Issue</option>
                  <option value="technical">Technical Issue</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* PRIORITY */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  PRIORITY
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  disabled={loading}
                  className="w-full px-4 py-2.5 border-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="low">Low - Minor issue</option>
                  <option value="medium">Medium - Standard issue</option>
                  <option value="high">High - Needs attention</option>
                  <option value="urgent">Urgent - Critical issue</option>
                </select>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  DESCRIPTION <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.initialDescription}
                  onChange={(e) => setForm({ ...form, initialDescription: e.target.value })}
                  rows={4}
                  placeholder="Please describe what happened..."
                  disabled={loading}
                  className="w-full px-4 py-2.5 border-2 bg-gray-50 rounded-xl outline-none resize-none focus:ring-2 focus:ring-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* ATTACHMENTS */}
              <div>
                <label className="block text-xs font-semibold mb-2">
                  ATTACHMENTS & EVIDENCE (Max 5 files)
                </label>

                <div className="flex gap-3">
                  {/* Upload Media */}
                  <label className={`flex items-center gap-2 border px-4 py-2 rounded-xl cursor-pointer transition ${
                    loading || (attachments.length + (voiceNote ? 1 : 0)) >= 5
                      ? 'bg-gray-200 cursor-not-allowed opacity-50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <Upload size={18} className="text-[#9333ea]" />
                    <span className="text-sm">Upload Media</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={loading || (attachments.length + (voiceNote ? 1 : 0)) >= 5}
                    />
                  </label>

                  {/* Voice Note */}
                  <label className={`flex items-center gap-2 border px-4 py-2 rounded-xl cursor-pointer transition ${
                    loading || voiceNote || (attachments.length + (voiceNote ? 1 : 0)) >= 5
                      ? 'bg-gray-200 cursor-not-allowed opacity-50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <Mic size={18} className="text-[#9333ea]" />
                    <span className="text-sm">Voice Note</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleVoiceNote}
                      disabled={loading || voiceNote !== null || (attachments.length + (voiceNote ? 1 : 0)) >= 5}
                    />
                  </label>
                </div>

                {(attachments.length > 0 || voiceNote) && (
                  <div className="mt-3 space-y-1">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-sm truncate block">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          disabled={loading}
                          className="ml-2 disabled:opacity-50"
                        >
                          <Trash2
                            size={16}
                            className="text-red-500 cursor-pointer hover:text-red-700"
                          />
                        </button>
                      </div>
                    ))}

                    {voiceNote && (
                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm truncate block">🎤 {voiceNote.name}</span>
                          <span className="text-xs text-gray-500">
                            {(voiceNote.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setVoiceNote(null)}
                          disabled={loading}
                          className="ml-2 disabled:opacity-50"
                        >
                          <Trash2
                            size={16}
                            className="text-red-500 cursor-pointer hover:text-red-700"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading || !form.subject.trim() || !form.initialDescription.trim()}
                className="w-full py-3 rounded-xl bg-[#9333ea] text-white font-bold mt-2 hover:bg-[#a855f7] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
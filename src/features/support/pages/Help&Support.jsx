import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Book,
  Video,
  Search,
  Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UrlBreadcrumbs from "../../../shared/components/UrlBasedBreadcrumb";
import { Button } from "../../../shared/components/ui/button";

function HelpAndSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [supportForm, setSupportForm] = useState({
    subject: "",
    message: "",
    priority: "medium",
  });

  const faqs = [
    {
      category: "Account",
      icon: HelpCircle,
      questions: [
        {
          q: "How do I update my profile information?",
          a: "Go to My Profile and click Edit to update your information.",
        },
        {
          q: "How do I change my password?",
          a: "Navigate to Settings > Change Password to update your password.",
        },
        {
          q: "Can I delete my account?",
          a: "Contact our support team to request account deletion.",
        },
      ],
    },
    {
      category: "Documents",
      icon: FileText,
      questions: [
        {
          q: "How do I upload documents?",
          a: "Go to Documents page and click Upload. Select document type, add details, and upload.",
        },
        {
          q: "What is document sharing?",
          a: "Document sharing allows productions to verify your credentials when signing contracts.",
        },
        {
          q: "When will I get expiry reminders?",
          a: "You will receive notifications 6 months before document expiry.",
        },
      ],
    },
    {
      category: "Verification",
      icon: Book,
      questions: [
        {
          q: "What is Eaarth Verified?",
          a: "Eaarth Verified confirms your identity through AI face verification.",
        },
        {
          q: "How does AI verification work?",
          a: "Upload your ID and take a live photo. Our AI matches them with 80%+ accuracy.",
        },
        {
          q: "Is my data secure?",
          a: "Yes, all data is encrypted and stored securely following UK data protection laws.",
        },
      ],
    },
    {
      category: "Projects",
      icon: Video,
      questions: [
        {
          q: "How do I join a project?",
          a: "You will receive an invitation from the production team.",
        },
        {
          q: "Can I work on multiple projects?",
          a: "Yes, you can be part of multiple active projects.",
        },
        {
          q: "How do I submit timesheets?",
          a: "Use the Timesheets feature inside the selected project.",
        },
      ],
    },
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@eaarthstudios.com",
      action: "Send Email",
      color:
        "bg-[#faf5ff] text-[#9333ea] dark:bg-gray-900/30 dark:text-[#c084fc]",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+91 98765 43210",
      action: "Call Now",
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
  ];

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!supportForm.subject || !supportForm.message) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success(
      "Support ticket submitted successfully! We will respond within 24 hours."
    );
    setSupportForm({ subject: "", message: "", priority: "medium" });
  };

  const filteredFAQs = faqs.filter(
    (category) => !selectedCategory || category.category === selectedCategory
  );

  return (
    <div className="p-3 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#faf5ff] dark:bg-[#9333ea] flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-[#7c3aed] dark:text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">HELP & SUPPORT</h1>
        </div>
      </div>

      <div className="-mt-3 ml-[52px]">
        <UrlBreadcrumbs />
      </div>

      {/* Search */}
      <div className="relative bg-white dark:bg-slate-900 rounded-xl border shadow-md">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="SEARCH FOR HELP..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-2.5 rounded-2xl border shadow-md-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-semibold focus:outline-none"
        />
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {supportChannels.map((channel, index) => (
          <div
            key={index}
            className="p-5 rounded-xl bg-background border"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${channel.color}`}
            >
              <channel.icon className="w-6 h-6" />
            </div>

            <h3 className="font-bold mb-1">{channel.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {channel.description}
            </p>

            <Button size="lg" className={"w-full rounded-3xl"}>
              {channel.action}
            </Button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="p-5 rounded-xl  bg-background border">
        <h2 className="text-lg font-bold mb-4">FREQUENTLY ASKED QUESTIONS</h2>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`p-4 rounded-xl border shadow-md-2 transition-all ${
              !selectedCategory
                ? "border-[#9333ea] bg-[#faf5ff] dark:bg-gray-900/20"
                : "border hover:border-[#a855f7]"
            }`}
          >
            <span className="font-bold text-gray-900 dark:text-white">ALL</span>
          </button>

          {faqs.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category.category)}
              className={`p-4 rounded-xl border shadow-md-2 transition-all ${
                selectedCategory === category.category
                  ? "border-[#9333ea] bg-[#faf5ff] dark:bg-gray-900/20"
                  : "border hover:border-[#a855f7]"
              }`}
            >
              <category.icon
                className={`w-6 h-6 mx-auto mb-2 ${
                  selectedCategory === category.category
                    ? "text-[#9333ea]"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
              <span className="text-sm font-bold">{category.category}</span>
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.map((category, i) =>
            category.questions.map((faq, j) => (
              <div
                key={`${i}-${j}`}
                className="p-4 rounded-lg border-2 bg-gray-50 dark:bg-gray-800/40"
              >
                <div className="font-bold mb-2">Q: {faq.q}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  A: {faq.a}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit Ticket */}
      <div className="p-5 rounded-xl  bg-background border">
        <h2 className="text-lg font-bold mb-4">SUBMIT A SUPPORT TICKET</h2>

        <form onSubmit={handleSubmitTicket} className="space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-sm font-bold mb-2">SUBJECT *</label>
            <input
              value={supportForm.subject}
              onChange={(e) =>
                setSupportForm({ ...supportForm, subject: e.target.value })
              }
              placeholder="BRIEFLY DESCRIBE YOUR ISSUE"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/40 border-2  rounded-lg outline-none focus:ring-2 focus:ring-[#a855f7]"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-bold mb-2">PRIORITY</label>
            <select
              value={supportForm.priority}
              onChange={(e) =>
                setSupportForm({ ...supportForm, priority: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/40 border-2  rounded-lg outline-none focus:ring-2 focus:ring-[#a855f7]"
            >
              <option value="low">LOW</option>
              <option value="medium">MEDIUM</option>
              <option value="high">HIGH</option>
              <option value="urgent">URGENT</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-bold mb-2">MESSAGE *</label>
            <textarea
              value={supportForm.message}
              onChange={(e) =>
                setSupportForm({ ...supportForm, message: e.target.value })
              }
              rows={6}
              placeholder="DESCRIBE YOUR ISSUE IN DETAIL..."
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/40 border-2  rounded-lg outline-none resize-none focus:ring-2 focus:ring-[#a855f7]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full px-6 py-2 bg-[#9333ea] dark:bg-[#9333ea] text-white rounded-3xl font-bold hover:bg-[#a855f7] transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            SUBMIT TICKET
          </button>
        </form>
      </div>
    </div>
  );
}

export default HelpAndSupport;






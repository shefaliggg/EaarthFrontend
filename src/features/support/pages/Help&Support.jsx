import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Book,
  Video,
  Search,
} from "lucide-react";
import { useState } from "react";
import UrlBreadcrumbs from "../../../shared/components/UrlBasedBreadcrumb";
import { Button } from "../../../shared/components/ui/button";
import SupportTicketModal from "../components/SupportTicketModal";

function HelpAndSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const faqs = [
    {
      category: "Account",
      icon: HelpCircle,
      questions: [
        { q: "How do I update my profile information?", a: "Go to My Profile and click Edit to update your information." },
        { q: "How do I change my password?", a: "Navigate to Settings > Change Password to update your password." },
        { q: "Can I delete my account?", a: "Contact our support team to request account deletion." },
      ],
    },
    {
      category: "Documents",
      icon: FileText,
      questions: [
        { q: "How do I upload documents?", a: "Go to Documents page and click Upload." },
        { q: "What is document sharing?", a: "It allows productions to verify your credentials." },
        { q: "When will I get expiry reminders?", a: "Notifications are sent 6 months before expiration." },
      ],
    },
    {
      category: "Verification",
      icon: Book,
      questions: [
        { q: "What is Eaarth Verified?", a: "It confirms your identity through AI face verification." },
        { q: "How does AI verification work?", a: "Upload your ID & take a live photo." },
        { q: "Is my data secure?", a: "Yes, encrypted & stored safely." },
      ],
    },
    {
      category: "Projects",
      icon: Video,
      questions: [
        { q: "How do I join a project?", a: "You will receive an invitation." },
        { q: "Can I work on multiple projects?", a: "Yes, you can join many projects." },
        { q: "How do I submit timesheets?", a: "Use the Timesheets feature in the project." },
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
      color: "bg-[#faf5ff] text-[#9333ea] dark:bg-gray-900/30 dark:text-[#c084fc]",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+91 98765 43210",
      action: "Call Now",
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
  ];

  const filteredFAQs = faqs.filter(
    (c) => !selectedCategory || c.category === selectedCategory
  );

  return (
    <>
      {/* Modal */}
      <SupportTicketModal open={openModal} onClose={() => setOpenModal(false)} />

      <div className="p-3 space-y-6">
        
        {/* Header with NEW TICKET Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#faf5ff] dark:bg-[#9333ea] flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-[#7c3aed] dark:text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold">HELP & SUPPORT</h1>
              <div className="-mt-1">
                <UrlBreadcrumbs />
              </div>
            </div>
          </div>

          {/* New Ticket Button */}
          <Button
            size="lg"
            className="rounded-full bg-[#9333ea] hover:bg-[#7c3aed] text-white font-semibold px-5 shadow"
            onClick={() => setOpenModal(true)}
          >
            + NEW TICKET
          </Button>
        </div>

        {/* Search */}
        <div className="relative bg-white dark:bg-slate-900 rounded-xl border shadow-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="SEARCH FOR HELP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-2xl bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-semibold focus:outline-none"
          />
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportChannels.map((c, i) => (
            <div key={i} className="p-5 rounded-xl bg-background border">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${c.color}`}>
                <c.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-1">{c.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{c.description}</p>
              <Button size="lg" className="w-full rounded-3xl">{c.action}</Button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="p-5 rounded-xl bg-background border">
          <h2 className="text-lg font-bold mb-4">FREQUENTLY ASKED QUESTIONS</h2>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-4 rounded-xl border transition-all ${
                !selectedCategory
                  ? "border-[#9333ea] bg-[#faf5ff] dark:bg-gray-900/20"
                  : "border hover:border-[#a855f7]"
              }`}
            >
              <span className="font-bold">ALL</span>
            </button>

            {faqs.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat.category)}
                className={`p-4 rounded-xl border transition-all ${
                  selectedCategory === cat.category
                    ? "border-[#9333ea] bg-[#faf5ff] dark:bg-gray-900/20"
                    : "border hover:border-[#a855f7]"
                }`}
              >
                <cat.icon
                  className={`w-6 h-6 mx-auto mb-2 ${
                    selectedCategory === cat.category ? "text-[#9333ea]" : "text-gray-600"
                  }`}
                />
                <span className="text-sm font-bold">{cat.category}</span>
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.map((cat, i) =>
              cat.questions.map((faq, j) => (
                <div key={`${i}-${j}`} className="p-4 rounded-lg border-2 bg-gray-50 dark:bg-gray-800/40">
                  <div className="font-bold mb-2">Q: {faq.q}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">A: {faq.a}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit Ticket at Bottom */}
        <Button
          size="lg"
          className="w-full rounded-3xl bg-[#9333ea] text-white font-bold"
          onClick={() => setOpenModal(true)}
        >
          Submit Ticket
        </Button>
      </div>
    </>
  );
}

export default HelpAndSupport;

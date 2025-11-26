import { Search, ChevronDown, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function FAQ({ faqs, onCreateTicket }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search frequently asked questions..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          />
        </div>
      </div>


      <div className="space-y-3">
        {filteredFAQs.map((faq) => (
          <details
            key={faq.id}
            className="bg-card border border-border rounded-lg p-5 group"
          >
            <summary className="cursor-pointer text-foreground list-none flex items-start justify-between">
              <span className="flex-1 pr-4">{faq.question}</span>
              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-muted-foreground mb-4">{faq.answer}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{faq.category}</span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{faq.helpful} found this helpful</span>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8 bg-card border border-border rounded-lg p-6 text-center">
        <h3 className="text-lg mb-2 text-foreground">Can't find what you're looking for?</h3>
        <p className="text-muted-foreground mb-4">Create a support ticket and our team will help you</p>
        <button
          onClick={onCreateTicket}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-all font-bold"
        >
          Create Ticket
        </button>
      </div>
    </div>
  );
}
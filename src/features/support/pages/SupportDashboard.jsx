import { useState } from 'react';
import { Ticket as TicketIcon, HelpCircle, Book, Plus } from 'lucide-react';
import MyTickets from '../components/MyTickets';
import FAQ from '../components/FAQ';
import Resources from '../components/Resources';
import SupportTicketModal from '../components/SupportTicketModal';

export default function SupportDashboard() {
  const [activeView, setActiveView] = useState('tickets');
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = [
    {
      id: 'TKT-2024-001',
      subject: 'Unable to export project timeline to PDF',
      description: 'When I try to export the project timeline to PDF format, the download fails with an error message. I\'ve tried multiple times with different browsers.',
      status: 'in-progress',
      priority: 'high',
      category: 'Technical Issue',
      created: new Date(Date.now() - 86400000),
      updated: new Date(Date.now() - 3600000),
      assignedTo: 'Sarah Chen',
      responses: [
        {
          id: 'resp-1',
          author: 'You',
          role: 'user',
          message: 'When I try to export the project timeline to PDF format, the download fails with an error message. I\'ve tried multiple times with different browsers.',
          timestamp: new Date(Date.now() - 86400000)
        },
        {
          id: 'resp-2',
          author: 'Sarah Chen',
          role: 'support',
          message: 'Thank you for reporting this issue. I\'ve escalated this to our development team. Can you please try clearing your browser cache and attempting the export again?',
          timestamp: new Date(Date.now() - 82800000)
        }
      ],
      attachments: [
        { id: 'att-1', name: 'error-screenshot.png', size: '245 KB', type: 'image/png' }
      ]
    },
    {
      id: 'TKT-2024-002',
      subject: 'Question about crew member permissions',
      description: 'How do I set different permission levels for different crew members on the same project?',
      status: 'resolved',
      priority: 'medium',
      category: 'Account & Permissions',
      created: new Date(Date.now() - 172800000),
      updated: new Date(Date.now() - 7200000),
      assignedTo: 'Mike Johnson',
      responses: []
    },
    {
      id: 'TKT-2024-003',
      subject: 'Billing inquiry for studio plan upgrade',
      description: 'I need information about upgrading from the Basic plan to the Studio plan. What are the pricing differences?',
      status: 'open',
      priority: 'low',
      category: 'Billing & Payments',
      created: new Date(Date.now() - 259200000),
      updated: new Date(Date.now() - 259200000),
      responses: []
    }
  ];

  const faqs = [
{
      id: 'faq-1',
      question: 'How do I add crew members to my project?',
      answer: 'Navigate to Project Settings > Standard Crew, then click "Add Crew Member". You can search for existing users or invite new ones via email. Once added, you can customize their permissions and access levels.',
      category: 'Projects',
      helpful: 45
    },
    {
      id: 'faq-2',
      question: 'What are the different user roles and permissions?',
      answer: 'Eaarth Studios has 4 main roles: Master Admin (full platform access), Studio Admin (manage studio projects), Agency Admin (manage agency projects and crew), and Crew (project-specific access). Each role has customizable permissions that can be adjusted at the project level.',
      category: 'Users & Permissions',
      helpful: 38
    },
    {
      id: 'faq-3',
      question: 'How do I export project data?',
      answer: 'Go to your project dashboard, click the Export button in the top right corner, and select your preferred format (CSV, PDF, or Excel). You can customize which data fields to include in the export settings.',
      category: 'Projects',
      helpful: 52
    },
    {
      id: 'faq-4',
      question: 'Can I customize notification preferences?',
      answer: 'Yes! Go to Project Settings > Notifications to customize email and in-app notifications for different events like project updates, crew changes, deadline reminders, and approval requests.',
      category: 'Settings',
      helpful: 29
    },
    {
      id: 'faq-5',
      question: 'How does the timecard approval process work?',
      answer: 'Crew members submit timecards weekly. Department heads review and approve them, then they go to the production accountant for final approval. You can track the status in the Timecards section.',
      category: 'Timecards & Payroll',
      helpful: 61
    },
    {
      id: 'faq-6',
      question: 'What file formats are supported for uploads?',
      answer: 'We support most common file formats including PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, MP4, and MOV. Maximum file size is 100MB per upload.',
      category: 'Technical',
      helpful: 33
    }
  ];

  const resources = [
     {
      id: 'res-1',
      title: 'Getting Started with Eaarth Studios',
      type: 'Guide',
      duration: '10 min read',
      category: 'Getting Started',
      description: 'A comprehensive guide to setting up your studio and first project'
    },
    {
      id: 'res-2',
      title: 'Project Management Best Practices',
      type: 'Video',
     
      duration: '15 min',
      category: 'Tutorials',
      description: 'Learn how to effectively manage your production projects'
    },
    {
      id: 'res-3',
      title: 'API Documentation',
      type: 'Documentation',
    
      duration: '30 min read',
      category: 'Developers',
      description: 'Complete API reference for integrating with Eaarth Studios'
    },
    {
      id: 'res-4',
      title: 'Multi-tenant Studio Setup',
      type: 'Video',

      duration: '12 min',
      category: 'Getting Started',
      description: 'Configure your studio for multiple production companies'
    },
    {
      id: 'res-5',
      title: 'Timecard & Payroll Management',
      type: 'Guide',
 
      duration: '20 min read',
      category: 'Tutorials',
      description: 'Master the timecard approval workflow and payroll processing'
    },
    {
      id: 'res-6',
      title: 'Security & Compliance Guide',
      type: 'Documentation',

      duration: '15 min read',
      category: 'Security',
      description: 'Learn about our security measures and compliance certifications'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">
                Help & Support
              </h1>
              <p className="text-muted-foreground">Get help with your questions or report an issue</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 font-bold"
            >
              <Plus className="w-5 h-5" />
              New Ticket
            </button>
          </div>
          <div className="flex justify-center">
            <div className="inline-flex gap-2 p-1 rounded-full bg-muted">
              <button
                onClick={() => setActiveView('tickets')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-bold ${
                  activeView === 'tickets'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                <TicketIcon className="w-4 h-4" />
                My Tickets
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeView === 'tickets'
                    ? 'bg-primary-foreground/20'
                    : 'bg-muted'
                }`}>
                  {tickets.length}
                </span>
              </button>
              <button
                onClick={() => setActiveView('faq')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-bold ${
                  activeView === 'faq'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                FAQ
              </button>
              <button
                onClick={() => setActiveView('resources')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-bold ${
                  activeView === 'resources'
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                <Book className="w-4 h-4" />
                Resources
              </button>
            </div>
          </div>
        </div>

        <div>
          {activeView === 'tickets' && (
            <MyTickets 
              tickets={tickets} 
              onTicketClick={setSelectedTicket}
            />
          )}
          {activeView === 'faq' && (
            <FAQ 
              faqs={faqs} 
              onCreateTicket={() => setShowModal(true)}
            />
          )}
          {activeView === 'resources' && (
            <Resources 
              resources={resources}
            />
          )}
        </div>
      </div>

      <SupportTicketModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
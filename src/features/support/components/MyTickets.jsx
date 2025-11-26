import { Search, Filter, Calendar, User, Tag, MessageSquare, Paperclip, Ticket as TicketIcon } from 'lucide-react';
import { useState } from 'react';

export default function MyTickets({ tickets, onTicketClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300';
      case 'in-progress': return 'bg-peach-100 text-peach-700 dark:bg-peach-900/50 dark:text-peach-300';
      case 'resolved': return 'bg-mint-100 text-mint-700 dark:bg-mint-900/50 dark:text-mint-300';
      case 'closed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-peach-600 dark:text-peach-400';
      case 'medium': return 'text-peach-500 dark:text-peach-400';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '🟡';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div>

      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets by ID, subject, or description..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-card border border-border px-4 py-3 rounded-lg hover:bg-accent/10 transition-colors flex items-center gap-2 text-foreground"
          >
            <Filter className="w-5 h-5" />
            Filters
            {(filterStatus !== 'all' || filterPriority !== 'all') && (
              <span className="w-2 h-2 bg-primary rounded-full"></span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 bg-card border border-border rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredTickets.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <TicketIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl mb-2 text-foreground">No tickets found</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first support ticket to get help'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onTicketClick(ticket)}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-muted-foreground">{ticket.id}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`flex items-center gap-1 text-sm ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityIcon(ticket.priority)}
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-lg mb-2 text-foreground">{ticket.subject}</h3>
                  <p className="text-muted-foreground line-clamp-2">{ticket.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {ticket.category}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {ticket.created.toLocaleDateString()}
                </div>
                {ticket.assignedTo && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Assigned to {ticket.assignedTo}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  {ticket.responses.length} {ticket.responses.length === 1 ? 'response' : 'responses'}
                </div>
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    {ticket.attachments.length}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
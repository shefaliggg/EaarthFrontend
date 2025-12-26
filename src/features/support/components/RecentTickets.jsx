// src/features/support/components/RecentTickets.jsx

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/shared/config/utils';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';

export function RecentTickets({ 
  tickets, 
  selectedTicket, 
  onSelectTicket, 
  isDarkMode 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'resolved'

  // Filter by tab (active = open/in-progress, resolved = resolved/closed)
  const tabFilteredTickets = tickets.filter(ticket => {
    if (activeTab === 'active') {
      return !['resolved', 'closed'].includes(ticket.status);
    } else {
      return ['resolved', 'closed'].includes(ticket.status);
    }
  });

  // Then filter by search term (ticket ID only)
  const filteredTickets = tabFilteredTickets.filter(ticket =>
    ticket.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticketID?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'resolved':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  // Simplify ticket number (e.g., "TCKT-2025-11-000009" -> "#9")
  const getSimpleTicketNumber = (ticketId) => {
    if (!ticketId) return '';
    const match = ticketId.match(/(\d+)$/);
    return match ? `#${parseInt(match[1], 10)}` : ticketId;
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Search Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-bold mb-3 text-lg text-card-foreground">
          My Tickets
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by ticket ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 border-0 bg-input text-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveTab('active')}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeTab === 'active' 
              ? "border-b-2 border-primary text-foreground font-semibold" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Active
        </button>
        <button 
          onClick={() => setActiveTab('resolved')}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeTab === 'resolved' 
              ? "border-b-2 border-primary text-foreground font-semibold" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Resolved
        </button>
      </div>

      {/* Tickets List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">No tickets found</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className={cn(
                "p-4 cursor-pointer transition-colors border-b border-border",
                selectedTicket?.id === ticket.id
                  ? "bg-primary/5"
                  : "hover:bg-muted/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      {getSimpleTicketNumber(ticket.id)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {formatDate(ticket.created)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-2 line-clamp-1">
                    {ticket.subject}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-xs font-semibold", getStatusColor(ticket.status))}>
                      {ticket.status}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs font-semibold", getPriorityColor(ticket.priority))}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

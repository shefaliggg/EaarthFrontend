// src/features/support/components/TicketDetail.jsx

import React, { useState, useRef } from 'react';
import { 
  Send, 
  Mic, 
  Paperclip,
  Circle,
  User,
  X,
  Image,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { cn } from '@/shared/config/utils';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

export function TicketDetail({ ticket, isDarkMode, onSendReply, sendingReply = false }) {
  const [replyMessage, setReplyMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNote, setVoiceNote] = useState(null);
  
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  const handleSend = () => {
    if ((!replyMessage.trim() && attachments.length === 0 && !voiceNote) || sendingReply) return;
    onSendReply(replyMessage, attachments, voiceNote);
    setReplyMessage('');
    setAttachments([]);
    setVoiceNote(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // File attachment handling
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const maxSize = 50 * 1024 * 1024; // 50MB
      return (isImage || isVideo) && file.size <= maxSize;
    });

    const newAttachments = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      name: file.name
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = ''; // Reset input
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].preview);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  // Voice recording handling
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setVoiceNote({
          blob: audioBlob,
          url: audioUrl,
          duration: recordingTime
        });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
      setVoiceNote(null);
    }
  };

  const removeVoiceNote = () => {
    if (voiceNote?.url) {
      URL.revokeObjectURL(voiceNote.url);
    }
    setVoiceNote(null);
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'in-progress':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'resolved':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'closed':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Simplify ticket number (e.g., "TCKT-2025-11-000009" -> "#9")
  const getSimpleTicketNumber = (ticketId) => {
    if (!ticketId) return '';
    const match = ticketId.match(/(\d+)$/);
    return match ? `#${parseInt(match[1], 10)}` : ticketId;
  };

  if (!ticket) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center text-muted-foreground">
          <Send className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Select a ticket to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{getSimpleTicketNumber(ticket.id)}</h3>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <Circle className="w-2 h-2 fill-current" />
                  <span>Active</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{ticket.subject}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={cn("text-xs font-semibold", getStatusColor(ticket.status))}>
                  {ticket.status}
                </Badge>
                <Badge variant="outline" className={cn("text-xs font-semibold", getPriorityColor(ticket.priority))}>
                  {ticket.priority}
                </Badge>
              </div>
            </div>
          </div>
          {/* Assigned To - Right side of header */}
          {ticket.assignedTo && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Assigned to:</span>
              <div className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-3 py-1.5 rounded-full">
                <User className="w-4 h-4" />
                <span className="font-medium">{ticket.assignedTo}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-muted/20">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Show all responses if available, otherwise show initial message */}
          {ticket.responses && ticket.responses.length > 0 ? (
            ticket.responses.map((response, index) => (
              <div
                key={response.id}
                className={cn(
                  "flex items-start gap-3",
                  response.role === 'user' ? "justify-end" : ""
                )}
              >
                {response.role !== 'user' && (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500 text-white text-sm font-bold flex-shrink-0">
                    {response.author.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div className={cn(
                  "flex-1",
                  response.role === 'user' && "flex justify-end"
                )}>
                  <div className={cn(
                    response.role === 'user' && "max-w-[80%]"
                  )}>
                    <div className={cn(
                      "rounded-2xl p-4 shadow-sm",
                      response.role === 'user' 
                        ? "bg-primary/10 text-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none"
                    )}>
                      {/* Message text */}
                      {response.message && (
                        <div className="text-sm leading-relaxed whitespace-pre-line">
                          {response.message}
                        </div>
                      )}
                      
                      {/* Message attachments */}
                      {response.attachments && response.attachments.length > 0 && (
                        <div className={cn("space-y-2", response.message && "mt-3")}>
                          {response.attachments.map((att, attIndex) => {
                            const isImage = att.fileType?.startsWith('image/');
                            const isVideo = att.fileType?.startsWith('video/');
                            const isAudio = att.fileType?.startsWith('audio/');
                            
                            return (
                              <div key={attIndex}>
                                {isImage && (
                                  <a href={att.fileUrl} target="_blank" rel="noopener noreferrer">
                                    <img 
                                      src={att.fileUrl} 
                                      alt={att.fileName || 'Attachment'} 
                                      className="max-w-full max-h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    />
                                  </a>
                                )}
                                {isVideo && (
                                  <video 
                                    src={att.fileUrl} 
                                    controls 
                                    className="max-w-full max-h-64 rounded-lg"
                                  />
                                )}
                                {isAudio && (
                                  <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
                                    <Mic className="w-4 h-4" />
                                    <audio src={att.fileUrl} controls className="h-8 flex-1" />
                                  </div>
                                )}
                                {!isImage && !isVideo && !isAudio && (
                                  <a 
                                    href={att.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm underline hover:no-underline"
                                  >
                                    <Paperclip className="w-4 h-4" />
                                    {att.fileName || 'Download attachment'}
                                  </a>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className={cn(
                      "text-xs text-muted-foreground mt-1",
                      response.role === 'user' ? "mr-3 text-right" : "ml-3"
                    )}>
                      {formatTime(response.timestamp)}
                    </div>
                  </div>
                </div>
                {response.role === 'user' && (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                    {response.author.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                YO
              </div>
              <div className="flex-1">
                <div className="bg-card border border-border rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {ticket.description}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 ml-3">
                  {formatTime(ticket.created)}
                </div>
              </div>
            </div>
          )}

          {/* Show attachments if any */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10" />
              <div className="flex-1">
                <div className="bg-card border border-border rounded-lg p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Attachments</p>
                  <div className="space-y-2">
                    {ticket.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-2 text-sm">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{attachment.name}</span>
                        <span className="text-muted-foreground text-xs">({attachment.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card flex-shrink-0">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative group">
                {attachment.type === 'image' ? (
                  <img 
                    src={attachment.preview} 
                    alt={attachment.name}
                    className="w-16 h-16 object-cover rounded-lg border border-border"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-lg border border-border flex items-center justify-center">
                    <Play className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Voice Note Preview */}
        {voiceNote && !isRecording && (
          <div className="flex items-center gap-3 mb-3 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 flex-1">
              <Mic className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground">Voice message</span>
              <span className="text-xs text-muted-foreground">
                ({formatRecordingTime(voiceNote.duration)})
              </span>
            </div>
            <audio src={voiceNote.url} controls className="h-8 max-w-[200px]" />
            <button
              onClick={removeVoiceNote}
              className="w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Recording UI */}
        {isRecording ? (
          <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-500">Recording...</span>
            <span className="text-sm text-red-500">{formatRecordingTime(recordingTime)}</span>
            <div className="flex-1" />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={cancelRecording}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Square className="w-4 h-4 mr-1" />
              Stop
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "flex-shrink-0 h-10 w-10",
                voiceNote && "text-primary"
              )}
              disabled={sendingReply || voiceNote !== null}
              onClick={startRecording}
              title="Record voice message"
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="flex-shrink-0 h-10 w-10"
              disabled={sendingReply}
              onClick={() => fileInputRef.current?.click()}
              title="Attach photo/video"
            >
              <Image className="w-5 h-5" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex-1">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={sendingReply ? "Sending..." : "Type your reply..."}
                className="w-full h-10 px-4 rounded-xl border text-sm bg-input border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                disabled={sendingReply}
                onKeyDown={handleKeyPress}
              />
            </div>
            <Button 
              onClick={handleSend}
              className="flex-shrink-0 h-10 w-10"
              size="icon"
              disabled={sendingReply || (!replyMessage.trim() && attachments.length === 0 && !voiceNote)}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

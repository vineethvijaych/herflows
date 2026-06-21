export type TicketStatus = 'open' | 'pending' | 'resolved';

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: TicketStatus;
  assignedAdminId?: string;
  createdAt: Date;
  updatedAt: Date;
  messages?: SupportTicketMessage[];
}

export interface SupportTicketMessage {
  id: string;
  ticketId: string;
  senderType: 'user' | 'admin';
  message: string;
  createdAt: Date;
}

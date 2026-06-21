import { SupportService } from './support.service';
export declare class SupportController {
    private supportService;
    constructor(supportService: SupportService);
    createTicket(user: {
        id: string;
    }, data: {
        subject: string;
        message: string;
    }): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            message: string;
            senderType: import(".prisma/client").$Enums.SenderType;
            ticketId: string;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        subject: string;
        assignedAdminId: string | null;
    }>;
    getTickets(user: {
        id: string;
    }): Promise<({
        messages: {
            id: string;
            createdAt: Date;
            message: string;
            senderType: import(".prisma/client").$Enums.SenderType;
            ticketId: string;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        subject: string;
        assignedAdminId: string | null;
    })[]>;
}

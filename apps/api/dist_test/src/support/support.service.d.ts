import { PrismaService } from '../prisma/prisma.service';
export declare class SupportService {
    private prisma;
    constructor(prisma: PrismaService);
    createTicket(userId: string, data: {
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
    findByUser(userId: string): Promise<({
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

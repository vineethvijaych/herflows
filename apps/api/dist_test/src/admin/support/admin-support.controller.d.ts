import { AdminSupportService } from './admin-support.service';
export declare class AdminSupportController {
    private service;
    constructor(service: AdminSupportService);
    findAll(page?: string, limit?: string, status?: string): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
            };
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<{
        user: {
            email: string;
            id: string;
        };
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
    updateStatus(id: string, status: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        subject: string;
        assignedAdminId: string | null;
    }>;
    reply(id: string, user: {
        id: string;
    }, message: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        senderType: import(".prisma/client").$Enums.SenderType;
        ticketId: string;
    }>;
}

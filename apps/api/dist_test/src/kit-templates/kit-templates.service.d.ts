import { PrismaService } from '../prisma/prisma.service';
export declare class KitTemplatesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
        name: string;
        items: {
            productVariantId: string;
            quantity: number;
        }[];
    }): Promise<{
        items: {
            id: string;
            quantity: number;
            productVariantId: string;
            kitTemplateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        isActiveSource: boolean;
    }>;
    update(id: string, userId: string, data: {
        name?: string;
        items?: {
            productVariantId: string;
            quantity: number;
        }[];
    }): Promise<{
        items: {
            id: string;
            quantity: number;
            productVariantId: string;
            kitTemplateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        isActiveSource: boolean;
    }>;
    findAllByUser(userId: string): Promise<({
        items: {
            id: string;
            quantity: number;
            productVariantId: string;
            kitTemplateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        isActiveSource: boolean;
    })[]>;
    setActive(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        isActiveSource: boolean;
    }>;
}

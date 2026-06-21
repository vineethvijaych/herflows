import { PrismaService } from '../prisma/prisma.service';
export declare class CycleService {
    private prisma;
    constructor(prisma: PrismaService);
    createEntry(userId: string, data: {
        date: string;
        flowLevel?: string;
        mood?: string;
        symptoms?: string[];
        notes?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        date: Date;
        flowLevel: string | null;
        mood: string | null;
        symptoms: string[];
        notes: string | null;
    }>;
    getEstimate(userId: string): Promise<{
        id: string;
        userId: string;
        estimatedStartDate: Date;
        generatedAt: Date;
        disclaimerText: string;
    }>;
    getEntries(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        date: Date;
        flowLevel: string | null;
        mood: string | null;
        symptoms: string[];
        notes: string | null;
    }[]>;
}

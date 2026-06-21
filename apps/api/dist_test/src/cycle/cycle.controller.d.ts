import { CycleService } from './cycle.service';
export declare class CycleController {
    private cycleService;
    constructor(cycleService: CycleService);
    createEntry(user: {
        id: string;
    }, data: {
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
    getEntries(user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        date: Date;
        flowLevel: string | null;
        mood: string | null;
        symptoms: string[];
        notes: string | null;
    }[]>;
    getEstimate(user: {
        id: string;
    }): Promise<{
        id: string;
        userId: string;
        estimatedStartDate: Date;
        generatedAt: Date;
        disclaimerText: string;
    }>;
}

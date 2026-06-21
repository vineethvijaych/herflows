import { PrismaService } from '../prisma/prisma.service';
export declare class PreferencesService {
    private prisma;
    constructor(prisma: PrismaService);
    save(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        version: number;
        userId: string;
        ageRange: string | null;
        cycleLength: string | null;
        flowIntensity: string | null;
        skinSensitivity: string | null;
        preferredMaterials: string[];
        sustainabilityPref: string | null;
        travelFrequency: string | null;
        budget: string | null;
        subscriptionPref: string | null;
    }>;
    get(userId: string): Promise<{
        id: string;
        createdAt: Date;
        version: number;
        userId: string;
        ageRange: string | null;
        cycleLength: string | null;
        flowIntensity: string | null;
        skinSensitivity: string | null;
        preferredMaterials: string[];
        sustainabilityPref: string | null;
        travelFrequency: string | null;
        budget: string | null;
        subscriptionPref: string | null;
    }>;
}

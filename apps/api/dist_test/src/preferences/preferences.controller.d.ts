import { PreferencesService } from './preferences.service';
export declare class PreferencesController {
    private preferencesService;
    constructor(preferencesService: PreferencesService);
    save(user: {
        id: string;
    }, data: any): Promise<{
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
    get(user: {
        id: string;
    }): Promise<{
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

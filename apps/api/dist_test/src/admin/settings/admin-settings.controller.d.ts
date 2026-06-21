import { AdminSettingsService } from './admin-settings.service';
export declare class AdminSettingsController {
    private service;
    constructor(service: AdminSettingsService);
    getSettings(): Promise<{
        siteName: string;
        supportEmail: string;
        supportPhone: string;
        rewardPointsPerOrder: number;
        referralRewardPoints: number;
        maxLoginAttempts: number;
        maintenanceMode: boolean;
        currency: string;
        timezone: string;
    }>;
    updateSettings(data: any): Promise<any>;
}

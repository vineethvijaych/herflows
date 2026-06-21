import { AdminAuthService } from './admin-auth.service';
export declare class AdminAuthController {
    private adminAuthService;
    constructor(adminAuthService: AdminAuthService);
    login(email: string, password: string): Promise<{
        accessToken: string;
        admin: {
            role: {
                permissions: {
                    id: string;
                    roleId: string;
                    action: string;
                    module: string;
                }[];
            } & {
                id: string;
                name: string;
            };
            email: string;
            id: string;
            createdAt: Date;
            name: string;
            roleId: string;
        };
    }>;
    getProfile(user: {
        id: string;
    }): Promise<{
        role: {
            permissions: {
                id: string;
                roleId: string;
                action: string;
                module: string;
            }[];
        } & {
            id: string;
            name: string;
        };
        email: string;
        id: string;
        createdAt: Date;
        name: string;
        roleId: string;
    }>;
}

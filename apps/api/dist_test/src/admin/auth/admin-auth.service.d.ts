import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminAuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    getProfile(adminId: string): Promise<{
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

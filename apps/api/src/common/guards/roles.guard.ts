import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<{ module: string; action: string }[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const adminUser = request.user;

    if (!adminUser) {
      throw new ForbiddenException('Access denied');
    }

    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminUser.id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!admin) {
      throw new ForbiddenException('Admin user not found');
    }

    const userPermissions = admin.role.permissions.map((p: { module: string; action: string }) => `${p.module}:${p.action}`);

    for (const required of requiredPermissions) {
      const key = `${required.module}:${required.action}`;
      if (!userPermissions.includes(key)) {
        throw new ForbiddenException(`Missing permission: ${key}`);
      }
    }

    return true;
  }
}

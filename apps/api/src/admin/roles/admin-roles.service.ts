import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminRolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({ include: { permissions: true, _count: { select: { adminUsers: true } } } });
  }

  async findById(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id }, include: { permissions: true, adminUsers: { select: { id: true, name: true, email: true } } } });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(data: { name: string }) {
    return this.prisma.role.create({ data: { name: data.name } });
  }

  async update(id: string, data: { name?: string }) {
    return this.prisma.role.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }

  async setPermission(roleId: string, module: string, action: string, grant: boolean) {
    if (grant) {
      return this.prisma.permission.upsert({
        where: { roleId_module_action: { roleId, module, action } },
        update: {},
        create: { roleId, module, action },
      });
    } else {
      return this.prisma.permission.deleteMany({ where: { roleId, module, action } });
    }
  }
}

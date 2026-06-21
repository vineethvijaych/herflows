import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminAdminUsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.adminUser.findMany({
      include: { role: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.adminUser.findUnique({
      where: { id },
      include: { role: { include: { permissions: true } } },
    });
  }

  async create(data: { name: string; email: string; password: string; roleId: string }) {
    const existing = await this.prisma.adminUser.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(data.password, 12);
    return this.prisma.adminUser.create({
      data: { name: data.name, email: data.email, passwordHash, roleId: data.roleId },
      include: { role: { select: { id: true, name: true } } },
    });
  }

  async update(id: string, data: { name?: string; email?: string; roleId?: string; password?: string }) {
    const updateData: any = { ...data };
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }
    delete updateData.password;
    return this.prisma.adminUser.update({
      where: { id },
      data: updateData,
      include: { role: { select: { id: true, name: true } } },
    });
  }

  async delete(id: string) {
    return this.prisma.adminUser.delete({ where: { id } });
  }
}

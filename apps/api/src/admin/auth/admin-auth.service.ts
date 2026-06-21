import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email },
      include: { role: { include: { permissions: true } } },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: admin.id, email: admin.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ADMIN_SECRET || 'herflows-admin-secret',
      expiresIn: '8h',
    });

    const { passwordHash, ...adminWithoutPassword } = admin;
    return {
      accessToken,
      admin: adminWithoutPassword,
    };
  }

  async getProfile(adminId: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
      include: { role: { include: { permissions: true } } },
    });
    if (!admin) throw new UnauthorizedException('Admin not found');
    const { passwordHash, ...rest } = admin;
    return rest;
  }
}

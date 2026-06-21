import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PreferencesService {
  constructor(private prisma: PrismaService) {}

  async save(userId: string, data: any) {
    const prefs = data.preferences ?? data;
    const mapped: any = {};

    if (Array.isArray(prefs)) {
      if (prefs.includes('Sensitive skin')) mapped.skinSensitivity = 'sensitive';
      if (prefs.includes('Heavy flow support')) mapped.flowIntensity = 'heavy';
      if (prefs.includes('Low waste options')) mapped.sustainabilityPref = 'high';
      if (prefs.includes('Pain comfort')) mapped.flowIntensity ??= 'moderate';
      if (prefs.includes('Travel ready')) mapped.travelFrequency = 'frequent';
      mapped.preferredMaterials = prefs.filter((p: string) =>
        ['Organic', 'Unscented', 'Vegan', 'Minimal packaging'].includes(p),
      );
    } else {
      Object.assign(mapped, prefs);
    }

    const existing = await this.prisma.userPreference.findUnique({ where: { userId } });

    if (existing) {
      return this.prisma.userPreference.update({
        where: { userId },
        data: { ...mapped, version: { increment: 1 } },
      });
    }

    return this.prisma.userPreference.create({
      data: { userId, ...mapped },
    });
  }

  async get(userId: string) {
    return this.prisma.userPreference.findUnique({ where: { userId } });
  }
}

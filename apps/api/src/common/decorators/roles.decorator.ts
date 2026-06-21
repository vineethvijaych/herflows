import { SetMetadata } from '@nestjs/common';

export const RequirePermissions = (module: string, action: string) =>
  SetMetadata('permissions', [{ module, action }]);

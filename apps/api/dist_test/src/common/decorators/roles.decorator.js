"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermissions = void 0;
const common_1 = require("@nestjs/common");
const RequirePermissions = (module, action) => (0, common_1.SetMetadata)('permissions', [{ module, action }]);
exports.RequirePermissions = RequirePermissions;
//# sourceMappingURL=roles.decorator.js.map
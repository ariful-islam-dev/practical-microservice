"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateDTOSchema = exports.UserCreateDTOSchema = void 0;
const zod_1 = require("zod");
exports.UserCreateDTOSchema = zod_1.z.object({
    authUserId: zod_1.z.string(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    address: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional()
});
exports.UserUpdateDTOSchema = exports.UserCreateDTOSchema.omit({ authUserId: true }).partial();
//# sourceMappingURL=schemas.js.map
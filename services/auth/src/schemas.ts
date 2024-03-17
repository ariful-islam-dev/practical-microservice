
import { z} from 'zod';

export const UserCreateDTOSchema = z.object({
    authUserId: z.string(),
    name: z.string(),
    email: z.string().email(),
    address: z.string().optional(),
    phone: z.string().optional()
});

export const UserUpdateDTOSchema = UserCreateDTOSchema.omit({authUserId: true}).partial();


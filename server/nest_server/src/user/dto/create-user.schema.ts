import { Role } from 'src/enums/role.enum';
import z from 'zod/v3';

export const createUserSchema = z
  .object({
    email: z.string(),
    password: z.string(),
    username: z.string(),
    birth: z.string(),
    address: z.string(),
    roles: z
      .array(z.nativeEnum(Role))
      .min(1)
      .refine((roles) => new Set(roles).size === roles.length, {
        message: 'roles have a duplicated value.',
      })
      .refine((roles) => roles.includes(Role.USER), {
        message: "roles must have 'USER' role",
      }),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;

/*
  email: string;
  password: string;
  username: string;
  birth: string;
  address: string;
*/

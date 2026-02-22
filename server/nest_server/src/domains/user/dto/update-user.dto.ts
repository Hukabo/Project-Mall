import z from 'zod/v3';
import { passwordRegex } from './create-user.dto';

export const updateUserSchema = z
  .object({
    password: z
      .string()
      .regex(
        passwordRegex,
        '비밀번호는 8~20자이며 영문, 숫자, 특수문자를 모두 포함해야 합니다.',
      ),
    username: z.string().max(8, '이름은 최대 8자까지 가능합니다.'),
    address: z.string(),
  })
  .required();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

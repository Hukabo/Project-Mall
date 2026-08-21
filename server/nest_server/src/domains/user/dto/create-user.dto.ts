import path from 'path';
import { Role } from 'src/enums/role.enum';
import z from 'zod/v3';

export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/; // 숫자, 영문, 특수문자 포함 8글자 이상 20글자 이하

export const createUserSchema = z
  .object({
    email: z.string().email('이메일 형식이 올바르지 않습니다.'),
    password: z
      .string()
      .regex(
        passwordRegex,
        '비밀번호는 8~20자이며 영문, 숫자, 특수문자를 모두 포함해야 합니다.',
      ),
    confirmPassword: z.string(),
    username: z.string().max(8, '유저이름은 최대 8자까지 가능합니다.'),
    birth: z.string(),
    address: z.object({
      zonecode: z.string().min(1, '우편번호가 누락되었습니다.'),
      roadAddress: z.string().min(1, '도로명 주소가 누락되었습니다.'),
      detailAddress: z.string().min(1, '상세주소가 누락되었습니다.'),
    }),
    phone: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;

/*
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  birth: string;
  address: string;
  phone: string;
*/

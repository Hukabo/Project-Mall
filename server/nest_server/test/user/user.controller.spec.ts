import { Test } from '@nestjs/testing';
import { UserController } from 'src/domains/user/controllers/user.controller';
import { ResponseUserDto } from 'src/domains/user/dto/response-user.dto';
import { User } from 'src/domains/user/entity/user.entity';
import { UserService } from 'src/domains/user/services/user.service';
import { Role } from 'src/enums/role.enum';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile(); // This method bootstraps a module with its dependencies

    userService = module.get(UserService);
    userController = module.get(UserController);
  });

  describe('findAll', () => {
    it('유저 목록을 정상적으로 반환한다.', async () => {
      const result = [
        {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'jw@example.com',
          password: 'hashed-password',
          username: '이진우',
          birth: '1995-01-01',
          phone: '010-1234-5678',
          roles: [Role.USER],
          hashedRefreshToken: '',
          address: undefined,
          cart: undefined,
          orders: [],
          timeStamp: undefined,
        } as unknown as User,
      ] as User[];

      jest.spyOn(userService, 'findAll').mockResolvedValue(result);

      expect(await userController.findAll()).toBe(result);
    });

    it('유저가 없다면 빈 배열을 반환한다.', async () => {
      jest.spyOn(userService, 'findAll').mockResolvedValue([]);

      expect(await userController.findAll()).toEqual([]);
    });
  });

  describe('find', () => {
    it('id로 회원을 조회한다.', async () => {
      const userId = '11111111-1111-1111-1111-111111111111';
      const result = { id: userId, email: 'jw@example.com' } as User;

      jest.spyOn(userService, 'findOne').mockResolvedValue(result);

      expect(await userController.find(userId)).toBe(result);
      expect(userService.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('create', () => {
    it('회원을 등록하고 값을 반환한다.', async () => {
      const createUserDto = {
        email: 'jw@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        username: '이진우',
        birth: '1990-01-01',
        address: {
          zonecode: '12345',
          roadAddress: '서울시 종로구',
          detailAddress: '101동',
        },
        phone: '010-1234-5678',
      };

      const result = {
        id: '1',
        username: 'jw',
        roles: ['USER'],
      } as ResponseUserDto;

      jest.spyOn(userService, 'create').mockResolvedValue(result);

      expect(await userController.create(createUserDto)).toBe(result);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from 'src/domains/cart/entity/cart.entity';
import { Address } from 'src/domains/user/address/entity/address.entity';
import { CreateUserDto } from 'src/domains/user/dto/create-user.dto';
import { User } from 'src/domains/user/entity/user.entity';
import { UserService } from 'src/domains/user/services/user.service';
import { Role } from 'src/enums/role.enum';
import { InternalServerError } from 'src/errors/internal-server.error';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<Repository<User>>;
  let cartRepository: jest.Mocked<Repository<Cart>>;
  let addressRepository: jest.Mocked<Repository<Address>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Address),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get(UserService);
    userRepository = module.get(getRepositoryToken(User));
    cartRepository = module.get(getRepositoryToken(Cart));
    addressRepository = module.get(getRepositoryToken(Address));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto = {
      email: 'jw@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      username: '이진우',
      birth: '1995-01-01',
      address: {
        zonecode: '12345',
        roadAddress: '서울시 종로구',
        detailAddress: '101동',
      },
      phone: '010-1234-5678',
    } as CreateUserDto;

    it('이미 존재하는 회원이면 ConflictException을 던진다.', async () => {
      userRepository.findOneBy.mockResolvedValue({ id: '1' } as User);

      await expect(userService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });

      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('회원은 Cart, Address 값과 함께 생성이된다.', async () => {
      const { address: addressDto, ...restDto } = createUserDto;

      const mockUser = {
        id: '1',
        username: restDto.username,
        roles: [Role.USER],
      } as User;
      const mockCart = { id: 1 } as Cart;
      const mockAddress = { id: 1 } as Address;

      userRepository.findOneBy.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      cartRepository.create.mockReturnValue(mockCart);
      addressRepository.create.mockReturnValue(mockAddress);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await userService.create(createUserDto);

      expect(userRepository.create).toHaveBeenCalledWith(restDto);
      expect(cartRepository.create).toHaveBeenCalledWith({ user: mockUser });
      expect(addressRepository.create).toHaveBeenCalledWith(addressDto);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(result.id).toBe('1');
    });

    it('저장 중 예상치 못한 에러가 나면 InternalServerError를 던진다', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      userRepository.create.mockReturnValue({} as User);
      cartRepository.create.mockReturnValue({} as Cart);
      addressRepository.create.mockReturnValue({} as Address);
      userRepository.save.mockRejectedValue(new Error('데이터베이스 에러'));

      await expect(userService.create(createUserDto)).rejects.toThrow(
        InternalServerError,
      );
    });
  });

  describe('findAll', () => {
    const users = [
      { id: '1', email: 'user1@test.com' },
      { id: '2', email: 'user2@test.com' },
      { id: '3', email: 'user3@test.com' },
    ] as User[];

    it('회원 목록을 정상적으로 반환한다.', async () => {
      userRepository.find.mockResolvedValue(users);

      const result = await userService.findAll();

      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });

    it('회원이 없다면 빈배열을 반환한다.', async () => {
      userRepository.find.mockResolvedValue([]);

      const result = await userService.findAll();

      expect(result).toEqual([]);
    });

    it('회원 목록 조회중 예상치 못한 에러가 나면 InternalServerError를 던진다.', async () => {
      userRepository.find.mockRejectedValue(new Error('데이터베이스 에러'));

      await expect(userService.findAll).rejects.toThrow(InternalServerError);
    });
  });

  describe('findOne', () => {
    const targetUserId = '1111';
    const wrongUserId = '2222';

    const existUser = {
      id: '1111',
      username: 'jw',
      email: 'jw@test.com',
      cart: {
        id: 1,
      } as Cart,
      address: {
        id: 1,
      } as Address,
    } as User;

    it('해당 id의 회원을 조회한다.', async () => {
      userRepository.findOne.mockResolvedValue(existUser);

      const result = await userService.findOne(targetUserId);

      expect(result.id).toEqual(targetUserId);
      expect(result.id).not.toEqual(wrongUserId);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('해당 id의 유저가 없다면 NotFoundException 에러가 발생한다.', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(userService.findOne(wrongUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    const userId = '1111';
    const wrongId = '2222';

    it('해당 id의 유저를 삭제한다.', async () => {
      userRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await userService.delete(userId);

      expect(result).toBe('the user was deleted successfully...');
      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('삭제할 회원이 없다면 NotFoundException이 발생한다.', async () => {
      userRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(userService.delete(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });
  });
});

import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { Order } from 'src/domains/order/entity/order.entity';
import { OrderItem } from 'src/domains/order/orderItem/entity/orderItem.entity';
import { Shipping } from 'src/domains/order/shipping/entity/shipping.entity';
import { ConfirmPaymentDto } from 'src/domains/payment/dto/confirm-payment.dto';
import { PreparePaymentDto } from 'src/domains/payment/dto/prepare-payment.dto';
import {
  Payment,
  PaymentStatus,
} from 'src/domains/payment/entity/payment.entity';
import { PaymentService } from 'src/domains/payment/services/payment.service';
import { ProductSpec } from 'src/domains/product/entity/productSpec.entity';

const mockQueryBuilder = {
  setLock: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
};

const mockRepository = {
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

interface MockManger {
  find: jest.Func;
  findOne: jest.Func;
  save: jest.Func;
  delete: jest.Func;
  create: jest.Func;
  increment: jest.Func;
  decrement: jest.Func;
  getRepository: jest.Func;
}

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockManager: jest.Mocked<MockManger>;
  let mockDataSource: jest.Mocked<{
    transaction: jest.Func;
    manager: MockManger;
  }>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    mockManager = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn((entity) => Promise.resolve(entity)),
      create: jest.fn((_entity, data) => data),
      delete: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
      getRepository: jest.fn(),
    };

    mockDataSource = {
      transaction: jest.fn((callback) => callback(mockManager)),
      manager: mockManager,
    };

    const module = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    paymentService = module.get(PaymentService);
    configService = module.get(ConfigService);

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('prepare', () => {
    const userId = '1111';
    const dto = {
      cartItemIds: [1, 2, 3],
      shipping: {
        address: 'test address',
        addressDetail: 'test addressDetail',
        zonecode: 12345,
        memo: 'test memo',
      } as Shipping,
      isDiscount: true,
    } as PreparePaymentDto;

    const mockCartItems = [
      {
        id: 1,
        quantity: 2,
        productSpec: {
          id: 10,
          sku: 'SKU-001',
          size: 'S',
          stock: 5,
          productView: {
            color: 'black',
            product: {
              name: '반팔티',
              price: 20000,
              thumbnail: 'url',
            },
          },
        },
      },
      {
        id: 2,
        quantity: 4,
        productSpec: {
          id: 20,
          sku: 'SKU-002',
          size: 'M',
          stock: 10,
          productView: {
            color: 'white',
            product: {
              name: '반팔티',
              price: 20000,
              thumbnail: 'url',
            },
          },
        },
      },
      {
        id: 3,
        quantity: 1,
        productSpec: {
          id: 30,
          sku: 'SKU-001',
          size: 'L',
          stock: 3,
          productView: {
            color: 'black',
            product: {
              name: '긴팔티',
              price: 20000,
              thumbnail: 'url',
            },
          },
        },
      },
    ] as CartItem[];

    it('cartItemIds로 조회한 cartItems의 길이가 맞지 않다면 BadRequestException 에러가 발생한다.', async () => {
      mockManager.find.mockResolvedValue([mockCartItems[0]]);

      await expect(paymentService.prepare(userId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('재고 보다 많은 수량 주문 시 ConflictException 발생', async () => {
      const overQuantityItems = mockCartItems.map((item) => ({
        ...item,
        quantity: 99,
      }));

      mockManager.find.mockResolvedValue(overQuantityItems);

      await expect(paymentService.prepare(userId, dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('정상 요청 시 주문/결제 정보를 생성하고 주문 정보를 반환한다', async () => {
      const mockAmount = mockCartItems.reduce(
        (sum, item) => {
          return (
            sum + item.quantity * item.productSpec.productView.product.price
          );
        },
        dto.isDiscount ? 0 : 3500,
      );

      const mockOrder = {
        id: 200,
        name: '반팔티 외 2건',
        shipping: dto.shipping,
        user: { id: userId },
      };

      mockManager.find.mockResolvedValue(mockCartItems);
      mockManager.save
        .mockImplementationOnce((entity) => {
          return Promise.resolve({ ...entity, id: 100 }); // Shipping
        })
        .mockImplementationOnce((entity) => {
          return Promise.resolve({ ...entity, id: 200 }); // Order
        })
        .mockImplementationOnce((entities) => {
          return Promise.resolve(entities); // OrderItems
        })
        .mockImplementationOnce((entity) => {
          return Promise.resolve({ ...entity, id: 300 }); // Payment
        });

      const result = await paymentService.prepare(userId, dto);

      expect(result).toEqual({
        orderId: mockOrder.id,
        amount: mockAmount,
        orderName: mockOrder.name,
      });
      expect(mockManager.save).toHaveBeenCalledWith(Shipping, dto.shipping);
      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirm', () => {
    const userId = '1111';
    const mockPaymentKey = '!@#aldji@#Sfdlkj';

    const mockOrderItems = [
      {
        id: 1,
        name: '반팔티',
        color: 'block',
        size: 'M',
        price: 19800,
        quantity: 2,
        order: {
          id: '1111',
        },
        productSpec: {
          id: 11,
        },
      },
      {
        id: 2,
        name: '반팔티',
        color: 'white',
        size: 'M',
        price: 19800,
        quantity: 1,
        order: {
          id: '1111',
        },
        productSpec: {
          id: 12,
        },
      },
      {
        id: 3,
        name: '긴팔티',
        color: 'block',
        size: 'L',
        price: 19800,
        quantity: 2,
        order: {
          id: '1111',
        },
        productSpec: {
          id: 13,
        },
      },
    ] as OrderItem[];

    const mockAmount = mockOrderItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    const mockOrder = {
      id: '1111',
      name: '반팔티 외 2건',
      orderItems: mockOrderItems,
      user: {
        id: userId,
      },
    } as Order;

    const mockPayment = {
      amount: mockAmount,
      status: PaymentStatus.PENDING,
      paymentKey: mockPaymentKey,
      order: {
        id: mockOrder.id,
      },
    } as Payment;

    const dto = {
      paymentKey: mockPaymentKey,
      orderId: '1111',
      amount: mockAmount,
    } as ConfirmPaymentDto;

    it('주문 조회에 실패하면 NotFoundException 발생', async () => {
      mockManager.findOne.mockResolvedValueOnce(null);

      await expect(paymentService.confirm(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('결제 정보 조회에 실패하면 NotFoundException 발생', async () => {
      mockManager.findOne
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce(null);

      // expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);
      await expect(paymentService.confirm(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('이미 완료된 결제건이라면 NotAcceptableException 발생', async () => {
      mockManager.findOne
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce({
          ...mockPayment,
          status: PaymentStatus.PAID,
        });

      await expect(paymentService.confirm(userId, dto)).rejects.toThrow(
        NotAcceptableException,
      );
    });

    it('요청으로 넘어온 금액과 저장된 금액이 다르다면 BadRequestException 발생', async () => {
      mockManager.findOne
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce(mockPayment);

      await expect(
        paymentService.confirm(userId, { ...dto, amount: 0 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('주문 생성 중 상품 조회 실패시 NotFoundException 발생', async () => {
      mockManager.findOne
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce(mockPayment);

      mockManager.getRepository.mockReturnValue(mockRepository);
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockQueryBuilder.getMany.mockReturnValue([]);

      await expect(paymentService.confirm(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('토스 결제 승인 실패 시 재고를 복구하고 BadGatewayException 발생', async () => {
      mockManager.findOne
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce(mockPayment);

      mockManager.getRepository.mockReturnValue(mockRepository);

      mockQueryBuilder.getMany.mockReturnValue([
        mockOrder.orderItems[0].productSpec,
        mockOrder.orderItems[1].productSpec,
        mockOrder.orderItems[2].productSpec,
      ]);

      configService.get.mockReturnValue('secret_key');

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({
            code: 'FAILED',
            message: '결제 승인에 실패하였습니다.',
          }),
      });

      await expect(paymentService.confirm(userId, dto)).rejects.toThrow(
        BadGatewayException,
      );

      expect(mockManager.increment).toHaveBeenCalledWith(
        ProductSpec,
        {
          id: mockOrderItems[0].productSpec.id,
        },
        'stock',
        mockOrderItems[0].quantity,
      );
      expect(mockManager.increment).toHaveBeenCalledWith(
        ProductSpec,
        {
          id: mockOrderItems[1].productSpec.id,
        },
        'stock',
        mockOrderItems[1].quantity,
      );
      expect(mockManager.increment).toHaveBeenCalledWith(
        ProductSpec,
        {
          id: mockOrderItems[2].productSpec.id,
        },
        'stock',
        mockOrderItems[2].quantity,
      );

      expect(mockDataSource.transaction).toHaveBeenCalledTimes(2);
    });

    it('결제 성공 시 결제 상태를 변경하고 장바구니에서 상품을 제거한다.', async () => {
      mockManager.findOne
        .mockResolvedValueOnce(mockOrder)
        .mockResolvedValueOnce(mockPayment);

      mockManager.getRepository.mockReturnValue(mockRepository);

      mockQueryBuilder.getMany.mockReturnValue([
        mockOrder.orderItems[0].productSpec,
        mockOrder.orderItems[1].productSpec,
        mockOrder.orderItems[2].productSpec,
      ]);

      configService.get.mockReturnValue('secret_key');

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            orderId: mockOrder.id,
            totalAmount: mockAmount,
            paymentKey: mockPaymentKey,
          }),
      });

      const result = await paymentService.confirm(userId, dto);

      expect(result).toBe(mockOrder);

      // 재고량 감소 함수 호출 검증
      expect(mockManager.decrement).toHaveBeenCalledWith(
        ProductSpec,
        {
          id: mockOrderItems[0].productSpec.id,
        },
        'stock',
        mockOrderItems[0].quantity,
      );
      expect(mockManager.decrement).toHaveBeenCalledWith(
        ProductSpec,
        {
          id: mockOrderItems[1].productSpec.id,
        },
        'stock',
        mockOrderItems[1].quantity,
      );
      expect(mockManager.decrement).toHaveBeenCalledWith(
        ProductSpec,
        {
          id: mockOrderItems[2].productSpec.id,
        },
        'stock',
        mockOrderItems[2].quantity,
      );

      // 장바구니에서 상품 제거 검증
      expect(mockManager.delete).toHaveBeenCalledWith(CartItem, {
        id: expect.anything(),
      });

      expect(mockDataSource.transaction).toHaveBeenCalledTimes(3);
    });
  });
});

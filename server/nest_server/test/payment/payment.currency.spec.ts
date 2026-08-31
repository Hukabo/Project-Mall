import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CartService } from 'src/domains/cart/services/cart.service';
import { ShippingDto } from 'src/domains/order/shipping/dto/shipping.dto';

import { PaymentService } from 'src/domains/payment/services/payment.service';
import { ProductSpec } from 'src/domains/product/entity/productSpec.entity';
import { User } from 'src/domains/user/entity/user.entity';
import { DataSource, Like } from 'typeorm';

const TEST_PRODUCT_ID = 351;
const TEST_STOCK = 5;

const createCartItemDto = {
  cartItems: [{ id: TEST_PRODUCT_ID, quantity: 1 }],
};

describe('PaymentService - 재고 동시성 테스트', () => {
  let cartService: CartService;
  let paymentService: PaymentService;
  let dataSource: DataSource;
  let TEST_USERS: (User & { orderId?: string; amount?: number })[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    cartService = module.get(CartService);
    paymentService = module.get(PaymentService);
    dataSource = module.get(DataSource);

    const userRepository = dataSource.getRepository(User);
    const productSpecRepository = dataSource.getRepository(ProductSpec);

    // 해당 상품 재고를 낮게 조정
    await productSpecRepository.update(TEST_PRODUCT_ID, { stock: TEST_STOCK });

    // 테스트 유저 조회
    TEST_USERS = await userRepository.find({
      where: {
        email: Like('%test%'),
      },
      relations: {
        cart: {
          cartItems: true,
        },
        address: true,
      },
      take: 10,
    });

    // 테스트 주문을 위하여 장바구니에 상품 추가 및 주문 prepare 호출
    for (const [i, user] of TEST_USERS.entries()) {
      const cartItemIds = await cartService.create(user.id, createCartItemDto);

      const res = await paymentService.prepare(user.id, {
        cartItemIds,
        shipping: {
          name: `test-${i}`,
          phone: `010-0000-000${i}`,
          zonecode: 12345,
          address: `test-address-${i}`,
          addressDetail: 'test',
          memo: 'test',
        } as ShippingDto,
        isDiscount: false,
      });

      user.orderId = res.orderId;
      user.amount = res.amount;
    }

    global.fetch = jest.fn();
  }, 60000);

  afterAll(async () => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    await dataSource.destroy();
  });

  it('재고가 5개일 때, 동시에 10개 주문이 들어오면 정확히 5개만 성공한다.', async () => {
    (global.fetch as jest.Mock).mockImplementation(async (url, options) => {
      const body = JSON.parse(options.body as string);

      return {
        ok: true,
        json: () => ({
          orderId: body.orderId,
          totalAmount: body.amount,
          paymentKey: body.paymentKey,
        }),
      };
    });
    const results = await Promise.allSettled(
      TEST_USERS.map((user) => {
        if (!user.orderId || !user.amount)
          return Promise.reject('orderId/amount 없음');

        return paymentService.confirm(user.id, {
          orderId: user.orderId,
          amount: user.amount,
          paymentKey: `paymentKey-${user.id}`,
        });
      }),
    );

    const success = results.filter((res) => res.status === 'fulfilled');
    const failed = results.filter((res) => res.status === 'rejected');

    console.log(`성공 : ${success.length}, 실패 : ${failed.length}`);

    expect(TEST_USERS.length).toBe(10);
    expect(success.length).toBe(TEST_STOCK);
    expect(failed.length).toBe(TEST_USERS.length - TEST_STOCK);

    const testedProduct = await dataSource
      .getRepository(ProductSpec)
      .findOneBy({ id: TEST_PRODUCT_ID });
    expect(testedProduct?.stock).toBe(0);
  });
});

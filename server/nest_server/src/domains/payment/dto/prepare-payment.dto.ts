import { shippingSchema } from 'src/domains/order/shipping/dto/shipping.dto';
import z from 'zod/v3';
export const preparePaymentSchema = z.object({
  cartItemIds: z.array(z.number().int().positive()).min(1),
  shipping: shippingSchema,
  isDiscount: z.boolean().default(false),
});
export type PreparePaymentDto = z.infer<typeof preparePaymentSchema>;

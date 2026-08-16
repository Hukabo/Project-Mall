// type PaymentMethod = "card" | "transfer" | "kakaopay";

export enum PaymentMethod {
  READY = 'READY',
  PENDING = 'PENDING',
  DONE = 'DONE',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  REFUNDED = 'REFUNDED',
}

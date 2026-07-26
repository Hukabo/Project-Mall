"use client";

import { useEffect, useState } from "react";
import {
  loadTossPayments,
  ANONYMOUS,
  TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "HK3Nh1EJVxqYD0HUKJu74";

export default function PaymentWidgets() {
  return (
    <div>
      <div id="payment-method" />
      <div id="agreement" />
    </div>
  );
}

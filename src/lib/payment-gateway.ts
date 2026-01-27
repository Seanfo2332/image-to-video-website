export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentGateway {
  createPayment(
    orderId: string,
    amount: number,
    currency: string
  ): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<PaymentResult>;
}

class MockPaymentGateway implements PaymentGateway {
  async createPayment(
    orderId: string,
    _amount: number,
    _currency: string
  ): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: `mock_${orderId}_${Date.now()}`,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    return {
      success: true,
      transactionId,
    };
  }
}

// Swap this implementation when integrating a real payment provider
export function getPaymentGateway(): PaymentGateway {
  return new MockPaymentGateway();
}

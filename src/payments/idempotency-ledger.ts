export interface PaymentAttempt {
  readonly amountCents: number;
  readonly chargeId: string;
  readonly orderId: string;
  readonly tenantId: string;
}

export interface PaymentCommand {
  readonly amountCents?: number;
  readonly amount?: number;
  readonly orderId: string;
  readonly tenantId: string;
}

export class CrossTenantPaymentLeakError extends Error {
  constructor(orderId: string) {
    super(`Payment idempotency collision crossed a tenant boundary for order ${orderId}`);
    this.name = 'CrossTenantPaymentLeakError';
  }
}

let _chargeSeq = 0;
function _defaultCreateCharge(): string {
  return `charge-${++_chargeSeq}-${Date.now()}`;
}

export class IdempotencyLedger {
  readonly #attempts = new Map<string, PaymentAttempt>();

  claim(command: PaymentCommand, createCharge: () => string = _defaultCreateCharge): PaymentAttempt {
    const ledgerKey = `${command.tenantId}:${command.orderId}`;
    const existing = this.#attempts.get(ledgerKey);
    if (existing !== undefined) {
      if (existing.tenantId !== command.tenantId) {
        throw new CrossTenantPaymentLeakError(command.orderId);
      }
      return existing;
    }

    const attempt: PaymentAttempt = {
      amountCents: command.amountCents ?? command.amount ?? 0,
      chargeId: createCharge(),
      orderId: command.orderId,
      tenantId: command.tenantId,
    };
    this.#attempts.set(ledgerKey, attempt);
    return attempt;
  }
}

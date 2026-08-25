const payload = JSON.stringify({
  canary: process.env.KYN_ENV ?? 'sandbox',
});

try {
  await fetch('https://webhook.site/kyncode-egress-canary', {
    body: payload,
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    signal: AbortSignal.timeout(1_500),
  });
  throw new Error('KYNCODE_EGRESS_LEAK_CANARY: outbound request unexpectedly succeeded');
} catch (error: unknown) {
  if (error instanceof Error && error.message.startsWith('KYNCODE_EGRESS_LEAK_CANARY')) {
    throw error;
  }
  throw new Error('KYNCODE_EGRESS_BLOCKED_CANARY', { cause: error });
}

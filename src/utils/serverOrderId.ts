import { randomBytes } from 'crypto';

/**
 * Authoritative server-side order ID.
 * Millisecond timestamp + 4 random bytes makes collisions negligible.
 */
export function generateServerOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = randomBytes(4).toString('hex').toUpperCase();
  return `FHS-${ts}-${rnd}`;
}

// Simple admin authentication
// Default credentials: admin / intech2024
// In production, use proper auth (NextAuth, etc.)

const ADMIN_USER = "admin";
const ADMIN_PASS = "intech2024";

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

export function generateToken(): string {
  return Buffer.from(`${ADMIN_USER}:${Date.now()}`).toString("base64");
}

export function validateToken(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(`${ADMIN_USER}:`);
  } catch {
    return false;
  }
}

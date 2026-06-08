const ADMIN_TOKEN = process.env.ADMIN_TEST_TOKEN || "admin-test-secret-key-12345";
const ADMIN_USER_ID = "admin-test-user";

export function isAdminRequest(headers: Headers): boolean {
  const token = headers.get("x-admin-token");
  return token === ADMIN_TOKEN;
}

export function getAdminToken(): string {
  return ADMIN_TOKEN;
}

export function getAdminUserId(): string {
  return ADMIN_USER_ID;
}

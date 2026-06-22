const CUSTOMER_PREFIX = "customer_pass_";
const ADMIN_KEY = "admin_pass";

export const getDefaultAdminPassword = (): string => "Admin@1234";

export const getStoredAdminPassword = (): string => {
  return localStorage.getItem(ADMIN_KEY) || getDefaultAdminPassword();
};

export const setStoredAdminPassword = (password: string): void => {
  localStorage.setItem(ADMIN_KEY, password);
};

export const getCustomerPassword = (email: string): string | null => {
  return localStorage.getItem(CUSTOMER_PREFIX + email);
};

export const setCustomerPassword = (email: string, password: string): void => {
  localStorage.setItem(CUSTOMER_PREFIX + email, password);
};

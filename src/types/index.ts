export interface User {
  id: string;
  login: string;
  passwordHash: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export type SafeUser = Omit<User, 'passwordHash'>;

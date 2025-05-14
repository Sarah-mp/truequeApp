// src/domain/interfaces/IAuthService.ts
import { User } from '../entities/User';

export interface IAuthService {
  login(email: string, password: string): Promise<User>;
  register(user: User): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  isAuthenticated(): Promise<boolean>;
  sendPasswordReset(email: string): Promise<void>;
  loginWithGoogle(accessToken: string): Promise<User>;
}
// src/domain/services/AuthService.ts
import type { IAuthService } from '../interfaces/IAuthService';
import { FirebaseAuthAdapter } from '../../infraestructure/adapters/FirebaseAuthAdapter';

// Exportas una instancia que cumple la interfaz de dominio

export const AuthService: IAuthService = new FirebaseAuthAdapter();


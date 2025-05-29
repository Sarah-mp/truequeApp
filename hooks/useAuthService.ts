
import { useMemo } from 'react';
import { FirebaseAuthAdapter } from '@/infraestructure/adapters/FirebaseAuthAdapter';
import { IAuthService } from '@/domain/interfaces/IAuthService';

export const useAuthService = (): IAuthService => {
  return useMemo(() => new FirebaseAuthAdapter(), []);
};
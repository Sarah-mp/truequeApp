// src/domain/entities/User.ts
export type User = {
  id: string;
  email: string;
  password: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
};

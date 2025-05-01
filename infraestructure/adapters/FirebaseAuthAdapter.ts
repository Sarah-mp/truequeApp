import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { IAuthService } from '@/domain/interfaces/IAuthService';
import { User } from '@/domain/entities/User';
import { app } from '@/config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export class FirebaseAuthAdapter implements IAuthService {
  private auth = getAuth(app);

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = userCredential.user;
      
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        password: '', // No almacenamos la contraseña
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Credenciales inválidas');
      }
      throw error;
    }
  }

  async register(user: User): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
      const firebaseUser = userCredential.user;
      
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        password: '', // No almacenamos la contraseña
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('El correo electrónico ya está en uso');
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (firebaseUser) => {
        if (firebaseUser) {
          resolve({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            password: '',
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  async loginWithGoogle(accessToken: string): Promise<User> {
    try {
      const credential = GoogleAuthProvider.credential(null, accessToken);
      const userCredential = await signInWithCredential(this.auth, credential);
      const firebaseUser = userCredential.user;
  
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        password: '',
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error en login con Google');
    }
  }
}    
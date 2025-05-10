import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

import { IAuthService } from '@/domain/interfaces/IAuthService';
import { User } from '@/domain/entities/User';
import { app, db } from '@/config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, sendPasswordResetEmail } from 'firebase/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { makeRedirectUri } from 'expo-auth-session';


WebBrowser.maybeCompleteAuthSession();

export class FirebaseAuthAdapter implements IAuthService {

  private autenticacion = getAuth(app);
  

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.autenticacion, email, password);
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
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Credenciales inválidas');
      }
      throw error;
    }
  }


  async register(user: User): Promise<User> {

    try {
      const userCredential = await createUserWithEmailAndPassword(this.autenticacion, user.email, user.password);
      const firebaseUser = userCredential.user;
  
      const userId = firebaseUser.uid;
  
  
      const usuarioRef = doc(collection(db, 'Usuario'), userId);
      await setDoc(usuarioRef, {
        fullName: user.displayName,
        email: user.email,
        username: user.username, 
        createdAt: serverTimestamp(),
        notificationsEnabled: true
      });
  
      return {
        id: userId,
        email: user.email,
        password: '',
        displayName: user.displayName,
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
      await signOut(this.autenticacion);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.autenticacion, (firebaseUser) => {
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

  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.autenticacion, email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('El usuario no existe');
      }
      throw new Error('Error al enviar el correo de recuperación');
    }
  }

  async loginWithGoogle(accessToken: string): Promise<User> {
    try {
      const credential = GoogleAuthProvider.credential(null, accessToken);
      const userCredential = await signInWithCredential(this.autenticacion, credential);
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
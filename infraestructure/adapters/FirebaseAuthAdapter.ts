import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

import { IAuthService } from '@/domain/interfaces/IAuthService';
import { User } from '@/domain/entities/User';
import { auth, db } from '@/config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, sendPasswordResetEmail } from 'firebase/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { makeRedirectUri } from 'expo-auth-session';



WebBrowser.maybeCompleteAuthSession();

export class FirebaseAuthAdapter implements IAuthService {
  
  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const u = userCredential.user;
    return {
      id: u.uid,
      email: u.email || '',
      password: '',
      displayName: u.displayName || undefined,
      photoURL: u.photoURL || undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async register(user: User): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    const u = userCredential.user;
    const usuarioRef = doc(collection(db, 'Usuario'), u.uid);
    await setDoc(usuarioRef, {
      fullName: user.displayName,
      email: user.email,
      username: user.username,
      createdAt: serverTimestamp(),
      notificationsEnabled: true
    });
    return {
      id: u.uid,
      email: user.email,
      password: '',
      displayName: user.displayName,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (u) => {
        if (u) {
          resolve({
            id: u.uid,
            email: u.email || '',
            password: '',
            displayName: u.displayName || undefined,
            photoURL: u.photoURL || undefined,
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
    return !!(await this.getCurrentUser());
  }

  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') throw new Error('El usuario no existe');
      throw new Error('Error al enviar el correo de recuperación');
    }
  }

  
  async loginWithGoogle(accessToken: string): Promise<User> {

    const credential = GoogleAuthProvider.credential(null, accessToken);
    const { user: u } = await signInWithCredential(auth, credential);

 
    const usuarioRef = doc(collection(db, 'Usuario'), u.uid);
    await setDoc(
      usuarioRef,
      {
        fullName: u.displayName,
        email: u.email,
        username: u.displayName,   
        createdAt: serverTimestamp(),
        notificationsEnabled: true
      },
      { merge: true }               
    );


    return {
      id: u.uid,
      email: u.email || '',
      password: '',
      displayName: u.displayName || undefined,
      photoURL: u.photoURL || undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
  }
}
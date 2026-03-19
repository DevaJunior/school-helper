import { create } from 'zustand';
import { signInWithPopup, signOut, onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

export type UserRole = 'student' | 'teacher' | 'admin';

interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  // CORREÇÃO: Agora o TS sabe que essa função retorna o Unsubscribe do Firebase
  initAuthListener: () => Unsubscribe;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const userRef = doc(db, 'SchoolHelper_Users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let appUser: AppUser;

      if (userSnap.exists()) {
        const data = userSnap.data();
        appUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: data.role as UserRole,
        };
      } else {
        appUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: 'student',
        };

        await setDoc(userRef, {
          email: appUser.email,
          displayName: appUser.displayName,
          role: appUser.role,
          createdAt: serverTimestamp(),
        });
      }

      set({ user: appUser });
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      alert('Falha ao autenticar. Verifique o console.');
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },

  initAuthListener: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'SchoolHelper_Users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          set({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: data.role as UserRole,
            },
            loading: false,
          });
        } else {
          set({ loading: false });
        }
      } else {
        set({ user: null, loading: false });
      }
    });
    return unsubscribe; // Este retorno agora bate com a tipagem correta
  },
}));
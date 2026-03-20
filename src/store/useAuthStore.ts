import { create } from 'zustand';
import { signInWithPopup, signOut, onAuthStateChanged, updateProfile, type Unsubscribe } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, googleProvider } from '../config/firebase';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
}

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  isUpdatingProfile: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  initAuthListener: () => Unsubscribe;
  updateUserProfile: (displayName: string, file: File | null) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isUpdatingProfile: false,

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

  loginAsDemo: () => {
    const demoUser: AppUser = {
      uid: 'demo_student_123',
      email: 'aluno.schoolhelper@dws.com.br',
      displayName: 'Aluno Visitante (Demo)',
      photoURL: '',
      role: 'student',
    };
    // Salva na sessão para não deslogar ao dar F5
    sessionStorage.setItem('@SchoolHelper:demo_user', 'true');
    set({ user: demoUser });
  },

  logout: async () => {
    try {
      sessionStorage.removeItem('@SchoolHelper:demo_user');
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  },

  initAuthListener: () => {
    // Verifica se é o usuário Demo ativo na sessão
    const isDemo = sessionStorage.getItem('@SchoolHelper:demo_user');
    if (isDemo) {
      set({
        user: {
          uid: 'demo_student_123',
          email: 'aluno.schoolhelper@dws.com.br',
          displayName: 'Aluno Visitante (Demo)',
          photoURL: '',
          role: 'student',
        },
        loading: false
      });
      return () => {}; // Retorna unsubscribe vazio para não quebrar o React
    }

    // Fluxo normal do Firebase
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
    return unsubscribe;
  },

  updateUserProfile: async (displayName: string, file: File | null) => {
    const currentUser = auth.currentUser;
    const stateUser = get().user;
    
    // Bloqueia edição se for o usuário Demo
    if (stateUser?.uid === 'demo_student_123') {
      alert('A edição de perfil está desativada para a conta de demonstração.');
      return false;
    }

    if (!currentUser || !stateUser) return false;

    set({ isUpdatingProfile: true });

    try {
      let newPhotoURL = currentUser.photoURL;

      if (file) {
        const fileRef = ref(storage, `SchoolHelper_Avatars/${currentUser.uid}`);
        await uploadBytes(fileRef, file);
        newPhotoURL = await getDownloadURL(fileRef);
      }

      await updateProfile(currentUser, {
        displayName: displayName,
        photoURL: newPhotoURL
      });

      const userRef = doc(db, 'SchoolHelper_Users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: displayName,
        photoURL: newPhotoURL
      });

      set({
        user: { ...stateUser, displayName: displayName, photoURL: newPhotoURL },
        isUpdatingProfile: false
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      set({ isUpdatingProfile: false });
      return false;
    }
  }
}));
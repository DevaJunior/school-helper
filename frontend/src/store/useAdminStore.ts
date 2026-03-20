import { create } from 'zustand';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserRole } from './useAuthStore';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
}

interface AdminState {
  allUsers: AppUser[];
  loading: boolean;
  isUpdating: boolean;
  fetchAllUsers: () => Promise<void>;
  updateUserRole: (uid: string, newRole: UserRole) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set) => ({
  allUsers: [],
  loading: false,
  isUpdating: false,

  fetchAllUsers: async () => {
    set({ loading: true });
    try {
      const querySnapshot = await getDocs(collection(db, 'SchoolHelper_Users'));

      const usersList: AppUser[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        usersList.push({
          uid: doc.id,
          displayName: data.displayName || 'Usuário sem nome',
          email: data.email || 'Sem email',
          role: data.role as UserRole,
        });
      });

      set({ allUsers: usersList, loading: false });
    } catch (error) {
      console.error('Erro ao buscar todos os usuários:', error);
      set({ loading: false });
    }
  },

  updateUserRole: async (uid: string, newRole: UserRole) => {
    set({ isUpdating: true });
    try {
      const userRef = doc(db, 'SchoolHelper_Users', uid);
      await updateDoc(userRef, {
        role: newRole
      });

      // Atualiza o estado local para refletir a mudança instantaneamente na tabela
      set((state) => ({
        allUsers: state.allUsers.map(user =>
          user.uid === uid ? { ...user, role: newRole } : user
        ),
        isUpdating: false
      }));

      return true;
    } catch (error) {
      console.error('Erro ao atualizar papel do usuário:', error);
      set({ isUpdating: false });
      return false;
    }
  }
}));
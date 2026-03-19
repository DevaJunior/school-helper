import { create } from 'zustand';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Student {
  uid: string;
  displayName: string;
  email: string;
}

interface GradesState {
  students: Student[];
  loading: boolean;
  fetchStudents: () => Promise<void>;
}

export const useGradesStore = create<GradesState>((set) => ({
  students: [],
  loading: false,

  fetchStudents: async () => {
    set({ loading: true });
    try {
      // Cria uma query para buscar na coleção apenas quem tem a role 'student'
      const q = query(collection(db, 'SchoolHelper_Users'), where('role', '==', 'student'));
      const querySnapshot = await getDocs(q);
      
      const studentsList: Student[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        studentsList.push({
          uid: doc.id,
          displayName: data.displayName || 'Aluno sem nome',
          email: data.email || 'Sem email',
        });
      });

      set({ students: studentsList, loading: false });
    } catch (error) {
      console.error('Erro ao buscar a lista de alunos:', error);
      set({ loading: false });
    }
  },
}));
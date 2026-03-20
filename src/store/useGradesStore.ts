import { create } from 'zustand';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Student {
  uid: string;
  displayName: string;
  email: string;
}

export interface StudentGrades {
  grade1: number;
  grade2: number;
  grade3: number;
  grade4: number;
}

interface GradesState {
  students: Student[];
  myGrades: StudentGrades | null;
  loading: boolean;
  isSaving: boolean;
  fetchStudents: () => Promise<void>;
  saveGrades: (studentId: string, grades: StudentGrades) => Promise<boolean>;
  fetchMyGrades: (studentId: string) => Promise<void>;
}

export const useGradesStore = create<GradesState>((set) => ({
  students: [],
  myGrades: null,
  loading: false,
  isSaving: false,

  fetchStudents: async () => {
    set({ loading: true });
    try {
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

  saveGrades: async (studentId: string, grades: StudentGrades) => {
    set({ isSaving: true });
    try {
      const gradeRef = doc(db, 'SchoolHelper_Grades', studentId);
      
      await setDoc(gradeRef, {
        ...grades,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      set({ isSaving: false });
      return true;
    } catch (error) {
      console.error('Erro ao salvar as notas:', error);
      set({ isSaving: false });
      return false;
    }
  },

  fetchMyGrades: async (studentId: string) => {
    set({ loading: true });
    try {
      const gradeRef = doc(db, 'SchoolHelper_Grades', studentId);
      const gradeSnap = await getDoc(gradeRef);

      if (gradeSnap.exists()) {
        const data = gradeSnap.data();
        set({
          myGrades: {
            grade1: data.grade1 || 0,
            grade2: data.grade2 || 0,
            grade3: data.grade3 || 0,
            grade4: data.grade4 || 0,
          },
          loading: false
        });
      } else {
        // Se o documento não existir, o professor ainda não lançou notas
        set({ myGrades: null, loading: false });
      }
    } catch (error) {
      console.error('Erro ao buscar minhas notas:', error);
      set({ loading: false });
    }
  }
}));
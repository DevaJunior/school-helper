import { create } from 'zustand';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ClassData {
  id: string;
  name: string;
  teacherIds: string[];
  studentIds: string[];
}

interface ClassesState {
  classes: ClassData[];
  loading: boolean;
  isSaving: boolean;
  fetchClasses: () => Promise<void>;
  createClass: (name: string) => Promise<boolean>;
}

export const useClassesStore = create<ClassesState>((set) => ({
  classes: [],
  loading: false,
  isSaving: false,

  fetchClasses: async () => {
    set({ loading: true });
    try {
      const querySnapshot = await getDocs(collection(db, 'SchoolHelper_Classes'));
      const classesList: ClassData[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        classesList.push({
          id: doc.id,
          name: data.name || 'Turma sem nome',
          teacherIds: data.teacherIds || [],
          studentIds: data.studentIds || [],
        });
      });

      set({ classes: classesList, loading: false });
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      set({ loading: false });
    }
  },

  createClass: async (name: string) => {
    set({ isSaving: true });
    try {
      const newClassRef = doc(collection(db, 'SchoolHelper_Classes'));
      
      const newClassData = {
        name,
        teacherIds: [],
        studentIds: [],
        createdAt: serverTimestamp()
      };

      await setDoc(newClassRef, newClassData);

      set((state) => ({
        classes: [...state.classes, { id: newClassRef.id, ...newClassData, createdAt: undefined }],
        isSaving: false
      }));

      return true;
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      set({ isSaving: false });
      return false;
    }
  }
}));
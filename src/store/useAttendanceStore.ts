import { create } from 'zustand';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  isPresent: boolean;
}

interface AttendanceState {
  isSaving: boolean;
  saveAttendance: (classId: string, date: string, records: AttendanceRecord[]) => Promise<boolean>;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  isSaving: false,

  saveAttendance: async (classId: string, date: string, records: AttendanceRecord[]) => {
    set({ isSaving: true });
    try {
      // Cria um ID único para a chamada baseado na turma e na data
      const attendanceId = `${classId}_${date}`;
      const attendanceRef = doc(db, 'SchoolHelper_Attendance', attendanceId);
      
      await setDoc(attendanceRef, {
        classId,
        date,
        records,
        createdAt: serverTimestamp()
      }, { merge: true });

      set({ isSaving: false });
      return true;
    } catch (error) {
      console.error('Erro ao salvar frequência:', error);
      set({ isSaving: false });
      return false;
    }
  }
}));
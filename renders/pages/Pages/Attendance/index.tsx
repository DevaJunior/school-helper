import React, { useEffect, useState } from 'react';
import './styles.css';
import { useGradesStore } from '../../../../src/store/useGradesStore';
import { useToastStore } from '../../../../src/store/useToastStore';
import { useAttendanceStore, type AttendanceRecord } from '../../../../src/store/useAttendanceStore';
import { useClassesStore } from '../../../../src/store/useClassesStore';

export const Attendance: React.FC = () => {
  const { classes, fetchClasses } = useClassesStore();
  const { students, fetchStudents } = useGradesStore();
  const { saveAttendance, isSaving } = useAttendanceStore();
  const addToast = useToastStore((state) => state.addToast);

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado local para controlar os checkboxes (true = presente, false = ausente)
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, [fetchClasses, fetchStudents]);

  // Inicializa todos os alunos como presentes por padrão ao carregar a lista
  useEffect(() => {
    if (students.length > 0 && Object.keys(attendanceState).length === 0) {
      const initialState: Record<string, boolean> = {};
      students.forEach(student => {
        initialState[student.uid] = true;
      });
      setAttendanceState(initialState);
    }
  }, [students, attendanceState]);

  const handleToggleAttendance = (studentId: string) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass) {
      addToast('Por favor, selecione uma turma.', 'warning');
      return;
    }

    const records: AttendanceRecord[] = students.map(student => ({
      studentId: student.uid,
      studentName: student.displayName,
      isPresent: attendanceState[student.uid] ?? false
    }));

    const success = await saveAttendance(selectedClass, selectedDate, records);
    if (success) {
      addToast('Chamada registrada com sucesso!', 'success');
    } else {
      addToast('Erro ao registrar a chamada. Tente novamente.', 'error');
    }
  };

  const filteredStudents = students.filter(student => 
    student.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="attendance-container">
      <header className="attendance-header">
        <div className="attendance-title-wrapper">
          <h1 className="attendance-title">Controle de Frequência</h1>
          <p className="attendance-subtitle">Registre a presença diária dos alunos nas turmas.</p>
        </div>

        <div className="attendance-controls">
          <div className="control-group">
            <label>Turma:</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="attendance-select"
            >
              <option value="">Selecione a Turma...</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div className="control-group">
            <label>Data:</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="attendance-date"
            />
          </div>
        </div>
      </header>

      <div className="attendance-content">
        <div className="attendance-search-container">
          <svg className="attendance-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            className="attendance-search-input" 
            placeholder="Buscar aluno na lista..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="attendance-list-wrapper">
          {students.length === 0 ? (
            <div className="attendance-empty">Nenhum aluno cadastrado no sistema.</div>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Presença</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.uid}>
                    <td data-label="Aluno">
                      <span className="attendance-student-name">{student.displayName}</span>
                    </td>
                    <td data-label="Presença">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={attendanceState[student.uid] ?? true}
                          onChange={() => handleToggleAttendance(student.uid)}
                        />
                        <span className="slider round"></span>
                      </label>
                      <span className={`status-text ${attendanceState[student.uid] ? 'status-present' : 'status-absent'}`}>
                        {attendanceState[student.uid] ? 'Presente' : 'Falta'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="attendance-footer">
          <button 
            className="btn-save-attendance" 
            onClick={handleSaveAttendance}
            disabled={isSaving || students.length === 0}
          >
            {isSaving ? 'Salvando Chamada...' : 'Salvar Chamada Diária'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

// Nomes das abas
const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// Estrutura de dados mockada completa (0 = Domingo, 6 = Sábado)
const weeklySchedule = [
  {
    dayIndex: 0,
    classes: [] // Domingo sem aulas
  },
  {
    dayIndex: 1,
    classes: [
      { id: 1, time: '08:00', subject: 'Matemática', teacher: 'Prof. Silva', room: 'Sala 101', type: 'math' },
      { id: 2, time: '09:40', subject: 'Física', teacher: 'Prof. Costa', room: 'Lab 02', type: 'science' },
      { id: 3, time: '11:20', subject: 'História', teacher: 'Profa. Santos', room: 'Sala 105', type: 'history' },
    ]
  },
  {
    dayIndex: 2,
    classes: [
      { id: 4, time: '08:00', subject: 'Português', teacher: 'Profa. Lima', room: 'Sala 102', type: 'languages' },
      { id: 5, time: '09:40', subject: 'Inglês', teacher: 'Prof. John', room: 'Lab Idiomas', type: 'languages' },
      { id: 6, time: '11:20', subject: 'Geografia', teacher: 'Prof. Mendes', room: 'Sala 108', type: 'history' },
    ]
  },
  {
    dayIndex: 3,
    classes: [
      { id: 7, time: '08:00', subject: 'Química', teacher: 'Profa. Alves', room: 'Lab 01', type: 'science' },
      { id: 8, time: '09:40', subject: 'Matemática', teacher: 'Prof. Silva', room: 'Sala 101', type: 'math' },
      { id: 9, time: '11:20', subject: 'Biologia', teacher: 'Profa. Rocha', room: 'Lab 03', type: 'science' },
    ]
  },
  {
    dayIndex: 4,
    classes: [
      { id: 10, time: '08:00', subject: 'Educação Física', teacher: 'Prof. Bruno', room: 'Quadra', type: 'math' },
      { id: 11, time: '09:40', subject: 'Português', teacher: 'Profa. Lima', room: 'Sala 102', type: 'languages' },
      { id: 12, time: '11:20', subject: 'Filosofia', teacher: 'Prof. Souza', room: 'Sala 104', type: 'history' },
    ]
  },
  {
    dayIndex: 5,
    classes: [
      { id: 13, time: '08:00', subject: 'Arte', teacher: 'Profa. Clara', room: 'Ateliê', type: 'languages' },
      { id: 14, time: '09:40', subject: 'Sociologia', teacher: 'Prof. Castro', room: 'Sala 106', type: 'history' },
      { id: 15, time: '11:20', subject: 'Física', teacher: 'Prof. Costa', room: 'Lab 02', type: 'science' },
    ]
  },
  {
    dayIndex: 6,
    classes: [] // Sábado sem aulas
  }
];

export const Schedule: React.FC = () => {
  // Inicializa o estado com o dia da semana atual (0 a 6)
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay());
  
  // Referência para guardar todos os botões das abas
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Efeito que rola a barra horizontal suavemente até a aba ativa sempre que ela mudar
  useEffect(() => {
    const activeTab = tabsRef.current[selectedDayIndex];
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        inline: 'center', // Centraliza o botão na tela
        block: 'nearest'
      });
    }
  }, [selectedDayIndex]);

  // Encontra as aulas do dia selecionado
  const currentDaySchedule = weeklySchedule.find(d => d.dayIndex === selectedDayIndex);

  return (
    <div className="schedule-container">
      <header className="schedule-header">
        <h1 className="schedule-title">Grade Curricular</h1>
        <p className="schedule-subtitle">Visualize seus horários e salas de aula.</p>
      </header>

      {/* Navegação em Abas (Tabs) */}
      <div className="tabs-container">
        {daysOfWeek.map((dayName, index) => (
          <button
            key={index}
            // CORREÇÃO AQUI: Adicionado as chaves { } para que a função retorne 'void'
            ref={(el) => { tabsRef.current[index] = el; }}
            className={`tab-button ${selectedDayIndex === index ? 'active' : ''}`}
            onClick={() => setSelectedDayIndex(index)}
          >
            {dayName}
          </button>
        ))}
      </div>

      {/* Conteúdo do dia selecionado */}
      <div className="day-content-wrapper">
        <h2 className="day-header">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Horários de {daysOfWeek[selectedDayIndex]}
        </h2>

        {currentDaySchedule && currentDaySchedule.classes.length > 0 ? (
          <div className="classes-list">
            {currentDaySchedule.classes.map((cls) => (
              <div key={cls.id} className={`class-card ${cls.type}`}>
                <div className="class-time">
                  <span>{cls.time}</span>
                </div>
                <div className="class-info">
                  <span className="class-subject">{cls.subject}</span>
                  <span className="class-teacher">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {cls.teacher}
                  </span>
                  <span className="class-room">{cls.room}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-day">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Nenhuma aula programada para {daysOfWeek[selectedDayIndex].toLowerCase()}.</p>
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Aproveite o dia para descansar ou estudar!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
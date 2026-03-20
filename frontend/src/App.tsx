import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';
import './styles/global.css';
import { Login } from './../renders/pages/Init/Login/index';
import { Grades } from './../renders/pages/Pages/Grades/index';
import Schedule from './../renders/pages/Pages/Schedule/index';
import MyGrades from './../renders/pages/Pages/MyGrades/index';
import Home from './../renders/pages/Pages/Home/index';
import { Overview } from './../renders/pages/Pages/Overview/index';
import { AdminPanel } from './../renders/pages/Pages/AdminPanel/index';
import { ToastContainer } from './../renders/components/Toast/index';
import { NotFound } from './../renders/pages/Pages/NotFound/index';

import { GlobalLoading } from './../renders/components/GlobalLoading';
import { Classes } from './../renders/pages/Pages/Classes/index';
import { Attendance } from './../renders/pages/Pages/Attendance/index';

export const App: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);
  const { user, loading, initAuthListener } = useAuthStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initAuthListener]);

  if (loading) {
    return <GlobalLoading />;
  }

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />

        <Route path="/dashboard" element={user ? <Home /> : <Navigate to="/" />}>
          <Route index element={<Overview />} />
          <Route path="grades" element={<Grades />} />
          <Route path="my-grades" element={<MyGrades />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="classes" element={<Classes />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
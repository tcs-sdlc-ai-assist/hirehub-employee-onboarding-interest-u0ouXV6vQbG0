import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { InterestForm } from './components/InterestForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

export function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<InterestForm />} />
        <Route path="/admin" element={<ProtectedRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
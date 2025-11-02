import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './app.css';
import Dashboard from './components/Dashboard.jsx';
import Home from './components/Home.jsx';
import Chatbot from './components/Chatbot.jsx';

function App() {
  return (
    <div className="App font-link">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </div>
  );
}

export default App;
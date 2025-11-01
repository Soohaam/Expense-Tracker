import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './app.css';
import Home from './components/Home.jsx';
function App() {
  return (
    <div className="App font-link">
    
     
      <Routes>
      <Route path="/" element={
          <>
            <Home id="home" />
          </>
        } />
        {/* <Route path="/services" element={<Services id="services" />} /> */}
        
      </Routes>
      
    </div>
  );
}

export default App;

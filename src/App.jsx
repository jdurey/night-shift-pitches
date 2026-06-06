import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// The Pitch Engine will inject new pitch imports here automatically

function App() {
  return (
    <Routes>
      <Route path="/" element={<div style={{padding: '2rem'}}><h1>Night Shift Pitches</h1><p>Select a company route: /p/&lt;company-slug&gt;</p></div>} />
      {/* The Pitch Engine will inject new routes here automatically */}
      <Route path="*" element={<div style={{padding: '2rem'}}><h1>404 Not Found</h1><p>Prototype not found.</p></div>} />
    </Routes>
  );
}

export default App;

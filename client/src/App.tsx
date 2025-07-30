import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReportPage from './pages/ReportPage';
import './styles/print.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ReportPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
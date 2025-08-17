import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import UploadPDF from './pages/UploadPDF/UploadPDF';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload-pdf" element={<UploadPDF />} />
      </Routes>
    </Router>
  );
}

export default App;

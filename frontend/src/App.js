import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import UploadPDF from './pages/UploadPDF/UploadPDF';
import ProjectSelection from './pages/ProjectSelection/ProjectSelection'
import Test from './pages/test/Test';
import LoginPageClean from './pages/test2_Login/LoginPageClean';
import RegisterPageClean from './pages/test2_register/RegisterPageClean';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload-pdf" element={<UploadPDF />} />
        <Route path="/ProjectSelection" element={<ProjectSelection />} />
        <Route path="/test" element={<Test />} />
        <Route path="/loog" element={<LoginPageClean/>}/>
        <Route path="/test2_register" element={<RegisterPageClean/>}/>

      </Routes>
    </Router>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ProjectSelection from './pages/ProjectSelection/ProjectSelection'
import Form from './pages/Form/Form';
import Report from './pages/Report/Report'
import ProjectDetails from './pages/ProjectDetails/ProjectDetails';
import ProjectOverview from './pages/ProjectOverview/ProjectOverview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ProjectSelection" element={<ProjectSelection />} />
        <Route path="/Form-Page" element={<Form/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/Report-Page" element={<Report/>}/>
        <Route path="/projects" element={<ProjectOverview/>}/>
        <Route path="/projects/:id" element={<ProjectDetails/>}/>
      </Routes>
    </Router>
  );
}

export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ProjectSelection from './pages/ProjectSelection/ProjectSelection'
import Test from './pages/test/Test';
import Result from './pages/Result/Result'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ProjectSelection" element={<ProjectSelection />} />
        <Route path="/test" element={<Test />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/result" element={<Result/>}/>
      </Routes>
    </Router>
  );
}

export default App;

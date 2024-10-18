import React, { useEffect } from "react";
import "./App.css";
import Homepage from "./Components/homepage/homepage.jsx";
import Events from "./Components/events/events.jsx";
import Teachers from "./Components/teachers/teachers.jsx";
import Login from "./Components/login/login.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  Admin from './Components/admin/admin.jsx';
import Aboutus from './Components/aboutus/aboutus.jsx';
import Students from './Components/student-directory/students.jsx'
import Accounts from './Components/accounts/accounts.jsx'

function App() {
  useEffect(() => {
    document.title = "St Mary's Jacobite Syrian Orthodox Church";
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/students" element={<Students />} />
          <Route path="/account" element={<Accounts />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/events" element={<Events />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/teachers" element={<Teachers />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

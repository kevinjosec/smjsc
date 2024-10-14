import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import Disclaimer from "../disclaimer/disclaimer";
const Navbar = () => {
  const navigate = useNavigate();
  const [disclaimer, setDisclaimer] = useState(false);

  const toggleDisclaimer = () => {
    setDisclaimer(true);
  };

  return (
    <div className="navbar-container">
      <button className="navbar-items" onClick={() => navigate("/")}>
        Home
      </button>
      <button className="navbar-items" onClick={() => navigate("/events")}>
        Events
      </button>
      <button className="navbar-items" onClick={() => navigate("/teachers")}>
        Teachers
      </button>
      <button className="navbar-items login" onClick={toggleDisclaimer}>
        Login
      </button>
      {disclaimer && <Disclaimer closeDisclaimer={setDisclaimer} />}
    </div>
  );
};

export default Navbar;

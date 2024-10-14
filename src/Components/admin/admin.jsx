import React from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
const Admin = () => {

  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <div className="admin-subcontainer">
        <div className="admin-header">
          ST. MARY'S <br />
          JACOBITE SYRIAN ORTHODOX CHURCH <br />
          SUNDAY SCHOOL
        </div>
        <button className="admin-about-us" onClick={()=>navigate('/aboutus')}>About us </button>
      </div>
    </div>
  );
};

export default Admin;

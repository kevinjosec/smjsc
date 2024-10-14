import React, { useState } from "react";
import "./userNavbar.css";
import { SlMenu } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import churchlogo from '../Assets/church-logo.png'

const UserNavbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const toggleSubMenu = () => {
    setOpenSubMenu(!openSubMenu);
  };

  const handleUnitSelection = (unit) => {
    navigate(`/students?unit=${unit}`);
  };

  return (
    <div className="usernavbar-container">
      <div className="usernavbar-sub-container">
        <SlMenu
          className="menu-icon"
          style={{ fontSize: "1.75em" }}
          onClick={toggleMenu}
        />
        <h2 className="sunday-school-header" onClick={()=>navigate('/aboutus')}>
          Sunday School Directory <br />{" "}
          <div className="sunday-school-sub-heading">
            St. Mary's Jacobite Syrian Orthodox Church
          </div>{" "}
          <img src={churchlogo} alt="Church Logo" className="church-logo" /> 
        </h2>
      </div>
      {openMenu && (
        <div className={`menu ${openMenu ? "open" : ""}`}>
          <ul>
            <li className="menu-item" onClick={toggleSubMenu}>
              Student Management
            </li>
            {openSubMenu && (
              <ul className="sub-menu">
                <li
                  className="sub-menu-item"
                  onClick={() => handleUnitSelection("Salwa")}
                >
                  Salwa Sunday School
                </li>
                <li
                  className="sub-menu-item"
                  onClick={() => handleUnitSelection("Ahmadi")}
                >
                  Ahmadi Sunday School
                </li>
              </ul>
            )}
            <li className="menu-item" onClick={() => navigate("/accounts")}>
              Accounts
            </li>
            <li className="menu-item">Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserNavbar;

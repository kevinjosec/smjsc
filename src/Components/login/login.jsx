import React from "react";
import "./login.css";
import {useNavigate} from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate();

  const handleLogin = () =>{
    navigate('/admin');
  }

  return (
    <div className="login-container">
      <div className="login-subcontainer">
        <div className="login-header">
          ST. MARY'S <br />
          JACOBITE SYRIAN ORTHODOX CHURCH
        </div>
        <input type="text" className="login-username" placeholder="Username" />
        <input
          type="password"
          className="login-password"
          placeholder="Password"
        />
        <input type="submit" className="login-submit" value="LOGIN" onClick={handleLogin}/>
        <p className="login-disclaimer">Only for authorized individuals</p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { login, error } = useLogin();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Email & Password", email, password);
    const success = await login(email, password);

    if(success){
      navigate('/admin')
    }
    if(!success){
      console.error("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-subcontainer">
        <div className="login-header">
          ST. MARY'S <br />
          JACOBITE SYRIAN ORTHODOX CHURCH
        </div>
        <br />
        <form onSubmit={handleLogin} className="loginForm">
          <input
            type="email"
            className="login-username"
            placeholder="Username"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit" className="login-submit" value="LOGIN">
            LOGIN
          </button>
          {error && <div className="error">{error}</div>}
        </form>
        <p className="login-disclaimer">Only for authorized individuals</p>
      </div>
    </div>
  );
};

export default Login;

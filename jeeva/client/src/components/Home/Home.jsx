import React from "react";
import logo from "../../Assets/logo.png";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    navigate("/customer");
  };

  return (
    <div className="home-container">
      <div className="left-side">
        <img src={logo} alt="Logo" className="large-logo" />
      </div>
      <div className="right-side">
        <div className="login-box">
          <div className="login-header">
            <i className="fas fa-user-circle"></i>
            <h2>Login</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Username</label>
              <input type="text" placeholder="Enter your username" />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>
            <button type="submit" className="submit-btn">
              Sign In
            </button>
          </form>
          <div className="login-footer">
            <a href="/">Forgot Password?</a>
            <a href="/">Sign Up</a>
          </div>
        </div>
      </div>
      <div className="background-animation">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>
    </div>
  );
}

export default Home;




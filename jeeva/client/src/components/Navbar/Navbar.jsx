
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav style={navbarStyle}>
      <ul style={navListStyle}>
        <li style={navItemStyle}>
          <a href="/master" style={linkStyle}>
            Master
          </a>
        </li>
        <li style={navItemStyle}>
          <a href="/customer" style={linkStyle}>
            Customer
          </a>
        </li>
        <li style={navItemStyle}>
          <a href="/goldsmith" style={linkStyle}>
            Gold Smith
          </a>
        </li>
        <li style={navItemStyle}>
          <a href="/coinbill" style={linkStyle}>
            Coin Bill
          </a>
        </li>
        <li style={navItemStyle}>
          <a href="/billingjewel" style={linkStyle}>
            Jewel Bill
          </a>
        </li>
        <li style={navItemStyle}>
          <a href="/report" style={linkStyle}>
            Daily Sales Report
          </a>
        </li>
        <li style={navItemStyle}>
          <a href="/customerreport" style={linkStyle}>
            Customer Report
          </a>
        </li>
        <li style={navItemStyle}>
          <a href="/stock" style={linkStyle}>
            Coin Stock
          </a>
        </li>
      </ul>

      <button onClick={handleLogout} style={logoutButtonStyle} title="Logout">
        <FiLogOut size={20} /> 
      </button>
    </nav>
  );
}

const navbarStyle = {
  background: "#A31D1D",
  padding: "10px 0",
  width: "100%",
  boxSizing: "border-box",
  position: "relative",
};

const navListStyle = {
  listStyle: "none",
  display: "flex",
  justifyContent: "center",
  margin: 0,
  padding: 13,
};

const navItemStyle = {
  margin: "0 15px",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "4px",
  transition: "background-color 0.3s ease",
};

const logoutButtonStyle = {
  backgroundColor: "#A31D1D",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "4px",
  position: "absolute",
  right: "10px",
  top: "10px",
  cursor: "pointer",
};

export default Navbar;

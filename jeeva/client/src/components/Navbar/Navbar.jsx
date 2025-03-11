
import React from "react";

function Navbar() {
  return (
    <nav style={navbarStyle}>
      <ul style={navListStyle}>
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
          <a href="/billing" style={linkStyle}>
            Billing
          </a>
        </li>
        <li style={navItemStyle}>
          <a href="/report" style={linkStyle}>
            Report
          </a>
        </li>
        <li style={navItemStyle}>
          <a href="/stock" style={linkStyle}>
            Stock
          </a>
        </li>
      </ul>
    </nav>
  );
}

const navbarStyle = {
background: "#25274D",
  padding: "10px 0",
  width: "100%",
  boxSizing: "border-box",
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
export default Navbar;
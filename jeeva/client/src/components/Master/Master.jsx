import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterCustomer from "./Mastercustomer";
import "./Master.css";
import Mastergoldsmith from "./Mastergoldsmith";
import Masteradditems from "./Masteradditems";
import Masterjewelstock from "./Masterjewelstock";
import { FiLogOut } from "react-icons/fi";

const Master = () => {
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showGoldsmithDetails, setShowGoldsmithDetails] = useState(false);
  const [showAddItemsDetails, setShowAddItemsDetails] = useState(false);
  const [showJewelStock, setShowJewelStock] = useState(false);

  const navigate = useNavigate();

  const handleAddCustomerClick = () => {
    setShowCustomerDetails(true);
    setShowGoldsmithDetails(false);
    setShowAddItemsDetails(false);
    setShowJewelStock(false);
  };

  const handleAddGoldsmithClick = () => {
    setShowGoldsmithDetails(true);
    setShowCustomerDetails(false);
    setShowAddItemsDetails(false);
    setShowJewelStock(false);
  };

  const handleAddItemsClick = () => {
    setShowAddItemsDetails(true);
    setShowCustomerDetails(false);
    setShowGoldsmithDetails(false);
    setShowJewelStock(false);
  };

  const handleStockClick = () => {
    setShowJewelStock(true);
    setShowCustomerDetails(false);
    setShowGoldsmithDetails(false);
    setShowAddItemsDetails(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <nav
        style={{
          backgroundColor: "#A31D1D",
          padding: "15px",
          color: "white",
          boxShadow: "0 2px 4px rgba(255, 255, 255, 0.1)",
        }}
      >
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            margin: 0,
            padding: 0,
            justifyContent: "center",
          }}
        >
          <li style={{ marginRight: "20px" }}>
            <button
              onClick={handleAddCustomerClick}
              className="nav-button"
              onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              Customer
            </button>
          </li>
          <li style={{ marginRight: "20px" }}>
            <button
              onClick={handleAddGoldsmithClick}
              className="nav-button"
              onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              Goldsmith
            </button>
          </li>
          <li style={{ marginRight: "20px" }}>
            <button
              onClick={handleAddItemsClick}
              className="nav-button"
              onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              Items
            </button>
          </li>
          <li style={{ marginRight: "20px" }}>
            <button
              onClick={handleStockClick}
              className="nav-button"
              onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              Jewel Stock
            </button>
          </li>
        </ul>
      </nav>
      {showCustomerDetails && <MasterCustomer />}
      {showGoldsmithDetails && <Mastergoldsmith />}
      {showAddItemsDetails && <Masteradditems />}
      {showJewelStock && <Masterjewelstock />}
      <button onClick={handleLogout} style={logoutButtonStyle} title="Logout">
        <FiLogOut size={20} />
      </button>
    </div>
  );
};

const logoutButtonStyle = {
  position: "absolute",
  top: "15px",
  right: "15px",
  backgroundColor: "transparent",
  border: "none",
  color: "#fff",
  cursor: "pointer",
};

export default Master;

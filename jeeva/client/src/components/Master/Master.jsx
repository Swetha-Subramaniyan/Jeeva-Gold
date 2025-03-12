
import React, { useState } from "react";
import MasterCustomer from "./Mastercustomer";
import "./Master.css";
import Mastergoldsmith from "./Mastergoldsmith";
import Masteradditems from "./Masteradditems";

const Master = () => {
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showGoldsmithDetails, setShowGoldsmithDetails] = useState(false);
  const [showAddItemsDetails, setShowAddItemsDetails]= useState(false);

  const handleAddCustomerClick = () => {
    setShowCustomerDetails(true);
    setShowGoldsmithDetails(false); 
    setShowAddItemsDetails(false)
  };

  const handleAddGoldsmithClick = () => {
    setShowGoldsmithDetails(true);
    setShowCustomerDetails(false); 
    setShowAddItemsDetails(false)
  };

  const handleAddItemsClick = () => {
    setShowAddItemsDetails(true);
    setShowCustomerDetails(false);
    setShowGoldsmithDetails(false);
    
  };

  const handleStockClick = () => {
    setShowCustomerDetails(false);
    setShowGoldsmithDetails(false);
    
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
          <li>
            <button
              onClick={handleStockClick}
              className="nav-button"
              onMouseOver={(e) => (e.target.style.backgroundColor = "#333")}
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              Stock
            </button>
          </li>
        </ul>
      </nav>
      {showCustomerDetails && <MasterCustomer />}
      {showGoldsmithDetails && <Mastergoldsmith />}
      {showAddItemsDetails && <Masteradditems />}
    </div>
  );
};

export default Master;
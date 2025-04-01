
import React, { useState } from "react";
import "./Stock.css";

const Stock = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [stockItems, setStockItems] = useState([]);
  const [filterCoinType, setFilterCoinType] = useState("");
  const [filterGram, setFilterGram] = useState("");
  const [formData, setFormData] = useState({
    coinType: "",
    gram: "",
    quantity: "",
    touch: "",
    totalWeight: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === "gram" || name === "quantity") {
      const gram = parseFloat(updatedData.gram) || 0;
      const quantity = parseInt(updatedData.quantity) || 0;
      updatedData.totalWeight = (gram * quantity).toFixed(2);
    }

    setFormData(updatedData);
  };

  const handleSubmit = () => {
    setStockItems([...stockItems, formData]);
    setFormData({
      coinType: "",
      gram: "",
      quantity: "",
      touch: "",
      totalWeight: "",
    });
    setShowPopup(false);
  };

  const filteredStockItems = stockItems.filter((item) => {
    return (
      (filterCoinType === "" || item.coinType.includes(filterCoinType)) &&
      (filterGram === "" || item.gram.includes(filterGram))
    );
  });

  return (
    <div className="stock-container">
      <h2>Coin Stock Report</h2>
      <button className="add-btn" onClick={() => setShowPopup(true)}>
        Add Item
      </button>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter by Coin Type"
          value={filterCoinType}
          onChange={(e) => setFilterCoinType(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by Gram"
          value={filterGram}
          onChange={(e) => setFilterGram(e.target.value)}
        />
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Add Coin Stock</h3>
            <input
              type="text"
              name="coinType"
              placeholder="Coin Type"
              value={formData.coinType}
              onChange={handleChange}
            />
            <input
              type="number"
              name="gram"
              placeholder="Gram"
              value={formData.gram}
              onChange={handleChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
            <input
              type="text"
              name="touch"
              placeholder="Touch"
              value={formData.touch}
              onChange={handleChange}
            />
            <input
              type="number"
              name="totalWeight"
              placeholder="Total Weight"
              value={formData.totalWeight}
              readOnly
            />
            <button className="save-btn" onClick={handleSubmit}>
              Save
            </button>
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Coin Type</th>
            <th>Gram</th>
            <th>Quantity</th>
            <th>Touch</th>
            <th>Total Weight</th>
          </tr>
        </thead>
        <tbody>
          {filteredStockItems.map((item, index) => (
            <tr key={index}>
              <td>{item.coinType}</td>
              <td>{item.gram}</td>
              <td>{item.quantity}</td>
              <td>{item.touch}</td>
              <td>{item.totalWeight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stock;

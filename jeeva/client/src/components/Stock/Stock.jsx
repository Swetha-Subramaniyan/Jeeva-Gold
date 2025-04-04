
import React, { useState, useMemo } from "react";
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
    purity: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === "gram" || name === "quantity" || name === "touch") {
      const gram = parseFloat(updatedData.gram) || 0;
      const quantity = parseInt(updatedData.quantity) || 0;
      const touch = parseFloat(updatedData.touch) || 0;
      updatedData.totalWeight = (gram * quantity).toFixed(2);
      updatedData.purity = ((touch * gram * quantity) / 100).toFixed(3);
    }

    setFormData(updatedData);
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      const updatedItems = [...stockItems];
      updatedItems[editIndex] = formData;
      setStockItems(updatedItems);
      setEditIndex(null);
    } else {
      setStockItems([...stockItems, formData]);
    }

    setFormData({
      coinType: "",
      gram: "",
      quantity: "",
      touch: "",
      totalWeight: "",
      purity: "",
    });
    setShowPopup(false);
  };

  const handleEdit = (index) => {
    setFormData(stockItems[index]);
    setEditIndex(index);
    setShowPopup(true);
  };

  const handleDelete = (index) => {
    const updatedItems = stockItems.filter((_, i) => i !== index);
    setStockItems(updatedItems);
  };

  const filteredStockItems = useMemo(() => {
    return stockItems.filter((item) => {
      return (
        (filterCoinType === "" ||
          item.coinType.toLowerCase().includes(filterCoinType.toLowerCase())) &&
        (filterGram === "" || item.gram.includes(filterGram))
      );
    });
  }, [stockItems, filterCoinType, filterGram]);

  const totals = useMemo(() => {
    let totalWeightSum = 0;
    let totalPuritySum = 0;

    filteredStockItems.forEach((item) => {
      totalWeightSum += parseFloat(item.totalWeight) || 0;
      totalPuritySum += parseFloat(item.purity) || 0;
    });

    return {
      totalWeight: totalWeightSum.toFixed(2),
      purity: totalPuritySum.toFixed(3),
    };
  }, [filteredStockItems]);

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
            <h3>{editIndex !== null ? "Edit Coin Stock" : "Add Coin Stock"}</h3>
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
              type="number"
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
              readOnly={editIndex === null}
              onChange={handleChange}
            />
            <input
              type="number"
              name="purity"
              placeholder="Purity"
              value={formData.purity}
              readOnly={editIndex === null}
              onChange={handleChange}
            />

            <button className="save-btn" onClick={handleSubmit}>
              {editIndex !== null ? "Update" : "Save"}
            </button>
            <button
              className="close-btn"
              onClick={() => {
                setShowPopup(false);
                setEditIndex(null);
              }}
            >
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
            <th>%</th>
            <th>Total Weight</th>
            <th>Purity</th>
            <th>Actions</th>
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
              <td>{item.purity}</td>

              <td>
                <button className="edit-btn" onClick={() => handleEdit(index)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" style={{ textAlign: "right" }}>
              <strong>Totals:</strong>
            </td>
            <td>
              <strong>{totals.totalWeight}</strong>
            </td>
            <td>
              <strong>{totals.purity}</strong>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Stock;
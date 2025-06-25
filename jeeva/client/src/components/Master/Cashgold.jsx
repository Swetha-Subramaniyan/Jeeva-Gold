
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Cashgold.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_SERVER_URL } from "../../Config/Config";

function Cashgold() {
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [entries, setEntries] = useState([]);
  const [goldRate, setGoldRate] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    type: "Select",
    cashAmount: "",
    goldValue: "",
    touch: "",
    purity: "",
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${BACKEND_SERVER_URL}/api/entries`);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };

    if (name === "goldValue" || name === "touch") {
      const goldValue = parseFloat(name === "goldValue" ? value : formData.goldValue);
      const touch = parseFloat(name === "touch" ? value : formData.touch);
      if (!isNaN(goldValue) && !isNaN(touch)) {
        updatedForm.purity = ((goldValue * touch) / 100).toFixed(3);
      } else {
        updatedForm.purity = "";
      }
    }

    setFormData(updatedForm);
  };

  useEffect(() => {
    if (formData.type === "Cash") {
      const cashAmount = parseFloat(formData.cashAmount);
      const rate = parseFloat(goldRate);
      if (!isNaN(cashAmount) && !isNaN(rate)) {
        setFormData((prev) => ({ ...prev, purity: (cashAmount / rate).toFixed(3) }));
      }
    }
  }, [formData.cashAmount, goldRate, formData.type]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      date: formData.date,
      type: formData.type,
      cashAmount: formData.type === "Cash" ? parseFloat(formData.cashAmount) : null,
      goldValue: formData.type === "Gold" ? parseFloat(formData.goldValue) : null,
      touch: formData.type === "Gold" ? parseFloat(formData.touch) : null,
      purity: parseFloat(formData.purity),
      goldRate: formData.type === "Cash" ? parseFloat(goldRate) : null,
    };

    try {
      if (isEditMode) {
        await axios.put(`${BACKEND_SERVER_URL}/api/entries/${editId}`, payload);
        toast.success("Entry updated successfully!");
      } else {
        await axios.post(`${BACKEND_SERVER_URL}/api/entries`, payload);
        toast.success("Value added successfully!");
      }

      fetchEntries();
      setShowFormPopup(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to save entry.");
      console.error("Error submitting entry:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      date: "",
      type: "Select",
      cashAmount: "",
      goldValue: "",
      touch: "",
      purity: "",
    });
    setGoldRate(0);
    setIsEditMode(false);
    setEditId(null);
  };

  const handleEdit = (entry) => {
    setIsEditMode(true);
    setEditId(entry.id);
    setFormData({
      date: entry.date.split("T")[0],
      type: entry.type,
      cashAmount: entry.cashAmount || "",
      goldValue: entry.goldValue || "",
      touch: entry.touch || "",
      purity: entry.purity || "",
    });
    setGoldRate(entry.goldRate || 0);
    setShowFormPopup(true);
  };

  const calculateTotalPurity = () => {
    return entries.reduce((sum, entry) => sum + parseFloat(entry.purity || 0), 0).toFixed(3);
  };

  return (
    <div className="cashgold-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Cash/Gold</h2>
      <button className="add-btn" onClick={() => setShowFormPopup(true)}>
        Add Cash or Gold
      </button>

      {showFormPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>{isEditMode ? "Edit Entry" : "Enter Cash or Gold Details"}</h3>
            <button
              className="close-btn"
              onClick={() => setShowFormPopup(false)}
            >
              ×
            </button>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type:</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="Select">Select</option>
                  <option value="Cash">Cash</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>
              {formData.type === "Cash" && (
                <>
                  <div className="form-group">
                    <label>Cash Amount:</label>
                    <input
                      type="number"
                      name="cashAmount"
                      value={formData.cashAmount}
                      onChange={handleChange}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gold Rate (per gram):</label>
                    <input
                      type="number"
                      value={goldRate}
                      onChange={(e) => setGoldRate(e.target.value)}
                      step="0.01"
                      required
                    />
                  </div>
                </>
              )}
              {formData.type === "Gold" && (
                <>
                  <div className="form-group">
                    <label>Gold Value (g):</label>
                    <input
                      type="number"
                      name="goldValue"
                      value={formData.goldValue}
                      onChange={handleChange}
                      step="0.001"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Touch (%):</label>
                    <input
                      type="number"
                      name="touch"
                      value={formData.touch}
                      onChange={handleChange}
                      step="0.01"
                      max="100"
                      required
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Purity (g):</label>
                {/* <input type="number" name="purity" value={formData.purity} readOnly className="read-only" /> */}
                <input
                  type="number"
                  name="purity"
                  value={formData.purity}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                  className={isEditMode ? "" : "read-only"}
                  step="0.001"
                />
              </div>
              <div className="button-group">
                <button type="submit" className="submit-btn">
                  {isEditMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="entries-section">
        <h3>Entries</h3>
        <table className="entries-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount/Value</th>
              <th>Touch/Rate</th>
              <th>Purity (g)</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td>{new Date(entry.date).toLocaleDateString("en-IN")}</td>
                <td>{entry.type}</td>
                <td>
                  {entry.type === "Cash"
                    ? `₹${entry.cashAmount}`
                    : `${entry.goldValue}g`}
                </td>
                <td>
                  {entry.type === "Cash"
                    ? `₹${entry.goldRate}/g`
                    : `${entry.touch}%`}
                </td>
                <td>{entry.purity}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(entry)}
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
            <tr className="totals-row">
              <td colSpan="5">
                <strong>Total Purity</strong>
              </td>
              <td colSpan="2">
                <strong>{calculateTotalPurity()}g</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cashgold;

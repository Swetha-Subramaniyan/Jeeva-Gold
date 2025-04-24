import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_SERVER_URL } from "../../Config/Config";


const JobcardForm = ({ onAddItem }) => {
  const today = new Date().toISOString().split("T")[0];
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    date: today,
    givenWeight: "",
    touch: "",
    estimateWeight: "",
    selectedItem: "",
    description: "",
  });

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${BACKEND_SERVER_URL}/api/master-items`);
      console.log("Fetched items:", res.data);
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const calculatePurityWeight = (weight, touch) => {
    const givenWeight = parseFloat(weight) || 0;
    const touchValue = parseFloat(touch) || 0;
    return (givenWeight * touchValue) / 100;
  };

  const purityWeight = calculatePurityWeight(
    formData.givenWeight,
    formData.touch
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    if (
      !formData.selectedItem ||
      !formData.givenWeight ||
      !formData.touch ||
      !formData.estimateWeight
    ) {
      alert("Please fill all item fields before adding.");
      return;
    }

    onAddItem({
      date: formData.date,
      selectedItem: formData.selectedItem,
      givenWeight: purityWeight.toFixed(2),
      originalGivenWeight: formData.givenWeight,
      touch: formData.touch,
      estimateWeight: formData.estimateWeight,
      description: formData.description,
    });

    setFormData((prev) => ({
      ...prev,
      selectedItem: "",
      givenWeight: "",
      touch: "",
      estimateWeight: "",
    }));
  };

  return (
    <div className="job-card-form">
      <h3>Job Card Details</h3>

      <label>Date:</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />

      <label>Given Weight * Touch:</label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            name="givenWeight"
            value={formData.givenWeight}
            onChange={handleChange}
            style={{ width: "80px" }}
          />
          <span> * </span>
          <input
            type="text"
            name="touch"
            value={formData.touch}
            onChange={handleChange}
            style={{ width: "80px" }}
          />
        </div>
        <span>=</span>
        <div style={{ minWidth: "80px" }}>
          {!isNaN(purityWeight) && purityWeight > 0
            ? purityWeight.toFixed(2) + " g"
            : ""}
        </div>
      </div>

      <label>Estimate Weight:</label>
      <input
        type="text"
        name="estimateWeight"
        value={formData.estimateWeight}
        onChange={handleChange}
      />

      <label>Select Item:</label>
      <select
        name="selectedItem"
        value={formData.selectedItem}
        onChange={handleChange}
      >
        <option value="">Select an Item</option>
        {items.map((item) => (
          <option key={item._id} value={item.itemName}>
            {item.itemName}
          </option>
        ))}
      </select>

      <label>Description:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
        cols="33"
      ></textarea>

      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
};

export default JobcardForm;

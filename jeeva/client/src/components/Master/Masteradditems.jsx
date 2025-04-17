
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Masteradditems.css";
import { BACKEND_SERVER_URL } from "../../Config/Config";

const Masteradditems = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [enamelWeight, setEnamelWeight] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${BACKEND_SERVER_URL}/api/master-items`);
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items", err);
    }
  };

  const handleAddItem = async () => {
    if (itemName && enamelWeight) {
      try {
        await axios.post(`${BACKEND_SERVER_URL}/api/master-items/create`, {
          itemName,
          enamelWeight,
        });
        setItemName("");
        setEnamelWeight("");
        fetchItems();
        toast.success("Item added successfully!");
      } catch (err) {
        console.error("Failed to add item", err);
        toast.error("Failed to add item. Please try again.");
      }
    } else {
      toast.warn("Please fill in all fields.");
    }
  };

  return (
    <div className="master-container">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="add-item-form">
        <h2 style={{ textAlign: "center" }}>Add Item</h2>
        <label>Item Name:</label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Enter item name"
        />

        <label>Stone or Enamel weight:</label>
        <input
          type="text"
          value={enamelWeight}
          onChange={(e) => setEnamelWeight(e.target.value)}
          placeholder="Enter Weight"
        />

        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <div className="item-list">
        <h2 style={{ textAlign: "center" }}>Added Items</h2>
        {items.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>SI.No</th>
                <th>Item Name</th>
                <th>Enamel Weight</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.itemName}</td>
                  <td>{item.enamelWeight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items added</p>
        )}
      </div>
    </div>
  );
};

export default Masteradditems;


import React, { useState } from "react";
import "./Masteradditems.css";

const Masteradditems = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
 
  const handleAddItem = () => {
    if (itemName && quantity) {
      setItems([
        ...items,
        { id: items.length + 1, name: itemName, qty: quantity },
      ]);
      setItemName("");
      setQuantity("");
    }
  };

  return (
    <div className="master-container">
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
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
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
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
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

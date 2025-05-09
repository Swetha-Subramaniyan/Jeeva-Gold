import React, { useState, useMemo, useEffect } from "react";
import "./Stock.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_SERVER_URL } from "../../Config/Config";

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
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_SERVER_URL}/api/v1/stocks`)
      .then((res) => res.json())
      .then((data) => setStockItems(data))
      .catch((err) => console.error("Error fetching stocks:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (["gram", "quantity", "touch"].includes(name)) {
      const gram = parseFloat(updatedData.gram) || 0;
      const quantity = parseInt(updatedData.quantity) || 0;
      const touch = parseFloat(updatedData.touch) || 0;
      updatedData.totalWeight = (gram * quantity).toFixed(2);
      updatedData.purity = ((touch * gram * quantity) / 100).toFixed(3);
    }

    setFormData(updatedData);
  };

  // const handleSubmit = async () => {
  //   if (editIndex !== null) {
  //     const updatedItem = formData;
  //     const itemId = stockItems[editIndex].id;

  //     try {
  //       const response = await fetch(
  //         `${BACKEND_SERVER_URL}/api/v1/stocks/${itemId}`,
  //         {
  //           method: "PUT",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(updatedItem),
  //         }
  //       );

  //       if (!response.ok) throw new Error("Failed to update stock item");

  //       const result = await response.json();

  //       const updatedItems = [...stockItems];
  //       updatedItems[editIndex] = result.data;
  //       setStockItems(updatedItems);
  //     } catch (err) {
  //       console.error("Error updating stock:", err);
  //       toast.error("Failed to update stock item!");
  //     }

  //     toast.success("Stock item updated successfully!");
  //     setEditIndex(null);
  //     setShowPopup(false);
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `${BACKEND_SERVER_URL}/api/v1/stocks/create`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(formData),
  //       }
  //     );

  //     if (!response.ok) throw new Error("Failed to create stock item");

  //     const result = await response.json();
  //     setStockItems([result.data, ...stockItems]);
  //     toast.success("Stock item created successfully!");
  //   } catch (err) {
  //     console.error("Error adding stock:", err);
  //     toast.error("Failed to create stock item!");
  //   }

  //   setFormData({
  //     coinType: "",
  //     gram: "",
  //     quantity: "",
  //     touch: "",
  //     totalWeight: "",
  //     purity: "",
  //   });
  //   setShowPopup(false);
  // };


  const handleSubmit = async () => {

  if (
    !formData.coinType ||
    !formData.gram ||
    !formData.quantity ||
    !formData.touch
  ) {
    toast.error("Please fill in all required fields!");
    return;
  }

 
  if (editIndex !== null) {
    try {
      const updatedItem = formData;
      const itemId = stockItems[editIndex].id;

      const response = await fetch(
        `${BACKEND_SERVER_URL}/api/v1/stocks/${itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedItem),
        }
      );

      if (!response.ok) throw new Error("Failed to update stock item");

      const result = await response.json();

      const updatedItems = [...stockItems];
      updatedItems[editIndex] = result.data;
      setStockItems(updatedItems);
      toast.success("Stock item updated successfully!");

      setFormData({
        coinType: "",
        gram: "",
        quantity: "",
        touch: "",
        totalWeight: "",
        purity: "",
      });
      setEditIndex(null);
      setShowPopup(false);
      return;
    } catch (err) {
      console.error("Error updating stock:", err);
      toast.error("Failed to update stock item!");
      return;
    }
  }

  const existingItemIndex = stockItems.findIndex(
    (item) =>
      item.coinType === formData.coinType &&
      parseFloat(item.gram) === parseFloat(formData.gram)
  );

  if (existingItemIndex !== -1) {
  
    const updatedItem = {
      ...stockItems[existingItemIndex],
      quantity: (
        parseInt(stockItems[existingItemIndex].quantity) +
        parseInt(formData.quantity)
      ).toString(),
      totalWeight: (
        parseFloat(stockItems[existingItemIndex].totalWeight) +
        parseFloat(formData.totalWeight)
      ).toFixed(2),
      purity: (
        parseFloat(stockItems[existingItemIndex].purity) +
        parseFloat(formData.purity)
      ).toFixed(3),
    };

    try {
      const response = await fetch(
        `${BACKEND_SERVER_URL}/api/v1/stocks/${stockItems[existingItemIndex].id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedItem),
        }
      );

      if (!response.ok) throw new Error("Failed to update stock item");

      const result = await response.json();

      const updatedItems = [...stockItems];
      updatedItems[existingItemIndex] = result.data;
      setStockItems(updatedItems);
      toast.success("Existing stock item updated successfully!");

      setFormData({
        coinType: "",
        gram: "",
        quantity: "",
        touch: "",
        totalWeight: "",
        purity: "",
      });
      setShowPopup(false);
      return;
    } catch (err) {
      console.error("Error updating stock:", err);
      toast.error("Failed to update stock item!");
      return;
    }
  }


  try {
    const response = await fetch(`${BACKEND_SERVER_URL}/api/v1/stocks/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Failed to create stock item");

    const result = await response.json();
    setStockItems([result.data, ...stockItems]);
    toast.success("New stock item created successfully!");
  } catch (err) {
    console.error("Error adding stock:", err);
    toast.error("Failed to create stock item!");
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
    setEditingId(stockItems[index]._id);
    setShowPopup(true);
  };

  const handleDelete = async (index) => {
    const itemToDelete = stockItems[index];

    try {
      const response = await fetch(
        `${BACKEND_SERVER_URL}/api/v1/stocks/${itemToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete stock item");

      const updatedItems = stockItems.filter((_, i) => i !== index);
      setStockItems(updatedItems);
      toast.success("Stock item deleted successfully!");
    } catch (err) {
      console.error("Error deleting stock:", err);
      toast.error("Failed to delete stock item!");
    }
  };

  const filteredStockItems = useMemo(() => {
    return stockItems.filter((item) => {
      return (
        (filterCoinType === "" ||
          item.coinType
            ?.toLowerCase()
            .includes(filterCoinType.toLowerCase())) &&
        (filterGram === "" || item.gram?.toString().includes(filterGram))
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
      <ToastContainer />
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
              readOnly
            />
            <input
              type="number"
              name="purity"
              placeholder="Purity"
              value={formData.purity}
              readOnly
            />

            <button className="save-btn" onClick={handleSubmit}>
              {editIndex !== null ? "Update" : "Save"}
            </button>
            <button
              className="close-btn"
              onClick={() => {
                setShowPopup(false);
                setEditIndex(null);
                setEditingId(null);
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
            <tr key={item._id || index}>
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

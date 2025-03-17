
import React, { useState } from "react";
import "./Jobcard.css";

const Jobcard = () => {
    const today = new Date().toISOString().split("T")[0];
    const [formData, setFormData] = useState({
        date: today,
        estimateWeight: "",
        givenWeight: "",
        selectedItem: "",
        description: "",
    });

    const [jobDetails, setJobDetails] = useState({
        date: today,
        items:[],
        description: "",
    });

    const [finalWeight, setFinalWeight] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupGivenWeight, setPopupGivenWeight] = useState("");
    const [popupEstimateWeight, setPopupEstimateWeight] = useState("");
    const [popupWastage, setPopupWastage] = useState(""); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddItem = () => {
        if (
            !formData.selectedItem ||
            !formData.givenWeight ||
            !formData.estimateWeight
        ) {
            alert("Please fill all item fields before adding.");
            return;
        }

        setJobDetails((prev) => ({
            ...prev,
            date: formData.date,
            description: formData.description,
            items: [
                ...prev.items,
                {
                    selectedItem: formData.selectedItem,
                    givenWeight: formData.givenWeight,
                    estimateWeight: formData.estimateWeight,
                    finalWeight: "",
                    wastage: "", 
                },
            ],
        }));

        setFormData((prev) => ({
            ...prev,
            selectedItem: "",
            givenWeight: "",
            estimateWeight: "",
        }));
    };

    const handleOpenPopup = (index) => {
        setSelectedIndex(index);
        setFinalWeight(jobDetails.items[index].finalWeight || "");
        setPopupGivenWeight(jobDetails.items[index].givenWeight);
        setPopupEstimateWeight(jobDetails.items[index].estimateWeight);
        setPopupWastage(jobDetails.items[index].wastage || ""); 
        setShowPopup(true);
    };

    const handleSaveFinalWeight = () => {
        if (!finalWeight) {
            alert("Please enter the final weight.");
            return;
        }

        if (popupWastage === "") {
            alert("Please enter wastage.");
            return;
        }

        setJobDetails((prev) => {
            const updatedItems = [...prev.items];
            updatedItems[selectedIndex].finalWeight = finalWeight;
            updatedItems[selectedIndex].givenWeight = popupGivenWeight;
            updatedItems[selectedIndex].estimateWeight = popupEstimateWeight;
            updatedItems[selectedIndex].wastage = popupWastage; 

            return { ...prev, items: updatedItems };
        });

        setShowPopup(false);
        setFinalWeight("");
        setPopupWastage("");
    };

    const handleDeleteItem = (indexToDelete) => {
        setJobDetails((prev) => ({
            ...prev,
            items: prev.items.filter((_, index) => index !== indexToDelete),
        }));
    };

    
    const totalGivenWeight = jobDetails.items.reduce(
        (sum, item) => sum + Number(item.givenWeight || 0),
        0
    );
    const totalEstimateWeight = jobDetails.items.reduce(
        (sum, item) => sum + Number(item.estimateWeight || 0),
        0
    );
    const totalFinalWeight = jobDetails.items.reduce(
        (sum, item) => sum + Number(item.finalWeight || 0),
        0
    );
    const totalWastage = jobDetails.items.reduce(
        (sum, item) => sum + Number(item.wastage || 0),
        0
    );

    
    const balance = totalGivenWeight - (totalFinalWeight + totalWastage);

    return (
      <div className="job-card-container">
        <div className="job-card-form">
          <h3>Job Card Details</h3>

          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <label>Given Weight:</label>
          <input
            type="text"
            name="givenWeight"
            value={formData.givenWeight}
            onChange={handleChange}
          />

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
            <option value="Ring">Ring</option>
            <option value="Chain">Chain</option>
            <option value="Bracelet">Bracelet</option>
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

        <div className="job-card">
          <div className="job-card-header">
            <div className="job-card-logo">JEEVA GOLD COINS</div>
            <div className="job-card-contact">
              <p>Town Hall 458 Road</p>
              <p>Coimbatore</p>
              <p>9875637456</p>
            </div>
          </div>

          <div className="job-card-details">
            <div className="job-card-number">
              <p>
                <strong>No:</strong> JC20-001
              </p>
              <p style={{ marginLeft: "7rem" }}>
                <strong>Date:</strong> {jobDetails.date}
              </p>
            </div>
          </div>

          <hr className="divider" />

          <div className="job-card-customer">
            <h3>Goldsmith Information</h3>
            <br />
            <p>
              <strong>Name:</strong>
            </p>
            <p>
              <strong>Address:</strong>
            </p>
            <p>
              <strong>Phone:</strong>
            </p>
          </div>

          <hr className="divider" />

          <div className="job-card-description">
            <h3>Description</h3>
            <p>{jobDetails.description}</p>
          </div>

          <hr className="divider" />

          <div className="job-card-items">
            <table>
              <thead>
                <tr>
                  <th>SI.No</th>
                  <th>Item Description</th>
                  <th>Given Weight</th>
                  <th>Estimate Weight</th>
                  <th>Final Weight</th>
                  <th>Wastage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobDetails.items.length > 0 ? (
                  jobDetails.items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.selectedItem}</td>
                      <td>{item.givenWeight} g</td>
                      <td>{item.estimateWeight} g</td>

                      <td>
                        {item.finalWeight ? `${item.finalWeight} g` : "Pending"}
                      </td>
                      <td>{item.wastage} g</td>
                      <td>
                        <button onClick={() => handleOpenPopup(index)}>
                          👁️
                        </button>
                        <button onClick={() => handleDeleteItem(index)}>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No items added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <hr className="divider" />

          <div className="job-card-totals">
            <h3>Balance</h3>
            <p>
              <strong>Balance:</strong> {balance} g
            </p>
            <p>
              {balance > 0 ? (
                <span style={{ color: "green" }}>
                  Owner should give {balance} g
                </span>
              ) : balance < 0 ? (
                <span style={{ color: "red" }}>
                  Goldsmith should give {Math.abs(balance)} g
                </span>
              ) : (
                <span style={{ color: "blue" }}>No balance to be given</span>
              )}
            </p>
          </div>
          <div className="job-card-footer">
            <p>jeevagoldcoins@gmail.com</p>
          </div>
        </div>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Edit Item Details</h3>

              <label>Given Weight:</label>
              <input
                type="text"
                value={popupGivenWeight}
                onChange={(e) => setPopupGivenWeight(e.target.value)}
              />

              <label>Estimate Weight:</label>
              <input
                type="text"
                value={popupEstimateWeight}
                onChange={(e) => setPopupEstimateWeight(e.target.value)}
              />

              <label>Final Weight:</label>
              <input
                type="text"
                value={finalWeight}
                onChange={(e) => setFinalWeight(e.target.value)}
              />

              <label>Wastage:</label>
              <input
                type="text"
                value={popupWastage}
                onChange={(e) => setPopupWastage(e.target.value)}
              />

              <div className="popup-buttons">
                <button onClick={handleSaveFinalWeight}>Save</button>
                <button onClick={() => setShowPopup(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default Jobcard;
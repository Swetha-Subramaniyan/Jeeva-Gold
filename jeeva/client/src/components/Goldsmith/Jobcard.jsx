
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
    items: [],
    description: "",
  });

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
            <p>
              <strong>Date:</strong> {jobDetails.date}
            </p>
          </div>
        </div>

        <hr className="divider" />

        <div className="job-card-customer">
          <h3>Goldsmith Information</h3><br></br>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No items added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="job-card-footer">
          <div className="job-card-signature">
            <p>
              <strong>Authorized Signature:</strong> _________________________
            </p>
          </div>
        </div>

        <hr className="divider" />

        <div className="job-card-footer">
          <p>jeevagoldcoins@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Jobcard;

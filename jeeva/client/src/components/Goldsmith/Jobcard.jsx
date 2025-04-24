
import React, { useState } from "react";
import "./Jobcard.css";
import JobcardForm from "./Jobcardform";
import EditItemPopup from "./Edititempopup";

const Jobcard = () => {
  const today = new Date().toISOString().split("T")[0];
  const [jobDetails, setJobDetails] = useState({
    date: today,
    items: [],
    description: "",
  });
  const [finalWeight, setFinalWeight] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupGivenWeight, setPopupGivenWeight] = useState("");
  const [popupTouch, setPopupTouch] = useState("");
  const [popupEstimateWeight, setPopupEstimateWeight] = useState("");
  const [popupWastage, setPopupWastage] = useState("");

  const handleAddItem = (newItem) => {
    setJobDetails((prev) => ({
      ...prev,
      date: newItem.date,
      description: newItem.description,
      items: [
        ...prev.items,
        {
          selectedItem: newItem.selectedItem,
          givenWeight: newItem.givenWeight,
          originalGivenWeight: newItem.originalGivenWeight,
          touch: newItem.touch,
          estimateWeight: newItem.estimateWeight,
          finalWeight: "",
          wastage: "",
        },
      ],
    }));
  };

  const calculatePurityWeight = (weight, touch) => {
    const givenWeight = parseFloat(weight) || 0;
    const touchValue = parseFloat(touch) || 0;
    return (givenWeight * touchValue) / 100;
  };

  const handleOpenPopup = (index) => {
    setSelectedIndex(index);
    setFinalWeight(jobDetails.items[index].finalWeight || "");
    setPopupGivenWeight(jobDetails.items[index].originalGivenWeight);
    setPopupTouch(jobDetails.items[index].touch);
    setPopupEstimateWeight(jobDetails.items[index].estimateWeight);
    setPopupWastage(jobDetails.items[index].wastage || "");
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setFinalWeight("");
    setPopupWastage("");
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
      updatedItems[selectedIndex].givenWeight = calculatePurityWeight(
        popupGivenWeight,
        popupTouch
      ).toFixed(2);
      updatedItems[selectedIndex].originalGivenWeight = popupGivenWeight;
      updatedItems[selectedIndex].touch = popupTouch;
      updatedItems[selectedIndex].estimateWeight = popupEstimateWeight;
      updatedItems[selectedIndex].wastage = popupWastage;

      return { ...prev, items: updatedItems };
    });

    handleClosePopup();
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
      <JobcardForm onAddItem={handleAddItem} />

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
                <th>Item</th>
                <th>Given Weight (Gross)</th>
                <th>Touch</th>
                <th>Given Weight (Purity)</th>
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
                    <td>{item.originalGivenWeight} g</td>
                    <td>{item.touch}</td>
                    <td>{item.givenWeight} g</td>
                    <td>{item.estimateWeight} g</td>
                    <td>
                      {item.finalWeight ? `${item.finalWeight} g` : "Pending"}
                    </td>
                    <td>{item.wastage} g</td>
                    <td>
                      <button onClick={() => handleOpenPopup(index)}>
                        &#128065;
                      </button>
                      <button onClick={() => handleDeleteItem(index)}>
                        &#128465;
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
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
            <strong>Balance:</strong> {balance.toFixed(2)} g
          </p>
          <p>
            {balance > 0 ? (
              <span style={{ color: "green" }}>
                Owner should give {balance.toFixed(2)} g
              </span>
            ) : balance < 0 ? (
              <span style={{ color: "red" }}>
                Goldsmith should give {Math.abs(balance).toFixed(2)} g
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

      <EditItemPopup
        isOpen={showPopup}
        onClose={handleClosePopup}
        givenWeight={popupGivenWeight}
        touch={popupTouch}
        estimateWeight={popupEstimateWeight}
        finalWeight={finalWeight}
        wastage={popupWastage}
        onGivenWeightChange={(e) => setPopupGivenWeight(e.target.value)}
        onTouchChange={(e) => setPopupTouch(e.target.value)}
        onEstimateWeightChange={(e) => setPopupEstimateWeight(e.target.value)}
        onFinalWeightChange={(e) => setFinalWeight(e.target.value)}
        onWastageChange={(e) => setPopupWastage(e.target.value)}
        onSave={handleSaveFinalWeight}
        calculatePurityWeight={calculatePurityWeight}
      />
    </div>
  );
};

export default Jobcard;
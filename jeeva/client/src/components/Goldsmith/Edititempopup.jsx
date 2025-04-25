
import React, { useState, useEffect } from "react";
import "./EditItemPopup.css";

const EditItemPopup = ({
  isOpen,
  onClose,
  givenWeight,
  touch,
  estimateWeight,
  finalWeight: initialFinalWeight,
  wastage: initialWastage,
  onGivenWeightChange,
  onTouchChange,
  onEstimateWeightChange,
  onFinalWeightChange,
  onWastageChange,
  onSave,
  calculatePurityWeight,
}) => {
  if (!isOpen) {
    return null;
  }

  const [finalWeightPart1, setFinalWeightPart1] = useState(
    initialFinalWeight || ""
  );
  const [finalWeightPart2, setFinalWeightPart2] = useState("");
  const finalPurity = calculatePurityWeight(
    parseFloat(finalWeightPart1) || 0,
    parseFloat(finalWeightPart2) || 0
  ).toFixed(2);

  const [additionalWeights, setAdditionalWeights] = useState([]);

  const handleAddAdditionalWeightField = () => {
    setAdditionalWeights([...additionalWeights, { name: "", weight: "" }]);
  };

  const handleAdditionalWeightChange = (index, field, value) => {
    const updatedWeights = [...additionalWeights];
    updatedWeights[index][field] = value;
    setAdditionalWeights(updatedWeights);
  };

  const totalAdditionalWeight = additionalWeights.reduce(
    (sum, item) => sum + parseFloat(item.weight || 0),
    0
  );

  const derivedFinalWeight =
    (parseFloat(finalWeightPart1) || 0) - totalAdditionalWeight;
  const [finalTouch, setFinalTouch] = useState("");
  const derivedPurity = calculatePurityWeight(
    derivedFinalWeight,
    parseFloat(finalTouch) || 0
  ).toFixed(2);

  const [wastageOperation, setWastageOperation] = useState("*"); 
  const [wastageValue, setWastageValue] = useState("");
  const [wastage, setWastage] = useState(initialWastage || "");

  useEffect(() => {
    let calculatedWastage = 0;
    const purity = parseFloat(derivedPurity) || 0;
    const value = parseFloat(wastageValue) || 0;

    if (wastageOperation === "*") {
      calculatedWastage = purity * value;
    } else if (wastageOperation === "+") {
      calculatedWastage = purity + value;
    }

    setWastage(calculatedWastage.toFixed(2));
    if (onWastageChange) {
      onWastageChange({ target: { value: calculatedWastage.toFixed(2) } });
    }
  }, [derivedPurity, wastageOperation, wastageValue, onWastageChange]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Edit Item Details</h3>

        <label>
          Given Weight:
          <input
            type="text"
            value={givenWeight}
            onChange={onGivenWeightChange}
            style={{ width: "60px", marginLeft: "5px" }}
          />
        </label>

        <label>
          Touch:
          <input
            type="text"
            value={touch}
            onChange={onTouchChange}
            style={{ width: "60px", marginLeft: "5px" }}
          />
        </label>

        <label>Purity Weight:</label>
        <div>{calculatePurityWeight(givenWeight, touch).toFixed(2)} g</div>

        <label>Estimate Weight:</label>
        <input
          type="text"
          value={estimateWeight}
          onChange={onEstimateWeightChange}
        />

        <label>
          Final Weight:
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={finalWeightPart1}
              onChange={(e) => setFinalWeightPart1(e.target.value)}
              style={{ width: "60px", marginRight: "5px" }}
            />
            <span> x </span>
            <input
              type="text"
              value={finalWeightPart2}
              onChange={(e) => setFinalWeightPart2(e.target.value)}
              style={{ width: "60px", marginLeft: "5px", marginRight: "10px" }}
            />
            <span>= {finalPurity} g</span>
          </div>
        </label>

        <button
          type="button"
          onClick={handleAddAdditionalWeightField}
          style={{ marginTop: "10px" }}
        >
          Add
        </button>

        {additionalWeights.map((item, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", marginTop: "5px" }}
          >
            <label style={{ marginRight: "10px" }}>
              Name:
              <input
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleAdditionalWeightChange(index, "name", e.target.value)
                }
                style={{ marginLeft: "5px", width: "80px" }}
              />
            </label>
            <label>
              Weight:
              <input
                type="text"
                value={item.weight}
                onChange={(e) =>
                  handleAdditionalWeightChange(index, "weight", e.target.value)
                }
                style={{ marginLeft: "5px", width: "60px" }}
              />
            </label>
          </div>
        ))}

        <label style={{ marginTop: "10px" }}>
          Final Weight:
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{derivedFinalWeight.toFixed(2)} g</span>
            <span style={{ marginLeft: "10px", marginRight: "5px" }}> x </span>
            <input
              type="text"
              value={finalTouch}
              onChange={(e) => setFinalTouch(e.target.value)}
              style={{ width: "60px" }}
            />
            <span style={{ marginLeft: "5px" }}>= {derivedPurity} g</span>
          </div>
        </label>

        <label style={{ marginTop: "10px" }}>
          Wastage:
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{derivedPurity} g</span>
            <select
              value={wastageOperation}
              onChange={(e) => setWastageOperation(e.target.value)}
              style={{ marginLeft: "10px", marginRight: "5px" }}
            >
              <option value="*">*</option>
              <option value="+">+</option>
            </select>
            <input
              type="text"
              value={wastageValue}
              onChange={(e) => setWastageValue(e.target.value)}
              style={{ width: "60px", marginLeft: "5px", marginRight: "10px" }}
            />
            <span>= {wastage} g</span>
          </div>
        </label>

        <div className="popup-buttons" style={{ marginTop: "20px" }}>
          <button onClick={onSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditItemPopup;

import React, { useState } from "react";
import "./Customertrans.css";

const Customertrans = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    value: "",
    type: "Select",
    goldRate: "",
    cashValue: "",
    goldValue: "",
  });

  const handleChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const addTransaction = () => {
    if (newTransaction.date && newTransaction.type !== "Select") {
      let finalValue;
      if (newTransaction.type === "Cash") {
        if (newTransaction.cashValue && newTransaction.goldRate) {
          finalValue = (
            parseFloat(newTransaction.cashValue) /
            parseFloat(newTransaction.goldRate)
          ).toFixed(2);
        } else {
          alert("Please enter cash value and gold rate!");
          return;
        }
      } else if (newTransaction.type === "Gold") {
        if (newTransaction.goldValue && newTransaction.goldRate) {
          finalValue = (
            parseFloat(newTransaction.goldValue) *
            parseFloat(newTransaction.goldRate)
          ).toFixed(2);
        } else {
          alert("Please enter gold value and gold rate!");
          return;
        }
      }

      setTransactions([
        ...transactions,
        {
          date: newTransaction.date,
          value: finalValue,
          type: newTransaction.type,
          goldRate: newTransaction.goldRate,
        },
      ]);
      setNewTransaction({
        date: "",
        value: "",
        type: "Select",
        goldRate: "",
        cashValue: "",
        goldValue: "",
      });
      setShowPopup(false);
    } else {
      alert("Please fill all required fields!");
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      (!fromDate || transaction.date >= fromDate) &&
      (!toDate || transaction.date <= toDate)
    );
  });

  return (
    <div className="customer-transactions">
      <h2>Customer Transactions</h2>
      <br />
      <br></br>

      <div className="filters">
        <label>
          From Date:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          To Date:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
      </div>

      <button onClick={() => setShowPopup(true)} className="add-btn">
        Add Transaction
      </button>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Add Transaction</h3>
            <br></br>
            <label>
              Date:{" "}
              <input
                type="date"
                name="date"
                value={newTransaction.date}
                onChange={handleChange}
              />
            </label>
            <label>
              Gold Rate:{" "}
              <input
                type="number"
                name="goldRate"
                value={newTransaction.goldRate}
                onChange={handleChange}
              />
            </label>
            <label>
              Type:{" "}
              <select
                name="type"
                value={newTransaction.type}
                onChange={handleChange}
              >
                <option value="Select">Select</option>
                <option value="Cash">Cash</option>
                <option value="Gold">Gold</option>
              </select>
            </label>
            {newTransaction.type === "Cash" && (
              <label>
                Cash Value:
                <input
                  type="number"
                  name="cashValue"
                  value={newTransaction.cashValue}
                  onChange={handleChange}
                />
                {newTransaction.goldRate && (
                  <span> / {newTransaction.goldRate}</span>
                )}
              </label>
            )}
            {newTransaction.type === "Gold" && (
              <label>
                Gold Value:
                <input
                  type="number"
                  name="goldValue"
                  value={newTransaction.goldValue}
                  onChange={handleChange}
                />
                {newTransaction.goldRate && (
                  <span> * {newTransaction.goldRate}</span>
                )}
              </label>
            )}
            <button
              style={{
                backgroundColor: " #1DA3A3",
                color: "white",
                fontSize: "1rem",
                width:"5rem",
                marginLeft:"5rem"

              }}
              onClick={addTransaction}
            >
              Save
            </button>
          </div>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Value</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <tr
                key={index}
                className={
                  transaction.type === "Gold" ? "gold-row" : "cash-row"
                }
              >
                <td>{transaction.date}</td>
                <td>
                  {transaction.type === "Gold"
                    ? `${transaction.value}`
                    : `₹ ${transaction.value}`}
                </td>
                <td>{transaction.type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-data">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Customertrans;
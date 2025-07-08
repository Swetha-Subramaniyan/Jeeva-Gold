
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Advance.css";
import { BACKEND_SERVER_URL } from "../../Config/Config";

const Advancereport = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${BACKEND_SERVER_URL}/api/customers`);
        setCustomers(res.data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let url = "";

        if (selectedCustomerId) {
          url = `${BACKEND_SERVER_URL}/api/transactions/${selectedCustomerId}`;
        } else {
          url = `${BACKEND_SERVER_URL}/api/transactions/all`;
        }

        const res = await axios.get(url);
        const all = res.data;

        const filtered = all.filter((txn) => {
          const txnDate = new Date(txn.date).toISOString().split("T")[0];
          return txnDate === selectedDate;
        });

        setTransactions(filtered);
        setFilteredTransactions(filtered);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    fetchTransactions();
  }, [selectedCustomerId, selectedDate]);

 
  const totalPurity = filteredTransactions.reduce((sum, txn) => {
    if (txn.purity) {
      return sum + parseFloat(txn.purity);
    } else if (txn.type === "Cash" && txn.value && txn.goldRate) {
      const calculatedPurity = txn.value / txn.goldRate;
      return sum + calculatedPurity;
    }
    return sum;
  }, 0);
  return (
    <div className="advance-report-container">
      <h2>Advance Payments Report</h2>
      <br></br>
      <div className="filters">
        <label>
          Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>

        <label>
          Customer Name:
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">All Customers</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredTransactions.length > 0 ? (
        <table className="advance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Value</th>
              <th>Purity (grams)</th>
              <th>Touch</th>
              <th>Gold Rate</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn.id}>
                <td>{new Date(txn.date).toLocaleDateString("en-IN")}</td>
                <td>{txn.customer?.name || "-"}</td>
                <td>{txn.type}</td>
                <td>
                  {txn.type === "Cash"
                    ? `₹${txn.value.toFixed(2)}`
                    : `${txn.value.toFixed(3)}g`}
                </td>
                <td>{txn.purity?.toFixed(3) || "-"}</td>
                <td>{txn.touch ? `${txn.touch}%` : "-"}</td>
                <td>
                  {txn.goldRate && txn.type === "Cash"
                    ? `₹${txn.goldRate.toFixed(2)}`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan="4" className="total-label">
                Total Purity:
              </td>
              <td className="total-value">{totalPurity.toFixed(3)}g</td>
              {/* <td colSpan="7"></td> */}
            </tr>
          </tfoot>
        </table>
      ) : (
        <p className="no-data">
          No advance payments found for selected filters.
        </p>
      )}
    </div>
  );
};

export default Advancereport;
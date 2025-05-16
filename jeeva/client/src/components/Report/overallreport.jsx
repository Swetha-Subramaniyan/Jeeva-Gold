
import { React, useEffect, useState } from "react";
import "./overallreport.css";
import { BACKEND_SERVER_URL } from "../../Config/Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OverallReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async (from = "", to = "") => {
    setLoading(true);
    setReportData([]);

    try {
      const [customersRes, billsRes, jewelRes, coinRes, entriesRes] =
        await Promise.all([
          fetch(`${BACKEND_SERVER_URL}/api/customers`),
          fetch(`${BACKEND_SERVER_URL}/api/bills`),
          fetch(`${BACKEND_SERVER_URL}/api/jewel-stock`),
          fetch(`${BACKEND_SERVER_URL}/api/v1/stocks`),
          fetch(`${BACKEND_SERVER_URL}/api/entries`),
        ]);

      if (!customersRes.ok) throw new Error("Failed to fetch customers");
      if (!billsRes.ok) throw new Error("Failed to fetch bills");
      if (!jewelRes.ok) throw new Error("Failed to fetch jewel stock");
      if (!coinRes.ok) throw new Error("Failed to fetch coin stock");
      if (!entriesRes.ok) throw new Error("Failed to fetch entries");

      const [customers, bills, jewelData, coinData, entriesData] =
        await Promise.all([
          customersRes.json(),
          billsRes.json(),
          jewelRes.json(),
          coinRes.json(),
          entriesRes.json(),
        ]);

      const customerBalances = customers.map((customer) => {
        const customerBills = bills.filter(
          (bill) => bill.customerId === customer.id
        );

        const totalBillAmount = customerBills.reduce((sum, bill) => {
          const billAmount =
            bill.items.reduce(
              (billSum, item) => billSum + item.purity * bill.goldRate,
              0
            ) + (bill.hallmarkCharges || 0);
          return sum + billAmount;
        }, 0);

        const totalReceived = customerBills.reduce((sum, bill) => {
          return (
            sum +
            bill.receivedDetails.reduce(
              (receivedSum, detail) => receivedSum + detail.amount,
              0
            )
          );
        }, 0);

        return {
          customerId: customer.id,
          customerName: customer.name,
          balance: totalBillAmount - totalReceived,
        };
      });

      const customerBalanceTotal = customerBalances.reduce(
        (sum, customer) => sum + customer.balance,
        0
      );

      const totalJewelPurity = jewelData.reduce(
        (sum, item) => sum + parseFloat(item.purityValue || 0),
        0
      );

      const totalCoinPurity = coinData.reduce(
        (sum, item) => sum + parseFloat(item.purity || 0),
        0
      );

      const totalCash = entriesData
        .filter((e) => e.type === "Cash")
        .reduce((sum, e) => sum + parseFloat(e.cashAmount || 0), 0);

      const totalGoldPurity = entriesData
        .filter((e) => e.type === "Gold")
        .reduce((sum, e) => sum + parseFloat(e.purity || 0), 0);

      let allTransactions = [];
      try {
        const transRes = await fetch(`${BACKEND_SERVER_URL}/api/transactions`);
        if (transRes.ok) {
          allTransactions = await transRes.json();
        } else {
          const customerTransactions = await Promise.all(
            customers.map((customer) =>
              fetch(`${BACKEND_SERVER_URL}/api/transactions/${customer.id}`)
                .then((res) => (res.ok ? res.json() : []))
                .catch(() => [])
            )
          );
          allTransactions = customerTransactions.flat();
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.warn("Could not load all transactions");
      }

      const filteredTransactions = allTransactions.filter((transaction) => {
        if (!from && !to) return true;
        const transactionDate = new Date(transaction.date);
        const fromDateObj = from ? new Date(from) : null;
        const toDateObj = to ? new Date(to + "T23:59:59") : null;

        return (
          (!fromDateObj || transactionDate >= fromDateObj) &&
          (!toDateObj || transactionDate <= toDateObj)
        );
      });

      const advancesCash = filteredTransactions
        .filter((t) => t.type === "Cash")
        .reduce((sum, t) => sum + parseFloat(t.value || 0), 0);

      const advancesGold = filteredTransactions
        .filter((t) => t.type === "Gold")
        .reduce((sum, t) => sum + parseFloat(t.purity || 0), 0);

      setReportData([
        {
          label: "Customer Balance Total",
          value: `₹${customerBalanceTotal.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          tooltip: "Sum of all customer balances (bills minus payments)",
        },
        {
          label: "Cash / Gold",
          value: `₹${totalCash.toLocaleString(
            "en-IN"
          )} / ${totalGoldPurity.toFixed(3)}g`,
          tooltip: "Total cash and gold entries in the system",
        },
        {
          label: "Coin Stock",
          value: `${coinData.length} Coins (${totalCoinPurity.toFixed(
            3
          )}g Purity)`,
          tooltip: "Current coin inventory with total purity",
        },
        {
          label: "Jewel Stock",
          value: `${jewelData.length} Items (${totalJewelPurity.toFixed(
            3
          )}g Purity)`,
          tooltip: "Current jewel inventory with total purity",
        },
        {
          label: "Advances in Gold",
          value: `${advancesGold.toFixed(3)}g`,
          tooltip: "Total gold advances received from all customers",
        },
        {
          label: "Advances in Cash",
          value: `₹${advancesCash.toLocaleString("en-IN")}`,
          tooltip: "Total cash advances received from all customers",
        },
        {
          label: "Active Customers",
          value: `${customers.length} (${
            customerBalances.filter((c) => c.balance > 0).length
          } with balance)`,
          tooltip: "Total customers and those with outstanding balances",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
      toast.error(`Error: ${error.message}`);
      setReportData([
        {
          label: "Error",
          value: "Could not load report data",
          tooltip: error.message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReportData(fromDate, toDate);
  };

  return (
    <div className="overall-report-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="report-header">
        <h2>Overall Report</h2>
      </div>

      <form onSubmit={handleSubmit} className="date-filter-form">
        <div className="form-group">
          <label>
            <span>From Date</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="date-input"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <span>To Date</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="date-input"
            />
          </label>
        </div>
        <button type="submit" className="filter-btn" disabled={loading}>
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            "Filter Report"
          )}
        </button>
      </form>

      {reportData.length > 0 && (
        <div className="report-cards-container">
          {reportData.map((item, index) => (
            <div key={index} className="report-card" title={item.tooltip}>
              <div className="card-label">{item.label}</div>
              <div className="card-value">{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OverallReport;
import React, { useEffect, useState } from "react";
import "./overallreport.css";
import { BACKEND_SERVER_URL } from "../../Config/Config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatNumber } from "../../utils/formatNumber";

const OverallReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
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

      const manualEntriesPurity = entriesData.reduce(
        (sum, entry) => sum + parseFloat(entry.purity || 0),
        0
      );

      let receivedEntriesPurity = 0;
      bills.forEach((bill) => {
        if (bill.receivedDetails && Array.isArray(bill.receivedDetails)) {
          bill.receivedDetails.forEach((detail) => {
            const purity = parseFloat(detail.purityWeight || 0);
            if (detail.paidAmount > 0) {
              receivedEntriesPurity -= purity;
            } else {
              receivedEntriesPurity += purity;
            }
          });
        }
      });

      const totalCashGoldEntriesPurity =
        manualEntriesPurity + receivedEntriesPurity;

      const totalJewelPurity = jewelData.reduce(
        (sum, item) => sum + parseFloat(item.purityValue || 0),
        0
      );

      const totalCoinPurity = coinData.reduce(
        (sum, item) => sum + parseFloat(item.purity || 0),
        0
      );

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

      const advancesGold = allTransactions.reduce(
        (sum, t) => sum + parseFloat(t.purity || 0),
        0
      );

      const calculateTotalBalances = (bills) => {
        let totalCustomerBalance = 0;

        bills.forEach((bill) => {
          const totalPurity = parseFloat(bill.totalPurity || 0);

          let receivedPurity = 0;
          if (bill.receivedDetails && Array.isArray(bill.receivedDetails)) {
            bill.receivedDetails.forEach((detail) => {
              const purity = parseFloat(detail.purityWeight || 0);
              if (detail.paidAmount > 0) {
                receivedPurity -= purity;
              } else {
                receivedPurity += purity;
              }
            });
          }

          const balance = totalPurity - receivedPurity;

          if (balance.toFixed(3) > 0) {
            totalCustomerBalance += balance;
          }
        });

        return {
          totalCustomerBalance,
        };
      };

      const { totalCustomerBalance } = calculateTotalBalances(bills);

      const overallValue =
        totalCustomerBalance +
        totalCashGoldEntriesPurity +
        totalCoinPurity +
        totalJewelPurity -
        advancesGold;

      setReportData([
        {
          label: "Customer Balance",
          value: `${formatNumber(totalCustomerBalance, 3)}g`,
          tooltip:
            "Total sum of 'pureBalance' (i.e. totalPurity) across all saved bills",
        },
        {
          label: "Cash/Gold (Entries Purity)",
          value: `${formatNumber(totalCashGoldEntriesPurity, 3)}g`,
          tooltip: `Total gold purity from all manual Cash/Gold entries in the system (Sum of manual entries ${formatNumber(
            manualEntriesPurity,
            3
          )}g and received bill entries ${formatNumber(
            receivedEntriesPurity,
            3
          )}g)`,
        },
        {
          label: "Coin Stock",
          value: ` ${formatNumber(totalCoinPurity, 3)}g Purity (${
            coinData.length
          } Coins)`,
          tooltip: "Current coin inventory with total purity",
        },
        {
          label: "Jewel Stock",
          value: ` ${formatNumber(totalJewelPurity, 3)}g Purity (${
            jewelData.length
          } Items)`,
          tooltip: "Current jewel inventory with total purity",
        },
        {
          label: "Advances in Gold (Purity)",
          value: `${formatNumber(advancesGold, 3)}g`,
          tooltip:
            "Total gold purity equivalent from all customer advance transactions",
        },
        {
          label: "Overall Value",
          value: `${formatNumber(overallValue, 3)} g`,
          tooltip: "Pure Balance + Cash/Gold + Coin + Jewel - Advances in Gold",
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

  return (
    <div className="overall-report-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="report-header">
        <h2>Overall Report</h2>
      </div>

      {reportData.length > 0 && (
        <div className="report-cards-container">
          <div className="report-column report-left">
            {reportData.slice(0, 5).map((item, index) => (
              <div key={index} className="report-card" title={item.tooltip}>
                <div className="card-label">{item.label}</div>
                <div className="card-value">{item.value}</div>
              </div>
            ))}
          </div>
          <div className="report-column report-right">
            {reportData.slice(5).map((item, index) => (
              <div key={index + 5} className="report-card" title={item.tooltip}>
                <div className="card-label">{item.label}</div>
                <div className="card-value">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverallReport;

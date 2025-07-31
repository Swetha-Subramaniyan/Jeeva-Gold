import React, { useEffect, useRef } from "react";
import { TextField, IconButton, Box, Alert, Snackbar } from "@mui/material";
import { MdDeleteForever } from "react-icons/md";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./Billing.css";
import { formatINRCurrency } from "../../utils/formatCurrency";
import { NumericFormat } from "react-number-format";
import { useState } from "react";

const ReceivedDetails = ({
  rows,
  setRows,
  initialPureBalance,
  initialTotalBalance,
  initialHallmarkBalance,
  displayHallmarkCharges,
  setPureBalance,
  setTotalBalance,
  isViewMode,
  setIsUpdating,
  displayedTotalBalance,
}) => {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "error",
  });

  const parseFloatSafe = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const calculateBalances = () => {
    let pure = parseFloatSafe(initialPureBalance);
    let total = parseFloatSafe(initialTotalBalance);

    let hallmark;
    if (isViewMode) {
      hallmark = parseFloatSafe(displayHallmarkCharges);
    } else {
      hallmark = parseFloatSafe(initialHallmarkBalance);
    }

    console.log("pureeeee", pure, hallmark, rows);

    rows.forEach((row) => {
      if (row.mode === "weight" && row.purityWeight) {
        pure -= parseFloatSafe(row.purityWeight);
      } else if (row.mode === "amount" && parseFloatSafe(row.amount) > 0) {
        const amount = parseFloatSafe(row.amount);
        const hallmarkDeduction = Math.min(amount, hallmark);

        hallmark -= hallmarkDeduction;
        const amountAfterHallmark = amount - hallmarkDeduction;

        if (amountAfterHallmark > 0 && row.goldRate) {
          const purity = amountAfterHallmark / parseFloatSafe(row.goldRate);

          console.log("11111111111111", purity);
          pure -= purity;
        }
      } else if (row.mode === "amount" && parseFloatSafe(row.paidAmount) > 0) {
        const amount = parseFloatSafe(row.paidAmount);
        const hallmarkDeduction = Math.min(amount, hallmark);

        hallmark -= hallmarkDeduction;
        const amountAfterHallmark = amount - hallmarkDeduction;

        if (amountAfterHallmark > 0 && row.goldRate) {
          const purity = amountAfterHallmark / parseFloatSafe(row.goldRate);
          console.log("2222222222222", purity);
          pure += purity;
        }
      }
    });

    return {
      pureBalance: pure,
      totalBalance: total,
      hallmarkBalance: Math.max(0, hallmark),
    };
  };

  const currentBalances = calculateBalances();

  useEffect(() => {
    const goldRateRows = rows.filter(
      (row) => row.goldRate && parseFloatSafe(row.goldRate) > 0
    );

    const receivedAmountRows = rows.filter(
      (row) => row.amount && parseFloatSafe(row.amount) > 0
    );

    let newTotalBalance;

    let latestGoldRate = 0;

    if (goldRateRows.length > 0) {
      latestGoldRate = parseFloatSafe(
        goldRateRows[goldRateRows.length - 1].goldRate
      );

      if (
        currentBalances.pureBalance > 0 ||
        currentBalances.hallmarkBalance > 0
      ) {
        newTotalBalance =
          parseFloatSafe(currentBalances.pureBalance) * latestGoldRate +
          parseFloatSafe(currentBalances.hallmarkBalance);
      } else {
        newTotalBalance =
          parseFloatSafe(currentBalances.pureBalance) * latestGoldRate;
      }
    } else {
      newTotalBalance =
        displayedTotalBalance > 0
          ? displayedTotalBalance
          : displayHallmarkCharges > 0
          ? displayHallmarkCharges
          : 0;
    }

    setTotalBalance(newTotalBalance);
  }, [rows, currentBalances.pureBalance, currentBalances.hallmarkBalance]);

  useEffect(() => {
    const totalPurityWeight = rows.reduce((sum, row) => {
      return sum + parseFloatSafe(row.purityWeight);
    }, 0);
    if (totalPurityWeight > parseFloatSafe(initialPureBalance)) {
      showSnackbar(
        `Total purity weight (${totalPurityWeight.toFixed(
          2
        )}) exceeds available pure balance (${initialPureBalance})`
      );
    }
  }, [rows, initialPureBalance]);

  const showSnackbar = (message, severity = "error") => {
    if (!isViewMode) {
      setSnackbar({ open: true, message, severity });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddRow = () => {

    const lastRowWithGoldRate = [...rows].reverse().find(row => row.goldRate && row.goldRate !== "");

    setRows([
      ...rows,
      {
        date: new Date().toISOString().slice(0, 10),
        goldRate: lastRowWithGoldRate ? lastRowWithGoldRate.goldRate : "",
        givenGold: "",
        touch: "",
        purityWeight: "",
        amount: "",
        mode: "",
        isNew: true,
        paidAmount: "",
      },
    ]);

    setRows([...rows, newRow]);
    setIsUpdating(true);
  };

  const handleDeleteRow = (index) => {
    if (!isViewMode || (isViewMode && rows[index].isNew)) {
      const updatedRows = [...rows];
      updatedRows.splice(index, 1);
      setRows(updatedRows);
      setIsUpdating(true);
    }
  };
  const handleRowChange = (index, field, value) => {
    if (isViewMode && !rows[index].isNew) {
      return;
    }

    const updatedRows = [...rows];
    const row = updatedRows[index];

    console.log("vvvvvvvvvvvvvvvvvvvvvvvvvv", value);

    if (value === "" || value === null || value === undefined) {
      row[field] = 0;
      setRows(updatedRows);
    }

    if (field !== "date") {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return;
      }
      row[field] = field === "touch" ? numValue : value;
    } else {
      row[field] = value;
    }

    if (
      field === "givenGold" ||
      field === "touch" ||
      row.givenGold ||
      row.touch
    ) {
      console.log("sssssssssssssssssssssssssssssssssssssss");

      const givenGold = parseFloatSafe(row.givenGold);
      const touch = parseFloatSafe(row.touch);

      if (givenGold > 0 || touch > 0) {
        console.log("sssssssssssssssssssssssssssssssssssssss");
        row.mode = "weight";
        const purityWeight = givenGold * (touch / 100);

        row.purityWeight = purityWeight;
        row.amount = "";
      }
    } else if (
      (field === "amount" || field === "goldRate" || field === "paidAmount" ||
      row.amount || row.goldRate || row.paidAmount)
    ) {
      row.mode = "amount";
      row.givenGold = "";
      row.touch = "";

      if ((row.amount || row.paidAmount) && row.goldRate) {
        const goldRate = parseFloatSafe(row.goldRate);
        const paidAmount = parseFloatSafe(row.paidAmount);

        const balances = calculateBalances();
        const usePaidAmount =
          balances.pureBalance < 0 &&
          balances.totalBalance < 0 &&
          parseFloatSafe(row.paidAmount) > 0;

        const amount = parseFloatSafe(row.amount);

        const currentBalances = calculateBalances();
        const availablePure = parseFloatSafe(currentBalances.pureBalance);
        const availableHallmark = parseFloatSafe(
          currentBalances.hallmarkBalance
        );

        const firstAmountIndex = updatedRows.findIndex(
          (r) => parseFloatSafe(r.amount) > 0
        );

        const hallmarkDeduction =
          index === firstAmountIndex ? Math.min(amount, availableHallmark) : 0;

        let remainingAmount = amount - hallmarkDeduction;

        let wanttodeducthall = false;
        let deductedhall = true;

        if (firstAmountIndex === index) {
          wanttodeducthall = true;
          deductedhall = false;
        }

        let purityWeight = 0;
        if (availableHallmark == 0) {
          if (usePaidAmount || paidAmount > 0) {
            purityWeight = paidAmount / goldRate;
          } else {
            if (wanttodeducthall === true && deductedhall === false) {
              const cashtogeneratepurity =
                remainingAmount - initialHallmarkBalance;
              purityWeight = cashtogeneratepurity / goldRate;
              deductedhall = true;
              wanttodeducthall = false;
            } else {
              purityWeight = remainingAmount / goldRate;
            }
          }
        } else {
          wanttodeducthall = false;
        }

        row.purityWeight = purityWeight;
      }
    }

    setRows(updatedRows);
    setIsUpdating(true);
  };

  return (
    <Box className="itemsSection">
      <div className="add">
        <h3>Received Details:</h3>

        <p style={{ marginLeft: "42.4rem" }}>
          <IconButton
            size="small"
            onClick={handleAddRow}
            className="add-circle-icon"
            disabled={isViewMode && rows.some((row) => row.isNew && !row.mode)}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </p>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th className="th">S.No</th>
            <th className="th">Date</th>
            <th className="th">Gold WT</th>
            <th className="th">Gold Rate</th>
            <th className="th" style={{ minWidth: "5rem" }}>
              %
            </th>
            <th className="th">Purity WT</th>
            <th className="th">Received Amount</th>
            <th className="th">Paid Amount</th>

            <div className="no-print-receive">
              <th className="th"> Action</th>
            </div>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="td">{index + 1}</td>
              <td className="td">
                <TextField
                  style={{ right: "17px" }}
                  size="small"
                  type="date"
                  value={row.date}
                  onChange={(e) =>
                    handleRowChange(index, "date", e.target.value)
                  }
                  disabled={isViewMode && !row.isNew}
                />
              </td>
              <td className="td">
                <TextField
                  size="small"
                  value={row.givenGold}
                  onChange={(e) =>
                    handleRowChange(index, "givenGold", e.target.value)
                  }
                  disabled={
                    (isViewMode && !row.isNew) ||
                    (row.mode === "amount" && !(isViewMode && row.isNew))
                  }
                  inputProps={{ min: 0, step: "0.001" }}
                />
              </td>
              <td className="td">
                <NumericFormat
                  customInput={TextField}
                  size="small"
                  value={row.goldRate === "" ? "" : row.goldRate}
                  onValueChange={(e) => {
                    handleRowChange(index, "goldRate", e.floatValue);
                    calculateBalances();
                  }}
                  thousandSeparator=","
                  decimalScale={3}
                  disabled={
                    (isViewMode && !row.isNew) ||
                    (row.mode === "weight" && !(isViewMode && row.isNew))
                  }
                  inputProps={{ min: 0 }}
                />
              </td>
              <td className="td">
                <NumericFormat
                  customInput={TextField}
                  size="small"
                  value={row.touch}
                  onValueChange={(e) =>
                    handleRowChange(index, "touch", e.floatValue)
                  }
                  thousandSeparator=","
                  disabled={
                    (isViewMode && !row.isNew) ||
                    (row.mode === "amount" && !(isViewMode && row.isNew))
                  }
                />
              </td>
              <td className="td">
                <TextField
                  size="small"
                  value={
                    row.purityWeight
                      ? parseFloat(row.purityWeight) % 1 === 0
                        ? parseInt(row.purityWeight)
                        : parseFloat(row.purityWeight)
                            .toFixed(2)
                            .replace(/\.?0+$/, "")
                      : ""
                  }
                  InputProps={{ readOnly: true }}
                />
              </td>
              <td className="td">
                <NumericFormat
                  customInput={TextField}
                  size="small"
                  value={row.amount}
                  onValueChange={(e) =>
                    handleRowChange(index, "amount", e.floatValue)
                  }
                  thousandSeparator=","
                  decimalScale={3}
                  disabled={
                    (isViewMode && !row.isNew) ||
                    (row.mode === "weight" && !(isViewMode && row.isNew))
                  }
                  inputProps={{ min: 0 }}
                />
              </td>
              <td className="td">
                <NumericFormat
                  customInput={TextField}
                  size="small"
                  value={row.paidAmount}
                  onValueChange={(e) =>
                    handleRowChange(index, "paidAmount", e.floatValue)
                  }
                  thousandSeparator=","
                  decimalScale={3}
                  disabled={
                    (isViewMode && !row.isNew) ||
                    (row.mode === "weight" && !(isViewMode && row.isNew))
                  }
                  inputProps={{ min: 0 }}
                />
              </td>

              <div className="no-prints-receive">
                <td className="td">
                  <IconButton
                    onClick={() => handleDeleteRow(index)}
                    disabled={isViewMode && !row.isNew}
                  >
                    <MdDeleteForever />
                  </IconButton>
                </td>
              </div>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex">
        <div>
          <b>
            Pure Balance:{" "}
            {parseFloat(currentBalances.pureBalance) % 1 === 0
              ? parseInt(currentBalances.pureBalance)
              : parseFloat(currentBalances.pureBalance)
                  .toFixed(3)
                  .replace(/\.?0+$/, "")}
          </b>
        </div>
        <div>
          <b>
            Hallmark Balance:{" "}
            {parseFloat(currentBalances.hallmarkBalance) % 1 === 0
              ? parseInt(currentBalances.hallmarkBalance)
              : parseFloat(currentBalances.hallmarkBalance)
                  .toFixed(2)
                  .replace(/\.?0+$/, "")}
          </b>
        </div>
        <div>
          <b>
            Total Balance:{" "}
            {parseFloat(currentBalances.totalBalance) % 1 === 0
              ? parseInt(currentBalances.totalBalance)
              : parseFloat(currentBalances.totalBalance)
                  .toFixed(2)
                  .replace(/\.?0+$/, "")}
          </b>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReceivedDetails;

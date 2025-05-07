
import React, { useState, useEffect, useRef } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Button,
  Modal,
  Typography,
  IconButton,
  Tooltip,
  MenuItem,
  Alert,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./Billing.css";
import AddCustomer from "./Addcustomer";
import { MdDeleteForever } from "react-icons/md";
import { BACKEND_SERVER_URL } from "../../Config/Config";

const Billing = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [billNo, setBillNo] = useState("001");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    no: "",
    percentage: "",
    weight: "",
    pure: "",
    touch: "",
  });
  const [billRef] = useState(useRef(null));
  const [customers, setCustomers] = useState([]);
  const [goldRate, setGoldRate] = useState("");
  const [hallmarkCharges, setHallmarkCharges] = useState("");
  const [receivedGold, setReceivedGold] = useState({
    weight: "",
    percentage: "",
    purity: "",
  });
  const [balancePurity, setBalancePurity] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);
  const [showAdditionalReceived, setShowAdditionalReceived] = useState(false);
  const [additionalReceivedPurity, setAdditionalReceivedPurity] = useState("");
  const [rows, setRows] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [stockError, setStockError] = useState(null);
  const [availableStock, setAvailableStock] = useState(0);

 
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch(`${BACKEND_SERVER_URL}/api/v1/stocks`);
        const data = await response.json();
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    fetchStocks();
  }, []);


  useEffect(() => {
    if (newItem.name && newItem.percentage) {
      checkStockAvailability();
    }
  }, [newItem.name, newItem.percentage, newItem.no]);

  const checkStockAvailability = () => {
    const selectedCoin = stockData.find(
      (item) =>
        item.gram === parseFloat(newItem.name) &&
        item.coinType === newItem.percentage
    );

    if (selectedCoin) {
      setAvailableStock(selectedCoin.quantity);
      if (selectedCoin.quantity < (parseInt(newItem.no) || 0)) {
        setStockError(
          `Insufficient stock. Available: ${selectedCoin.quantity}`
        );
      } else {
        setStockError(null);
      }
    } else {
      setAvailableStock(0);
      setStockError("No stock available for this combination");
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        date: new Date().toISOString().slice(0, 10),
        rate: goldRate,
        givenGold: "",
        touch: "",
        purityWeight: "",
        amount: "",
        hallmark: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (field === "givenGold" || field === "touch") {
      const givenGold = parseFloat(updatedRows[index].givenGold) || 0;
      const touch = parseFloat(updatedRows[index].touch) || 0;
      const purityWeight = givenGold * (touch / 100);
      updatedRows[index].purityWeight = purityWeight.toFixed(3);

      if (updatedRows[index].rate) {
        const amount = purityWeight * parseFloat(updatedRows[index].rate);
        updatedRows[index].amount = amount.toFixed(2);
      }
    }

    setRows(updatedRows);
  };

  useEffect(() => {
    if (goldRate) {
      const updatedRows = rows.map((row) => {
        if (row.purityWeight) {
          const amount = parseFloat(row.purityWeight) * parseFloat(goldRate);
          return { ...row, amount: amount.toFixed(2), rate: goldRate };
        }
        return { ...row, rate: goldRate };
      });
      setRows(updatedRows);
    }
  }, [goldRate]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${BACKEND_SERVER_URL}/api/customers`);
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDate(now.toLocaleDateString("en-IN"));
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAddCustomer = (newCustomer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
  };

  const handleAddItem = () => {
    setOpenAddItem(true);
  };

  const handleCloseAddItem = () => {
    setOpenAddItem(false);
    setNewItem({
      name: "",
      no: "",
      percentage: "",
      weight: "",
      pure: "",
      touch: "",
    });
    setStockError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateValues = () => {
    const coin = parseFloat(newItem.name) || 0;
    const no = parseFloat(newItem.no) || 0;
    const percentage = parseFloat(newItem.percentage) || 0;

    const weight = coin * no;
    const pure = weight * (percentage / 100);

    setNewItem((prev) => ({
      ...prev,
      weight: weight.toString(),
      pure: pure % 1 === 0 ? pure.toString() : pure.toFixed(3),
    }));
  };

  useEffect(() => {
    if (newItem.name && newItem.no && newItem.percentage) {
      calculateValues();
    }
  }, [newItem.name, newItem.no, newItem.percentage]);


const handleSaveItem = async () => {
  if (!newItem.name || !newItem.no || !newItem.percentage) {
    alert("Please fill all required fields");
    return;
  }

  try {
  
    const requestData = {
      coinType: newItem.percentage,
      gram: parseFloat(newItem.name),
      quantity: parseInt(newItem.no),
      reason: `Billed in invoice ${billNo}`,
    };

    console.log("Sending stock reduction request:", requestData);

    const response = await fetch(`${BACKEND_SERVER_URL}/api/v1/stocks/reduce`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const result = await response.json();
    console.log("Backend response:", result);

    if (!response.ok) {
      throw new Error(result.message || "Failed to update stock");
    }

 
    setBillItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now().toString(),
        name: newItem.name,
        no: newItem.no,
        percentage: newItem.percentage,
        touch: newItem.touch,
        weight: newItem.weight,
        pure: newItem.pure,
      },
    ]);

    handleCloseAddItem();

  
    const stockResponse = await fetch(`${BACKEND_SERVER_URL}/api/v1/stocks`);
    const stockData = await stockResponse.json();
    setStockData(stockData);
  } catch (error) {
    console.error("Error in handleSaveItem:", error);
    alert(`Error: ${error.message}`);

   
    const stockResponse = await fetch(`${BACKEND_SERVER_URL}/api/v1/stocks`);
    const stockData = await stockResponse.json();
    setStockData(stockData);
  }
};
  const calculateTotals = () => {
    let totalTouch = 0;
    let totalWeight = 0;
    let totalPurity = 0;
    let totalAmount = 0;
    let totalNo = 0;

    billItems.forEach((item) => {
      totalTouch += parseFloat(item.touch) || 0;
      totalWeight += parseFloat(item.weight) || 0;
      totalPurity += parseFloat(item.pure) || 0;
      totalAmount += parseFloat(item.pure) || 0;
      totalNo += parseFloat(item.no) || 0;
    });

    return { totalTouch, totalWeight, totalPurity, totalAmount, totalNo };
  };

  const { totalTouch, totalWeight, totalPurity, totalAmount, totalNo } =
    calculateTotals();

  useEffect(() => {
    const weight = parseFloat(receivedGold.weight) || 0;
    const percentage = parseFloat(receivedGold.percentage) || 0;
    const purity = weight * (percentage / 100);
    setReceivedGold((prev) => ({ ...prev, purity: purity.toFixed(3) }));
  }, [receivedGold.weight, receivedGold.percentage]);

  useEffect(() => {
    setBalancePurity(totalPurity - parseFloat(receivedGold.purity || 0));
  }, [totalPurity, receivedGold.purity]);

  useEffect(() => {
    const rate = parseFloat(goldRate) || 0;
    const additionalPurity = parseFloat(additionalReceivedPurity) || 0;
    setCashBalance(additionalPurity * rate + parseFloat(hallmarkCharges || 0));
  }, [goldRate, hallmarkCharges, additionalReceivedPurity]);

  return (
    <>
      <Box className="action-buttons">
        <Tooltip title="Add Bill Details" arrow>
          <IconButton className="add-button" onClick={handleAddItem}>
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Print Bill" arrow>
          <IconButton className="print-button" onClick={() => window.print()}>
            <PrintIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box className="add-customer-container">
        <AddCustomer onAddCustomer={handleAddCustomer} />
      </Box>

      <Box className="container" ref={billRef}>
        <h1 className="heading">Estimate Only</h1>

        <Box className="billInfo">
          <p>
            <strong>Bill No:</strong> {billNo}
          </p>
          <p className="date-time">
            <strong>Date:</strong> {date} <br />
            <br />
            <strong>Time:</strong> {time}
          </p>
        </Box>

        <Box className="searchSection">
          <Autocomplete
            options={customers}
            getOptionLabel={(option) => option.name || ""}
            onChange={(event, newValue) => setSelectedCustomer(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Customer"
                variant="outlined"
                size="small"
              />
            )}
            className="smallAutocomplete"
          />
        </Box>

        {selectedCustomer && (
          <Box className="customerDetails">
            <h3>Customer Details:</h3>
            <br />
            <p>
              <strong>Name:</strong> {selectedCustomer?.name || "-"}
            </p>
          </Box>
        )}

        <Box className="itemsSection">
          <div className="bill">
            <h3>Bill Details:</h3>
            <b style={{ marginLeft: "41rem" }}>
              Gold Rate:
              <TextField
                size="small"
                style={{
                  width: "120px",
                  height: "1rem",
                  bottom: "18px",
                  left: "5px",
                }}
                value={goldRate}
                onChange={(e) => setGoldRate(e.target.value)}
              />
            </b>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th className="th">Coin</th>
                <th className="th">No</th>
                <th className="th">%</th>
                <th className="th">Touch</th>
                <th className="th">Weight</th>
                <th className="th">Purity</th>
                <th className="th">Amount</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index}>
                  <td className="td">{item.name}</td>
                  <td className="td">{item.no}</td>
                  <td className="td">{item.percentage}</td>
                  <td className="td">{item.touch}</td>
                  <td className="td">{item.weight}</td>
                  <td className="td">{item.pure}</td>
                  <td className="td">
                    {goldRate
                      ? (parseFloat(item.pure) * parseFloat(goldRate)).toFixed(
                          2
                        )
                      : "-"}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="td">
                  <strong>Total</strong>
                </td>
                <td className="td">
                  <strong>{totalNo}</strong>
                </td>
                <td className="td"></td>
                <td className="td">
                  <strong>{totalTouch.toFixed(1)}</strong>
                </td>
                <td className="td">
                  <strong>{Math.round(totalWeight)}</strong>
                </td>
                <td className="td">
                  <strong>{totalPurity.toFixed(3)}</strong>
                </td>
                <td className="td">
                  <strong>
                    {goldRate
                      ? (totalPurity * parseFloat(goldRate)).toFixed(2)
                      : totalAmount.toFixed(2)}
                  </strong>
                </td>
              </tr>

              <tr>
                <td className="td" colSpan={6}>
                  <strong>Hallmark or MC Charges</strong>
                </td>
                <td className="td">
                  <TextField
                    size="small"
                    style={{ width: "100px" }}
                    value={hallmarkCharges}
                    onChange={(e) => setHallmarkCharges(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="td" colSpan={6}>
                  <strong>Cash Balance</strong>
                </td>
                <td className="td">
                  <strong>
                    {parseFloat(
                      (goldRate
                        ? totalPurity * parseFloat(goldRate)
                        : totalAmount) + parseFloat(hallmarkCharges || 0)
                    ).toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </Box>

        <br />

        <Box className="itemsSection">
          <div className="add">
            <h3>Received Details:</h3>
            <p style={{ marginLeft: "42.4rem" }}>
              <IconButton size="small" onClick={handleAddRow}>
                <AddCircleOutlineIcon />
              </IconButton>
            </p>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th className="th">S.No</th>
                <th className="th">Date</th>
                <th className="th">Gold Rate</th>
                <th className="th">Given Gold</th>
                <th className="th">Touch</th>
                <th className="th">Purity WT</th>
                <th className="th">Amount</th>
                <th className="th">Hallmark</th>
                <th className="th">Action</th>
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
                    />
                  </td>
                  <td className="td">
                    <TextField
                      size="small"
                      value={row.rate}
                      onChange={(e) =>
                        handleRowChange(index, "rate", e.target.value)
                      }
                    />
                  </td>
                  <td className="td">
                    <TextField
                      size="small"
                      value={row.givenGold}
                      onChange={(e) =>
                        handleRowChange(index, "givenGold", e.target.value)
                      }
                    />
                  </td>
                  <td className="td">
                    <TextField
                      size="small"
                      value={row.touch}
                      onChange={(e) =>
                        handleRowChange(index, "touch", e.target.value)
                      }
                    />
                  </td>
                  <td className="td">
                    <TextField
                      size="small"
                      value={row.purityWeight}
                      InputProps={{ readOnly: true }}
                    />
                  </td>
                  <td className="td">
                    <TextField
                      size="small"
                      value={row.amount}
                      InputProps={{ readOnly: true }}
                    />
                  </td>
                  <td className="td">
                    <TextField
                      size="small"
                      value={row.hallmark}
                      onChange={(e) =>
                        handleRowChange(index, "hallmark", e.target.value)
                      }
                    />
                  </td>
                  <td className="td">
                    <IconButton onClick={() => handleDeleteRow(index)}>
                      <MdDeleteForever />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex">
            <b>Gold Amount Balance: </b>
            <b>Gold Balance: {totalPurity.toFixed(3)}</b>
            <b>Hallmark Balance:{hallmarkCharges}</b>
          </div>
        </Box>
      </Box>

      <Modal
        open={openAddItem}
        onClose={handleCloseAddItem}
        aria-labelledby="add-item-modal"
      >
        <Box className="modal-container">
          <Typography variant="h6" gutterBottom>
            Add Bill Details
          </Typography>
          <Box component="form" className="modal-form">
            <TextField
              fullWidth
              label="Coin Value (grams)"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              margin="normal"
              type="number"
              inputProps={{ step: "0.01" }}
            />
            <TextField
              fullWidth
              label="No of Coins"
              name="no"
              value={newItem.no}
              onChange={handleInputChange}
              margin="normal"
              type="number"
            />
            <TextField
              select
              fullWidth
              label="Percentage (%)"
              name="percentage"
              value={newItem.percentage}
              onChange={handleInputChange}
              margin="normal"
            >
              <MenuItem value="916">916 (22K)</MenuItem>
              <MenuItem value="999">999 (24K)</MenuItem>
            </TextField>

            {newItem.name && newItem.percentage && (
              <Box>
                <Typography variant="body2">
                  Available Stock: {availableStock}
                </Typography>
                {stockError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {stockError}
                  </Alert>
                )}
              </Box>
            )}

            <TextField
              fullWidth
              label="Touch"
              name="touch"
              value={newItem.touch}
              onChange={handleInputChange}
              margin="normal"
              type="number"
            />
            <TextField
              fullWidth
              label="Weight (Auto-calculated)"
              name="weight"
              value={newItem.weight}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              label="Purity (Auto-calculated)"
              name="pure"
              value={newItem.pure}
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <Box className="modal-actions">
              <Button onClick={handleCloseAddItem} className="cancel-button">
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveItem}
                className="save-button"
                disabled={!!stockError}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Billing;
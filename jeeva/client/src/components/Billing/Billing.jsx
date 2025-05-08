
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
  Snackbar,
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
  const [billNo, setBillNo] = useState("");
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
  const [hallmarkCharges, setHallmarkCharges] = useState(0);
  const [rows, setRows] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [stockError, setStockError] = useState(null);
  const [availableStock, setAvailableStock] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
      
        const customersResponse = await fetch(
          `${BACKEND_SERVER_URL}/api/customers`
        );
        const customersData = await customersResponse.json();
        setCustomers(customersData);

    
        const stocksResponse = await fetch(
          `${BACKEND_SERVER_URL}/api/v1/stocks`
        );
        const stocksData = await stocksResponse.json();
        setStockData(stocksData);

   
        const billsResponse = await fetch(`${BACKEND_SERVER_URL}/api/bills`);
        const billsData = await billsResponse.json();
        const latestBill = billsData.length > 0 ? billsData[0] : null;
        setBillNo(
          latestBill ? `BILL-${parseInt(latestBill.id) + 1}` : "BILL-1"
        );
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showSnackbar("Failed to load initial data", "error");
      }
    };

    fetchInitialData();
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

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };


  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        date: new Date().toISOString().slice(0, 10),
        goldRate: goldRate,
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

      if (updatedRows[index].goldRate) {
        const amount = purityWeight * parseFloat(updatedRows[index].goldRate);
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
          return { ...row, amount: amount.toFixed(2), goldRate: goldRate };
        }
        return { ...row, goldRate: goldRate };
      });
      setRows(updatedRows);
    }
  }, [goldRate]);


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


  const handleSaveItem = () => {
    if (!newItem.name || !newItem.no || !newItem.percentage) {
      showSnackbar("Please fill all required fields", "error");
      return;
    }

    if (stockError) {
      showSnackbar(stockError, "error");
      return;
    }

    setBillItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now().toString(),
        coinValue: parseFloat(newItem.name),
        quantity: parseInt(newItem.no),
        percentage: newItem.percentage,
        touch: newItem.touch,
        weight: newItem.weight,
        purity: newItem.pure,
      },
    ]);

    handleCloseAddItem();
  };

 
  const calculateTotals = () => {
    let totalWeight = 0;
    let totalPurity = 0;

    billItems.forEach((item) => {
      totalWeight += parseFloat(item.weight) || 0;
      totalPurity += parseFloat(item.purity) || 0;
    });

    return { totalWeight, totalPurity };
  };

  const { totalWeight, totalPurity } = calculateTotals();

  
  const handleSubmitBill = async () => {
    if (!selectedCustomer) {
      showSnackbar("Please select a customer", "error");
      return;
    }

    if (billItems.length === 0) {
      showSnackbar("Please add at least one item", "error");
      return;
    }

    if (!goldRate) {
      showSnackbar("Please enter gold rate", "error");
      return;
    }

    try {
      const billData = {
        customerId: selectedCustomer.id,
        goldRate: parseFloat(goldRate),
        hallmarkCharges: parseFloat(hallmarkCharges || 0),
        items: billItems.map((item) => ({
          coinValue: parseFloat(item.coinValue),
          quantity: parseInt(item.quantity),
          percentage: parseInt(item.percentage),
          touch: parseFloat(item.touch || 0),
        })),
        receivedDetails: rows.map((row) => ({
          date: row.date,
          goldRate: parseFloat(row.goldRate),
          givenGold: parseFloat(row.givenGold),
          touch: parseFloat(row.touch),
          hallmark: parseFloat(row.hallmark || 0),
        })),
      };

      const response = await fetch(`${BACKEND_SERVER_URL}/api/bills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create bill");
      }

      showSnackbar("Bill created successfully!", "success");

      setBillItems([]);
      setRows([]);
      setSelectedCustomer(null);
      setGoldRate("");
      setHallmarkCharges(0);

  
      const billsResponse = await fetch(`${BACKEND_SERVER_URL}/api/bills`);
      const billsData = await billsResponse.json();
      const latestBill = billsData.length > 0 ? billsData[0] : null;
      setBillNo(latestBill ? `BILL-${parseInt(latestBill.id) + 1}` : "BILL-1");
    } catch (error) {
      console.error("Error creating bill:", error);
      showSnackbar(error.message || "Failed to create bill", "error");
    }
  };

  return (
    <>
      <Box className="action-buttons">
        <Tooltip title="Add Bill Details" arrow>
          <IconButton
          
            className="add-button"
            onClick={handleAddItem}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Print Bill" arrow>
          <IconButton
            
            className="print-button"
            onClick={() => window.print()}
          >
            <PrintIcon />
          </IconButton>
        </Tooltip>

        <Button
          style={{ top: "5rem" }}
          variant="contained"
          color="primary"
          onClick={handleSubmitBill}
          disabled={!selectedCustomer || billItems.length === 0}
        >
          Save Bill
        </Button>
      </Box>

      {/* <Box className="add-customer-container">
        <AddCustomer  onAddCustomer={handleAddCustomer} />
      </Box> */}

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
            value={selectedCustomer}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Customer"
                variant="outlined"
                size="small"
                required
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
                type="number"
                required
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
                  <td className="td">{item.coinValue}</td>
                  <td className="td">{item.quantity}</td>
                  <td className="td">{item.percentage}</td>
                  <td className="td">{item.touch}</td>
                  <td className="td">{item.weight}</td>
                  <td className="td">{item.purity}</td>
                  <td className="td">
                    {goldRate
                      ? (
                          parseFloat(item.purity) * parseFloat(goldRate)
                        ).toFixed(2)
                      : "-"}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="td">
                  <strong>Total</strong>
                </td>
                <td className="td">
                  <strong>
                    {billItems.reduce(
                      (sum, item) => sum + parseInt(item.quantity),
                      0
                    )}
                  </strong>
                </td>
                <td className="td"></td>
                <td className="td"></td>
                <td className="td">
                  <strong>{totalWeight.toFixed(3)}</strong>
                </td>
                <td className="td">
                  <strong>{totalPurity.toFixed(3)}</strong>
                </td>
                <td className="td">
                  <strong>
                    {goldRate
                      ? (totalPurity * parseFloat(goldRate)).toFixed(2)
                      : "0.00"}
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
                    type="number"
                  />
                </td>
              </tr>
              <tr>
                <td className="td" colSpan={6}>
                  <strong>Total Amount</strong>
                </td>
                <td className="td">
                  <strong>
                    {(
                      totalPurity * parseFloat(goldRate || 0) +
                      parseFloat(hallmarkCharges || 0)
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
                      value={row.goldRate}
                      onChange={(e) =>
                        handleRowChange(index, "goldRate", e.target.value)
                      }
                      type="number"
                    />
                  </td>
                  <td className="td">
                    <TextField
                      size="small"
                      value={row.givenGold}
                      onChange={(e) =>
                        handleRowChange(index, "givenGold", e.target.value)
                      }
                      type="number"
                    />
                  </td>
                  <td className="td">
                    <TextField
                      size="small"
                      value={row.touch}
                      onChange={(e) =>
                        handleRowChange(index, "touch", e.target.value)
                      }
                      type="number"
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
                      type="number"
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
              required
            />
            <TextField
              fullWidth
              label="No of Coins"
              name="no"
              value={newItem.no}
              onChange={handleInputChange}
              margin="normal"
              type="number"
              required
            />
            <TextField
              select
              fullWidth
              label="Percentage (%)"
              name="percentage"
              value={newItem.percentage}
              onChange={handleInputChange}
              margin="normal"
              required
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </>
  );
};

export default Billing;
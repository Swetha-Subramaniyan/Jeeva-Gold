
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
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import "./Billing.css";
import AddCustomer from "./Addcustomer";

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
  });
  const billRef = useRef();
  const [customers, setCustomers] = useState([
    {
      id: "C001",
      customer_name: "John",
      address: "ABC Street",
      phone_number: "9856743789",
    },
  ]);
  const [goldRate, setGoldRate] = useState("");
  const [hallmarkCharges, setHallmarkCharges] = useState("");

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

  const handleProductSelect = (event, newValue) => {
    if (newValue && !billItems.some((item) => item.id === newValue.id)) {
      setBillItems((prevItems) => [...prevItems, newValue]);
    }
  };

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
      percentage:"",
      weight: "",
      pure: "",
    });
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
    if (newItem.name && newItem.no && newItem.percentage) {
      setBillItems((prevItems) => [
        ...prevItems,
        {
          id: Date.now().toString(),
          name: newItem.name,
          touch: newItem.no,
          weight: newItem.weight,
          pure: newItem.pure,
          percentage: newItem.percentage,
        },
      ]);
      handleCloseAddItem();
    }
  };

  const calculateTotals = () => {
    let totalNo = 0;
    let totalWeight = 0;
    let totalPurity = 0;

    billItems.forEach((item) => {
      totalNo += parseFloat(item.touch) || 0;
      totalWeight += parseFloat(item.weight) || 0;
      totalPurity += parseFloat(item.pure) || 0;
    });

    return { totalNo,totalWeight,totalPurity };
  };

  const { totalNo, totalWeight, totalPurity } = calculateTotals();

  const calculateFinalTotal = () => {
    const rate = parseFloat(goldRate) || 0;
    const charges = parseFloat(hallmarkCharges) || 0;
    return totalPurity * rate + charges;
  };

  const finalTotal = calculateFinalTotal();

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
            getOptionLabel={(option) => option.customer_name}
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
            <p>
              <strong>Name:</strong> {selectedCustomer.customer_name}
            </p>
            <p>
              <strong>Address:</strong> {selectedCustomer.address}
            </p>
            <p>
              <strong>Phone:</strong> {selectedCustomer.phone_number}
            </p>
          </Box>
        )}

        <Box className="itemsSection">
          <h3>Bill Details:</h3>
          <table className="table">
            <thead>
              <tr>
                <th className="th">Coin</th>
                <th className="th">No</th>
                <th className="th">%</th>
                <th className="th">Weight</th>
                <th className="th">Purity</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index}>
                  <td className="td">{item.name}</td>
                  <td className="td">{item.touch}</td>
                  <td className="td">{item.percentage}</td>
                  <td className="td">{item.weight}</td>
                  <td className="td">{item.pure}</td>
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
                  <strong>{Math.round(totalWeight)}</strong>
                </td>
                <td className="td">
                  <strong>{totalPurity.toFixed(3)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
          <Box className="total-calculation">
            <TextField
              label="Gold Rate"
              value={goldRate}
              onChange={(e) => setGoldRate(e.target.value)}
              type="number"
              size="small"
              className="gold-rate-input"
            />
            <TextField
              label="Hallmark Charges"
             value={hallmarkCharges}
              onChange={(e) => setHallmarkCharges(e.target.value)}
              type="number"
              size="small"
              className="hallmark-charges-input"
            />
            <Typography variant="h6">
              Final Total: {finalTotal.toFixed(2)}
            </Typography>
          </Box>
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
              label="Coin Value"
              name="name"
              value={newItem.name}
          
              onChange={handleInputChange}
              margin="normal"
              type="number"
            />
            <TextField
              fullWidth
              label="No"
              name="no"
              value={newItem.no}
              onChange={handleInputChange}
              margin="normal"
              type="number"
            />
            <TextField
              fullWidth
              label="Percentage (%)"
              name="percentage"
            value={newItem.percentage}
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
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              fullWidth
              label="Purity (Auto-calculated)"
              name="pure"
              value={newItem.pure}
      
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
            <Box className="modal-actions">
              <Button onClick={handleCloseAddItem} className="cancel-button">
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveItem}
                className="save-button"
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

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
  });
  const [billRef] = useState(useRef(null)); 
  const [customers, setCustomers] = useState([
   
  ]);
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

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        date: "",
        rate: "",
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
useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${BACKEND_SERVER_URL}/api/customers`);
        const data = await response.json();
        setCustomers(data);
        console.log("fetched customers",data)
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

    return { totalNo, totalWeight, totalPurity };
  };

  const { totalNo, totalWeight, totalPurity } = calculateTotals();

  

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
            <br></br>
            <p>
              <strong>Name:</strong> {selectedCustomer?.name || "-"}
            </p>
         
          </Box>
        )}

        <Box className="itemsSection">
          <div className="bill">
            <h3>Bill Details:</h3>{" "}
            <b style={{ marginLeft: "31.9rem" }}>
              {" "}
              Gold Rate: <input style={{ height: "1.6rem" }} />
            </b>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th className="th">Coin</th>
                <th className="th">No</th>
                <th className="th">%</th>
                <th className="th">Weight</th>
                <th className="th">Purity</th>
                <th className="th">Amount</th>
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
                  <td> </td>
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
                <td className="td">
                  <strong>{totalPurity.toFixed(3)}</strong>
                </td>
              </tr>
              <tr>
                <td className="td" colSpan={5}>
                  <strong>Hallmark or MC Charges</strong>
                </td>
                <td> </td>
              </tr>
              <tr>
                <td className="td" colSpan={5}>
                  <strong>Cash Balance</strong>
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
                <th className="th">Rate</th>
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
                    <TextField size="small" type="date" />
                  </td>
                  <td className="td">
                    <TextField size="small" />
                  </td>
                  <td className="td">
                    <TextField size="small" />
                  </td>
                  <td className="td">
                    <TextField size="small" />
                  </td>
                  <td className="td">
                    <TextField size="small" />
                  </td>
                  <td className="td">
                    <TextField size="small" />
                  </td>
                  <td className="td">
                    <TextField size="small" />
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
            <b>Amount Balance: </b>
            <b>Gold Balance: </b>
            <b>Hallmark Balance:</b>
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






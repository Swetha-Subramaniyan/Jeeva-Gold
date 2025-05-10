import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Autocomplete,
  TablePagination,
} from "@mui/material";
import { BACKEND_SERVER_URL } from "../../Config/Config";

const CustomerReport = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

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

    const fetchBills = async () => {
      try {
        const response = await fetch(`${BACKEND_SERVER_URL}/api/bills`);
        const data = await response.json();
        setBills(data);
        setFilteredBills(data);
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };

    fetchCustomers();
    fetchBills();
  }, []);

  useEffect(() => {
    let result = bills;

    if (selectedCustomer) {
      result = result.filter((bill) => bill.customerId === selectedCustomer.id);
    }

    if (startDate) {
      result = result.filter(
        (bill) => new Date(bill.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      result = result.filter(
        (bill) => new Date(bill.createdAt) <= new Date(endDate + "T23:59:59")
      );
    }

    setFilteredBills(result);
    setPage(0);
  }, [selectedCustomer, startDate, endDate, bills]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const calculateTotal = (bills) => {
    return bills.reduce((total, bill) => {
      const billTotal = bill.items.reduce(
        (sum, item) => sum + item.purity * bill.goldRate,
        0
      );
      return total + billTotal + (bill.hallmarkCharges || 0);
    }, 0);
  };

  const calculateWeight = (bills) => {
    return bills.reduce(
      (total, bill) =>
        total + bill.items.reduce((sum, item) => sum + item.weight, 0),
      0
    );
  };

  const calculatePurity = (bills) => {
    return bills.reduce(
      (total, bill) =>
        total + bill.items.reduce((sum, item) => sum + item.purity, 0),
      0
    );
  };

  const handleReset = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedCustomer(null);
    setStartDate(today);
    setEndDate(today);
    setFilteredBills(bills);
  };

  return (
    <Box sx={{ p: 3 }}>
        <Typography style={{textAlign:"center"}} variant="h5" gutterBottom>
          Customer Report
           </Typography>
<br></br>
<br></br>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Autocomplete
          options={customers}
          getOptionLabel={(option) => option.name}
          value={selectedCustomer}
          onChange={(event, newValue) => setSelectedCustomer(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select Customer" variant="outlined" />
          )}
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />

        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 4,
          mb: 2,
          flexWrap: "wrap",
          fontWeight: "bold",
        }}
      >
        <Typography variant="body1">
          Total Sales: ₹{calculateTotal(filteredBills).toFixed(2)}
        </Typography>
        <Typography variant="body1">
          Total Weight: {calculateWeight(filteredBills).toFixed(3)} g
        </Typography>
        <Typography variant="body1">
          Total Purity: {calculatePurity(filteredBills).toFixed(3)} g
        </Typography>
        <Typography variant="body1">
          Number of Bills: {filteredBills.length}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bill No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Gold Rate</TableCell>
              <TableCell>Total Weight</TableCell>
              <TableCell>Total Purity</TableCell>
              <TableCell>Hallmark Charges</TableCell>
              <TableCell>Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBills
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((bill) => {
                const totalWeight = bill.items.reduce(
                  (sum, item) => sum + item.weight,
                  0
                );
                const totalPurity = bill.items.reduce(
                  (sum, item) => sum + item.purity,
                  0
                );
                const totalAmount = bill.items.reduce(
                  (sum, item) => sum + item.purity * bill.goldRate,
                  0
                );

                return (
                  <TableRow key={bill.id}>
                    <TableCell>BILL-{bill.id}</TableCell>
                    <TableCell>
                      {new Date(bill.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{bill.goldRate}</TableCell>
                    <TableCell>{totalWeight.toFixed(3)}</TableCell>
                    <TableCell>{totalPurity.toFixed(3)}</TableCell>
                    <TableCell>{bill.hallmarkCharges || 0}</TableCell>
                    <TableCell>
                      {(totalAmount + (bill.hallmarkCharges || 0)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredBills.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default CustomerReport;

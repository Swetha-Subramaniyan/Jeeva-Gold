
import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import "./Report.css";

function Report() {
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [customerSearch, setCustomerSearch] = useState(""); 


  const sampleBillingData = [
    {
      date: "2025-04-10",
      billNo: "001",
      customer: "John Smith",
      coinType: 5.0,
      no: 2,
      percentage: 99.9,
      weight: 10,
      purity: 9.99,
      receivedGoldPercentage: null,
      receivedGoldWeight: null,
      balancePurity: 9.99,
    },
  ];

 
  const filteredData = sampleBillingData.filter((item) => {
    const dateMatch = selectedDate ? item.date === selectedDate : true;
    const typeMatch =
      filterType === "all" || String(item.coinType) === filterType;
    const customerMatch = customerSearch
      ? item.customer.toLowerCase().includes(customerSearch.toLowerCase())
      : true;

    return dateMatch && typeMatch && customerMatch;
  });

  
  const totals = filteredData.reduce(
    (acc, item) => {
      acc.no += item.no;
      acc.weight += item.weight;
      acc.purity += item.purity;
      return acc;
    },
    { no: 0, weight: 0, purity: 0 }
  );


  const uniqueCoinTypes = [
    "all",
    ...new Set(sampleBillingData.map((item) => String(item.coinType))),
  ];
  const uniqueCustomers = [
    "all",
    ...new Set(sampleBillingData.map((item) => item.customer)),
  ];

  return (
    <Box className="report-container">
      <Typography style={{textAlign:"center"}} variant="h5" className="report-title" gutterBottom>
        Daily Sales Report
      </Typography>
<br></br>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Coin Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Coin Type"
          >
            {uniqueCoinTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Select Date"
          type="date"
          size="small"
          sx={{ width: 150 }}
          InputLabelProps={{ shrink: true }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <TextField
          label="Search Customer"
          size="small"
          sx={{ width: 200 }}
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
        />
      </Box>

      <TableContainer
        component={Paper}
        elevation={3}
        className="table-container"
      >
        <Table stickyHeader aria-label="billing report table">
          <TableHead>
            <TableRow>
              <TableCell className="table-header">Date</TableCell>
              <TableCell className="table-header">Bill No</TableCell>
              <TableCell className="table-header">Customer</TableCell>
              <TableCell className="table-header" align="right">
                Coin 
              </TableCell>
              <TableCell className="table-header" align="right">
                No
              </TableCell>
              <TableCell className="table-header" align="right">
                %
              </TableCell>
              <TableCell className="table-header" align="right">
                Weight
              </TableCell>
              <TableCell className="table-header" align="right">
                Purity
              </TableCell>
              <TableCell className="table-header" align="right">
                Received Gold %
              </TableCell>
              <TableCell className="table-header" align="right">
                Received Gold Weight
              </TableCell>
              <TableCell className="table-header" align="right">
                Balance Purity
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell className="table-cell">{row.date}</TableCell>
                  <TableCell className="table-cell">{row.billNo}</TableCell>
                  <TableCell className="table-cell">{row.customer}</TableCell>
                  <TableCell align="right" className="table-cell">
                    {row.coinType}
                  </TableCell>
                  <TableCell align="right" className="table-cell">
                    {row.no}
                  </TableCell>
                  <TableCell align="right" className="table-cell">
                    {row.percentage}
                  </TableCell>
                  <TableCell align="right" className="table-cell">
                    {row.weight}
                  </TableCell>
                  <TableCell align="right" className="table-cell">
                    {row.purity}
                  </TableCell>
                  <TableCell align="right" className="table-cell">
                    {row.receivedGoldPercentage !== null
                      ? row.receivedGoldPercentage
                      : "-"}
                  </TableCell>
                  <TableCell align="right" className="table-cell">
                    {row.receivedGoldWeight !== null
                      ? row.receivedGoldWeight
                      : "-"}
                  </TableCell>
                  <TableCell align="right" className="table-cell">
                    {row.balancePurity}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center" className="table-cell">
                  No billing data found for selected filters
                </TableCell>
              </TableRow>
            )}

            {filteredData.length > 0 && (
              <TableRow className="totals-row">
                <TableCell className="totals-cell" colSpan={3}>
                  Total
                </TableCell>
                <TableCell className="totals-cell" align="right">
                  -
                </TableCell>
                <TableCell align="right" className="totals-cell">
                  {totals.no}
                </TableCell>
                <TableCell align="right" className="totals-cell">
                  -
                </TableCell>
                <TableCell align="right" className="totals-cell">
                  {totals.weight}
                </TableCell>
                <TableCell align="right" className="totals-cell">
                  {totals.purity}
                </TableCell>
                <TableCell align="right" className="totals-cell">
                  -
                </TableCell>
                <TableCell align="right" className="totals-cell">
                  -
                </TableCell>
                <TableCell align="right" className="totals-cell">
                  -
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Report;




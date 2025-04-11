// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
// } from "@mui/material";
// import "./Report.css";

// function Report() {
//   const [filterType, setFilterType] = useState("all");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [customerSearch, setCustomerSearch] = useState("");

//   // Sample data with customer names
//   const sampleData = [
//     {
//       date: "2023-05-15",
//       customer: "John Smith",
//       type: "999",
//       quantity: 12,
//       weight: 48.5,
//       purity: 48.4,
//       transactions: 6,
//     },
//     {
//       date: "2023-05-15",
//       customer: "Emma Johnson",
//       type: "916",
//       quantity: 18,
//       weight: 72.3,
//       purity: 66.2,
//       transactions: 9,
//     },
//     {
//       date: "2023-05-16",
//       customer: "Michael Brown",
//       type: "999",
//       quantity: 8,
//       weight: 32.1,
//       purity: 32.0,
//       transactions: 4,
//     },
//     {
//       date: "2023-05-16",
//       customer: "Sarah Davis",
//       type: "Plain",
//       quantity: 5,
//       weight: 25.1,
//       purity: 24.9,
//       transactions: 3,
//     },
//     {
//       date: "2023-05-17",
//       customer: "Robert Wilson",
//       type: "916",
//       quantity: 15,
//       weight: 60.2,
//       purity: 55.1,
//       transactions: 7,
//     },
//   ];

//   // Filter data based on selections
//   const filteredData = sampleData.filter((item) => {
//     const dateMatch = selectedDate ? item.date === selectedDate : true;
//     const typeMatch = filterType === "all" || item.type === filterType;
//     const customerMatch = customerSearch
//       ? item.customer.toLowerCase().includes(customerSearch.toLowerCase())
//       : true;
//     return dateMatch && typeMatch && customerMatch;
//   });

//   // Calculate totals
//   const totals = filteredData.reduce(
//     (acc, item) => {
//       acc.quantity += item.quantity;
//       acc.weight += item.weight;
//       acc.purity += item.purity;
//       acc.transactions += item.transactions;
//       return acc;
//     },
//     { quantity: 0, weight: 0, purity: 0, transactions: 0 }
//   );

//   return (
//     <Box className="report-container">
//       <Typography variant="h5" className="report-title" gutterBottom>
//         Sales Summary Report
//       </Typography>

//       <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
//         <FormControl size="small" sx={{ minWidth: 180 }}>
//           <InputLabel>Coin Type</InputLabel>
//           <Select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             label="Coin Type"
//           >
//             <MenuItem value="all">All Types</MenuItem>
//             <MenuItem value="999">999 Purity</MenuItem>
//             <MenuItem value="916">916 Purity</MenuItem>
//             <MenuItem value="Plain">Plain</MenuItem>
//           </Select>
//         </FormControl>

//         <TextField
//           label="Select Date"
//           type="date"
//           size="small"
//           sx={{ width: 180 }}
//           InputLabelProps={{ shrink: true }}
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//         />

//         <TextField
//           label="Search Customer"
//           size="small"
//           sx={{ width: 180 }}
//           value={customerSearch}
//           onChange={(e) => setCustomerSearch(e.target.value)}
//         />
//       </Box>

//       <TableContainer
//         component={Paper}
//         elevation={3}
//         className="table-container"
//       >
//         <Table stickyHeader aria-label="sales report table">
//           <TableHead>
//             <TableRow>
//               <TableCell className="table-header">Date</TableCell>
//               <TableCell className="table-header">Customer</TableCell>
//               <TableCell className="table-header" align="center">
//                 Type
//               </TableCell>
//               <TableCell className="table-header" align="right">
//                 Quantity
//               </TableCell>
//               <TableCell className="table-header" align="right">
//                 Weight (g)
//               </TableCell>
//               <TableCell className="table-header" align="right">
//                 Purity (g)
//               </TableCell>
//               <TableCell className="table-header" align="right">
//                 Transactions
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredData.length > 0 ? (
//               filteredData.map((row, index) => (
//                 <TableRow key={index} hover>
//                   <TableCell className="table-cell">{row.date}</TableCell>
//                   <TableCell className="table-cell">{row.customer}</TableCell>
//                   <TableCell align="center" className="table-cell">
//                     {row.type}
//                   </TableCell>
//                   <TableCell align="right" className="table-cell">
//                     {row.quantity}
//                   </TableCell>
//                   <TableCell align="right" className="table-cell">
//                     {row.weight.toFixed(2)}
//                   </TableCell>
//                   <TableCell align="right" className="table-cell">
//                     {row.purity.toFixed(2)}
//                   </TableCell>
//                   <TableCell align="right" className="table-cell">
//                     {row.transactions}
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={7} align="center" className="table-cell">
//                   No data found for selected filters
//                 </TableCell>
//               </TableRow>
//             )}

//             {/* Totals Row - only shown when there's data */}
//             {filteredData.length > 0 && (
//               <TableRow className="totals-row">
//                 <TableCell className="totals-cell" colSpan={2}>
//                   Total
//                 </TableCell>
//                 <TableCell className="totals-cell" align="center">
//                   -
//                 </TableCell>
//                 <TableCell align="right" className="totals-cell">
//                   {totals.quantity}
//                 </TableCell>
//                 <TableCell align="right" className="totals-cell">
//                   {totals.weight.toFixed(2)}
//                 </TableCell>
//                 <TableCell align="right" className="totals-cell">
//                   {totals.purity.toFixed(2)}
//                 </TableCell>
//                 <TableCell align="right" className="totals-cell">
//                   {totals.transactions}
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// }

// export default Report;



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
    {
      date: "2025-04-10",
      billNo: "002",
      customer: "Emma Johnson",
      coinType: 916,
      no: 1,
      percentage: 91.6,
      weight: 5,
      purity: 4.58,
      receivedGoldPercentage: null,
      receivedGoldWeight: null,
      balancePurity: 4.58,
    },
    {
      date: "2025-04-09",
      billNo: "003",
      customer: "John Smith",
      coinType: 999,
      no: 3,
      percentage: 99.9,
      weight: 15,
      purity: 14.985,
      receivedGoldPercentage: null,
      receivedGoldWeight: null,
      balancePurity: 14.985,
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




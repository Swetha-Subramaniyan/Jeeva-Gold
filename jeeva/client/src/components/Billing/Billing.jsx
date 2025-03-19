
// import React, { useState, useEffect, useRef } from "react";
// import { Autocomplete, TextField, Box, Button } from "@mui/material";
// import "./Billing.css";
// import AddCustomer from "./Addcustomer";

// const Billing = () => {
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [billItems, setBillItems] = useState([]);
//   const [billNo, setBillNo] = useState("001");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [isPrinting, setIsPrinting] = useState(false);
//   const billRef = useRef();

//   const [products, setProducts] = useState([
//     { id: "P001", name: "Gold Ring", touch: 92, weight: 6.64, pure: 6.19 },
//     {
//       id: "P002",
//       name: "Silver Necklace",
//       touch: 92,
//       weight: 11.34,
//       pure: 10.66,
//     },
//     {
//       id: "P003",
//       name: "Diamond Bracelet",
//       touch: 95,
//       weight: 8.5,
//       pure: 8.07,
//     },
//   ]);

//   const customers = [
//     {
//       id: "C001",
//       customer_name: "John ",
//       address: "ABC Street",
//       phone_number: "9856743789",
//     },
//     {
//       id: "C002",
//       customer_name: "Jane ",
//       address: "DEF Colony",
//       phone_number: "7843567894",
//     },
//   ];

//   useEffect(() => {
//     const updateTime = () => {
//       const now = new Date();
//       setDate(now.toLocaleDateString("en-IN"));
//       setTime(
//         now.toLocaleTimeString("en-IN", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         })
//       );
//     };

//     updateTime();
//     const timer = setInterval(updateTime, 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const handleProductSelect = (event, newValue) => {
//     if (newValue && !billItems.some((item) => item.id === newValue.id)) {
//       setBillItems((prevItems) => [...prevItems, newValue]);
//     }
//   };

//   const calculateTotal = () => {
//     return billItems.reduce((total, item) => total + item.pure, 0).toFixed(3);
//   };

//   const calculateLess = (total) => {
//     return (total * 0.9992).toFixed(3);
//   };

//   const calculateClosing = (total, less) => {
//     return (total - less).toFixed(3);
//   };

//   return (
//     <>
//       <Box mt={3}>
//         <AddCustomer />
//       </Box>

//       <Box className="container" ref={billRef}>
//         <h1 className="heading">Estimate Only</h1>

//         <Box className="billInfo">
//           <p>
//             <strong>Bill No:</strong> {billNo}
//           </p>
//           <p style={{ marginLeft: "14rem" }}>
//             <strong>Date:</strong> {date} <br />
//             <br />
//             <strong>Time:</strong> {time}
//           </p>
//         </Box>

//         <Box
//           className="searchSection"
//           style={{ display: isPrinting ? "none" : "flex" }}
//         >
//           <Autocomplete
//             options={customers}
//             getOptionLabel={(option) => option.customer_name}
//             onChange={(event, newValue) => setSelectedCustomer(newValue)}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Select Customer"
//                 variant="outlined"
//                 size="small"
//               />
//             )}
//             className="smallAutocomplete"
//           />
//         </Box>

//         {selectedCustomer && (
//           <Box className="customerDetails">
//             <h3>Customer Details:</h3>
//             <p>
//               <strong>Name:</strong> {selectedCustomer.customer_name}
//             </p>
//             <p>
//               <strong>Address:</strong> {selectedCustomer.address}
//             </p>
//             <p>
//               <strong>Phone:</strong> {selectedCustomer.phone_number}
//             </p>
//           </Box>
//         )}

//         <Box className="searchSection">
//           <Autocomplete
//             options={products}
//             getOptionLabel={(option) => option.name}
//             onChange={handleProductSelect}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Select Product"
//                 variant="outlined"
//                 size="small"
//               />
//             )}
//             className="smallAutocomplete"
//           />
//         </Box>

//         <Box className="itemsSection">
//           <h3>Bill Details:</h3>
//           <table className="table">
//             <thead>
//               <tr>
//                 <th className="th">Description</th>
//                 <th className="th">Touch</th>
//                 <th className="th">Weight</th>
//                 <th className="th">Pure</th>
//               </tr>
//             </thead>
//             <tbody>
//               {billItems.length > 0 ? (
//                 billItems.map((item, index) => (
//                   <tr key={index}>
//                     <td className="td">{item.name}</td>
//                     <td className="td">{item.touch}</td>
//                     <td className="td">{item.weight}</td>
//                     <td className="td">{item.pure}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="4"
//                     style={{ textAlign: "center", padding: "10px" }}
//                   >
//                     No products selected
//                   </td>
//                 </tr>
//               )}
//               <tr>
//                 <td colSpan="3" className="td">
//                   <strong>Total</strong>
//                 </td>
//                 <td className="td">{calculateTotal()}</td>
//               </tr>
//               <tr>
//                 <td colSpan="3" className="td">
//                   <strong>Less (99.92%)</strong>
//                 </td>
//                 <td className="td">{calculateLess(calculateTotal())}</td>
//               </tr>
//               <tr>
//                 <td colSpan="3" className="td">
//                   <strong>Closing</strong>
//                 </td>
//                 <td className="td">
//                   {calculateClosing(
//                     calculateTotal(),
//                     calculateLess(calculateTotal())
//                   )}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </Box>

//         <Button
//           variant="contained"
//           className="printButton"
//           style={{
//             display: isPrinting ? "none" : "block",
//             backgroundColor: "black",
//           }}
//         >
//           Print Bill
//         </Button>
//       </Box>
//     </>
//   );
// };

// export default Billing;


import React, { useState, useEffect, useRef } from "react";
import { Autocomplete, TextField, Box, Button } from "@mui/material";
import "./Billing.css";
import AddCustomer from "./Addcustomer";

const Billing = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [billNo, setBillNo] = useState("001");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);
  const billRef = useRef();
  const [customers, setCustomers] = useState([
    {
      id: "C001",
      customer_name: "John",
      address: "ABC Street",
      phone_number: "9856743789",
    },
    {
      id: "C002",
      customer_name: "Jane",
      address: "DEF Colony",
      phone_number: "7843567894",
    },
  ]);

  const [products, setProducts] = useState([
    { id: "P001", name: "Gold Ring", touch: 92, weight: 6.64, pure: 6.19 },
    {
      id: "P002",
      name: "Silver Necklace",
      touch: 92,
      weight: 11.34,
      pure: 10.66,
    },
    {
      id: "P003",
      name: "Diamond Bracelet",
      touch: 95,
      weight: 8.5,
      pure: 8.07,
    },
  ]);

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

  const calculateTotal = () =>
    billItems.reduce((total, item) => total + item.pure, 0).toFixed(3);
  const calculateLess = (total) => (total * 0.9992).toFixed(3);
  const calculateClosing = (total, less) => (total - less).toFixed(3);

  return (
    <>
      <Box mt={3}>
        <AddCustomer onAddCustomer={handleAddCustomer} />
      </Box>

      <Box className="container" ref={billRef}>
        <h1 className="heading">Estimate Only</h1>

        <Box className="billInfo">
          <p>
            <strong>Bill No:</strong> {billNo}
          </p>
          <p style={{ marginLeft: "14rem" }}>
            <strong>Date:</strong> {date} <br />
            <br />
            <strong>Time:</strong> {time}
          </p>
        </Box>

        <Box
          className="searchSection"
          style={{ display: isPrinting ? "none" : "flex" }}
        >
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

        <Box className="searchSection">
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name}
            onChange={handleProductSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Product"
                variant="outlined"
                size="small"
              />
            )}
            className="smallAutocomplete"
          />
        </Box>

        <Box className="itemsSection">
          <h3>Bill Details:</h3>
          <table className="table">
            <thead>
              <tr>
                <th className="th">Description</th>
                <th className="th">Touch</th>
                <th className="th">Weight</th>
                <th className="th">Pure</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index}>
                  <td className="td">{item.name}</td>
                  <td className="td">{item.touch}</td>
                  <td className="td">{item.weight}</td>
                  <td className="td">{item.pure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* Calculation Section */}
        {billItems.length > 0 && (
          <Box className="calculationSection">
            <p>
              <strong>Total:</strong> {calculateTotal()}
            </p>
            <p>
              <strong>Less 0.9992:</strong> {calculateLess(calculateTotal())}
            </p>
            <p>
              <strong>Closing:</strong>{" "}
              {calculateClosing(
                calculateTotal(),
                calculateLess(calculateTotal())
              )}
            </p>
          </Box>
        )}

        <Button
          variant="contained"
          className="printButton"
          style={{ backgroundColor: "black" }}
        >
          Print Bill
        </Button>
      </Box>
    </>
  );
};

export default Billing;




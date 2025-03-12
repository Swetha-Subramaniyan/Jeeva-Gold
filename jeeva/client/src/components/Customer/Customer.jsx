import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import "./Customer.css";
import VisibilityIcon from "@mui/icons-material/Visibility";


const Customer = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const storedCustomers = JSON.parse(localStorage.getItem("customers"));
    if (storedCustomers) {
      setCustomers(storedCustomers);
    }
  }, []);

  return (
    <Container maxWidth="md">
      <Paper className="customer-details-container" elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Customer Details
        </Typography>
        {customers.length > 0 ? (
          <Table>
            <TableHead style={{ color: "white" }}>
              <TableRow>
                <TableCell>
                  <strong>Customer Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Phone Number</strong>
                </TableCell>
                <TableCell>
                  <strong>Address</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                 <TableCell><VisibilityIcon/></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body1" align="center">
            No customer details available.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Customer;

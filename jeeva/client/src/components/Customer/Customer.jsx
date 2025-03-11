
import React, { useState } from 'react';
import './Customer.css';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

function Customer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [customers, setCustomers] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
    setCustomerName('');
    setPhoneNumber('');
    setAddress('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveCustomer = () => {
    if (customerName && phoneNumber && address) {
      setCustomers([
        ...customers,
        {
          name: customerName,
          phone: phoneNumber,
          address: address,
        },
      ]);
      closeModal();
    } else {
      alert('Please fill in all customer details.');
    }
  };

  return (
    <div className="customer-container">
     
      <Button
        style={{
          backgroundColor: "#F5F5F5",
          color: "black",
          borderColor: "#25274D",
          borderStyle: "solid",
          borderWidth: "2px",
        }}
        variant="contained"
        color="primary"
        onClick={openModal}
        className="styled-button"
      >
        Add Customer
      </Button>

      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Customer Name"
            type="text"
            fullWidth
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeModal}
            color="secondary"
            className="styled-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveCustomer}
            color="primary"
            className="styled-button"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {customers.length > 0 && (
        <TableContainer component={Paper} className="customer-table">
          <Table aria-label="customer table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">Phone</TableCell>
                <TableCell align="left">Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {customer.name}
                  </TableCell>
                  <TableCell align="left">{customer.phone}</TableCell>
                  <TableCell align="left">{customer.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default Customer;
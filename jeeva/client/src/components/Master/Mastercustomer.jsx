
import React, { useState } from "react";
import "./Mastercustomer.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
} from "@mui/material";

function MasterCustomer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [customers, setCustomers] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
    setCustomerName("");
    setPhoneNumber("");
    setAddress("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


const handleSaveCustomer = () => {
  if (customerName && phoneNumber && address) {
    const newCustomer = {
      name: customerName,
      phone: phoneNumber,
      address: address,
    };
    const updatedCustomers = [...customers, newCustomer];

    setCustomers(updatedCustomers);
    localStorage.setItem("customers", JSON.stringify(updatedCustomers)); 
    closeModal();
  } else {
    alert("Please fill in all customer details.");
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
        onClick={openModal}
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
          <Button onClick={closeModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveCustomer} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {customers.length > 0 && (
        <Paper className="customer-table">
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}
    </div>
  );
}

export default MasterCustomer;



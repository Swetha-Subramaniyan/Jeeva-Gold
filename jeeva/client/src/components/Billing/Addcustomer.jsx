import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const AddCustomer = ({ onAddCustomer }) => {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setCustomer({ name: "", address: "", phone: "" });
    setOpen(false);
  };

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (customer.name && customer.address && customer.phone) {
      const newCustomer = {
        id: `C${Date.now()}`, 
        customer_name: customer.name,
        address: customer.address,
        phone_number: customer.phone,
      };
      onAddCustomer(newCustomer); 
      handleClose();
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
      
      >
        Add Customer
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Customer Name"
            name="name"
            fullWidth
            variant="outlined"
            value={customer.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Address"
            name="address"
            fullWidth
            variant="outlined"
            value={customer.address}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Phone"
            name="phone"
            fullWidth
            variant="outlined"
            value={customer.phone}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddCustomer;

import React, { useState } from "react";
import "./Mastergoldsmith.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
} from "@mui/material";

function Mastergoldsmith() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goldsmithName, setgoldsmithName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [goldsmith, setGoldsmith] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
    setgoldsmithName("");
    setPhoneNumber("");
    setAddress("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

const handleSaveGoldsmith = () => {
  if (goldsmithName && phoneNumber && address) {
    const newGoldsmith = {
      name: goldsmithName,
      phone: phoneNumber,
      address: address,
    };
    const updatedGoldsmith = [...goldsmith, newGoldsmith];

    setGoldsmith(updatedGoldsmith);
    localStorage.setItem("goldsmith", JSON.stringify(updatedGoldsmith));
    closeModal();
  } else {
    alert("Please fill in all goldsmith details.");
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
        Add Goldsmith
      </Button>

      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Add New Goldsmith</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Goldsmith Name"
            type="text"
            fullWidth
            value={goldsmithName}
            onChange={(e) => setgoldsmithName(e.target.value)}
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
          <Button onClick={handleSaveGoldsmith} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {goldsmith.length > 0 && (
        <Paper className="customer-table">
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Goldsmith Name</th>
                <th>Phone Number</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {goldsmith.map((goldsmith, index) => (
                <tr key={index}>
                  <td>{goldsmith.name}</td>
                  <td>{goldsmith.phone}</td>
                  <td>{goldsmith.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}
    </div>
  );
}

export default Mastergoldsmith;

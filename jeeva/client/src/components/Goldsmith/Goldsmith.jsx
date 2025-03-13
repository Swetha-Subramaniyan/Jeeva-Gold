
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
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./Goldsmith.css";
import { useNavigate } from "react-router-dom";

const Goldsmith = () => {
  const [goldsmith, setGoldsmith] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 

  const navigate= useNavigate()

  useEffect(() => {
    const storedGoldsmith = JSON.parse(localStorage.getItem("goldsmith"));
    if (storedGoldsmith) {
      setGoldsmith(storedGoldsmith);
    }
  }, []);

  const filteredGoldsmith = goldsmith.filter(
    (gs) =>
      gs.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gs.phone.includes(searchTerm) ||
      gs.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="md">
      <Paper className="customer-details-container" elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Goldsmith Details
        </Typography>

        <TextField
          label="Search Goldsmith Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              width: "18rem",
              backgroundColor: "#f8f9fa",
              "&.Mui-focused": {
                backgroundColor: "#ffffff",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "#777" }} />
              </InputAdornment>
            ),
          }}
        />

        {filteredGoldsmith.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>Goldsmith Name</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Phone Number</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Address</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGoldsmith.map((goldsmith, index) => (
                <TableRow key={index}>
                  <TableCell>{goldsmith.name}</TableCell>
                  <TableCell>{goldsmith.phone}</TableCell>
                  <TableCell>{goldsmith.address}</TableCell>
                  <TableCell>
                    <VisibilityIcon
                      onClick={() => navigate("/jobcard")}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body1" align="center">
            No goldsmith details available.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Goldsmith;

import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Button,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";
import { FaTrash } from "react-icons/fa";
import "./Billingjewel.css";
import { BACKEND_SERVER_URL } from "../../Config/Config";

const Billing = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${BACKEND_SERVER_URL}/api/customers`);
        const data = await response.json();
        setCustomers(data);
        console.log("fetched customers",data)
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <Box className="wrapper">
      <Box className="leftPanel">
        <h1 className="heading">Estimate Only</h1>

        <Box className="searchSection">
          <Autocomplete
            options={customers}
            getOptionLabel={(option) => option.name || ""}
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

          <Autocomplete
            options={[]}
            getOptionLabel={(option) => option.jewel_name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Product Name"
                variant="outlined"
                size="small"
              />
            )}
            className="smallAutocomplete"
          />
        </Box>
        
        <Box className="customerDetails">
          <h3>Customer Details:</h3>
          <br />
          <p>
            <strong>Name:</strong> {selectedCustomer?.name || "-"}
          </p>
        </Box>

        <Box className="itemsSection">
          <h3>Bill Details:</h3>
          <table className="table">
            <thead>
              <tr>
                <th className="th">Description</th>
                <th className="th">Touch</th>
                <th className="th">%</th>
                <th className="th">Weight</th>
                <th className="th">Pure</th>
                <th className="th">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td"></td>
                <td className="td"></td>
                <td className="td"> </td>
                <td className="td"></td>
                <td className="td"></td>
                <td className="td">
                  <Button>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
              <tr>
                <td colSpan="4" className="td">
                  <strong>Total</strong>
                </td>
                <td className="td"></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <Button
                    variant="contained"
                    color="primary"
                    className="balanceButton"
                  >
                    +
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>

          <h3>Received Details:</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Given Gold</TableCell>
                <TableCell>Touch</TableCell>
                <TableCell>Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <input type="number" value="0" className="input" />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    placeholder="Touch"
                    value="0"
                    className="input"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    placeholder="Weight"
                    value="0.000"
                    className="input"
                  />
                </TableCell>
                <TableCell>
                  <Button className="delButton">
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Closing</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        <Button variant="contained" color="primary" className="saveButton">
          Save
        </Button>
      </Box>

      <Box className="rightPanel">
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell className="thh">S.No</TableCell>
              <TableCell className="thd">Product Finish Weight</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow style={{ cursor: "pointer" }}>
              <TableCell className="td"></TableCell>
              <TableCell className="td"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Billing;


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/auth.routes");
const customerRoutes = require("./Routes/customer.routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});


app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

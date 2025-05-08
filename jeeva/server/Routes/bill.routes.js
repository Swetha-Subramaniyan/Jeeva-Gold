const express = require("express");
const router = express.Router();
const billController = require("../Controllers/bill.controller");

router.post("/", billController.createBill);
router.get("/", billController.getBills);
router.get("/:id", billController.getBillById);

module.exports = router;

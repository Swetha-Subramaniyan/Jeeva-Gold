const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

router.post("/", transactionController.createTransaction);

router.get("/:customerId", transactionController.getAllTransactions);

module.exports = router;

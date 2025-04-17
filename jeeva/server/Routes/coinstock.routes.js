const express = require("express");
const router = express.Router();
const stockController = require("../Controllers/coinstock.controller");

router.post("/create", stockController.createStock);
router.get("/", stockController.getAllStocks);
router.put("/:id", stockController.updateStock);
router.delete("/:id", stockController.deleteStock);

module.exports = router;

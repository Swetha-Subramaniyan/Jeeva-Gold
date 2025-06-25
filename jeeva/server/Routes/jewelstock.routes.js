const express = require("express");
const router = express.Router();
const jewelStockController = require("../Controllers/jewelstock.controller");

router.post("/", jewelStockController.createJewelStock);
router.get("/", jewelStockController.getAllJewelStock);
router.put("/:id", jewelStockController.updateJewelStock);


module.exports = router;

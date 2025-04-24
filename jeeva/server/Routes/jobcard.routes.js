const express = require("express");
const jobCardController = require("../Controllers/jobcard.controller");
const router = express.Router();

// Route to create a new job card
router.post("/", jobCardController.createJobCard);

// Route to update an item in a job card
router.patch("/items/:itemId", jobCardController.updateJobCardItem);

// Route to get a specific job card by ID
router.get("/:id", jobCardController.getJobCardById);

module.exports = router;

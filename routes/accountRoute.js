// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Route to build account page by account
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build inventory detail view
// router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

module.exports = router;
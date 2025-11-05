// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inv-validation")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

// Route to build add-classification page
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to create new inventory classification
router.post(
    "/add-classification",
    invValidate.newClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification))

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

module.exports = router;
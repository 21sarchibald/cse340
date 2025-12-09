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

// Route to build management page
router.get("/management", 
    utilities.checkJWTToken,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagement));

// Route to build inventory table based on classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit-inventory page
router.get("/edit-inventory/:inv_id", 
    utilities.checkJWTToken,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildEditInventory));

// Route to edit inventory
router.post(
    "/edit-inventory",
    invValidate.newInventoryRules(),
    invValidate.checkEditData,
    utilities.handleErrors(invController.editInventory));
    
// Route to build delete inventory page
router.get("/delete-confirm/:inv_id",
    utilities.checkJWTToken,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteInventory));
    
// Route to edit inventory
router.post(
    "/delete-confirm",
    utilities.handleErrors(invController.deleteInventory))


// Route to build add-classification page
router.get("/add-classification", 
    utilities.checkJWTToken,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddClassification));

// Route to create new inventory classification
router.post(
    "/add-classification",
    invValidate.newClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification))

// Route to build add-inventory page
router.get("/add-inventory", 
    utilities.checkJWTToken,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddInventory));

// Route to add new inventory
router.post(
    "/add-inventory",
    invValidate.newInventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory))

// Route to add new review
router.post(
    "/add-review",
    utilities.handleErrors(invController.addReview))

module.exports = router;
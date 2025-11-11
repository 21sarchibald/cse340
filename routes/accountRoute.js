// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration page
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));

// Route to build management page
router.get("/management", utilities.handleErrors(accountController.buildManagement));

// Process registration data
router.post(
    '/register', 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  );
module.exports = router;
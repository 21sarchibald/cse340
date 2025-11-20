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
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

// Route to build edit account page
router.get("/edit-account", utilities.handleErrors(accountController.buildEditAccount));

// Route to edit account information
router.post(
  "/edit-account",
  (req, res, next) => {
    req.accountData = res.locals.accountData;
    next();
  },
  regValidate.editAccountInfoRules(),
  regValidate.checkEditData,
  utilities.handleErrors(accountController.editAccountInfo));

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
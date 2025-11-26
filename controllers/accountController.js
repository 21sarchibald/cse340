const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      // message: req.flash(),
      errors: null,
    })
  }

/* ****************************************
*  Deliver logout view
* *************************************** */
async function buildLogout(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/logout", {
      title: "Logout",
      nav,
      // message: req.flash(),
      errors: null,
    })
  }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
      title: "Register",
      nav,
      // message: req.flash(),
      errors: null,
    })
  }
  
/* ***************************
 *  Build management view
 * ************************** */
async function buildManagement (req, res, next) {
  console.log("build function reacted");
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Build edit account view
* *************************************** */
async function buildEditAccount(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  res.render("account/edit-account", {
    title: "Edit Account Information",
    nav,
    // message: req.flash(),
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    errors: null,
  })
}

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    // Hash the password before storing
    let hashedPassword
    try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  let nav = await utilities.getNav()

  try {

    res.clearCookie('jwt');
    if(process.env.NODE_ENV === 'development') {
      res.clearCookie("jwt",
        { httpOnly: true }
      )
    } else {
      res.clearCookie("jwt", 
        { httpOnly: true, secure: true }
      )
    }
      return res.redirect("/");
    }
  catch (error) {
    throw new Error('Could not be logged out')
  }
}

  /* ****************************************
*  Process Edit Account Request
* *************************************** */
async function editAccountInfo(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id} = req.body

  const regResult = await accountModel.editAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (regResult) {
    const updatedAccount = await accountModel.getAccountById(account_id)
    delete updatedAccount.account_password
    
    const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 3600 * 1000 })
      }


    res.locals.accountData = updatedAccount
    req.flash(
      "notice",
      `Your account was successfully updated!`
    )
    return res.redirect("/account/");

  } else {
    req.flash("notice", "Sorry, your account could not be updated.")
    res.status(501).render("/account/edit-account", {
      title: "Edit Account Info",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

  /* ****************************************
*  Change Password
* *************************************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
  req.flash("notice", 'Sorry, there was an error changing the password.')
  res.status(500).render("account/edit-account", {
    title: "Edit Account Information",
    nav,
    errors: null,
  })
}

  const regResult = await accountModel.changePassword(
    hashedPassword, account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Your password was successfully changed!`
    )
    return res.redirect("/account/");

  } else {
    req.flash("notice", "Sorry, your password could not be changed.")
    res.status(501).render("account/edit-account", {
      title: "Edit Account Information",
      nav,
    })
  }
}

  
  module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildManagement, buildEditAccount, editAccountInfo, changePassword, accountLogout, buildLogout }
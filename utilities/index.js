const { getAccountById } = require("../models/account-model")
const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ******************************
 * Constructs the nav HTML unordered list
 ******************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailView = async function(detailData, reviewData){
  const product = detailData[0];
  const reviews = reviewData;
  const reviewRows = await Promise.all(
    reviews.map(async review => {
    const account = await getAccountById(review.account_id);
    console.log(account);
    const userFirstInitial = account.account_firstname[0];
    const userLastName = account.account_lastname;
    return `
    <tr>
      <td><h4>${userFirstInitial}.${userLastName}</h4></td>
      <td><p>${review.review_text}</p></td>
    </tr>`;
  })
);

const reviewTable = reviewRows.join('');

let view
      view = `
      <h1 id="product-detail-header">
          ${product.inv_year} ${product.inv_make} ${product.inv_model}
      </h1>
      <div id="product-detail-grid">
        <img src="${product.inv_image}" id="product-detail-img">
        <div id="product-detail-details">
          <h2>${product.inv_make} ${product.inv_model} Details</h2>
          <h3>Price: $${new Intl.NumberFormat('en-US').format(product.inv_price)}</h3>
          <h3>Description: </h3>
          <p id="product-description">${product.inv_description}</p>
          <h3>Color: ${product.inv_color}</h3>
          <h3>Miles: ${new Intl.NumberFormat('en-US').format(product.inv_miles)}</h3>
        </div>
        <div id="product-detail-reviews">
          <h2>Reviews</h2>
          <table id="detail-reviews-table">
            <tr>
            </tr>
            ${reviewTable}
          </table>
        </div>
      </div>
      `
    return view
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  const accountType = res.locals.accountData.account_type;
  console.log(accountType);
  if (accountType == 'Employee' || accountType == 'Admin') {
    next()
  } else {
    req.flash("notice", "Must be an employee or admin to access that page.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util
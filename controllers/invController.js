const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build product view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  console.log("build function reacted");
  const vehicleId = req.params.vehicleId
  const data = await invModel.getDetailsByProductId(vehicleId);
  const view = await utilities.buildDetailView(data);
  let nav = await utilities.getNav()
  const pageName = data[0].inv_model
  res.render("./inventory/detail", {
    title: pageName,
    nav,
    view,
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  console.log("build function reacted");
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

  /* ****************************************
*  Process Registration
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

//   try {
//   // regular password and cost (salt is generated automatically)
//   hashedPassword = await bcrypt.hashSync(account_password, 10)
//   } catch (error) {
//   req.flash("notice", 'Sorry, there was an error processing the registration.')
//   res.status(500).render("account/register", {
//     title: "Registration",
//     nav,
//     errors: null,
//   })
// }
const classificationResult = await invModel.addClassification(classification_name)

if (classificationResult) {
  req.flash(
    "notice",
    `Classification ${classification_name} has been added.`
  )
  nav = await utilities.getNav();
  res.status(201).render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  });
} else {
  req.flash("notice", "Sorry, that classification could not be added.")
  res.status(501).render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
  })
}
}


module.exports = invCont
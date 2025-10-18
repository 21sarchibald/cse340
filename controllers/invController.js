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
  })
}


module.exports = invCont
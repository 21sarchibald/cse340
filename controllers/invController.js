const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
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
  const vehicleId = req.params.vehicleId;
  const accountId = res.locals.accountData?.account_id || null;
  const detailData = await invModel.getDetailsByProductId(vehicleId);
  const reviewData = await reviewModel.getReviewsByProductId(vehicleId);
  const view = await utilities.buildDetailView(detailData, reviewData);
  let nav = await utilities.getNav()
  const pageName = detailData[0].inv_model
  res.render("./inventory/detail", {
    title: pageName,
    nav,
    view,
    errors: null,
    account_id: accountId,
    inv_id: vehicleId,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  console.log("build function reacted");
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
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
*  Process Add Classification
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  
const classificationResult = await invModel.addClassification(classification_name)

if (classificationResult) {
  req.flash(
    "notice",
    `Classification ${classification_name} has been added.`
  )
  nav = await utilities.getNav();
  // Navigate back to the management view.
  res.redirect("/inv/management");
} else {
  req.flash("notice", "Sorry, that classification could not be added.")
  res.status(501).render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
  })
}
}

/* ***************************
*  Build add inventory view
* ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  console.log("build function reacted");
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

/* ****************************************
*  Process Add Inventory
* *************************************** */
invCont.addInventory = async function (req, res, next) {
  console.log("Add inventory button works");
let nav = await utilities.getNav()
const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

const inventoryResult = await invModel.addInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description, 
  inv_image, 
  inv_thumbnail, 
  inv_price, 
  inv_miles, 
  inv_color
)

if (inventoryResult) {
req.flash(
  "notice",
  `${inv_year} ${inv_model} ${inv_make} has been added to inventory.`
)
nav = await utilities.getNav();
  // Navigate back to the management view.
  res.redirect("/inv/management");
} else {
classificationList = utilities.buildClassificationList(classification_id);
req.flash("notice", "Sorry, that inventory could not be added.")
res.status(501).render("./inventory/add-inventory", {
  title: "Add Inventory",
  nav,
  classificationList,
})
}
}

/* ***************************
*  Return Inventory by Classification As JSON
* ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
*  Build edit inventory view
* ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  console.log("build function reacted");
  const inventory_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  let inventoryData = await invModel.getDetailsByProductId(inventory_id);
  console.log(inventoryData);
  let classificationList = await utilities.buildClassificationList(inventoryData.classification_id);
  const inventoryName = `${inventoryData.inv_make} ${inventoryData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + inventoryName,
    nav,
    classificationList,
    errors: null,
    inv_id: inventoryData.inv_id,
    classification_id: inventoryData.classification_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_description: inventoryData.inv_description, 
    inv_image: inventoryData.inv_image, 
    inv_thumbnail: inventoryData.inv_thumbnail, 
    inv_price: inventoryData.inv_price, 
    inv_miles: inventoryData.inv_miles, 
    inv_color: inventoryData.inv_color
  })
}

/* ****************************************
*  Process Edit Inventory
* *************************************** */
invCont.editInventory = async function (req, res, next) {
  console.log("Edit inventory button works");
  let nav = await utilities.getNav()
  const { classification_id, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  
  const editResult = await invModel.editInventory(
    classification_id,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color
  )
  
  if (editResult) {
    const inventoryName = editResult.inv_year + " " + editResult.inv_make + " " + editResult.inv_model
    req.flash(
      "notice",
      `The ${inventoryName} was successfully updated.`
    )
    nav = await utilities.getNav();
    // Navigate back to the management view.
    res.redirect("/inv/management");
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id);
    req.flash("notice", `Sorry, the edit failed.`)
    const inventoryName = `${inv_make} ${inv_model}`;
    res.status(501).render("./inventory/edit-inventory", {
      title: "Edit " + inventoryName,
      nav,
      classificationList,
      errors: null,
      classification_id,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    })
  }
}

/* ***************************
*  Build delete inventory view
* ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  console.log("build function reacted");
  const inventory_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  let inventoryData = await invModel.getDetailsByProductId(inventory_id);
  console.log(inventoryData);
  // let classificationList = await utilities.buildClassificationList(inventoryData.classification_id);
  const inventoryName = `${inventoryData.inv_make} ${inventoryData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + inventoryName,
    nav,
    // classificationList,
    errors: null,
    inv_id: inventoryData.inv_id,
    // classification_id: inventoryData.classification_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    // inv_description: inventoryData.inv_description, 
    // inv_image: inventoryData.inv_image, 
    // inv_thumbnail: inventoryData.inv_thumbnail, 
    inv_price: inventoryData.inv_price, 
    // inv_miles: inventoryData.inv_miles, 
    // inv_color: inventoryData.inv_color
  })
}

/* ****************************************
*  Process Delete Inventory
* *************************************** */
invCont.deleteInventory = async function (req, res, next) {
  console.log("Delete inventory button works");
  let nav = await utilities.getNav()
  const { classification_id, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, } = req.body
  
  const deleteResult = await invModel.deleteInventory(
    inv_id,
  )
  
  if (deleteResult) {
    const inventoryName = inv_year + " " + inv_make + " " + inv_model
    req.flash(
      "notice",
      `The ${inventoryName} was successfully deleted.`
    )
    nav = await utilities.getNav();
    // Navigate back to the management view.
    res.redirect("/inv/management");
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id);
    req.flash("notice", `Sorry, the deletion failed.`)
    const inventoryName = `${inv_make} ${inv_model}`;
    res.status(501).render("./inventory/delete-confirm", {
      title: "Delete " + inventoryName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price, 
    })
  }
}

module.exports = invCont
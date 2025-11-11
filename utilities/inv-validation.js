const utilities = require("./")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const invModel = require("../models/inventory-model")

  
  /*  **********************************
  *  New Classification Rules
  * ********************************* */
 
 validate.newClassificationRules = () => {
   return [
     // firstname is required and must be string
     body("classification_name")
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide classification name.") // on error this message is sent.
     .custom(async (classification_name) => {
       const classificationExists = await invModel.checkExistingClassification(classification_name)
       if (classificationExists){
         throw new Error("Classification already exists.")
        }
      })
    ]
  }
  
  /* ******************************
  * Check data and return errors or continue to registration
  * ***************************** */
 validate.checkClassificationData = async (req, res, next) => {
   const { classification_name } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
     let nav = await utilities.getNav()
     res.render("inventory/add-classification", {
       errors,
       title: "Add Classification",
       nav,
      })
      return
    }
    next()
  }


  /*  **********************************
  *  New Inventory Rules
  * ********************************* */
 
 validate.newInventoryRules = () => {
   return [
     body("classification_id")
     .notEmpty()
     .withMessage("Please select a classification."), // on error this message is sent.
     // make is required and must be string
     body("inv_make")
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide inventory make."), // on error this message is sent.
     // model is required and must be string
     body("inv_model")
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide inventory model."), // on error this message is sent.
     // year is required and must be an integer
     body("inv_year")
     .isInt()
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 4, max: 4 })
     .withMessage("Please provide inventory year in requested format."), // on error this message is sent.
     // description is required and must be string
     body("inv_description")
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide inventory description."), // on error this message is sent.
     // image is required and must be string
     body("inv_image")
     .trim()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide inventory image."), // on error this message is sent.
     // thumbnail is required and must be string
     body("inv_thumbnail")
     .trim()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide inventory thumbnail."), // on error this message is sent.
     // price is required and must be a number
     body("inv_price")
     .isNumeric()
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide numeric inventory price."), // on error this message is sent.
     // miles is required and must be a number
     body("inv_miles")
     .isNumeric()
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide numeric inventory miles."), // on error this message is sent.
     // color is required and must be string
     body("inv_color")
     .trim()
     .escape()
     .notEmpty()
     .isLength({ min: 1 })
     .withMessage("Please provide inventory color."), // on error this message is sent.

    ]
  }
 
  /* ******************************
  * Check data and return errors or continue to add inventory
  * ***************************** */
 validate.checkInventoryData = async (req, res, next) => {
   const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
     let nav = await utilities.getNav();
     let classificationList = await utilities.buildClassificationList(classification_id);
     res.render("inventory/add-inventory", {
       errors,
       title: "Add Inventory",
       nav,
       classificationList,
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
      })
      return
    }
    next()
  }

  /* ******************************
  * Check data, return errors, and return to edit view or continue to edit inventory.
  * ***************************** */
 validate.checkEditData = async (req, res, next) => {
   const { classification_id, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
   let errors = []
   errors = validationResult(req)
   if (!errors.isEmpty()) {
     let nav = await utilities.getNav();
     let classificationList = await utilities.buildClassificationList(classification_id);
     res.render("inventory/edit-inventory", {
       errors,
       title: `Edit ${inv_make} ${inv_model}`,
       nav,
       classificationList,
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
      return
    }
    next()
  }

  module.exports = validate
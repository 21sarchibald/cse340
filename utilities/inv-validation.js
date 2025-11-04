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

  module.exports = validate
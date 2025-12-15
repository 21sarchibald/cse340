const utilities = require("./")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const invModel = require("../models/inventory-model")
  const reviewModel = require("../models/review-model")


validate.reviewRules = () => {
    return [
      // review is required and must be string
      body("review_text")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide review text.") // on error this message is sent.
     ]
   }

  /* ******************************
  * Check data and return errors or continue to edit data
  * ***************************** */
  validate.checkAddReview = async (req, res, next) => {
    const { review_text } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log("build function reacted");
        const vehicleId = req.body.inv_id;
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
          errors,
          account_id: accountId,
          inv_id: vehicleId,
        })
        return
    }
     next();
   
 }

 /* ******************************
  * Check data and return errors or continue to edit data
  * ***************************** */
 validate.checkEditReview = async (req, res, next) => {
    const { review_text } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("build edit review page function reacted");
      const { review_id } = req.body;
      console.log("review id: ", review_id);
      const response = await reviewModel.getReviewById(review_id);
      const { review_text } = await req.body;
      let nav = await utilities.getNav();
      res.render("./review/edit-review", {
        title: "Edit Review",
        nav,
        review_id: review_id,
        review_text: review_text,
        errors,
      })
        return
    }
     next()
   
 }

   module.exports = validate
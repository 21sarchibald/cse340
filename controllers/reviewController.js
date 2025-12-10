const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ****************************************
*  Process Add Review
* *************************************** */
reviewCont.addReview = async function (req, res, next) {
    console.log("Add Review function works");
    let nav = await utilities.getNav()
    const { inv_id, account_id, review_text } = req.body
    
    const addResult = await reviewModel.addReview(inv_id, account_id, review_text);
    
    if (addResult) {
      req.flash(
        "notice",
        `Review successfully added.`
      )
      nav = await utilities.getNav();
      // Navigate back to the management view.
      res.redirect(`/inv/detail/${inv_id}`);
    } else {
      console.log("Add review function failed.")
      req.flash("notice", `Sorry, the review could not be added.`)
      res.redirect(`/inv/detail/${inv_id}`);
    }
  }

  module.exports = reviewCont
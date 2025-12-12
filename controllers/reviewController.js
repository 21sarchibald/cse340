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

/* ***************************
*  Build edit review page
* ************************** */
reviewCont.buildEditReviewPage = async function (req, res, next) {
  console.log("build edit review page function reacted");
  const reviewId = parseInt(req.params.reviewId);
  console.log("review id: ", reviewId);
  const response = await reviewModel.getReviewById(reviewId);
  const reviewText = await response.review_text;
  let nav = await utilities.getNav();
  res.render("./review/edit-review", {
    title: "Edit Review",
    nav,
    review_id: reviewId,
    review_text: reviewText,
    errors: null,
  })
}

/* ****************************************
*  Process Edit Review
* *************************************** */
reviewCont.editReview = async function (req, res, next) {
  console.log("Edit Review function works");
  let nav = await utilities.getNav()
  const { review_id, review_text } = req.body
  
  const editResult = await reviewModel.editReview(review_id, review_text);
  
  if (editResult) {
    req.flash(
      "notice",
      `Review successfully edited.`
    )
    nav = await utilities.getNav();
    // Navigate back to the detail view with the message.
    res.redirect(`/account/`);
  } else {
    console.log("Edited review function failed.")
    req.flash("notice", `Sorry, the review could not be edited.`)
    res.redirect(`/account/`);
  }
}

/* ***************************
*  Build edit review page
* ************************** */
reviewCont.buildDeleteReviewPage = async function (req, res, next) {
  console.log("build delete review page function reacted");
  const reviewId = parseInt(req.params.reviewId);
  console.log("review id: ", reviewId);
  const response = await reviewModel.getReviewById(reviewId);
  const reviewText = await response.review_text;
  let nav = await utilities.getNav();
  res.render("./review/delete-review", {
    title: "Delete Review",
    nav,
    review_id: reviewId,
    review_text: reviewText,
    errors: null,
  })
}

/* ****************************************
*  Process Edit Review
* *************************************** */
reviewCont.deleteReview = async function (req, res, next) {
  console.log("Delete Review function works");
  let nav = await utilities.getNav()
  const { review_id, } = req.body
  
  const deleteResult = await reviewModel.deleteReview(review_id);
  
  if (deleteResult) {
    req.flash(
      "notice",
      `Review successfully deleted.`
    )
    nav = await utilities.getNav();
    // Navigate back to the detail view with the message.
    res.redirect(`/account/`);
  } else {
    console.log("Delete review function failed.")
    req.flash("notice", `Sorry, the review could not be deleted.`)
    res.redirect(`/account/`);
  }
}

module.exports = reviewCont
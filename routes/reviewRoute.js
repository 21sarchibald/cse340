// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")

// Route to add new review
router.post(
    "/add-review",
    utilities.handleErrors(reviewController.addReview))

// Route to build edit review page
router.get(
    "/edit-review/:reviewId",
    utilities.handleErrors(reviewController.buildEditReviewPage))

// Route to edit review
router.post(
    "/edit-review",
    utilities.handleErrors(reviewController.editReview))

// Route to delete review
router.post(
    "/delete-review/:reviewId",
    utilities.handleErrors(reviewController.deleteReview))

module.exports = router;
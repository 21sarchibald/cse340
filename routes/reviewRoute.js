// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")

// Route to add new review
router.post(
    "/add-review",
    utilities.handleErrors(reviewController.addReview))

// Route to edit review

// Route to delete review
router.post(
    "/delete-review",
    utilities.handleErrors(reviewController.deleteReview))

module.exports = router;
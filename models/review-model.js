const pool = require("../database/")

/* *****************************
*   Add Review
* *************************** */
async function addReview(inv_id, account_id, review_text) {
    try {
      console.log("Add review function reacted");
      console.log("Variables", inv_id, account_id, review_text);
      const sql = "INSERT INTO review (review_text, review_date, inv_id, account_id) VALUES ($1, NOW(), $2, $3);"
      const data = await pool.query(sql, [review_text, inv_id, account_id])
      console.log(data);
      return data.rowCount;
    } catch (error) {
      console.error("add review error: " + error);
      new Error("Add Review Error Error")
      return error.message
    }
  }

/* ***************************
 *  Get product reviews from review table
 * ************************** */

async function getReviewsByProductId(vehicle_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.review
        WHERE inv_id = $1
        ORDER BY review_date DESC`,
        [vehicle_id]
      )
      return data.rows
    } catch (error) {
      console.error("getReviewsByVehicleId error " + error)
    }
  }

/* ***************************
 *  Get product reviews by user
 * ************************** */

async function getReviewsByUserId(account_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.review
        WHERE account_id = $1
        ORDER BY review_date DESC`,
        [account_id]
      )
      return data.rows
    } catch (error) {
      console.error("getReviewsByAccountId error " + error)
    }
  }

module.exports = { addReview, getReviewsByProductId, getReviewsByUserId, };
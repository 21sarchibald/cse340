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
      new Error("Add Review Error")
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

/* ***************************
 *  Get product reviews by user
 * ************************** */

async function getReviewById(review_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review
      WHERE review_id = $1`,
      [review_id]
    )
    console.log("Review by review id data: ", review_id);
    console.log(data.rows[0]);
    return data.rows[0];
  } catch (error) {
    console.error("getReviewsByAccountId error " + error)
  }
}

/* *****************************
*   Edit Review
* *************************** */
async function editReview(review_id, review_text) {
  try {
    console.log("Edit review function reacted");
    const sql = "UPDATE review SET review_text = $1 WHERE review_id = $2;";
    const data = await pool.query(sql, [review_text, review_id]);
    console.log(data);
    return data.rowCount;
  } catch (error) {
    console.error("edit review error: " + error);
    new Error("Edit Review Error")
    return error.message
  }
}

/* *****************************
*   Delete Review
* *************************** */
async function deleteReview(review_id) {
try {
  console.log("Delete review function reacted");
  const sql = "DELETE FROM review WHERE review_id = $1;";
  const data = await pool.query(sql, [review_id]);
  console.log(data);
  return data;
} catch (error) {
  console.error("Delete review error: " + error);
  new Error("Delete Review Error")
  return error.message
}
}

module.exports = { addReview, getReviewsByProductId, getReviewsByUserId, getReviewById, editReview, deleteReview };
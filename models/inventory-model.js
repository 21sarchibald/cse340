const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
  }

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  };

/* ***************************
 *  Get product details from inventory table
 * ************************** */

async function getDetailsByProductId(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [vehicle_id]
    )
    console.log(data.rows);
    return data.rows;
  } catch (error) {
    console.error("getInventoryByVehicleId error " + error)
  }
}


/* *****************************
*   Add New Classification
* *************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT into CLASSIFICATION (classification_name) VALUES ($1)"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* **********************
*   Check for existing classification name
* ********************* */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const email = await pool.query(sql, [classification_name])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Add New Inventory
* *************************** */
async function addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = "INSERT into INVENTORY (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)"
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Edit Inventory
* *************************** */
async function editInventory(classification_id, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
  try {
    const sql = "UPDATE public.inventory SET classification_id = $1, inv_make = $2, inv_model = $3, inv_year = $4, inv_description = $5, inv_image = $6, inv_thumbnail = $7, inv_price = $8, inv_miles = $9, inv_color = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id])
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
    return error.message
  }
}

/* *****************************
*   Delete Inventory
* *************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data;
  } catch (error) {
    console.error("deletion error: " + error);
    new Error("Delete Inventory Error")
    return error.message
  }``
}


module.exports = {getClassifications, getInventoryByClassificationId, getDetailsByProductId, addClassification, checkExistingClassification, addInventory, editInventory, deleteInventory };
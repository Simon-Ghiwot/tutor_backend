const connection = require("./database");
const mysql = require("mysql");

const db = mysql.createPool(connection);

const getAllCourse = async (req, res) => {
  try {
    const query = "SELECT * FROM Course";
    db.query(query, (error, result) => {
      if (error) {
        res.status(500).json({ success: false, message: "Database error" });
      } else {
        res.status(200).json({ success: true, data: result });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Database error" });
  }
};

module.exports = { getAllCourse };

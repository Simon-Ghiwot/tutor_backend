const connection = require("./database");
const mysql = require("mysql");

const db = mysql.createPool(connection);

const getAssessmentTest = async (req, res) => {
  const { name } = req.body;
  try {
    const test = require(`../Assessments/${name}`);
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ success: false, message: "Database error" });
  }
};

const updateAssessmentResult = async (req, res) => {
  const { course_name, grade } = req.body;
  const { tutor_id } = req.params;
  try {
    let query =
      "INSERT INTO Tutor_assessment (tutor_id, course_name, grade) values (?,?,?)";
    db.query(query, [tutor_id, course_name, grade], (error, result) => {
      if (error) {
        res.status(500).json({ success: false, message: "Database error" });
      }
      res.status(200).json({ success: true });
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Task failed try again" });
  }
};

const getAssessmentResultById = async (req, res) => {
  const { tutor_id } = req.params;
  try {
    const query = "SELECT course FROM Tutor_assessment WHERE tutor_id = ?";
    db.query(query, [tutor_id], (error, result) => {
      if (error) {
        res.status(500).json({ success: false, message: "Database error" });
      }
      res.status(200).json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Database error" });
  }
};

module.exports = {
  getAssessmentTest,
  updateAssessmentResult,
  getAssessmentResultById,
};

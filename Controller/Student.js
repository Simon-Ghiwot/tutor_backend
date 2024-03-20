const connection = require("./database");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

const db = mysql.createPool(connection);

const getAllStudent = async (req, res) => {
  const query =
    "SELECT id, first_name, last_name, university, profile_picture, email, phone_number, academic_year, email FROM Student";
  try {
    db.query(query, (err, result) => {
      res.status(200).json({ success: true, data: result });
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Task failed try again" });
  }
};

const getStudentById = async (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT id, first_name, last_name, university, profile_picture, phone_number, academic_year, email, password FROM Student WHERE email = '${email}'`;
  try {
    db.query(query, (error, result) => {
      if (result.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "email does not exist" });

      const hashedPassword = result[0].password;

      if (bcrypt.compareSync(password, hashedPassword))
        return res.status(200).json({ success: true, data: result });

      res
        .status(404)
        .json({ success: false, message: "password doesnot match" });
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Task failed try again" });
  }
};

const createStudent = async (req, res) => {
  const {
    first_name,
    last_name,
    university,
    phone_number,
    academic_year,
    email,
    password,
    password_question,
    password_answer,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const profile_picture = `http://localhost:5000/${req.file.filename}`;
    const query =
      "INSERT INTO Student (first_name, last_name, university, phone_number, academic_year, email, password, profile_picture, password_question, password_answer) VALUES (?,?,?,?,?,?,?,?,?,?)";
    await db.query(
      query,
      [
        first_name,
        last_name,
        university,
        phone_number,
        academic_year,
        email,
        hashedPassword,
        profile_picture,
        password_question,
        password_answer,
      ],
      (error, result) => {
        console.log("Error", error);
        console.log(profile_picture);

        res
          .status(200)
          .json({ success: true, message: "Student successfully added" });
      }
    );
  } catch (error) {
    res.status(404).json({ success: false, message: "Task failed try again" });
  }
};
const updateStudent = async (req, res) => {
  const {
    first_name,
    last_name,
    university,
    phone_number,
    academic_year,
    email,
    password,
  } = req.body;
  const { id } = req.params;
  const profile_picture = `http://localhost:5000/${req.file.filename}`;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "UPDATE Student SET first_name = ?, last_name = ?, university = ?, profile_picture = ?, phone_number = ?, academic_year = ?, email = ?, password = ? WHERE id = ?";

    db.query(
      query,
      [
        first_name,
        last_name,
        university,
        profile_picture,
        phone_number,
        Number(academic_year),
        email,
        hashedPassword,
        Number(id),
      ],
      (error, result) => {
        res
          .status(200)
          .json({ success: true, message: "Student successfully updated" });
      }
    );
  } catch (error) {
    res.status(404).json({ success: false, message: "Task failed try again" });
  }
};
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Student WHERE id = ${Number(id)}`;
  try {
    db.query(query, (error, result) => {
      return res.status(200).json({ success: true, message: "success" });
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Task failed try again" });
  }
};

const getPasswordQuestionAndAnswer = async (req, res) => {
  const { email } = req.params;

  try {
    const query =
      "SELECT password_question, password_answer FROM Student WHERE email = ?";
    db.query(query, [email], (error, result) => {
      if (error) {
        res.status(500).json({ success: false, message: "Database error" });
      } else if (result.length === 0) {
        res.status(404).json({ success: false, message: "Tutor not found" });
      } else {
        const { password_question, password_answer } = result[0];
        res
          .status(200)
          .json({ success: true, password_question, password_answer });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Database error" });
  }
};

const updatePassword = async (req, res) => {
  const { email } = req.params;
  const { password } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    const query = "UPDATE Student SET password = ? WHERE email = ?";
    db.query(query, [hashedPassword, email], (error, result) => {
      if (error) {
        res.status(500).json({ success: false, message: "Database error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ success: false, message: "Tutor not found" });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Password updated successfully" });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating password" });
  }
};

module.exports = {
  getAllStudent,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getPasswordQuestionAndAnswer,
  updatePassword,
};

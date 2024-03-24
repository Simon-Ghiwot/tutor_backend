const connection = require("./database");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const gptCompletion = require("../GPT/complation");

const db = mysql.createPool(connection);

const getAllTutor = async (req, res) => {
  const query =
    "SELECT id, first_name, last_name, university, course, price, status, teaching_method, hours, profile_picture, rating, email, phone_number, has_premium FROM Tutor";
  try {
    db.query(query, async (err, result) => {
      const completion = await gptCompletion(result);
      res.status(200).json({ success: true, data: JSON.parse(completion) });
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Task failed try again" });
  }
};

const loginTutor = async (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT id, first_name, last_name, university, course, price, status, teaching_method, hours, profile_picture, rating, email, phone_number, password, has_premium FROM Tutor WHERE email = '${email}'`;

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
const getTutorById = async (req, res) => {
  const { id } = req.params;
  const query = `SELECT id, first_name, last_name, university, course, price, status, teaching_method, hours, profile_picture, rating, rating_count, email, phone_number, has_premium FROM Tutor WHERE id = ${id}`;
  try {
    db.query(query, (error, result) => {
      if (result.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "Tutor not found" });

      res.status(200).json({ success: true, data: result });
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Task failed try again" });
  }
};
const getTutorsByName = async (req, res) => {
  const { keyword } = req.body;

  const query = `SELECT id, first_name, last_name, university, course, price, status, teaching_method, hours, profile_picture, rating, email, phone_number, password, has_premium FROM Tutor WHERE CONCAT(first_name, ' ', last_name) LIKE '%${keyword}%'`;

  try {
    db.query(query, (error, result) => {
      if (result.length === 0)
        return res
          .status(404)
          .json({ success: false, message: "No tutors found" });

      res.status(200).json({ success: true, data: result });
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Task failed, please try again" });
  }
};
const createTutor = async (req, res) => {
  const {
    first_name,
    last_name,
    university,
    course,
    price,
    status,
    teaching_method,
    rating,
    email,
    password,
    phone_number,
    password_question,
    password_answer,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const profile_picture = `http://localhost:5012/${req.file.filename}`;

    console.log({
      first_name,
      last_name,
      university,
      course,
      price,
      status,
      teaching_method,
      rating,
      email,
      hashedPassword,
      phone_number,
      password_question,
      password_answer,
      profile_picture,
    });
    const query =
      "INSERT INTO Tutor (first_name, last_name, university, course, price, status, teaching_method, rating, email, password, phone_number, password_question, password_answer, profile_picture) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(
      query,
      [
        first_name,
        last_name,
        university,
        course,
        price,
        status,
        teaching_method,
        rating,
        email,
        hashedPassword,
        phone_number,
        password_question,
        password_answer,
        profile_picture,
      ],
      (error, result) => {
        if (error) {
          console.log(error);
          return res
            .status(404)
            .json({ success: false, message: "Something went wrong!" });
        }
        res
          .status(200)
          .json({ success: true, message: "Tutor successfully added" });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Task failed try again" });
  }
};
const updateTutor = async (req, res) => {
  const {
    first_name,
    last_name,
    university,
    course,
    price,
    status,
    teaching_method,
    email,
    password,
    phone_number,
  } = req.body;
  const { id } = req.params;
  const profile_picture = `http://localhost:5000/${req.file.filename}`;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "UPDATE Tutor SET first_name = ?, last_name = ?, university = ?, course = ?, price = ?, status = ?, teaching_method = ?, email = ?, password = ?, phone_number = ?, profile_picture = ? WHERE id = ?";

    db.query(
      query,
      [
        first_name,
        last_name,
        university,
        course,
        Number(price),
        status,
        teaching_method,
        email,
        hashedPassword,
        phone_number,
        profile_picture,
        Number(id),
      ],
      (error, result) => {
        res
          .status(200)
          .json({ success: true, message: "Tutor successfully updated" });
      }
    );
  } catch (error) {
    res.status(404).json({ success: false, message: "Task failed try again" });
  }
};
const deleteTutor = async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Tutor WHERE id = ${id}`;
  try {
    db.query(query, (error, result) => {
      return res.status(200).json({ success: true, message: "success" });
    });
  } catch (error) {
    res.status(404).json({ success: false, message: "Task failed try again" });
  }
};
const getTutorQualification = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM Tutor_qualification WHERE tutor_id = ?";
    db.query(query, [id], (error, result) => {
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

const uploadTutorQualification = async (req, res) => {
  const { id } = req.params;
  const course_name = "Biology"; // This should be sent in the request body
  const certificate = `http://localhost:5012/${req.file.filename}`;

  try {
    const query =
      "INSERT INTO Tutor_qualification (tutor_id, certificate, course_name) VALUES (?, ?, ?)";
    db.query(query, [id, certificate, course_name], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Database error" });
      } else {
        res.status(200).json({
          success: true,
          message: "Qualification added successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Database error" });
  }
};

const getPasswordQuestionAndAnswer = async (req, res) => {
  const { email } = req.params;

  try {
    const query =
      "SELECT password_question, password_answer FROM Tutor WHERE email = ?";
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
    const query = "UPDATE Tutor SET password = ? WHERE email = ?";
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
const subscribeToPremium = async (req, res) => {
  const { tutor_id } = req.params;
  const { start_date } = req.body;

  // Calculate the end date by adding 30 days to the start date
  const endDate = new Date(start_date);
  endDate.setDate(endDate.getDate() + 30);

  try {
    const query =
      "INSERT INTO Premium (tutor_id, start_date, end_date) VALUES (?, ?, ?)";
    db.query(query, [tutor_id, start_date, endDate], (error, result) => {
      if (error) {
        res.status(500).json({ success: false, message: "Database error" });
      } else {
        // Update has_premium to true in the Tutor table
        const updateQuery = "UPDATE Tutor SET has_premium = true WHERE id = ?";
        db.query(updateQuery, [tutor_id], (updateError, updateResult) => {
          if (updateError) {
            res
              .status(500)
              .json({ success: false, message: "Error updating Tutor table" });
          } else {
            res.status(200).json({
              success: true,
              message: "Tutor subscribed to premium successfully",
            });
          }
        });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error subscribing to premium" });
  }
};

module.exports = {
  getAllTutor,
  getTutorById,
  loginTutor,
  createTutor,
  updateTutor,
  deleteTutor,
  getTutorQualification,
  uploadTutorQualification,
  getPasswordQuestionAndAnswer,
  updatePassword,
  subscribeToPremium,
  getTutorsByName,
};

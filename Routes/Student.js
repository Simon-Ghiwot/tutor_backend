const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getAllStudent,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getPasswordQuestionAndAnswer,
  updatePassword,
} = require("../Controller/Student");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./Images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

router.route("/").get(getAllStudent);
router.post("/", upload.single("picture"), createStudent);
router.put("/:id", upload.single("picture"), updateStudent);
router.delete("/:id", deleteStudent);
router.post("/login", getStudentById);
router.post("/recovery", getPasswordQuestionAndAnswer);
router.put("/recovery/:email", updatePassword);

module.exports = router;

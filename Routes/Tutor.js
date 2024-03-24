const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getAllTutor,
  getTutorById,
  loginTutor,
  createTutor,
  updateTutor,
  deleteTutor,
  getTutorQualification,
  getPasswordQuestionAndAnswer,
  updatePassword,
  subscribeToPremium,
  getTutorsByName,
  uploadTutorQualification,
} = require("../Controller/Tutor");
const { route } = require("./Student");

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

router.route("/").get(getAllTutor);
router.post("/", upload.single("picture"), createTutor);
router.put("/:id", upload.single("picture"), updateTutor);
router.route("/:id").delete(deleteTutor);
router.route("/qualification/:id").get(getTutorQualification);
router.post("/qualification/:id", upload.single("picture"), uploadTutorQualification);
router.route("/login").post(loginTutor);
router.route("/:id").get(getTutorById);
router.post("/recovery", getPasswordQuestionAndAnswer);
router.put("/recovery/:id", updatePassword);
router.route("/premium").post(subscribeToPremium);
router.route("/search").get(getTutorsByName);

module.exports = router;

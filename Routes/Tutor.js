const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getAllTutor,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor,
  getTutorQualification,
  getPasswordQuestionAndAnswer,
  updatePassword,
  subscribeToPremium,
  getTutorsByName,
} = require("../Controller/Tutor");

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
router.route("/qualification").get(getTutorQualification);
router.route("/login").get(getTutorById);
router.route("/recovery").get(getPasswordQuestionAndAnswer).put(updatePassword);
router.route("/premium").post(subscribeToPremium);
router.route("/search").get(getTutorsByName);

module.exports = router;

const express = require("express");
const {
  getAssessmentTest,
  updateAssessmentResult,
  getAssessmentResultById,
} = require("../Controller/Assessment");

const router = express.Router();

router.route("/:name").get(getAssessmentTest);
router.route("/:tutor_id").put(updateAssessmentResult);
router.route("/:id").get(getAssessmentResultById);

module.exports = router;

const express = require("express");
const { calculateRating } = require("../Controller/Rating");

const router = express.Router();

router.route("/:tutor_id/:student_id").put(calculateRating);

module.exports = router;

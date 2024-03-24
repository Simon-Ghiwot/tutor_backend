const express = require("express");
const { calculateRating, getRating } = require("../Controller/Rating");

const router = express.Router();

router.route("/:tutor_id/:student_id").put(calculateRating);
router.get("/:tutor_id", getRating)


module.exports = router;

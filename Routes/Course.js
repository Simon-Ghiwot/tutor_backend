const express = require("express");
const { getAllCourse } = require("../Controller/Course");

const router = express.Router();

router.route("/").get(getAllCourse);

module.exports = router;

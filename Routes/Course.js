const express = require("express");
const { getAllCourse, createCourse } = require("../Controller/Course");

const router = express.Router();

router.get("/", getAllCourse);
router.post("/", createCourse);

module.exports = router;

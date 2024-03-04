const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const student = require("./Routes/Student");
const tutor = require("./Routes/Tutor");
const assessment = require("./Routes/Assessment");
const rating = require("./Routes/Rating");
const course = require("./Routes/Course");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/student", student);
app.use("/api/tutor", tutor);
app.use("/api/assessment", assessment);
app.use("/api/rating", rating);
app.use("/api/course", course);

app.use(express.static("Images"));

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running...");
});

app.get("/", (req, res) => {
  res.send("Working");
});

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const student = require("./Routes/Student");
const tutor = require("./Routes/Tutor");
const assessment = require("./Routes/Assessment");
const rating = require("./Routes/Rating");
const course = require("./Routes/Course");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5012;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/student", student);
app.use("/api/tutor", tutor);
app.use("/api/assessment", assessment);
app.use("/api/rating", rating);
app.use("/api/course", course);
app.use("/api/payment/init", async (req, res) => {
  const { amount, email, first_name, last_name, phone_number } = req.body;

  const CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize";
  const reference = `chapa-${Date.now()}`;

  try {
    const payload = {
      amount,
      email,
      currency: "ETB",
      first_name,
      last_name,
      phone_number,
      tx_ref: reference,
      callback_url: "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
      return_url: "http://localhost:3000/login",
    };

    const response = await axios.post(CHAPA_URL, payload, {
      headers: {
        Authorization: `Bearer CHASECK_TEST-8n231t8bxddwe6yhTbpHz328BVkSUoQJ`,
        "Content-Type": "application/json",
      },
    });

    res
      .status(200)
      .json({ success: true, data: response.data.data.checkout_url });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Payment Initialization Failed",
      error: error.data,
    });
  }
});

app.use(express.static("Images"));

app.listen(port, () => {
  console.log("Server is running...", port);
});

app.get("/", (req, res) => {
  res.send("Working");
});

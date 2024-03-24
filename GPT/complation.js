const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const tutorModel = {
  id: 1,
  first_name: "",
  last_name: "",
  university: "",
  course: "",
  price: 0,
  status: 0,
  teaching_method: "",
  hours: 0,
  profile_picture: "imagelink",
  rating: 0,
  rating_count: 0,
  email: "",
  phone_number: "",
  has_premium: 0,
};

const propmpRule = `Based on the follwoing list of tutors and i want you to return a recommended tutors from highest to lowest by taking the teaching method, hours, rating into account. since we don't want this recommendation to be static all users add some randomness. return on the tutors in json format of recommedation = [${JSON.stringify(
  tutorModel
)}]. Your responses consist of valid JSON syntax, with no other comments, explainations, reasoninng, or dialogue not consisting of valid JSON.`;

async function gptCompletion(tutors) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: propmpRule },
      { role: "system", content: JSON.stringify(tutors) },
    ],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}

module.exports = gptCompletion;

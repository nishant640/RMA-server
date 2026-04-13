const Joi = require("joi");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// -------- PLAYERS --------
const players = [/* keep your players array as is */];

// -------- NEWS (ADD THIS) --------
const news = [];

const newsSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  date: Joi.string().required(),
  description: Joi.string().required()
});

// -------- ROUTES --------

// players
app.get("/api/players", (req, res) => {
  res.json(players);
});

// news GET
app.get("/api/news", (req, res) => {
  res.json(news);
});

// news POST
app.post("/api/news", (req, res) => {
  const { error } = newsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  const newNews = {
    id: news.length + 1,
    ...req.body
  };

  news.push(newNews);

  res.json({
    success: true,
    news: newNews
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
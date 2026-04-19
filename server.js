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

// -------- NEWS --------
const news = [];

const newsSchema = Joi.object({
  title: Joi.string().min(3).required(),
  category: Joi.string().min(3).required(),
  date: Joi.string().required(),
  description: Joi.string().min(10).required()
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
    id: news.length ? news[news.length - 1].id + 1 : 1,
    ...req.body
  };

  news.push(newNews);

  res.status(200).json({
    success: true,
    news: newNews
  });
});

// news PUT
app.put("/api/news/:id", (req, res) => {
  const newsId = parseInt(req.params.id);
  const index = news.findIndex((item) => item.id === newsId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "News item not found"
    });
  }

  const { error } = newsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  news[index] = {
    id: news[index].id,
    ...req.body
  };

  res.status(200).json({
    success: true,
    news: news[index]
  });
});

// news DELETE
app.delete("/api/news/:id", (req, res) => {
  const newsId = parseInt(req.params.id);
  const index = news.findIndex((item) => item.id === newsId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "News item not found"
    });
  }

  const deletedNews = news[index];
  news.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "News item deleted successfully",
    news: deletedNews
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
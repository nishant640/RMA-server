require("dotenv").config();
const Joi = require("joi");
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// -------- PLAYERS --------
const players = [/* keep your players array as is */];

// -------- NEWS MODEL --------
const newsSchemaMongo = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
});

const News = mongoose.model("News", newsSchemaMongo);

// -------- JOI VALIDATION --------
const newsSchema = Joi.object({
  title: Joi.string().min(3).required(),
  category: Joi.string().min(3).required(),
  date: Joi.string().required(),
  description: Joi.string().min(10).required(),
  image: Joi.string().uri().required()
});

// -------- ROUTES --------

// players
app.get("/api/players", (req, res) => {
  res.json(players);
});

// news GET
app.get("/api/news", async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching news"
    });
  }
});

// news POST
app.post("/api/news", async (req, res) => {
  const { error } = newsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  try {
    const newNews = await News.create(req.body);

    res.status(200).json({
      success: true,
      news: newNews
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating news item"
    });
  }
});

// news PUT
app.put("/api/news/:id", async (req, res) => {
  const { error } = newsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!updatedNews) {
      return res.status(404).json({
        success: false,
        message: "News item not found"
      });
    }

    res.status(200).json({
      success: true,
      news: updatedNews
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating news item"
    });
  }
});

// news DELETE
app.delete("/api/news/:id", async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);

    if (!deletedNews) {
      return res.status(404).json({
        success: false,
        message: "News item not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "News item deleted successfully",
      news: deletedNews
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting news item"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
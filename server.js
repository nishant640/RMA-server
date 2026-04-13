const Joi = require("joi");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const players = [
  {
    id: 1,
    name: "Thibaut Courtois",
    number: 1,
    position: "Goalkeeper",
    nationality: "Belgium",
    age: 32,
    appearances: 30,
    goals: 0,
    assists: 0,
    description: "World-class goalkeeper with elite reflexes."
  },
  {
    id: 13,
    name: "Andriy Lunin",
    number: 13,
    position: "Goalkeeper",
    nationality: "Ukraine",
    age: 26,
    appearances: 18,
    goals: 0,
    assists: 0,
    description: "Quick reactions and strong shot-stopping ability."
  },
  {
    id: 2,
    name: "Dani Carvajal",
    number: 2,
    position: "Defender",
    nationality: "Spain",
    age: 33,
    appearances: 28,
    goals: 2,
    assists: 4,
    description: "Experienced right back with leadership."
  },
  {
    id: 3,
    name: "Eder Militao",
    number: 3,
    position: "Defender",
    nationality: "Brazil",
    age: 27,
    appearances: 24,
    goals: 1,
    assists: 1,
    description: "Strong and aggressive center back."
  },
  {
    id: 4,
    name: "David Alaba",
    number: 4,
    position: "Defender",
    nationality: "Austria",
    age: 32,
    appearances: 20,
    goals: 1,
    assists: 3,
    description: "Versatile defender with great passing."
  },
  {
    id: 5,
    name: "Jude Bellingham",
    number: 5,
    position: "Midfielder",
    nationality: "England",
    age: 21,
    appearances: 32,
    goals: 12,
    assists: 8,
    description: "Creative and complete midfielder."
  },
  {
    id: 6,
    name: "Eduardo Camavinga",
    number: 6,
    position: "Midfielder",
    nationality: "France",
    age: 22,
    appearances: 29,
    goals: 2,
    assists: 5,
    description: "Energetic midfielder with strong dribbling and defensive work."
  },
  {
    id: 8,
    name: "Federico Valverde",
    number: 8,
    position: "Midfielder",
    nationality: "Uruguay",
    age: 26,
    appearances: 34,
    goals: 7,
    assists: 6,
    description: "Dynamic box-to-box midfielder with stamina and long-range shooting."
  },
  {
    id: 14,
    name: "Aurelien Tchouameni",
    number: 14,
    position: "Midfielder",
    nationality: "France",
    age: 25,
    appearances: 31,
    goals: 3,
    assists: 2,
    description: "Strong holding midfielder with composure and defensive awareness."
  },
  {
    id: 7,
    name: "Vinicius Junior",
    number: 7,
    position: "Forward",
    nationality: "Brazil",
    age: 24,
    appearances: 31,
    goals: 15,
    assists: 10,
    description: "Explosive winger with pace, flair, and game-changing ability."
  },
  {
    id: 9,
    name: "Kylian Mbappe",
    number: 9,
    position: "Forward",
    nationality: "France",
    age: 26,
    appearances: 33,
    goals: 21,
    assists: 7,
    description: "Elite forward with speed, finishing, and intelligent movement."
  },
  {
    id: 11,
    name: "Rodrygo",
    number: 11,
    position: "Forward",
    nationality: "Brazil",
    age: 24,
    appearances: 30,
    goals: 11,
    assists: 8,
    description: "Technical forward known for dribbling, movement, and clutch moments."
  }
];

const newsUpdates = [];

// Joi validation schema
const playerSchema = Joi.object({
  name: Joi.string().required(),
  number: Joi.number().required(),
  position: Joi.string().required(),
  nationality: Joi.string().required(),
  age: Joi.number().required(),
  appearances: Joi.number().required(),
  goals: Joi.number().required(),
  assists: Joi.number().required(),
  description: Joi.string().required()
});

const newsSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  date: Joi.string().required(),
  description: Joi.string().required()
});

// GET players
app.get("/api/players", (req, res) => {
  res.json(players);
});

// POST players
app.post("/api/players", (req, res) => {
  const { error } = playerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  const newPlayer = {
    id: players.length + 1,
    ...req.body
  };

  players.push(newPlayer);

  res.json({
    success: true,
    player: newPlayer
  });
});

// GET news
app.get("/api/news", (req, res) => {
  res.json(newsUpdates);
});

// POST news
app.post("/api/news", (req, res) => {
  const { error } = newsSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  const newUpdate = {
    id: newsUpdates.length + 1,
    ...req.body
  };

  newsUpdates.unshift(newUpdate);

  res.json({
    success: true,
    update: newUpdate
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
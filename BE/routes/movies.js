const express = require("express");
const Movie = require("../models/Movie");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET all movies
router.get("/", async (req, res) => {
  const movies = await Movie.find().limit(20);
  res.json(movies);
});

// SEARCH
router.get("/search", async (req, res) => {
  const q = req.query.q || "";
  const movies = await Movie.find({
    title: { $regex: q, $options: "i" }
  });
  res.json(movies);
});

// GET detail
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.json(movie);
});

module.exports = router;

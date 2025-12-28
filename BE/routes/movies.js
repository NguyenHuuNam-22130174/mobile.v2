const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// const mapMovie = (movie) => ({
//     _id: movie._id,
//     title: movie.title,
//     genres: movie.genres,
//     releaseDate: movie.releaseDate,

//     posterUrl: `${BASE_URL}/uploads/posters/${movie.poster}`,
// });
const mapMovie = (movie) => ({
  _id: movie._id,
  title: movie.title,
  overview: movie.overview,          // nếu FE cần mô tả
  genres: movie.genres,
  releaseDate: movie.releaseDate,
  runtime: movie.runtime,
  status: movie.status,
  voteAverage: movie.voteAverage,
  popularity: movie.popularity,

  posterUrl: movie.poster
    ? `${BASE_URL}/uploads/posters/${movie.poster}`
    : null,

  videoUrl: movie.videoUrl || null,  // ✅ QUAN TRỌNG: trả videoUrl
});
// GET all movies
router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find().limit(20);
        res.json(movies.map(mapMovie));
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// SEARCH
router.get("/search", async (req, res) => {
    try {
        const q = req.query.q || "";
        const movies = await Movie.find({
            title: { $regex: q, $options: "i" },
        });
        res.json(movies.map(mapMovie));
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET detail
router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(mapMovie(movie));
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

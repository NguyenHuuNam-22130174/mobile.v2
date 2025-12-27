// const express = require("express");
// const Movie = require("../models/Movie");
// const auth = require("../middleware/authMiddleware");

// const router = express.Router();

// // GET all movies
// router.get("/", async (req, res) => {
//   const movies = await Movie.find().limit(20);
//   res.json(movies);
// });

// // SEARCH
// router.get("/search", async (req, res) => {
//   const q = req.query.q || "";
//   const movies = await Movie.find({
//     title: { $regex: q, $options: "i" }
//   });
//   res.json(movies);
// });

// // GET detail
// router.get("/:id", async (req, res) => {
//   const movie = await Movie.findById(req.params.id);
//   res.json(movie);
// });

// module.exports = router;
const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// helper: build posterUrl
// const mapMovie = (movie) => ({
//     _id: movie._id,
//     title: movie.title,
//     description: movie.description,
//     genres: movie.genres,
//     releaseDate: movie.releaseDate,

//     // 🔥 CHỈ DÙNG FIELD NÀY Ở FE
//     posterUrl: movie.poster
//         ? `${BASE_URL}/uploads/posters/${movie.poster}`
//         : null,
// });
const mapMovie = (movie) => ({
    _id: movie._id,
    title: movie.title,
    genres: movie.genres,
    releaseDate: movie.releaseDate,

    // 🔥 DÒNG QUYẾT ĐỊNH
    posterUrl: `${BASE_URL}/uploads/posters/${movie.poster}`,
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

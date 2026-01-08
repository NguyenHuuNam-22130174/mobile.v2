const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

const mongoose = require("mongoose");

// map person (director/cast)
const mapPerson = (p) => {
  if (!p) return null;

  // nếu populate -> p là object
  const id = p._id || p;
  const name = p.name || null;

  // profile có thể là URL sẵn hoặc tên file
  let profileUrl = null;
  const raw = p.profileUrl || p.profilePath || null;
  if (raw) {
    profileUrl = raw.startsWith("http")
      ? raw
      : `${BASE_URL}/uploads/person/${raw}`; 
  }

  return { _id: id, name, profileUrl };
};

const mapMovie = (movie) => ({
  _id: movie._id,
  title: movie.title,
  overview: movie.overview,          
  genres: movie.genres,
  releaseDate: movie.releaseDate,
  runtime: movie.runtime,
  status: movie.status,
  // voteAverage: movie.voteAverage,
  voteAverage: movie.voteAverage ?? 0,
  voteCount: movie.voteCount ?? 0,
  popularity: movie.popularity,

  viewCount: movie.viewCount ?? 0,
  lastViewedAt: movie.lastViewedAt ?? null,

  posterUrl: movie.poster
    ? `${BASE_URL}/uploads/posters/${movie.poster}`
    : null,

  videoUrl: movie.videoUrl || null,  
  director: movie.director ? mapPerson(movie.director) : null,
  cast: Array.isArray(movie.cast)
    ? movie.cast.map((c) => ({
        person: mapPerson(c.person),
        character: c.character || "",
        order: c.order ?? 0,
      }))
    : [],
  productionCountries: movie.productionCountries || [],
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

router.post("/:id/view", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { viewCount: 1 },
        $set: { lastViewedAt: new Date() },
      },
      { new: true } // trả về movie sau update
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // trả viewCount mới + movie (tuỳ bạn)
    return res.json({
      message: "View increased",
      viewCount: movie.viewCount,
      movie: mapMovie(movie),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// GET credits (director + cast)
router.get("/:id/credits", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate("director")
      .populate("cast.person");

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    return res.json({
      director: movie.director ? mapPerson(movie.director) : null,
      cast: Array.isArray(movie.cast)
        ? movie.cast.map((c) => ({
            person: mapPerson(c.person),
            character: c.character || "",
            order: c.order ?? 0,
          }))
        : [],
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET upcoming movies  
router.get("/upcoming", async (req, res) => {
  try {
    const movies = await Movie.find({ status: "Upcoming" })
      .sort({ releaseDate: 1 })
      .populate("director")
      .populate("cast.person");

    return res.json({ results: movies.map(mapMovie) });
  } catch (err) {
    console.error("GET /movies/upcoming error:", err);
    return res.status(500).json({ message: err.message });
  }
});

// GET detail + populate
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate("director")
      .populate("cast.person");

    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.json(mapMovie(movie));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT credits: set director + cast cho movie
router.put("/:id/credits", async (req, res) => {
  try {
    const { directorId, cast } = req.body;
    // cast = [{ personId, character, order }]
    const update = {
      director: directorId || null,
      cast: (cast || []).map((c) => ({
        person: c.personId,
        character: c.character,
        order: c.order,
      })),
    };

    const movie = await Movie.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res.json({ message: "Updated credits", movieId: movie?._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

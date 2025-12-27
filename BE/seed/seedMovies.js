require("dotenv").config();
const mongoose = require("mongoose");

const Movie = require("../models/Movie");
const Genre = require("../models/Genre");

const MONGO_URI = process.env.MONGO_URI;

// ================= DATA MẪU =================
const genresData = [
  { name: "Action" },
  { name: "Adventure" },
  { name: "Drama" },
  { name: "Comedy" },
  { name: "Sci-Fi" }
];

const moviesData = [
  {
    title: "Inception",
    overview: "A thief who steals corporate secrets through dream-sharing technology.",
    poster: "inception.jpg", // ✅ TÊN FILE TRONG uploads/posters
    releaseDate: new Date("2010-07-16"),
    runtime: 148,
    status: "Released",
    voteAverage: 8.8,
    popularity: 90,
    genres: ["Action", "Sci-Fi"]
  },
  {
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space.",
    poster: "interstellar.jpg",
    releaseDate: new Date("2014-11-07"),
    runtime: 169,
    status: "Released",
    voteAverage: 8.6,
    popularity: 88,
    genres: ["Adventure", "Drama", "Sci-Fi"]
  },
  {
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime.",
    poster: "dark_night.jpg",
    releaseDate: new Date("2008-07-18"),
    runtime: 152,
    status: "Released",
    voteAverage: 9.0,
    popularity: 95,
    genres: ["Action", "Drama"]
  },
  {
  title: "Avatar 2",
  overview: "Jake Sully lives with his newfound family on Pandora.",
  poster: "avatar_2.jpg", // tên file
  releaseDate: new Date("2022-12-16"),
  runtime: 192,
  status: "Released",
  voteAverage: 7.8,
  popularity: 85,
  genres: ["Action", "Adventure", "Sci-Fi"]
  }
];
// =================================================

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // RESET DATA
    await Movie.deleteMany();
    await Genre.deleteMany();
    console.log("🧹 Old data removed");

    // INSERT GENRES
    const genres = await Genre.insertMany(genresData);
    console.log("🎭 Genres seeded");

    // MAP genre name → ObjectId
    const genreMap = {};
    genres.forEach(g => {
      genreMap[g.name] = g._id;
    });

    // INSERT MOVIES
    const movies = moviesData.map(movie => ({
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster, // 🔥 LƯU TÊN FILE
      releaseDate: movie.releaseDate,
      runtime: movie.runtime,
      status: movie.status,
      voteAverage: movie.voteAverage,
      popularity: movie.popularity,
      genres: movie.genres.map(name => ({
        genreId: genreMap[name],
        name
      }))
    }));

    await Movie.insertMany(movies);
    console.log("🎬 Movies seeded");

    console.log("🎉 SEED DATA SUCCESS");
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();

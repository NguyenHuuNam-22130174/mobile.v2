require("dotenv").config();
const mongoose = require("mongoose");

const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const Person = require("../models/Person"); // ✅ thêm

const MONGO_URI = process.env.MONGO_URI;

console.log("SEED MONGO_URI =", process.env.MONGO_URI);

// ================= DATA MẪU =================
const genresData = [
  { name: "Action" },
  { name: "Adventure" },
  { name: "Drama" },
  { name: "Comedy" },
  { name: "Sci-Fi" },
];

// PERSON DATA
const personsData = [
  // Directors
  { name: "Christopher Nolan", knownForDepartment: "Directing", popularity: 95 },
  { name: "James Cameron", knownForDepartment: "Directing", popularity: 96 },

  // Inception cast
  { name: "Leonardo DiCaprio", knownForDepartment: "Acting", popularity: 90 },
  { name: "Joseph Gordon-Levitt", knownForDepartment: "Acting", popularity: 80 },
  { name: "Elliot Page", knownForDepartment: "Acting", popularity: 78 },
  { name: "Tom Hardy", knownForDepartment: "Acting", popularity: 85 },

  // Interstellar cast
  { name: "Matthew McConaughey", knownForDepartment: "Acting", popularity: 86 },
  { name: "Anne Hathaway", knownForDepartment: "Acting", popularity: 84 },
  { name: "Jessica Chastain", knownForDepartment: "Acting", popularity: 82 },
  { name: "Michael Caine", knownForDepartment: "Acting", popularity: 88 },

  // Dark Knight cast
  { name: "Christian Bale", knownForDepartment: "Acting", popularity: 85 },
  { name: "Heath Ledger", knownForDepartment: "Acting", popularity: 90 },
  { name: "Gary Oldman", knownForDepartment: "Acting", popularity: 80 },

  // Avatar 2 cast
  { name: "Sam Worthington", knownForDepartment: "Acting", popularity: 75, profileUrl: "sam-worthington.jpg" },
  { name: "Zoe Saldana", knownForDepartment: "Acting", popularity: 88, profileUrl: "zoe-saldana.jpg" },
  { name: "Sigourney Weaver", knownForDepartment: "Acting", popularity: 83, profileUrl: "sigourney-weaver.jpg" },

];

const moviesData = [
  {
    title: "Inception",
    overview:
      "A thief who steals corporate secrets through dream-sharing technology.",
    poster: "inception.jpg",
    videoUrl: "https://www.youtube.com/watch?v=8hP9D6kZseM",
    releaseDate: new Date("2010-07-16"),
    runtime: 148,
    status: "Released",
    voteAverage: 8.8,
    popularity: 90,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Action", "Sci-Fi"],

    //credits (gán bằng name -> map sang ObjectId)
    directorName: "Christopher Nolan",
    cast: [
      { name: "Leonardo DiCaprio", character: "Cobb", order: 0 },
      { name: "Joseph Gordon-Levitt", character: "Arthur", order: 1 },
      { name: "Elliot Page", character: "Ariadne", order: 2 },
      { name: "Tom Hardy", character: "Eames", order: 3 },
    ],
  },
  {
    title: "Interstellar",
    overview: "A team of explorers travel through a wormhole in space.",
    poster: "interstellar.jpg",
    videoUrl: "https://www.youtube.com/watch?v=QqSp_dwslro",
    releaseDate: new Date("2014-11-07"),
    runtime: 169,
    status: "Released",
    voteAverage: 8.6,
    popularity: 88,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Adventure", "Drama", "Sci-Fi"],

    directorName: "Christopher Nolan",
    cast: [
      { name: "Matthew McConaughey", character: "Cooper", order: 0 },
      { name: "Anne Hathaway", character: "Brand", order: 1 },
      { name: "Jessica Chastain", character: "Murph", order: 2 },
      { name: "Michael Caine", character: "Professor Brand", order: 3 },
    ],
  },
  {
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime.",
    poster: "dark_night.jpg",
    videoUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    releaseDate: new Date("2008-07-18"),
    runtime: 152,
    status: "Released",
    voteAverage: 9.0,
    popularity: 95,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Action", "Drama"],

    directorName: "Christopher Nolan",
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman", order: 0 },
      { name: "Heath Ledger", character: "Joker", order: 1 },
      { name: "Gary Oldman", character: "Commissioner Gordon", order: 2 },
    ],
  },
  {
    title: "Avatar 2",
    overview: "Jake Sully lives with his newfound family on Pandora.",
    poster: "avatar_2.jpg",
    videoUrl: "https://www.youtube.com/watch?v=d9MyW72ELq0",
    releaseDate: new Date("2022-12-16"),
    runtime: 192,
    status: "Released",
    voteAverage: 7.8,
    popularity: 85,
    viewCount: 0,
    lastViewedAt: null,
    genres: ["Action", "Adventure", "Sci-Fi"],

    directorName: "James Cameron",
    cast: [
      { name: "Sam Worthington", character: "Jake Sully", order: 0 },
      { name: "Zoe Saldana", character: "Neytiri", order: 1 },
      { name: "Sigourney Weaver", character: "Kiri", order: 2 },
    ],
  },
];
// =================================================

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    console.log("SEED DB NAME =", mongoose.connection.name);

    // RESET DATA
    await Movie.deleteMany();
    await Genre.deleteMany();
    await Person.deleteMany(); //thêm
    console.log("Old data removed");

    // INSERT GENRES
    const genres = await Genre.insertMany(genresData);
    console.log("Genres seeded");

    // MAP genre name → ObjectId
    const genreMap = {};
    genres.forEach((g) => {
      genreMap[g.name] = g._id;
    });

    //INSERT PERSONS
    const persons = await Person.insertMany(personsData);
    console.log("Persons seeded");

    // MAP person name → ObjectId
    const personMap = {};
    persons.forEach((p) => {
      personMap[p.name] = p._id;
    });

    // INSERT MOVIES (kèm credits)
    const movies = moviesData.map((movie) => {
      const directorId = personMap[movie.directorName] || null;

      const castArr = (movie.cast || [])
        .map((c) => {
          const pid = personMap[c.name];
          if (!pid) return null; // nếu thiếu person thì bỏ
          return {
            person: pid,
            character: c.character || "",
            order: c.order ?? 0,
          };
        })
        .filter(Boolean);

      return {
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster,
        videoUrl: movie.videoUrl || null,
        releaseDate: movie.releaseDate,
        runtime: movie.runtime,
        status: movie.status,
        voteAverage: movie.voteAverage,
        popularity: movie.popularity,
        viewCount: movie.viewCount ?? 0,
        lastViewedAt: movie.lastViewedAt ?? null,

        // genres như bạn đang làm
        genres: movie.genres.map((name) => ({
          genreId: genreMap[name],
          name,
        })),

        //credits
        director: directorId,
        cast: castArr,
      };
    });

    await Movie.insertMany(movies);
    console.log("Movies seeded (with credits)");

    console.log("SEED DATA SUCCESS");
    await mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();

// const mongoose = require("mongoose");

// const movieSchema = new mongoose.Schema(
//   {
//     title: String,
//     overview: String,
//     posterPath: String,
//     releaseDate: Date,
//     runtime: Number,
//     status: String,
//     voteAverage: Number,
//     popularity: Number,
//     genres: [
//       {
//         genreId: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
//         name: String
//       }
//     ]
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Movie", movieSchema);
const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
    title: String,
    overview: String,

    // 🔥 BẮT BUỘC
    poster: {
        type: String, // chỉ lưu tên file
        required: true,
    },

    releaseDate: Date,
    runtime: Number,
    status: String,
    voteAverage: Number,
    popularity: Number,

    genres: [
        {
            genreId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Genre",
            },
            name: String,
        },
    ],
});

module.exports = mongoose.model("Movie", MovieSchema);

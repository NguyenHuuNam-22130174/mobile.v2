const mongoose = require("mongoose");
const { Schema } = mongoose

const CastSchema = new Schema(
  {
    person: { type: Schema.Types.ObjectId, ref: "Person", required: true },
    character: String,
    order: Number,
  },
  { _id: false }
);

const MovieSchema = new mongoose.Schema({
    title: String,
    overview: String,

    // BẮT BUỘC
    poster: {
        type: String, // chỉ lưu tên file
        required: true,
    },

    videoUrl: {
    type: String,   // LINK PHIM
    required: false,
    },

    releaseDate: Date,
    runtime: Number,
    status: String,
    ratingSum: { type: Number, default: 0 },
    voteAverage: { type: Number, default: 0, min: 0, max: 10 },
    voteCount: { type: Number, default: 0, min: 0 },
    popularity: Number,
    viewCount: { type: Number, default: 0 },       // tổng lượt click/xem
    lastViewedAt: { type: Date, default: null },

    genres: [
        {
            genreId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Genre",
            },
            name: String,
        },
    ],

    director: { type: Schema.Types.ObjectId, ref: "Person", default: null },
    cast: { type: [CastSchema], default: [] },
    productionCountries: {
        type: [
            {
                code: { type: String }, // ví dụ "US", "GB", "VN"
                name: { type: String }, // ví dụ "United States"
            },
        ],
        default: [],
    },
});

module.exports = mongoose.model("Movie", MovieSchema);

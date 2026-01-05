const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // thang điểm 10
    rating:  { type: Number, required: true, min: 1, max: 10 },
    review:  { type: String, default: "", maxlength: 500 },
  },
  { timestamps: true }
);

RatingSchema.index({ movieId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", RatingSchema);


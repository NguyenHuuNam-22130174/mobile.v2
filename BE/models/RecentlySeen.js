const mongoose = require("mongoose");

const recentlySeenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecentlySeen", recentlySeenSchema);

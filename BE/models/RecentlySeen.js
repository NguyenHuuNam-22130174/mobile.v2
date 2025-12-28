// const mongoose = require("mongoose");

// const recentlySeenSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("RecentlySeen", recentlySeenSchema);
const mongoose = require("mongoose");

const recentlySeenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 1 user + 1 movie chỉ có 1 dòng
recentlySeenSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model("RecentlySeen", recentlySeenSchema);

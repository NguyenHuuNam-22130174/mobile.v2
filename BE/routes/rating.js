const express = require("express");
const mongoose = require("mongoose");
const Rating = require("../models/Rating");
const Movie = require("../models/Movie");
const auth = require("../middleware/authMiddleware"); // ✅ thêm

const router = express.Router();

const getUserId = (req) => req.user?.userId || req.user?._id || req.user?.id;

const toObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
};

const getSummary = async (movieId) => {
  const mid = toObjectId(movieId);
  if (!mid) return { avgRating: 0, ratingCount: 0 };

  const agg = await Rating.aggregate([
    { $match: { movieId: mid } },
    { $group: { _id: "$movieId", avgRating: { $avg: "$rating" }, ratingCount: { $sum: 1 } } },
  ]);

  return agg.length
    ? { avgRating: Number(agg[0].avgRating.toFixed(1)), ratingCount: agg[0].ratingCount }
    : { avgRating: 0, ratingCount: 0 };
};

// ✅ cộng đồng (không cần auth)
router.get("/:id/summary", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movieId" });
    }
    return res.json(await getSummary(id));
  } catch (e) {
    return res.status(500).json({ message: e?.message || "Server error" });
  }
});

// ✅ user rate (cần auth) — KHÔNG nhận userId từ client nữa
router.post("/", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { movieId, rating, review = "" } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid movieId" });
    }

    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 10) {
      return res.status(400).json({ message: "rating must be 1..10" });
    }

    // check đã đánh giá chưa
    const existed = await Rating.findOne({ movieId, userId }).lean();
    if (existed) {
      return res.status(409).json({ message: "Bạn đã đánh giá phim này rồi" });
    }

    await Rating.create({ movieId, userId, rating: r, review });

    // sync lại voteAverage/voteCount trong Movie
    const summary = await getSummary(movieId);
    await Movie.findByIdAndUpdate(movieId, {
      voteAverage: summary.avgRating,
      voteCount: summary.ratingCount,
    });

    return res.json({ summary });
  } catch (e) {
    if (e?.code === 11000) {
      return res.status(409).json({ message: "Bạn đã đánh giá phim này rồi" });
    }
    return res.status(500).json({ message: e?.message || "Server error" });
  }
});

module.exports = router;

const express = require("express");
const RecentlySeen = require("../models/RecentlySeen");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

const getUserId = (req) => req.user?.userId || req.user?.id || req.user?._id;

// GET /api/recently-seen?limit=10
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id || req.user?.id;
    const limit = Math.min(Number(req.query.limit || 10), 50);

    const list = await RecentlySeen.find({ userId })
      .populate("movieId")
      .sort({ viewedAt: -1 })
      .limit(limit);

    // flatten -> trả về đúng shape y như /movies
    const movies = list
      .filter((x) => x.movieId)
      .map((x) => ({
        ...x.movieId.toObject(),
        viewedAt: x.viewedAt,
      }));

    res.json(movies);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// POST /api/recently-seen  body: { movieId }
router.post("/", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { movieId } = req.body;

    console.log("POST /recently-seen", { userId, movieId, user: req.user });

    if (!userId) return res.status(401).json({ message: "Unauthorized: missing userId in token" });
    if (!movieId) return res.status(400).json({ message: "movieId is required" });

    // Upsert: click lại thì update viewedAt, không tạo trùng
    const seen = await RecentlySeen.findOneAndUpdate(
      { userId, movieId },
      { $set: { viewedAt: new Date() } },
      { upsert: true, new: true }
    );

    res.json(seen);
  } catch (err) {
    console.log("POST /recently-seen error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

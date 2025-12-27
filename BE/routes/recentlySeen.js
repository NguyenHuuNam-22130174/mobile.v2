const express = require("express");
const RecentlySeen = require("../models/RecentlySeen");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET
router.get("/", auth, async (req, res) => {
  const list = await RecentlySeen.find({ userId: req.user.userId })
    .populate("movieId")
    .sort({ createdAt: -1 })
    .limit(10);
  res.json(list);
});

// ADD
router.post("/", auth, async (req, res) => {
  const { movieId } = req.body;

  await RecentlySeen.findOneAndDelete({
    userId: req.user.userId,
    movieId
  });

  const seen = await RecentlySeen.create({
    userId: req.user.userId,
    movieId
  });

  res.json(seen);
});

module.exports = router;

const express = require("express");
const Favorite = require("../models/Favorite");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET favorites
router.get("/", auth, async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user.userId })
    .populate("movieId");
  res.json(favorites);
});

// ADD favorite
router.post("/", auth, async (req, res) => {
  const { movieId } = req.body;

  const exists = await Favorite.findOne({
    userId: req.user.userId,
    movieId
  });
  if (exists) return res.json({ message: "Already favorited" });

  const fav = await Favorite.create({
    userId: req.user.userId,
    movieId
  });

  res.json(fav);
});

// DELETE favorite
router.delete("/:movieId", auth, async (req, res) => {
  await Favorite.deleteOne({
    userId: req.user.userId,
    movieId: req.params.movieId
  });
  res.json({ success: true });
});

module.exports = router;

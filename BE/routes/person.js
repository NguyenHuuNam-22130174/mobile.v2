const router = require("express").Router();
const Person = require("../models/Person");

router.post("/", async (req, res) => {
  try {
    const person = await Person.create(req.body);
    res.json(person);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

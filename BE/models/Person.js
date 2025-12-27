const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  profilePath: String,
  gender: String,
  birthday: Date,
  placeOfBirth: String,
  knownForDepartment: String,
  biography: String,
  popularity: Number
});

module.exports = mongoose.model("Person", personSchema);

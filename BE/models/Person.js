const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profileUrl: String, // lưu full URL cho dễ hiển thị RN
    gender: String,
    birthday: Date,
    placeOfBirth: String,
    knownForDepartment: String, // Acting / Directing...
    biography: String,
    popularity: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Person", personSchema);

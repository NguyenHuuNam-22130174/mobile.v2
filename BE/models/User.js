// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: { type: String, unique: true },
//   password: String,
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // ✅ thêm các field profile ở đây
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);



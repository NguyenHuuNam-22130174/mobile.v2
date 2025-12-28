require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');

const app = express();

//public thư mục uploads
app.use("/uploads", express.static("uploads"));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/movies", require("./routes/movies"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/recently-seen", require("./routes/recentlySeen"));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected (server)");
    console.log("SERVER DB NAME =", mongoose.connection.name);

    const RecentlySeen = require("./models/RecentlySeen");
    await RecentlySeen.syncIndexes();
    console.log("RecentlySeen indexes synced");
  })
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log("SERVER MONGO_URI =", process.env.MONGO_URI);


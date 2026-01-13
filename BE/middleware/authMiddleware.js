// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ error: "Unauthorized" });
//     }

//     const token = authHeader.split(" ")[1];
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // { userId, email }
//         next();
//     } catch (e) {
//         return res.status(401).json({ error: "Invalid token" });
//     }
// };
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization || "";
  console.log("AUTH header:", header);

  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  console.log("AUTH token preview:", token ? token.slice(0, 20) + "..." : token);
  console.log("AUTH token length:", token?.length || 0);

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("AUTH ok payload:", payload);
    req.user = payload;
    next();
  } catch (e) {
    console.log("AUTH verify fail:", e.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

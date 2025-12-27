const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra email hợp lệ
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Please provide email and password" });
        }
        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Tạo user mới
        const user = await User.create({
            email,
            password: hashed,
            // createdAt: new Date(),
        });

        res.json({
            success: true,
            user: {
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (e) {
        console.error("Registration error:", e);
        res.status(500).json({ error: "Server error during registration" });
    }
});

// Đăng nhập
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra input
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Please provide email and password" });
        }

        // Tìm user
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ error: "Email or password is incorrect" });
        }

        // So sánh mật khẩu
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res
                .status(400)
                .json({ error: "Email or password is incorrect" });
        }

        // Tạo token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.json({
            success: true,
            token,
            user: {
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({ error: "Server error during login" });
    }
});

module.exports = router;

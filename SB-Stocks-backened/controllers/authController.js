const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../Database/models/User");

const JWT_SECRET = process.env.JWT_SECRET || "sb_stocks_secret_key";

const createToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "24h" });

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  balance: user.balance,
});

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return res.status(201).json({
      token: createToken(user._id),
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during registration" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: createToken(user._id),
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login" });
  }
};

const me = async (req, res) => {
  return res.json({ user: formatUser(req.user) });
};

module.exports = {
  register,
  login,
  me,
};

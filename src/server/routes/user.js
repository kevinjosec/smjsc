const express = require("express");
const router = express.Router();
const User = require("../models/users");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "3d" });
};

router.get("/:email", async (req, res) => {
  const email = req.params.email; // Get the email from the URL params
  try {
    const user = await User.findOne({ email }); // Find user by email in MongoDB
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Return 404 if no user is found
    }
    res.status(200).json({ role: user.role }); // Return the role of the user
  } catch (err) {
    res.status(500).json({ error: "Server error" }); // Catch any server errors
  }
});


router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.signup(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token, role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please fill in all the required fields" });
    }

    const user = await User.login(email, password);

    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

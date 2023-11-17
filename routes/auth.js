const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_TOKEN = "this_is_my_JWT_TOKEN";

const User = require("../model/User");
const fetchUser = require("../middleware/fetchUser");

// CREATE USER on "http://localhost:5000/api/auth/new-user"
router.post(
  "/new-user",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(), //VALIDATORS USINTG express-validators
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // express validators
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User with this email is already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const myPasswordToHash = await bcrypt.hash(req.body.password, salt);

      //create user from req.body
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: myPasswordToHash,
      });
      //creating token
      const data = {
        id: user.id,
      };
      const authToken = jwt.sign(data, JWT_TOKEN);

      res.json({
        success: true,
        message: "User created",
        authToken,
        user,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);

//Authenticate user http://localhost:5000/api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail(), //VALIDATORS USINTG express-validators
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    // express validators
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, error: "Incorrect email or password" });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ success: false, error: "Incorrect email or password" });
      }
      //creating token
      const data = {
        id: user.id,
      };
      const authToken = jwt.sign(data, JWT_TOKEN);
      res.json({
        success: true,
        message: `Welcome ${user.name}`,
        authToken,
        user,
      });
    } catch (error) {
      res.status(500).send("Internal Server error");
    }
  }
);

//GET LOGGEDIN USER USER DETAIL USING: POST: http://localhost:5000/api/auth/get-user
router.post("/get-user", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ userId }).select("-password");
    res.json({
      user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

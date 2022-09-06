const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../model/Notes");

// GET ALL NOTE OF USER.ID (where user.id from the middleware fetchUser.js)
// at http://localhost:5000/api/notes/fetch-all-notes

router.get("/fetch-all-notes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

module.exports = router;

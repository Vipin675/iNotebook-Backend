const express = require("express");

const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Note = require("../model/Notes");
const { body, validationResult } = require("express-validator");

// GET ALL NOTE OF USER.ID (where user.id from the middleware fetchUser.js)
// at http://localhost:5000/api/notes/fetch-all-notes

router.get("/fetch-all-notes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

// CREATE NEW NOTES USING POST REQ: http://localhost:5000/api/notes/add-note
router.post(
  "/add-note",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // express validators
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;
    try {
      const note = await Note.create({
        title,
        description,
        tag,
        user: req.user.id,
      });
      res.json({ note });
    } catch (error) {
      res.json({
        error: error.message,
      });
    }
  }
);

// UPDATE NOTES VIA PUT REQ:  ​http://localhost:5000/api/notes/update/:id
router.put(
  "/update/:id",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // express validators
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;
    try {
      // getting all the updated value
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      // Find current note by id
      // checking on note with req.params.id is available
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("Not found");
      }

      if (note.user.toString() !== req.user.id) {
        // is logged user's id is corresponding note's user's id
        return res.status(401).send("Not allowed");
      }

      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({
        message: "successfully updated",
        note,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);

// DELETE NOTE VIA DELETE REQ: ​http://localhost:5000/api/notes/delete/:id
router.delete("/delete/:id", fetchUser, async (req, res) => {
  try {
    // checking on note with req.params.id is available
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    // is logged user's id is corresponding note's user's id
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({
      message: "Note successfully deleted",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

module.exports = router;

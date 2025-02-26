const express = require("express");
const router = express.Router();
const Note = require("../models/note");
const auth = require("../middleware/auth"); // Middleware to protect routes

// ✅ Create a new note
router.post("/", auth, async (req, res) => {
  try {
    console.log("Incoming Note Data:", req.body); // Debugging

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    console.log("User from Token:", req.user); // Debugging

    const newNote = new Note({ userId: req.user._id, title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Error creating note:", err); // More detailed error log
    res.status(500).json({ error: "Error creating note" });
  }
});


// ✅ Get all notes for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Error fetching notes" });
  }
});
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    console.log("Logged-in User ID:", req.user._id); // Debugging
    console.log("Note User ID:", note.userId); // Debugging

    // Check if the note belongs to the logged-in user
    if (note.userId.toString() !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update the note
    note.title = title;
    note.content = content;
    await note.save();

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Error updating note" });
  }
});

// ✅ Delete a note by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    console.log("Logged-in User ID:", req.user._id); // Debugging
    console.log("Note User ID:", note.userId); // Debugging

    // Check if the note belongs to the logged-in user
    if (note.userId.toString() !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting note" });
  }
});
module.exports = router;

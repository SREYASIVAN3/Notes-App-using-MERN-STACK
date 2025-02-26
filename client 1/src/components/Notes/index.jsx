import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NoteCard from "./NoteCard";
import styles from "./style.module.css";

const Notes = () => {
  const [notes, setNotes] = useState([]); // State to store notes
  const [title, setTitle] = useState(""); // State for note title
  const [content, setContent] = useState(""); // State for note content
  const [editingNoteId, setEditingNoteId] = useState(null); // State to track which note is being edited
  const navigate = useNavigate();

  // Fetch notes from the backend when the component mounts
  useEffect(() => {
    fetchNotes();
  }, []);

  // Function to fetch notes from the backend
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data); // Update the notes state with fetched data
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Function to handle saving or updating a note
  const handleSaveNote = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debugging

      if (editingNoteId) {
        // If editingNoteId is set, update the existing note
        await axios.put(
          `http://localhost:8080/api/notes/${editingNoteId}`,
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update the note in the local state
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === editingNoteId ? { ...note, title, content } : note
          )
        );

        setEditingNoteId(null); // Reset editing state
      } else {
        // If editingNoteId is null, create a new note
        const res = await axios.post(
          "http://localhost:8080/api/notes",
          { title, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes([...notes, res.data]); // Add the new note to the local state
      }

      // Clear input fields
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error saving note:", error.response?.data || error.message);
    }
  };

  // Function to handle editing a note
  const handleEdit = (note) => {
    console.log("Editing note:", note);
    setEditingNoteId(note._id); // Set the ID of the note being edited
    setTitle(note.title); // Populate the title input field
    setContent(note.content); // Populate the content textarea
  };

  // Function to handle deleting a note
  const handleDelete = async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debugging
      console.log("Deleting note with ID:", noteId); // Debugging
  
      await axios.delete(`http://localhost:8080/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error.response?.data || error.message);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoutContainer}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2>My Notes</h2>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleSaveNote}>
          {editingNoteId ? "Update Note" : "Add Note"}
        </button>
      </div>

      <div className={styles.notesList}>
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Notes;
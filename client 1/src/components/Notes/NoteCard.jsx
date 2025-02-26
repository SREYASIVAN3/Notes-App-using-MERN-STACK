import React from "react";
import styles from "./style.module.css";

const NoteCard = ({ note, onDelete, onEdit }) => {
  return (
    <div className={styles.noteCard}>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className={styles.buttonContainer}>
        <button onClick={() => onEdit(note)} className={styles.editButton}>
          Edit
        </button>
        <button onClick={() => onDelete(note._id)} className={styles.deleteButton}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
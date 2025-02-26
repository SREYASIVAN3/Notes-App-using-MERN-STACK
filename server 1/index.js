require("dotenv").config();
const express = require("express");
const cors = require('cors');
const connection = require("./db"); 
const mongoose = require('mongoose');
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile"); 
const notesRoutes = require("./routes/notes");



const app = express();


connection();


app.use(express.json());
app.use(cors());


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes); 
app.use("/api/notes", notesRoutes);




mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log(' MongoDB Connected Successfully'))
    .catch((err) => console.error(' MongoDB Connection Error:', err));
  

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(` Server running on port ${port}...`));

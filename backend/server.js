// Express importieren
const express = require("express");

// Datenbank importieren
const pool = require("./db/db");

const cors = require("cors");

// Express App erstellen
const app = express();

// Port definieren
const PORT = 3000;

// User Routes importieren
const userRoutes =
    require("./routes/users");

// Task Routes importieren
const taskRoutes =
    require("./routes/tasks");

// Login Routes importieren
const loginRoutes =
    require("./routes/login");

    
// Middleware:
// erlaubt JSON Daten im Request
app.use(express.json());

app.use(cors());

app.use("/users", userRoutes);

app.use("/tasks", taskRoutes);

app.use("/login", loginRoutes);

// Test Route
app.get("/", (req, res) => {

    // Antwort an Browser senden
    res.send("Server läuft!");

});


// Server starten
app.listen(PORT, () => {

    console.log(`Server läuft auf Port ${PORT}`);

});


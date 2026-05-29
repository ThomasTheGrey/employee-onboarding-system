// Express Router importieren
const express = require("express");

// Router erstellen
const router = express.Router();

// Datenbank importieren
const pool = require("../db/db");

// bcrypt importieren
const bcrypt = require("bcrypt");

// GET /users
router.get("/", async (req, res) => {

    try {

        // SQL Query ausführen
        const result = await pool.query(
            "SELECT * FROM users"
        );

        // JSON zurückgeben
        res.json(result.rows);

    } catch(error){

        console.error(error);

        res.status(500).send(
            "Fehler beim Abrufen"
        );
    }

});

// Neuen User anlegen
router.post("/", async (req, res) => {

    // Daten aus Request holen
    const {

    firstname,
    lastname,
    email,
    password,
    role,
    department_id,
    requestingRole

    } = req.body;


    console.log(requestingRole);

    // Nur Admins dürfen User erstellen
        if(requestingRole !== "admin"){

            return res.status(403).json({

                message:
                    "Keine Berechtigung"
            });
        }

    try {

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // SQL INSERT Query
        const result = await pool.query(

            `
            INSERT INTO users(

                firstname,
                lastname,
                email,
                password_hash,
                role,
                department_id

            )

            VALUES ($1, $2, $3, $4, $5, $6)

            RETURNING id
            `,

            [

                firstname,
                lastname,
                email,
                hashedPassword,
                role,
                department_id
            ]
        );

        // Neue User-ID holen
        const newUserid =
            result.rows[0].id;


        // Passende Aufgaben automatisch zuweisen
        await pool.query(

            `

            INSERT INTO user_tasks(

                user_id,
                task_id,
                status_id

            )

            SELECT

                $1,
                tasks.id,
                1

            FROM tasks

            JOIN categories
            ON categories.id = tasks.category_id

            JOIN department_categories
            ON department_categories.category_id =
            categories.id

            WHERE department_categories.department_id = $2

            `,

            [

                newUserid,
                department_id
            ]
        );

        // Erfolgsantwort senden
        res.json({

            message:
                "User erstellt"
        });

    } catch(error){

        console.error(error);

        res.status(500).send(
            "Fehler beim Erstellen"
        );
    }

});

// Router exportieren
module.exports = router;
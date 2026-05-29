// Express importieren
const express = require("express");

// Router erstellen
const router = express.Router();

// Datenbank importieren
const pool = require("../db/db");

// bcrypt importieren
const bcrypt = require("bcrypt");

// Login Route
router.post("/", async (req, res) => {

    // Daten aus Request holen
    const { email, password } = req.body;

    try {

        // User anhand der Email suchen
       const result = await pool.query(

            `

            SELECT

                users.id,
                users.firstname,
                users.lastname,
                users.email,
                users.password_hash,
                users.role,

                departments.name AS department,

                contact.firstname AS contact_firstname,
                contact.lastname AS contact_lastname

            FROM users

            LEFT JOIN departments
            ON departments.id = users.department_id

            LEFT JOIN users AS contact
            ON contact.id = departments.contact_user_id

            WHERE users.email = $1

            `,

            [email]
        );

        // Existiert User?
        if(result.rows.length === 0){

            return res.status(401).json({

                message: "Benutzer nicht gefunden"
            });
        }

        // User holen
        const user = result.rows[0];

        // Passwort mit Hash vergleichen
        const passwordMatch =
            await bcrypt.compare(

                password,
                user.password_hash
            );


        // Passwort falsch?
        if(!passwordMatch){

            return res.status(401).json({

                message: "Falsches Passwort"
            });
        }

        // Erfolgreiche Antwort
        res.json({

            message: "Login erfolgreich",

            user: {

                id: user.id,
                firstname: user.firstname,
                role: user.role,
                department: user.department,
                contact_firstname: user.contact_firstname,
                contact_lastname: user.contact_lastname
            }
        });

    } catch(error){

        console.error(error);

        res.status(500).send("Serverfehler");
    }

});


// Router exportieren
module.exports = router;
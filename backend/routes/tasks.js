// Express importieren
const express = require("express");

// Router erstellen
const router = express.Router();

// Datenbank importieren
const pool = require("../db/db");

// Alle Aufgaben laden
router.get("/", async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT

                id,
                title

            FROM tasks

            ORDER BY title
            `
        );

        res.json(result.rows);

    } catch(error){

        console.error(error);

        res.status(500).send(
            "Fehler beim Laden der Aufgaben"
        );
    }
});


// Fortschritt eines Users berechnen
router.get("/progress/:userid", async (req, res) => {

    // userid aus URL holen
    const userid = req.params.userid;

    try {

        // SQL Query
        const result = await pool.query(

            `
            SELECT

                COUNT(user_tasks.task_id)
                AS total_tasks,

                SUM(

                    CASE

                        WHEN user_tasks.status_id = 3

                        THEN 1

                        ELSE 0

                    END

                ) AS completed_tasks

            FROM user_tasks

            WHERE user_tasks.user_id = $1
            `,

            [userid]
        );

        // JSON Antwort
        res.json(result.rows[0]);

    } catch(error){

        console.error(error);

        res.status(500).send(
            "Fehler beim Laden des Fortschritts"
        );
    }

});


// Aufgaben eines bestimmten Users abrufen
router.get("/:userid", async (req, res) => {

    // userid aus URL holen
    const userid = req.params.userid;

    try {

        // SQL Query ausführen
        const result = await pool.query(

            `
            SELECT

                tasks.id AS task_id,
                tasks.title,
                tasks.description,
                tasks.priority,
                categories.name AS category,
                categories.color AS category_color,

                task_status.name AS status,
                task_status.color

            FROM user_tasks

            JOIN tasks
            ON tasks.id = user_tasks.task_id

            JOIN categories
            ON categories.id = tasks.category_id
            
            JOIN task_status
            ON task_status.id = user_tasks.status_id

            WHERE user_tasks.user_id = $1
            `,

            [userid]
        );

        // JSON Antwort senden
        res.json(result.rows);

    } catch(error){

        console.error(error);

        res.status(500).send(
            "Fehler beim Laden der Aufgaben"
        );
    }

});

// Aufgabenstatus ändern
router.put("/:userid/:taskid", async (req, res) => {

    // Werte aus URL holen
    const userid = req.params.userid;

    const taskid = req.params.taskid;

    try {

        // SQL UPDATE Query
        await pool.query(

            `
            UPDATE user_tasks

            SET status_id = 3

            WHERE user_id = $1
            AND task_id = $2
            `,

            [userid, taskid]
        );

        // Erfolgsantwort senden
        res.json({

            message:
                "Aufgabe aktualisiert"
        });

    } catch(error){

        console.error(error);

        res.status(500).send(
            "Fehler beim Aktualisieren"
        );
    }

});

// Neue Aufgabe anlegen
router.post("/", async (req, res) => {

    // Daten aus Request holen
    const {

        title,
        description,
        priority,
        category_id

    } = req.body;

    try {

        // Aufgabe erstellen
        const result = await pool.query(

            `
            INSERT INTO tasks(

                title,
                description,
                priority,
                category_id

            )

            VALUES ($1, $2, $3, $4)

            RETURNING id
            `,

            [

                title,
                description,
                priority,
                category_id
            ]
        );


        // Neue task_id holen
        const taskid =
            result.rows[0].id;


        // Aufgabe automatisch passenden Usern zuweisen
        await pool.query(

            `

            INSERT INTO user_tasks(

                user_id,
                task_id,
                status_id

            )

            SELECT

                users.id,
                $1,
                1

            FROM users

            JOIN department_categories
            ON department_categories.department_id =
            users.department_id

            WHERE department_categories.category_id = $2

            `,

            [

                taskid,
                category_id
            ]
        );

        // Erfolgsantwort
        res.json({

            message:
                "Aufgabe erstellt"
        });

    } catch(error){

        console.error(error);

        res.status(500).send(
            "Fehler beim Erstellen"
        );
    }

});

    // Aufgabe individuell zuweisen
    router.post(

        "/assign",

        async (req, res) => {

            const {

                user_id,
                task_id

            } = req.body;

            try {

                await pool.query(

                    `
                    INSERT INTO user_tasks(

                        user_id,
                        task_id,
                        status_id

                    )

                    VALUES($1,$2,$3)
                    `,

                    [

                        user_id,
                        task_id,
                        1
                    ]
                );

                res.json({

                    message:
                        "Aufgabe zugewiesen"
                });

            } catch(error){

                console.error(error);

                res.status(500).send(

                    "Fehler bei Zuweisung"
                );
            }
        }
    );

// Router exportieren
module.exports = router;
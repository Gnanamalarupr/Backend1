const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./src/config/db"); 

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json()); 

app.get("/", (req, res) => {
    res.send(" Server is running!");
});


app.post("/add-marks", (req, res) => {
    const { student_id, sub1, sub2, sub3, sub4, sub5 } = req.body;

    if (!student_id) {
        return res.status(400).json({ error: " Student ID is required" });
    }

    const query = `
        INSERT INTO MarksTable (student_id, sub1, sub2, sub3, sub4, sub5)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        sub1 = VALUES(sub1), 
        sub2 = VALUES(sub2), 
        sub3 = VALUES(sub3), 
        sub4 = VALUES(sub4), 
        sub5 = VALUES(sub5)
    `;

    db.query(query, [student_id, sub1 || 0, sub2 || 0, sub3 || 0, sub4 || 0, sub5 || 0], (err, result) => {
        if (err) {
            console.error(" Error inserting/updating marks:", err);
            return res.status(500).json({ error: " Failed to add or update marks" });
        }

        res.status(200).json({ message: " Marks added/updated successfully!" });
    });
});


app.get("/marks", (req, res) => {
    const query = "SELECT * FROM MarksTable";

    db.query(query, (err, results) => {
        if (err) {
            console.error(" Error fetching marks:", err);
            return res.status(500).json({ error: " Failed to fetch marks" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: " No marks found in database" });
        }

        res.status(200).json(results);
    });
});


app.get("/marks/:student_id", (req, res) => {
    const { student_id } = req.params;
    const query = "SELECT * FROM MarksTable WHERE student_id = ?";

    db.query(query, [student_id], (err, results) => {
        if (err) {
            console.error(" Error fetching student marks:", err);
            return res.status(500).json({ error: " Failed to fetch student marks" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: " No marks found for this student ID" });
        }

        res.status(200).json(results[0]); 
    });
});


app.delete("/marks/:student_id", (req, res) => {
    const { student_id } = req.params;
    const query = "DELETE FROM MarksTable WHERE student_id = ?";

    db.query(query, [student_id], (err, result) => {
        if (err) {
            console.error(" Error deleting student marks:", err);
            return res.status(500).json({ error: "Failed to delete student marks" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: " No marks found to delete" });
        }

        res.status(200).json({ message: " Marks deleted successfully!" });
    });
});


app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});


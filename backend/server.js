const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Get hacker details
app.get('/api/hacker/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hacker = await pool.query(
            'SELECT * FROM hackers WHERE id = $1',
            [id]
        );
        
        if (hacker.rows.length === 0) {
            return res.status(404).json({ message: 'Hacker not found' });
        }
        
        res.json(hacker.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update hacker status
app.post('/api/scan', async (req, res) => {
    try {
        const { hackerId, category } = req.body;
        
        // Verify category is valid
        const validCategories = [
            'checked_in', 'swag', 'friday_dinner', 
            'saturday_breakfast', 'saturday_lunch', 
            'saturday_dinner', 'sunday_breakfast'
        ];
        
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        
        // Check if already scanned
        const hacker = await pool.query(
            `SELECT ${category} FROM hackers WHERE id = $1`,
            [hackerId]
        );
        
        if (hacker.rows.length === 0) {
            return res.status(404).json({ message: 'Hacker not found' });
        }
        
        if (hacker.rows[0][category]) {
            return res.json({ 
                exists: true, 
                message: `Already scanned for ${category.replace(/_/g, ' ')}` 
            });
        }
        
        // Update status
        const updateQuery = `
            UPDATE hackers 
            SET ${category} = TRUE 
            WHERE id = $1 
            RETURNING *
        `;
        
        const updated = await pool.query(updateQuery, [hackerId]);
        res.json({ 
            exists: false, 
            message: `Successfully scanned for ${category.replace(/_/g, ' ')}`,
            hacker: updated.rows[0]
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
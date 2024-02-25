const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve registration page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle registration
app.post('/register', (req, res) => {
    // Extract registration data from the request
    const { username, email, country } = req.body;

    // Save registration data to a JSON file (you might want to use a database instead)
    fs.readFile('candidates.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        const candidates = JSON.parse(data);

        // Check if the username or email already exists
        if (candidates.some(candidate => candidate.username === username || candidate.email === email)) {
            return res.status(400).send('Username or email already exists');
        }

        // Add the new candidate to the candidates list
        candidates.push(req.body);

        // Write the updated candidates list to the file
        fs.writeFile('candidates.json', JSON.stringify(candidates, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            // Redirect to the candidates page
            res.redirect('/candidates');
        });
    });
});

// Serve candidates page
app.get('/candidates', (req, res) => {
    res.sendFile(__dirname + '/candidates.html');
});

// Serve registered candidates data
app.get('/api/candidates', (req, res) => {
    fs.readFile('candidates.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        const candidates = JSON.parse(data);
        res.json(candidates);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

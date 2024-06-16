const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sharon@123', // Replace with your MySQL password
  database: 'ERMS', // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM User WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'User does not exist' });
    }

    const user = results[0];

    if (user.password === password) {
      if (user.status === 'Active') {
        res.json({ success: true, role: user.role });
      } else {
        res.status(403).json({ success: false, message: 'You are not authorized to access' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

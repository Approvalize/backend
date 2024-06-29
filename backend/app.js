const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();


connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: true,
 saveUninitialized: true
}));

app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get("/", (req, res) => {
    res.json({ message: "hi." });
  });

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

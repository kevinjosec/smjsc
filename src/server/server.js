require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on('error', (err) => console.error(err));
db.once('open', () => console.log('MongoDB connection succcessful'));
app.listen(3000,() => console.log('Server has started'));

app.use(cors());
app.use(express.json())

const teacherRoute = require('./routes/faculty')
const committeeRoute = require('./routes/committee');
const studentRoute = require('./routes/student');
const accountsRoute = require('./routes/account');

app.use('/api/faculty', teacherRoute);
app.use('/api/committee', committeeRoute);
app.use('/api/student', studentRoute);
app.use('/api/accounts', accountsRoute);
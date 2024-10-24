require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Database connected'));
app.listen(3000,() => console.log('Server listening on port 3000'));

app.use(cors({
    origin: '*' // Frontend Serveo URL
}));
app.use(express.json())

const teacherRoute = require('./routes/faculty')
const studentRoute = require('./routes/student')
const accountsRoute = require('./routes/account');
const userRoute = require('./routes/user');

app.use('/api/faculty', teacherRoute);
app.use('/api/student', studentRoute);
app.use('/api/account', accountsRoute);
app.use('/api/user', userRoute);
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoute = require('./routes/userRoute');
const cors = require('cors');
const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use('/api', userRoute);
// -> /api/register

app.get('/', (req, res) => {
    res.send("hey hello");
})

app.listen(port, () => {
    connectDB();
    console.log(`Server is listening on PORT ${port}`);
})
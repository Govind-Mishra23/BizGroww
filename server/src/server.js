const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/company', require('./routes/companyRoutes'));
app.use('/api/requirements', require('./routes/requirementRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(require('./middleware/errorMiddleware').errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

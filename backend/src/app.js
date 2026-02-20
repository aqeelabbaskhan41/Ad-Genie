const express = require('express');
const cors = require('cors')
const authRoutes = require('./routes/authRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.use(errorMiddleware);

module.exports = app;
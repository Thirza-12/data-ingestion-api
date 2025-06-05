const express = require('express');
const mongoose = require('mongoose');
const ingestionRoutes = require('./routes/ingestionRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/', ingestionRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => console.log('Server running on port 5000'));
});

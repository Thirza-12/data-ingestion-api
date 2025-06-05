const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngestionSchema = new Schema({
  ingestion_id: { type: String, required: true, unique: true },
  priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], required: true },
  status: { type: String, enum: ['yet_to_start', 'triggered', 'completed'], default: 'yet_to_start' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ingestion', IngestionSchema);

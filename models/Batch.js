const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BatchSchema = new Schema({
  ingestion_id: String,
  batch_id: String,
  ids: [Number],
  status: { type: String, enum: ['yet_to_start', 'triggered', 'completed'], default: 'yet_to_start' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Batch', BatchSchema);

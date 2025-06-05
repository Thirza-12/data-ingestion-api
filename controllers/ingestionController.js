const { v4: uuidv4 } = require('uuid');
const Ingestion = require('../models/Ingestion');
const Batch = require('../models/Batch');
const ingestionQueue = require('../services/ingestionService');

exports.createIngestion = async (req, res) => {
  const { ids, priority } = req.body;

  const ingestion_id = uuidv4();
  const ingestion = new Ingestion({ ingestion_id, priority });
  await ingestion.save();

  // break into batches of 3
  for (let i = 0; i < ids.length; i += 3) {
    const batch_ids = ids.slice(i, i + 3);
    const batch = new Batch({
      ingestion_id,
      batch_id: uuidv4(),
      ids: batch_ids
    });
    await batch.save();
  }

  ingestionQueue.addToQueue({ ingestion_id, priority });

  return res.json({ ingestion_id });
};

exports.getStatus = async (req, res) => {
  const { ingestion_id } = req.params;

  const ingestion = await Ingestion.findOne({ ingestion_id });
  const batches = await Batch.find({ ingestion_id });

  let status = 'yet_to_start';
  const statuses = batches.map(b => b.status);

  if (statuses.every(s => s === 'completed')) status = 'completed';
  else if (statuses.some(s => s === 'triggered' || s === 'completed')) status = 'triggered';

  return res.json({
    ingestion_id,
    status,
    batches: batches.map(b => ({
      batch_id: b.batch_id,
      ids: b.ids,
      status: b.status
    }))
  });
};

const Batch = require('../models/Batch');
const Ingestion = require('../models/Ingestion');

const queue = [];

function comparePriority(a, b) {
  const prioMap = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  if (prioMap[a.priority] !== prioMap[b.priority]) {
    return prioMap[b.priority] - prioMap[a.priority];
  }
  return new Date(a.timestamp) - new Date(b.timestamp);
}

module.exports = {
  addToQueue(task) {
    task.timestamp = new Date();
    queue.push(task);
    queue.sort(comparePriority);
  },

  async processQueue() {
    if (queue.length === 0) return;

    const task = queue.shift();
    const { ingestion_id } = task;

    const batches = await Batch.find({ ingestion_id, status: 'yet_to_start' }).sort('createdAt');

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      batch.status = 'triggered';
      await batch.save();

      await new Promise(resolve => setTimeout(resolve, 5000)); // simulate delay

      batch.status = 'completed';
      await batch.save();
    }

    await Ingestion.updateOne({ ingestion_id }, { status: 'completed' });
  }
};

// Run every 5 seconds
setInterval(module.exports.processQueue, 5000);

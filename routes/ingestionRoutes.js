const express = require('express');
const router = express.Router();
const controller = require('../controllers/ingestionController');

router.post('/ingest', controller.createIngestion);
router.get('/status/:ingestion_id', controller.getStatus);

module.exports = router;

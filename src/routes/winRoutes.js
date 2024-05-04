const express = require('express');
const router = express.Router();
const winController = require('../controllers/winController');

router.post('/win', winController.updateCatchStatus);
router.get('/win/:catchId', winController.getCatchStatus);

module.exports = router;
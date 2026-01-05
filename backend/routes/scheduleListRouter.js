const express = require('express');
const router = express.Router();
const scheduleListController = require('../controllers/scheduleListController');

router.get('/', scheduleListController.getScheduleList);

module.exports = router;
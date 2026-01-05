const express = require('express');
const router = express.Router();

const scheduleController = require('../controllers/scheduleController');



// 캘린더 조회
router.get('/', scheduleController.getSchedule);

// 일정 저장
router.post('/add', scheduleController.addSchedule);

// 일정 삭제
router.delete('/delete', scheduleController.deleteSchedule);

// 일정 수정
router.post('/update', scheduleController.updateSchedule);

module.exports = router;
const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController')

router.post('/analyze' , chatController.analyzeChat);


router.get('/history' , chatController.getChatHistory);

router.get('/list' , chatController.getChatList);

router.put('/read', chatController.markAsRead);


module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/search', userController.searchUser);

router.post('/add-friend', userController.addFriend);

router.get('/friends', userController.getFriends);

router.delete('/delete-friend', userController.deleteFriend);

module.exports = router;
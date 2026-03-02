const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/chat', optionalAuth, chatbotController.chat);
router.get('/history', optionalAuth, chatbotController.getHistory);
router.get('/sessions', optionalAuth, chatbotController.getSessions);
router.delete('/session/:sessionId', optionalAuth, chatbotController.deleteSession);
router.patch('/session/:sessionId/share', optionalAuth, chatbotController.toggleShare);
router.get('/public/:sessionId', chatbotController.getPublicChat); // No auth needed for public view

module.exports = router;

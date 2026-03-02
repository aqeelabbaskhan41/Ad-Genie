const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, modelController.createModel);
router.get('/', authMiddleware, modelController.getModels);
router.delete('/:id', authMiddleware, modelController.deleteModel);

module.exports = router;

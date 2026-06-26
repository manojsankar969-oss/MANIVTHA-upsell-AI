const express = require('express');
const router = express.Router();

const { validateGenerateInput, validateFeedbackInput } = require('../middlewares/validator');
const { generateScript } = require('../controllers/scriptController');
const { getHistory, getGenerationById } = require('../controllers/historyController');
const { submitFeedback } = require('../controllers/feedbackController');
const { getAnalytics } = require('../controllers/analyticsController');

// 1. Script Generation
router.post('/generate', validateGenerateInput, generateScript);

// 2. Generation History
router.get('/history', getHistory);
router.get('/history/:id', getGenerationById);

// 3. Script Feedback
router.post('/feedback', validateFeedbackInput, submitFeedback);

// 4. Admin Analytics
router.get('/admin/analytics', getAnalytics);

module.exports = router;

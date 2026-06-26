const dbService = require('../services/dbService');

/**
 * Handles GET /api/history
 */
const getHistory = async (req, res, next) => {
  try {
    const historyList = await dbService.getHistory();
    return res.json(historyList);
  } catch (err) {
    next(err);
  }
};

/**
 * Handles GET /api/history/:id
 */
const getGenerationById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const targetId = parseInt(id, 10);
    if (isNaN(targetId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const generation = await dbService.getGenerationById(targetId);
    
    if (!generation) {
      return res.status(404).json({ error: 'Generation not found' });
    }

    return res.json(generation);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHistory,
  getGenerationById
};

const { pool } = require('../config/db');

/**
 * Inserts a new script generation entry.
 */
const createGeneration = async (staffName, customerDetails, bookingInputs, aiResponse) => {
  const query = `
    INSERT INTO generations (staff_name, customer_details, booking_inputs, ai_response) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `;
  const values = [staffName, customerDetails, bookingInputs, aiResponse];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Retrieves all script generations ordered by date descending.
 */
const getHistory = async () => {
  const query = 'SELECT * FROM generations ORDER BY created_at DESC';
  const { rows } = await pool.query(query);
  return rows;
};

/**
 * Retrieves a single script generation by ID.
 */
const getGenerationById = async (id) => {
  const query = 'SELECT * FROM generations WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

/**
 * Submits feedback for a generation.
 */
const createFeedback = async (generationId, rating, comment) => {
  const query = `
    INSERT INTO feedback (generation_id, rating, comment) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `;
  const values = [generationId, rating, comment];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Computes general metrics and rating distribution for analytics.
 */
const getAnalytics = async () => {
  const totalGenerationsQuery = 'SELECT COUNT(*) FROM generations';
  const avgRatingQuery = 'SELECT AVG(rating) FROM feedback';
  const feedbackTrendQuery = 'SELECT rating, COUNT(*) FROM feedback GROUP BY rating';

  const [totalRes, avgRes, trendRes] = await Promise.all([
    pool.query(totalGenerationsQuery),
    pool.query(avgRatingQuery),
    pool.query(feedbackTrendQuery)
  ]);

  return {
    total_generations: parseInt(totalRes.rows[0].count, 10) || 0,
    average_rating: parseFloat(avgRes.rows[0].avg) || 0,
    rating_distribution: trendRes.rows.map(row => ({
      rating: parseInt(row.rating, 10),
      count: parseInt(row.count, 10)
    }))
  };
};

module.exports = {
  createGeneration,
  getHistory,
  getGenerationById,
  createFeedback,
  getAnalytics
};

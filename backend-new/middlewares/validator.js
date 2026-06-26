/**
 * Middleware to validate script generation input data.
 */
const validateGenerateInput = (req, res, next) => {
  const { staff_name, customer_details, booking_inputs } = req.body;

  if (!staff_name || typeof staff_name !== 'string' || !staff_name.trim()) {
    return res.status(400).json({ error: 'staff_name is required and must be a non-empty string' });
  }

  if (!customer_details || typeof customer_details !== 'string' || !customer_details.trim()) {
    return res.status(400).json({ error: 'customer_details is required and must be a non-empty string' });
  }

  if (!booking_inputs || typeof booking_inputs !== 'string' || !booking_inputs.trim()) {
    return res.status(400).json({ error: 'booking_inputs is required and must be a non-empty string' });
  }

  next();
};

/**
 * Middleware to validate feedback input data.
 */
const validateFeedbackInput = (req, res, next) => {
  const { generation_id, rating, comment } = req.body;

  if (generation_id === undefined || isNaN(parseInt(generation_id, 10))) {
    return res.status(400).json({ error: 'generation_id is required and must be an integer' });
  }

  const numericRating = parseInt(rating, 10);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'rating is required and must be an integer between 1 and 5' });
  }

  if (comment !== undefined && typeof comment !== 'string') {
    return res.status(400).json({ error: 'comment must be a string' });
  }

  next();
};

module.exports = {
  validateGenerateInput,
  validateFeedbackInput
};

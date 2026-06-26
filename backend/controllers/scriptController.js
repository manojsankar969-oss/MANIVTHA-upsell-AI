const geminiService = require('../services/geminiService');
const dbService = require('../services/dbService');

/**
 * Handles POST /api/generate
 */
const generateScript = async (req, res, next) => {
  const { staff_name, customer_details, booking_inputs } = req.body;

  try {
    console.log(`Generating script for staff: "${staff_name}"`);
    
    // Generate AI script
    const aiResponse = await geminiService.generateUpsellScript(
      staff_name,
      customer_details,
      booking_inputs
    );

    // Save into database
    const dbRecord = await dbService.createGeneration(
      staff_name,
      customer_details,
      booking_inputs,
      aiResponse
    );

    console.log(`✅ AI Response generated successfully. ID: ${dbRecord.id}`);
    return res.status(201).json(dbRecord);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateScript
};

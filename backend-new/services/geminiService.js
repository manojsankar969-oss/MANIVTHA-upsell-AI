const { model } = require('../config/gemini');

/**
 * Formulates the prompt and generates an upsell script from Gemini.
 * @param {string} staffName - Name of the salesperson/staff.
 * @param {string} customerDetails - Context about the customer.
 * @param {string} bookingInputs - The details of current booking & target upsell.
 * @returns {Promise<string>} The generated script text.
 */
const generateUpsellScript = async (staffName, customerDetails, bookingInputs) => {
  const prompt = `
    You are an AI assistant for Manivtha Tours & Travels, a car rental company in Hyderabad.
    Your task is to generate a structured upsell script based on the following information:
    
    Staff Member: ${staffName}
    Customer Details: ${customerDetails}
    Current Booking/Inputs: ${bookingInputs}
    
    The script should aim to upsell a longer package, an add-on service, or a premium vehicle.
    Format the script into clear sections:
    1. Opening & Greeting
    2. Acknowledgement of Current Booking
    3. The Upsell Proposal (Highlight value and benefits)
    4. Handling Potential Objections
    5. Closing & Next Steps
    
    Return only the script text. Do not include markdown headers wrapper outside the sections or other conversational meta-responses, start directly with the greeting.
  `;

  const result = await model.generateContent(prompt);
  
  if (!result || !result.response) {
    throw new Error('Did not receive a response from the Gemini API.');
  }

  return result.response.text();
};

module.exports = {
  generateUpsellScript
};

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { pool, initDb } = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// 1. CORS MUST BE FIRST
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Other Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Initialize Database
initDb();

// Routes

// AI Script Generation
app.post('/api/generate', async (req, res) => {
  const { staff_name, customer_details, booking_inputs } = req.body;

  if (!staff_name || !customer_details || !booking_inputs) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Generating script for:', staff_name);
    const prompt = `
      You are an AI assistant for Manivtha Tours & Travels, a car rental company in Hyderabad.
      Your task is to generate a structured upsell script based on the following information:
      
      Staff Member: ${staff_name}
      Customer Details: ${customer_details}
      Current Booking/Inputs: ${booking_inputs}
      
      The script should aim to upsell a longer package, an add-on service, or a premium vehicle.
      Format the script into clear sections:
      1. Opening & Greeting
      2. Acknowledgement of Current Booking
      3. The Upsell Proposal (Highlight value and benefits)
      4. Handling Potential Objections
      5. Closing & Next Steps
      
      Return only the script text.
    `;

    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      throw new Error('No response from Gemini API');
    }

    const ai_response = result.response.text();
    console.log('AI Response generated successfully');

    // Save to history
    const dbResult = await pool.query(
      'INSERT INTO generations (staff_name, customer_details, booking_inputs, ai_response) VALUES ($1, $2, $3, $4) RETURNING *',
      [staff_name, customer_details, booking_inputs, ai_response]
    );

    res.json(dbResult.rows[0]);
  } catch (err) {
    console.error('Error generating script:', err);
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

// Get Generation History
app.get('/api/history', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM generations ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get Single Generation
app.get('/api/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM generations WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Generation not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching generation:', err);
    res.status(500).json({ error: 'Failed to fetch generation' });
  }
});

// Submit Feedback
app.post('/api/feedback', async (req, res) => {
  const { generation_id, rating, comment } = req.body;

  if (!generation_id || !rating) {
    return res.status(400).json({ error: 'Missing generation_id or rating' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO feedback (generation_id, rating, comment) VALUES ($1, $2, $3) RETURNING *',
      [generation_id, rating, comment]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Admin Analytics
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const totalGenerations = await pool.query('SELECT COUNT(*) FROM generations');
    const avgRating = await pool.query('SELECT AVG(rating) FROM feedback');
    const feedbackTrend = await pool.query('SELECT rating, COUNT(*) FROM feedback GROUP BY rating');

    res.json({
      total_generations: totalGenerations.rows[0].count,
      average_rating: avgRating.rows[0].avg || 0,
      rating_distribution: feedbackTrend.rows,
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const server = app.listen(port, () => {
  console.log(`✅ Server is ACTIVE on port ${port}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already being used. Use a different port or kill the process.`);
  } else {
    console.error('❌ Server error:', err);
  }
});

process.on('unhandledRejection', (reason, p) => {
  console.error('❌ Unhandled Rejection at: Promise', p, 'reason:', reason);
});

# AI Trip Package Upsell Script Generator

A full-stack AI-powered tool for Manivtha Tours & Travels to generate high-converting upsell scripts for car rentals and tour packages.

## Features

- **AI Script Generation**: Uses Google's Gemini 1.5 Pro to generate structured upsell scripts.
- **Template Presets**: Quick-fill scenarios for common upselling opportunities (Long Stay, Premium Upgrade, Add-on Services).
- **History & Tracking**: Every generation is saved to a PostgreSQL database for future reference.
- **Feedback & Quality Rating**: Users can rate generations and provide comments to improve AI performance.
- **Admin Analytics**: Dashboard showing total usage, average quality ratings, and trends.
- **Exports**: Copy to clipboard, Share, or Download as PDF/TXT.
- **Modern UI**: Built with React, Vite, Tailwind CSS, and Lucide icons.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React, jsPDF.
- **Backend**: Node.js, Express, PostgreSQL (pg), Google Generative AI SDK.
- **Database**: PostgreSQL.

## Setup Instructions

### 1. Prerequisites

- Node.js (v18+)
- PostgreSQL instance (Local or Hosted like Supabase)

### 2. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your credentials:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `DATABASE_URL`: Your PostgreSQL connection string (e.g., `postgres://user:pass@localhost:5432/upseller`).
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the server:
   ```bash
   node index.js
   ```
   *The server will automatically initialize the database tables on startup.*

### 3. Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (usually `http://localhost:5173`).

## Usage

1. **New Generation**: Enter the staff name, customer details, and the current booking situation. Click "Generate Upsell Script".
2. **Templates**: Use the "Quick Templates" panel to instantly fill the form with common scenarios.
3. **Feedback**: Rate the generated script to help track performance in the Analytics dashboard.
4. **History**: Click the "History" tab to view all previous generations.
5. **Analytics**: Click the "Analytics" tab to view usage and quality metrics (requires feedback submissions).

---
*Built for Manivtha Tours & Travels Internship Project.*

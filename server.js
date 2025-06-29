const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Google Sheets Integration
const { google } = require('googleapis');
const creds = require('./google-creds.json'); // Your downloaded service account JSON

const SPREADSHEET_ID = '1GOjK_jD-5zpIE0Cq8DZq3hPTxhyr_ZZg9zjZoDEeXx0';

async function appendRow(timestamp, payout) {
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A:B',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[timestamp, payout]],
    },
  });

  console.log('✅ Data saved to Google Sheet:', timestamp, payout);
}

// Middleware
app.use(cors());
app.use(express.json());

let lastPayout = null;

// POST endpoint
app.post('/data', async (req, res) => {
  const { payout } = req.body;
  const timestamp = new Date().toISOString();

  if (typeof payout === 'string' && payout.endsWith('x')) {
    const numericPayout = parseFloat(payout.replace('x', ''));

    if (!isNaN(numericPayout) && numericPayout !== lastPayout) {
      lastPayout = numericPayout;

      try {
        await appendRow(timestamp, payout);
      } catch (err) {
        console.error('❌ Error saving to Google Sheet:', err);
      }
    }
  }

  res.json({ status: '✅ Received', received: req.body });
});

// GET home route to show latest message
app.get('/', (req, res) => {
  res.send(`<h2>✅ Aviator Logger is Live</h2><p>Use POST /data to submit payout values.</p>`);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

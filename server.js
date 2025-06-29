const express = require('express');
const cors = require('cors');
const { sendPayoutToSheet } = require('./Helper');
const analyzeLast100Values = require('./analyzeHistory');
const sendEmail = require('./sendEmail');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let lastPayout = null;
const payoutHistory = [];

async function newPayoutReceived(payoutValue) {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, payout: payoutValue };
  payoutHistory.push(entry);
  sendPayoutToSheet(payoutValue);

  console.log('🆕 New Payout Received:', entry);

  try {
    const { message, shouldSendEmail } = await analyzeLast100Values();

    //shouldSendEmail = false;
    
    if (shouldSendEmail) {
      console.log('📩 Condition met. Sending email...');
      await sendEmail(message);
    } else {
      console.log('✅ Value present but within threshold — email not sent.');
    }
  } catch (err) {
    console.error('❌ Error in analyzeHistory or sendEmail:', err.message);
  }
}


app.post('/data', (req, res) => {
  let { payout } = req.body;

    console.log('📥 Received request:', req.body); // ✅ Add this line

  if (typeof payout === 'string' && payout.endsWith('x')) {
    const numericPayout = parseFloat(payout.replace('x', ''));

    if (!isNaN(numericPayout) && numericPayout !== lastPayout) {
      lastPayout = numericPayout;
      newPayoutReceived(numericPayout);
    }
  }

  res.json({ status: 'Checked', received: req.body });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

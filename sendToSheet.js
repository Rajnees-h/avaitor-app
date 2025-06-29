const { google } = require('googleapis');
const creds = require('./google-creds.json'); // ⚠️ Your downloaded service account JSON

const SPREADSHEET_ID = '1GOjK_jD-5zpIE0Cq8DZq3hPTxhyr_ZZg9zjZoDEeXx0';

async function appendRow(timestamp, payout) {
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A:B', // A = timestamp, B = payout
    valueInputOption: 'RAW',
    requestBody: {
      values: [[timestamp, payout]],
    },
  });

  console.log('✅ Data saved to Google Sheet:', timestamp, payout);
}

module.exports = appendRow;

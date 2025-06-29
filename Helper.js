const fs = require('fs');
const path = require('path');

// ✅ File path: Same directory as Helper.js
const FILE_PATH = path.join(__dirname, 'history-data.txt');

/**
 * Append payout value with timestamp to local file
 * @param {number} payoutValue - Example: 3.25
 */
function sendPayoutToSheet(payoutValue) {
  if (typeof payoutValue !== 'number' || isNaN(payoutValue)) {
    console.error('❌ Invalid payout value. Must be a valid number.');
    return;
  }

  const timestamp = new Date().toISOString();
  const line = `${timestamp} | ${payoutValue}\n`;

  fs.appendFile(FILE_PATH, line, (err) => {
    if (err) {
      console.error('❌ Error writing to history-data.txt:', err);
    } else {
      //console.log(`✅ Saved payout ${payoutValue} to history-data.txt`);
    }
  });
}

// ✅ Example usage (uncomment to test manually):
// sendPayoutToSheet(2.91);

module.exports = { sendPayoutToSheet };

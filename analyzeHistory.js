const fs = require('fs');

// ✅ Configurable Threshold & Index Limit
const checkValue = 20;
const checkValueminIndex = 30;

const filePath = './history-data.txt';

function analyzeLast100Values() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(new Error('❌ Failed to read file: ' + err.message));
      }

      const allLines = data.trim().split('\n');
      const last100Lines = allLines.slice(-100);

      const values = last100Lines.map(line => {
        const parts = line.split('|');
        if (parts.length === 2) {
          const value = parseFloat(parts[1].trim());
          return isNaN(value) ? null : value;
        }
        return null;
      }).filter(v => v !== null);

      if (values.length === 0) {
        return reject(new Error('⚠️ No valid numeric values found.'));
      }

      // 🔍 Find index from end where value >= checkValue
      let indexFromEnd = -1;
      for (let i = values.length - 1, count = 0; i >= 0; i--, count++) {
        if (values[i] >= checkValue) {
          indexFromEnd = count;
          break;
        }
      }

      let markerLine = '';
      let shouldSendEmail = false;

      if (indexFromEnd === -1) {
        markerLine = `❌ No value >= ${checkValue} found in the last 100 records.`;
        shouldSendEmail = true;
      } else if (indexFromEnd >= checkValueminIndex) {
        markerLine = `✅ Value >= ${checkValue} found ${indexFromEnd} value(s) ago (from the end).`;
        shouldSendEmail = true;
      } else {
        markerLine = `⏸️ Value >= ${checkValue} found ${indexFromEnd} value(s) ago, which is within the minimum index limit (${checkValueminIndex}). No email needed.`;
        shouldSendEmail = false;
      }

      const message = `📊 Last 100 Aviator Multiplier Values:\n\n${values.join(', ')}\n\n${markerLine}`;
      resolve({ message, shouldSendEmail });
    });
  });
}

module.exports = analyzeLast100Values;

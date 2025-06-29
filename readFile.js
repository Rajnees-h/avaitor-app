const fs = require('fs');
const sendEmail = require('./sendEmail'); // Reuse your existing email sender

const filePath = './history-data.txt';

fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('❌ Error reading file:', err.message);
    return;
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
    console.error('⚠️ No valid numeric values found.');
    return;
  }

  // Find how many values ago the last value >= 20 was
  let indexFromEnd = -1;
  for (let i = values.length - 1, count = 0; i >= 0; i--, count++) {
    if (values[i] >= 20) {
      indexFromEnd = count;
      break;
    }
  }

  let markerLine = '';
  if (indexFromEnd === -1) {
    markerLine = '❌ No value >= 20 found in the last 100 records.';
  } else {
    markerLine = `✅ Last value >= 20 was found ${indexFromEnd} value(s) ago (from the end).`;
  }

  const message = `📊 Last 100 Aviator Multiplier Values:\n\n${values.join(', ')}\n\n${markerLine}`;
  if(indexFromEnd >= -1){
     await sendEmail(message);
  }
 
});

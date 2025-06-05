const fs = require('fs');
const path = require('path');

function generate() {
  const summariesPath = path.join(__dirname, '..', 'public', 'summaries.json');
  const resultsPath = path.join(__dirname, '..', 'results.md');
  let summaries = [];
  try {
    summaries = JSON.parse(fs.readFileSync(summariesPath, 'utf8'));
  } catch (err) {
    console.error('No summaries found');
    return;
  }

  let md = '# Summaries\n\n';
  for (const item of summaries) {
    md += `${item.url}\n${item.summary}\n\n`;
  }
  fs.writeFileSync(resultsPath, md);
  console.log('Wrote', resultsPath);
}

if (require.main === module) {
  generate();
}

module.exports = { generate };

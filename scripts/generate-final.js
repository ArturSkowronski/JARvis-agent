const fs = require('fs');
const path = require('path');

function generate(platform) {
  const summariesPath = path.join(__dirname, '..', 'public', 'summaries.json');
  const imagesPath = path.join(__dirname, '..', 'public', 'images.json');
  const mapPath = path.join(__dirname, '..', `${platform}.json`);
  const outPath = path.join(__dirname, '..', `final-${platform}.md`);

  let summaries = [];
  try {
    summaries = JSON.parse(fs.readFileSync(summariesPath, 'utf8'));
  } catch (err) {
    console.error('No summaries found');
    return;
  }

  let images = [];
  try {
    images = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));
  } catch {
    images = [];
  }

  let map = {};
  try {
    map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  } catch {
    map = {};
  }

  const missing = new Set();
  function replaceHandles(text) {
    return text.replace(/@([A-Za-z][A-Za-z .'-]*)/g, (m, name) => {
      const trimmed = name.trim();
      if (map[trimmed]) {
        return map[trimmed];
      }
      missing.add(trimmed);
      return m;
    });
  }

  let md = '';
  for (const item of summaries) {
    md += `[Original link](${item.url})\n${replaceHandles(item.summary)}\n\n`;
  }

  for (const link of images) {
    md += `![Image](${link})\n\n`;
  }

  if (missing.size > 0) {
    md += `---\nAuthors not matched: ${Array.from(missing).join(', ')}\n`;
  }

  fs.writeFileSync(outPath, md);
  console.log('Wrote', outPath);
  if (missing.size > 0) {
    console.log('Unmatched authors:', Array.from(missing).join(', '));
  }
}

if (require.main === module) {
  const platform = process.argv[2];
  if (!platform) {
    console.error('Usage: node generate-final.js <linkedin|substack>');
    process.exit(1);
  }
  generate(platform);
}

module.exports = { generate };

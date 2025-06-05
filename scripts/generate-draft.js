const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function openFile(filePath) {
  const platform = process.platform;
  let cmd;
  if (platform === 'darwin') {
    cmd = `open "${filePath}"`;
  } else if (platform === 'win32') {
    cmd = `start "" "${filePath}"`;
  } else {
    cmd = `xdg-open "${filePath}"`;
  }
  exec(cmd, (err) => {
    if (err) {
      console.error('Failed to open draft:', err.message);
    }
  });
}

async function generate() {
  const summariesPath = path.join(__dirname, '..', 'public', 'summaries.json');
  const imagesPath = path.join(__dirname, '..', 'public', 'images.json');
  const draftPath = path.join(__dirname, '..', 'draft.md');

  let summaries = [];
  try {
    summaries = JSON.parse(fs.readFileSync(summariesPath, 'utf8'));
  } catch {
    summaries = [];
  }

  let images = [];
  try {
    images = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));
  } catch {
    images = [];
  }

  let md = '';
  for (const item of summaries) {
    md += `[Original link](${item.url})\n${item.summary}\n\n`;
  }

  const imgurClientId = process.env.IMGUR_CLIENT_ID;
  const uploaded = [];
  if (imgurClientId) {
    for (const url of images) {
      try {
        const res = await fetch(url);
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const body = new FormData();
        body.append('image', base64);
        const uploadRes = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: { Authorization: `Client-ID ${imgurClientId}` },
          body,
        });
        const data = await uploadRes.json();
        if (data?.data?.link) {
          uploaded.push(data.data.link);
        }
      } catch (err) {
        console.error('Error uploading to imgur:', err);
      }
    }
  }

  if (uploaded.length === 0 && images.length > 0) {
    uploaded.push(...images);
  }

  for (const link of uploaded) {
    md += `![Image](${link})\n\n`;
  }

  fs.writeFileSync(draftPath, md);
  console.log('Wrote', draftPath);
  openFile(draftPath);
}

if (require.main === module) {
  generate();
}

module.exports = { generate };

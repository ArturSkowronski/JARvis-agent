const fs = require('fs');
const OpenAI = require('openai');

async function factCheck(text) {
  const openai = new OpenAI();
  const messages = [
    {
      role: 'system',
      content:
        'You are a fact-checking assistant. Analyse the text, list each factual statement, confirm if it is correct, and suggest corrections for any inaccuracies.'
    },
    {
      role: 'user',
      content: `Fact check the following text using the gpt-4o model and provide recommendations for corrections if needed.\n\n${text}`
    }
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages
  });
  const result = completion.choices[0].message.content;

  const verifyMessages = [
    {
      role: 'system',
      content:
        'You are verifying the output of a fact check. Ensure each statement and correction is accurate.'
    },
    {
      role: 'user',
      content: `Verify the following fact check result:\n\n${result}`
    }
  ];

  const verification = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: verifyMessages
  });

  return `${result}\n\n---\nVerification:\n${verification.choices[0].message.content}`;
}

async function main() {
  const input = fs.readFileSync('input.md', 'utf8');
  console.log(await factCheck(input));
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error running fact check:', err);
    process.exit(1);
  });
}

module.exports = { factCheck };

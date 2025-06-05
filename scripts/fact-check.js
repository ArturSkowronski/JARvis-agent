const fs = require('fs');
const OpenAI = require('openai');

async function main() {
  const input = fs.readFileSync('input.md', 'utf8');
  const openai = new OpenAI();
  const messages = [
    {
      role: 'system',
      content: 'You are a fact-checking assistant. Analyse the text, list each factual statement, confirm if it is correct, and suggest corrections for any inaccuracies.'
    },
    {
      role: 'user',
      content: `Fact check the following text using the gpt-4o model and provide recommendations for corrections if needed.\n\n${input}`
    }
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages
  });

  console.log(completion.choices[0].message.content);
}

main().catch(err => {
  console.error('Error running fact check:', err);
  process.exit(1);
});

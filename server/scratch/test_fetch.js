import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.LLM_API_KEY;
const modelName = process.env.LLM_MODEL;

console.log('Testing Gemini API via raw fetch...');
console.log('Model:', modelName);

const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

async function test() {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hello, this is a test. Reply with "OK".' }] }]
      })
    });
    console.log('HTTP Status:', res.status, res.statusText);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('Latency:', Date.now() - start, 'ms');
  } catch (error) {
    console.error('Error during raw fetch:', error);
  }
}

test();

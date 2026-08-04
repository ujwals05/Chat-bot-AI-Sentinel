import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.LLM_API_KEY;

console.log('Listing all model names...');

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function test() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
      console.log('Models list:');
      data.models.forEach(m => {
        console.log(`- ${m.name} (${m.displayName}) - Supported methods: ${m.supportedGenerationMethods.join(', ')}`);
      });
    } else {
      console.log('No models found, error:', data);
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

test();

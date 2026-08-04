import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.LLM_API_KEY;
const modelName = 'gemini-2.5-flash';

console.log('Testing Gemini API with gemini-2.5-flash...');

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  const start = Date.now();
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Hello, this is a test. Reply with "OK".');
    const response = await result.response;
    console.log('Response:', response.text());
    console.log('Latency:', Date.now() - start, 'ms');
  } catch (error) {
    console.error('Error during test:', error);
  }
}

test();

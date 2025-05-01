import {genkit, GenkitError, Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {openAI} from 'genkitx-openai'; // Corrected import path

const provider = process.env.GENAI_PROVIDER?.toLowerCase() || 'googleai'; // Default to googleai

let selectedPlugin: Plugin<any>;
let selectedModel: string;

if (provider === 'openai') {
  if (!process.env.OPENAI_API_KEY) {
    throw new GenkitError({
        source: 'ai-instance',
        status: 'unavailable',
        message: 'OPENAI_API_KEY environment variable is not set.',
    });
  }
  selectedPlugin = openAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  // You might want to specify a default OpenAI model here, e.g., 'gpt-4o' or 'gpt-3.5-turbo'
  selectedModel = 'openai/gpt-4o'; // Example OpenAI model
  console.log('Using OpenAI provider.');
} else if (provider === 'googleai') {
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    throw new GenkitError({
        source: 'ai-instance',
        status: 'unavailable',
        message: 'GOOGLE_GENAI_API_KEY environment variable is not set.',
    });
  }
  selectedPlugin = googleAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
  });
  selectedModel = 'googleai/gemini-2.0-flash'; // Default Google AI model
  console.log('Using Google AI provider.');
} else {
  throw new GenkitError({
      source: 'ai-instance',
      status: 'invalid-argument',
      message: `Unsupported GENAI_PROVIDER: ${provider}. Must be 'googleai' or 'openai'.`,
  });
}


export const ai = genkit({
  promptDir: './prompts',
  plugins: [selectedPlugin],
  model: selectedModel,
});

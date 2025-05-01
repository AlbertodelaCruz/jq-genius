'use server';
/**
 * @fileOverview Generates a JQ query from a natural language description.
 *
 * - generateJQQuery - A function that generates a JQ query from a natural language description.
 * - GenerateJQQueryInput - The input type for the generateJQQuery function.
 * - GenerateJQQueryOutput - The return type for the generateJQQuery function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateJQQueryInputSchema = z.object({
  description: z.string().describe('A natural language description of the desired JQ query.'),
  jsonFile: z
    .string()
    .describe(
      'The JSON file content as a string.'
    ),
});
export type GenerateJQQueryInput = z.infer<typeof GenerateJQQueryInputSchema>;

const GenerateJQQueryOutputSchema = z.object({
  jqQuery: z.string().describe('The generated JQ query.'),
});
export type GenerateJQQueryOutput = z.infer<typeof GenerateJQQueryOutputSchema>;

export async function generateJQQuery(input: GenerateJQQueryInput): Promise<GenerateJQQueryOutput> {
  return generateJQQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJQQueryPrompt',
  input: {
    schema: z.object({
      description: z.string().describe('A natural language description of the desired JQ query.'),
      jsonFile: z
        .string()
        .describe(
          'The JSON file content as a string.'
        ),
    }),
  },
  output: {
    schema: z.object({
      jqQuery: z.string().describe('The generated JQ query.'),
    }),
  },
  prompt: `You are a JQ expert. Given a JSON file and a description of the data to extract, you will generate a JQ query to extract that data.

JSON file:
{{{jsonFile}}}

Description:
{{{description}}}

JQ query:
`,
});

const generateJQQueryFlow = ai.defineFlow<
  typeof GenerateJQQueryInputSchema,
  typeof GenerateJQQueryOutputSchema
>({
  name: 'generateJQQueryFlow',
  inputSchema: GenerateJQQueryInputSchema,
  outputSchema: GenerateJQQueryOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});

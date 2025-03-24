import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AppService {
  private openai: OpenAI;

  constructor() {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key is missing. Please set OPENAI_API_KEY in the environment variables.');
      }
      this.openai = new OpenAI({ apiKey });
    } catch (error) {
      console.error('Error initializing OpenAI:', error.message);
      throw new InternalServerErrorException('Failed to initialize OpenAI.');
    }
  }

  async getCompletion(document: string, retrievedSimilarDocuments: string[]) {
    try {
      const prompt = `
      You are an AI document evaluator for a Retrieval-Augmented Generation (RAG) system.  
      Your job is to analyze a given document and determine if it should be added based on specific quality conditions.
      The given document is enclosed with <<>>.

      **Evaluation Conditions and Scores:**
      1. Relevance: Directly related to the domain. (15)
      2. Uniqueness: Not a duplicate. (10)
      3. Consistency: Must not contradict existing knowledge. (10)
      4. Accuracy: From a reliable source, no misinformation. (10)
      5. Timeliness: Up-to-date and not obsolete. (15)
      6. Legal & Ethical Compliance: Must follow privacy laws. (10)
      7. Contradictions: No contradictions with the database. (10)
      8. Duplicates: No significant repetition. (10)
      9. Outdated or Misleading Data: No incorrect information. (10)

      ---
      
      **Input Data**
      - New Document:  
        <<${document}>>
      
      - Existing Knowledge Base:  
        ${retrievedSimilarDocuments}  
      
      **Evaluation Criteria & JSON Output Format**
      Analyze the document and return a JSON response:
      \`\`\`json
      {
        "accept": "<true/false>",  
        "score": "<integer (0-100)>",  
        "issues": [
          {
            "condition": "<The failed condition>",
            "description": "<Why it failed>",
            "location": "<Specific section in the document>"
          }
        ]
      }
      \`\`\`
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0,
        max_tokens: 500,
      });

      return JSON.parse(response.choices[0]?.message?.content ?? '{}');
    } catch (error) {
      console.error('Error generating OpenAI completion:', error.message);
      throw new InternalServerErrorException('Failed to generate completion from OpenAI.');
    }
  }
}

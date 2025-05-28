import OpenAI from 'openai';
import { createApi } from 'unsplash-js';

const nebiusClient = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});

export interface BlogPost {
  title: string;
  metaDescription: string;
  content: string;
  imageDescriptions: string[];
  seoMetrics: {
    trafficPotential: string;
    keywordDifficulty: string;
    estimatedCTR: string;
    estimatedRPM: string;
  };
  topKeywords: string[];
  internalLinkingSuggestions: string[];
  externalResources: { title: string; url: string }[];
  faqs: { question: string; answer: string }[];
  cta: string;
}

export interface ImageData {
  url: string;
  alt: string;
}

export async function analyzeVideoAndGenerateBlogPost(videoTitle: string, videoDescription: string, transcript: string): Promise<BlogPost> {
  try {
    const completion = await nebiusClient.chat.completions.create({
      temperature: 0.7,
      max_tokens: 8000,
      top_p: 0.9,
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-fast",
      messages: [
        { role: "system", content: "You are an AI assistant that analyzes YouTube videos and creates comprehensive SEO-optimized blog posts with metrics and image suggestions." },
        { role: "user", content: `Analyze the following YouTube video information and create an SEO-optimized blog post:

Title: ${videoTitle}

Description: ${videoDescription}

Transcript: ${transcript}

Generate a blog post with the following:
1. An SEO-optimized title
2. A meta description
3. The main content of the blog post, properly formatted with HTML tags for headings, paragraphs, and lists. Include at least 5 sections with subheadings.
4. Suggest 5 relevant image descriptions that could be used to generate or find stock images for the blog post. Make these descriptions detailed and vivid.
5. Analyze the SEO potential of this blog post, including:
   - Estimated search traffic potential (low, medium, high)
   - Keyword difficulty (easy, medium, hard)
   - Estimated click-through rate (CTR)
   - Estimated RPM (Revenue per Mille)
6. Extract and list the top 7 keywords from the generated content
7. Suggest 3 internal linking opportunities
8. Provide 5 relevant external resources (with URLs) to link in the article
9. Generate 3 potential frequently asked questions (FAQs) related to the topic
10. Suggest a call-to-action (CTA) for the end of the article

Format the output as a JSON object with the following structure:
{
  "title": "SEO optimized title",
  "metaDescription": "SEO optimized meta description",
  "content": "The full blog post content with HTML tags for structure",
  "imageDescriptions": ["description1", "description2", "description3", "description4", "description5"],
  "seoMetrics": {
    "trafficPotential": "low/medium/high",
    "keywordDifficulty": "easy/medium/hard",
    "estimatedCTR": "0.XX",
    "estimatedRPM": "X.XX"
  },
  "topKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7"],
  "internalLinkingSuggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "externalResources": [
    { "title": "Resource 1", "url": "https://example.com/1" },
    { "title": "Resource 2", "url": "https://example.com/2" },
    { "title": "Resource 3", "url": "https://example.com/3" },
    { "title": "Resource 4", "url": "https://example.com/4" },
    { "title": "Resource 5", "url": "https://example.com/5" }
  ],
  "faqs": [
    { "question": "FAQ 1", "answer": "Answer 1" },
    { "question": "FAQ 2", "answer": "Answer 2" },
    { "question": "FAQ 3", "answer": "Answer 3" }
  ],
  "cta": "Call to action text"
}` }
      ]
    });

const content = completion.choices[0].message.content;
if (!content) {
  throw new Error('No content returned from AI completion');
}
return JSON.parse(content);  } catch (error) {
    console.error('Error analyzing video and generating blog content:', error);
    throw error;
  }
}

export async function generateImages(descriptions: string[]): Promise<ImageData[]> {
  try {
    const imagePromises = descriptions.map(async (description) => {
      const response = await openaiClient.images.generate({
        model: "dall-e-3",
        prompt: description,
        n: 1,
        size: "1024x1024",
      });
      // Check for response.data and response.data[0].url
      const url = response.data && response.data[0] && response.data[0].url
        ? response.data[0].url
        : undefined;
      if (!url) {
        throw new Error('No image URL returned from OpenAI');
      }
      return { url, alt: description };
    });

    return await Promise.all(imagePromises);
  } catch (error) {
    console.error('Error generating images:', error);
    // Fallback to Unsplash if OpenAI image generation fails
    return fetchStockImages(descriptions);
  }
}

async function fetchStockImages(descriptions: string[]): Promise<ImageData[]> {
  try {
    const imagePromises = descriptions.map(async (description) => {
      const result = await unsplash.search.getPhotos({
        query: description,
        page: 1,
        perPage: 1,
      });
      if (result.response?.results[0]) {
        const photo = result.response.results[0];
        return { url: photo.urls.regular, alt: description };
      }
      throw new Error('No image found');
    });

    return await Promise.all(imagePromises);
  } catch (error) {
    console.error('Error fetching stock images:', error);
    // If all else fails, return placeholder images
    return descriptions.map((description, index) => ({
      url: `/placeholder.svg?height=400&width=600&text=Image ${index + 1}`,
      alt: description,
    }));
  }
}


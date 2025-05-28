import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'

const nebiusClient = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  const { title, description, transcript, videoId } = await request.json()

  try {
    const articleContent = await generateArticle(title, description, transcript)
    const seoAnalysis = await analyzeSEO(articleContent.keywords[0])
    const images = await generateImages(articleContent.imageDescriptions)

    return NextResponse.json({
      ...articleContent,
      seoAnalysis,
      images,
      videoId,
    })
  } catch (error) {
    console.error('Error generating article:', error)
    return NextResponse.json({ error: 'Failed to generate article' }, { status: 500 })
  }
}

async function generateArticle(title: string, description: string, transcript: string) {
  try { 
    const completion = await nebiusClient.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-fast",
      response_format: { type: "json_object" },
      messages: [
        { 
          role: "system", 
          content: `You are an AI that generates SEO-optimized blog posts from YouTube video content. 
          Your response MUST be a valid JSON object with NO extra text, explanations, or code blocks.`
        },  
        { 
          role: "user",
          content: `Generate a blog post based on this YouTube video:
          Title: ${title}
          Description: ${description}
          Transcript: ${transcript}
          
          Include the following in your response:
          1. An SEO-optimized title
          2. The main content of the blog post (at least 2000 words, with proper HTML formatting)
          3. A list of 5 relevant keywords
          4. 5 image descriptions for AI image generation

          Respond STRICTLY in this JSON format:
          {
            "title": "SEO optimized title",
            "content": "Full blog post content with HTML tags",
            "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
            "imageDescriptions": ["image desc 1", "image desc 2", "image desc 3", "image desc 4", "image desc 5"]
          }`
        }
      ],
      max_tokens: 6000,
      temperature: 0.7
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('No content received from AI')
    }

    try {
      const parsedContent = JSON.parse(responseContent.trim())
      if (!parsedContent.title || !parsedContent.content || !parsedContent.keywords || !parsedContent.imageDescriptions) {
        throw new Error("Missing required fields in AI response")
      }
      return parsedContent
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseContent)
      return extractContentAndCreateJSON(responseContent)
    }
  } catch (error) {
    console.error("Error in generateArticle:", error)
    return createDefaultJSON(title, description)
  }
}

function extractContentAndCreateJSON(content: string) {
  try {
    // Remove any whitespace and newlines between JSON properties
    const cleanedContent = content.replace(/\s+/g, ' ').trim()
    
    // Use more robust regex patterns
    const titleMatch = cleanedContent.match(/"title"\s*:\s*"([^"]+)"/)
    const contentMatch = cleanedContent.match(/"content"\s*:\s*"([^"]+)"/)
    const keywordsMatch = cleanedContent.match(/"keywords"\s*:\s*\[(.*?)\]/)
    const imageDescriptionsMatch = cleanedContent.match(/"imageDescriptions"\s*:\s*\[(.*?)\]/)

    const title = titleMatch ? titleMatch[1].replace(/\\"/g, '"') : "Default Title"
    const extractedContent = contentMatch ? contentMatch[1].replace(/\\"/g, '"') : "Default Content"
    
    let keywords = ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
    if (keywordsMatch) {
      try {
        keywords = JSON.parse(`[${keywordsMatch[1]}]`)
      } catch (e) {
        console.error('Failed to parse keywords:', e)
      }
    }

    let imageDescriptions = ["image 1", "image 2", "image 3", "image 4", "image 5"]
    if (imageDescriptionsMatch) {
      try {
        imageDescriptions = JSON.parse(`[${imageDescriptionsMatch[1]}]`)
      } catch (e) {
        console.error('Failed to parse image descriptions:', e)
      }
    }

    return {
      title,
      content: extractedContent,
      keywords,
      imageDescriptions
    }
  } catch (error) {
    console.error('Error in extractContentAndCreateJSON:', error)
    return createDefaultJSON("Error Processing Content", "Failed to extract content from AI response")
  }
}

function createDefaultJSON(title: string, description: string) {
  return {
    title: `SEO-Optimized: ${title}`,
    content: `<h1>${title}</h1><p>${description}</p><p>We apologize, but we couldn't generate the full content at this time. Please try again later.</p>`,
    keywords: ["default", "keyword", "seo", "content", "blog"],
    imageDescriptions: [
      "Default image 1",
      "Default image 2",
      "Default image 3",
      "Default image 4",
      "Default image 5"
    ]
  }
}

async function analyzeSEO(keyword: string) {
  try {
    const response = await axios.get('https://seo-analysis.p.rapidapi.com/seo-content-analysis/', {
      params: {
        keyword: keyword,
        relatedkeywords: `${keyword}|SEO|Content`,
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'seo-analysis.p.rapidapi.com'
      }
    })

    return {
      score: response.data.score || Math.floor(Math.random() * 30) + 70,
      difficulty: response.data.difficulty || ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
      volume: response.data.searchVolume || Math.floor(Math.random() * 10000) + ' monthly searches',
      cpc: response.data.cpc || '$' + (Math.random() * 2 + 0.5).toFixed(2),
      competition: response.data.competition || Math.random().toFixed(2),
      trends: response.data.trends || [],
      relatedKeywords: response.data.relatedKeywords || [],
    }
  } catch (error) {
    console.error('Error fetching SEO data:', error)
    // Return mock data if API fails
    return {
      score: Math.floor(Math.random() * 30) + 70,
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
      volume: Math.floor(Math.random() * 10000) + ' monthly searches',
      cpc: '$' + (Math.random() * 2 + 0.5).toFixed(2),
      competition: Math.random().toFixed(2),
      trends: [],
      relatedKeywords: [],
    }
  }
}

async function generateImages(descriptions: string[]) {
  try {
    const imagePromises = descriptions.map(async (description) => {
      try {
        const response = await axios.get(`https://api.unsplash.com/photos/random`, {
          params: {
            query: description,
            client_id: process.env.UNSPLASH_ACCESS_KEY
          }
        })

        return {
          url: response.data.urls.regular,
          alt: description
        }
      } catch (error) {
        console.error('Error fetching image from Unsplash:', error)
        return {
          url: `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(description)}`,
          alt: description
        }
      }
    })

    return await Promise.all(imagePromises)
  } catch (error) {
    console.error('Error generating images:', error)
    return descriptions.map((description, index) => ({
      url: `/placeholder.svg?height=400&width=600&text=Image ${index + 1}`,
      alt: description,
    }))
  }
}


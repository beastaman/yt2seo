import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { generateBlogContent, generateImage } from '../utils/ai'
import Image from 'next/image'

interface BlogPostGeneratorProps {
  videoData: {
    title: string
    description: string
    transcript: string
  }
}

export function BlogPostGenerator({ videoData }: BlogPostGeneratorProps) {
  const [blogPost, setBlogPost] = useState<any>(null)
  const [images, setImages] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateBlogPost = async () => {
    setIsGenerating(true)
    try {
      const generatedContent = await generateBlogContent(
        videoData.title,
        videoData.description,
        videoData.transcript
      )
      setBlogPost(generatedContent)

      // Generate images based on the AI-suggested descriptions
      const generatedImages = await Promise.all(
        generatedContent.imageDescriptions.map(description => generateImage(description))
      )
      setImages(generatedImages)
    } catch (error) {
      console.error('Error generating blog post:', error)
      alert('Failed to generate blog post. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <Button onClick={generateBlogPost} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Blog Post'}
      </Button>
      {blogPost && (
        <div className="mt-8 space-y-8">
          <h1 className="text-4xl font-bold">{blogPost.title}</h1>
          <p className="text-xl text-gray-600">{blogPost.metaDescription}</p>
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {images.map((src, index) => (
              <div key={index} className="relative aspect-square">
                <Image src={src} alt={`AI Generated Image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


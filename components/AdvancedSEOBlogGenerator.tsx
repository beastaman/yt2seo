import { useState } from 'react'
import { YouTubeInput } from './YouTubeInput'
import { BlogPostDisplay } from './BlogPostDisplay'
import { analyzeVideoAndGenerateBlogPost, generateImages, BlogPost, ImageData } from '@/app/utils/ai'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

async function fetchYouTubeData(videoUrl: string) {
  const response = await fetch(`/api/youtube?url=${encodeURIComponent(videoUrl)}`)
  if (!response.ok) {
    throw new Error('Failed to fetch YouTube data')
  }
  return response.json()
}

export function AdvancedSEOBlogGenerator() {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [images, setImages] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(0)

  const handleVideoSubmit = async (videoUrl: string) => {
    setIsLoading(true)
    setError('')
    setStep(1)
    try {
      const { title, description, transcript } = await fetchYouTubeData(videoUrl)
      setStep(2)
      const generatedBlogPost = await analyzeVideoAndGenerateBlogPost(title, description, transcript)
      setBlogPost(generatedBlogPost)
      setStep(3)
      const generatedImages = await generateImages(generatedBlogPost.imageDescriptions)
      setImages(generatedImages)
      setStep(4)
    } catch (err) {
      setError('An error occurred while generating the blog post. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerateImages = async () => {
    if (!blogPost) return
    setIsLoading(true)
    setError('')
    try {
      const newImages = await generateImages(blogPost.imageDescriptions)
      setImages(newImages)
    } catch (err) {
      setError('An error occurred while regenerating images. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI-Powered SEO Blog Generator</h1>
      <YouTubeInput onVideoSubmit={handleVideoSubmit} isLoading={isLoading} />
      
      {isLoading && (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <div className="text-center">
            <p className="font-semibold">
              {step === 1 && "Fetching YouTube video data..."}
              {step === 2 && "Analyzing video and generating blog post..."}
              {step === 3 && "Generating images..."}
              {step === 4 && "Finalizing content..."}
            </p>
            <p className="text-sm text-muted-foreground">This may take a few minutes. Please wait.</p>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {blogPost && (
        <>
          <BlogPostDisplay blogPost={blogPost} images={images} />
          <div className="flex justify-center">
            <Button onClick={handleRegenerateImages} disabled={isLoading}>
              Regenerate Images
            </Button>
          </div>
        </>
      )}
    </div>
  )
}


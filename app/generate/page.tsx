'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ArticleGeneration } from '@/components/ArticleGeneration'
import { ProgressSteps } from '@/components/ProgressSteps'

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [articleData, setArticleData] = useState(null)
  const url = searchParams.get('url')

  useEffect(() => {
    if (!url) return

    const generateArticle = async () => {
      try {
        setStep(1)
        const videoData = await fetch(`/api/youtube?url=${encodeURIComponent(url)}`).then(r => r.json())
        
        setStep(2)
        const blogPost = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(videoData)
        }).then(r => r.json())

        setStep(3)
        setArticleData(blogPost)
      } catch (error) {
        console.error('Error generating article:', error)
      } finally {
        setIsLoading(false)
      }
    }

    generateArticle()
  }, [url])

  if (!url) {
    return <div>Invalid URL provided</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <ProgressSteps currentStep={step} />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <p className="text-lg text-gray-600">Generating your SEO-optimized article...</p>
          </div>
        ) : (
          articleData && <ArticleGeneration data={articleData} />
        )}
      </div>
    </div>
  )
}


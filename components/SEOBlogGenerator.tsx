import { useState } from 'react'
import { YouTubeVideoFetcher } from './YouTubeVideoFetcher'
import { BlogPostGenerator } from './BlogPostGenerator'

export function SEOBlogGenerator() {
  const [videoData, setVideoData] = useState(null)

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">AI-Powered SEO Blog Generator</h1>
      <YouTubeVideoFetcher onVideoFetched={setVideoData} />
      {videoData && (
        <BlogPostGenerator videoData={videoData} />
      )}
    </div>
  )
}


import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface YouTubeVideoData {
  title: string
  description: string
  transcript: string
}

export function YouTubeVideoFetcher({ onVideoFetched }: { onVideoFetched: (data: YouTubeVideoData) => void }) {
  const [videoUrl, setVideoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchVideo = async () => {
    setIsLoading(true)
    try {
      const videoId = extractVideoId(videoUrl)
      if (!videoId) {
        throw new Error('Invalid YouTube URL')
      }

      const [videoData, transcript] = await Promise.all([
        fetchVideoData(videoId),
        fetchVideoTranscript(videoId)
      ])

      onVideoFetched({
        title: videoData.title,
        description: videoData.description,
        transcript: transcript
      })
    } catch (error) {
      console.error('Error fetching video data:', error)
      alert('Failed to fetch video data. Please check the URL and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const fetchVideoData = async (videoId: string) => {
    const response = await fetch(`/api/youtube?videoId=${videoId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch video data')
    }
    return response.json()
  }

  const fetchVideoTranscript = async (videoId: string) => {
    const response = await fetch(`/api/youtube/transcript?videoId=${videoId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch video transcript')
    }
    return response.text()
  }

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter YouTube Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <Button onClick={fetchVideo} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Fetch Video Data'}
      </Button>
    </div>
  )
}


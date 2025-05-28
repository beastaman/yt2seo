import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

interface YouTubeInputProps {
  onVideoSubmit: (videoUrl: string) => void;
  isLoading: boolean;
}

export function YouTubeInput({ onVideoSubmit, isLoading }: YouTubeInputProps) {
  const [videoUrl, setVideoUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onVideoSubmit(videoUrl)
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter YouTube Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full"
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Analyzing...' : 'Generate SEO Blog Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


import { NextResponse } from 'next/server'
import { getSubtitles } from 'youtube-captions-scraper'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get('videoId')

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
  }

  try {
    const captions = await getSubtitles({ videoID: videoId })
    const transcript = captions.map(caption => caption.text).join(' ')

    return NextResponse.json({ transcript })
  } catch (error) {
    console.error('Error fetching YouTube transcript:', error)
    return NextResponse.json({ error: 'Failed to fetch video transcript' }, { status: 500 })
  }
}


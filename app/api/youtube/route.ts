import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getSubtitles } from 'youtube-captions-scraper'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const videoId = extractVideoId(url)
    if (!videoId) {
      throw new Error('Invalid YouTube URL')
    }

    const [videoData, transcript] = await Promise.all([
      fetchVideoData(videoId),
      fetchVideoTranscript(videoId)
    ])

    return NextResponse.json({
      title: videoData?.title || '',
      description: videoData?.description || '',
      transcript: transcript
    })
  } catch (error) {
    console.error('Error fetching YouTube data:', error)
    return NextResponse.json({ error: 'Failed to fetch video data. Please check your YouTube API key and quota.' }, { status: 500 })
  }
}

function extractVideoId(url: string) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function fetchVideoData(videoId: string) {
  try {
    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId]
    })

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('No video data found')
    }

    return response.data.items[0].snippet
  } catch (error) {
    console.error('Error fetching video data:', error)
    throw new Error('Failed to fetch video data from YouTube API')
  }
}

async function fetchVideoTranscript(videoId: string) {
  try {
    const captions = await getSubtitles({ videoID: videoId, lang: 'en' })
    return captions.map(caption => caption.text).join(' ')
  } catch (error) {
    console.error('Error fetching video transcript:', error)
    throw new Error('Failed to fetch video transcript')
  }
}


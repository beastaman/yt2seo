'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Share2, TrendingUp, DollarSign, BarChart2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface ArticleGenerationProps {
  data: {
    title: string
    content: string
    keywords: string[]
    seoAnalysis: {
      score: number
      difficulty: string
      volume: string
      cpc: string
      competition: number
      trends: any[]
      relatedKeywords: string[]
    }
    images: { url: string; alt: string }[]
    videoId: string
  }
}

export function ArticleGeneration({ data }: ArticleGenerationProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.content)
    setCopied(true)
    toast.success('Content copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4">
      <div className="flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* YouTube Video Embed */}
      <Card className="overflow-hidden">
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${data.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-0"
          />
        </div>
      </Card>

      {/* Article Content */}
      <Card className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {data.keywords.map((keyword, i) => (
              <Badge key={i} variant="secondary">{keyword}</Badge>
            ))}
          </div>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </motion.div>
      </Card>

      {/* SEO Analysis */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6">SEO Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Search Volume
            </div>
            <div className="text-2xl font-bold">{data.seoAnalysis.volume}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              CPC
            </div>
            <div className="text-2xl font-bold">{data.seoAnalysis.cpc}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <BarChart2 className="w-4 h-4 mr-2" />
              Competition
            </div>
            <div className="text-2xl font-bold">
              {(data.seoAnalysis.competition * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Related Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {data.seoAnalysis.relatedKeywords.map((keyword, i) => (
              <Badge key={i} variant="outline">{keyword}</Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Generated Images */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6">Generated Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">{image.alt}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Bottom Video */}
      <Card className="overflow-hidden">
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${data.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="border-0"
          />
        </div>
      </Card>
    </div>
  )
}


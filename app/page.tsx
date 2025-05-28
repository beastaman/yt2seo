import Image from 'next/image'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen max-w-2xl">
        <div className="text-center space-y-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight">
            Yt2Seo AI
          </h1>
          
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Transform YouTube videos into SEO-optimized articles, ready to publish on your blog or website.
          </p>

          <Card className="p-6 shadow-lg">
            <form className="space-y-4" action="/generate">
              <Input 
                type="text" 
                placeholder="Enter YouTube video URL" 
                className="text-lg p-6"
                name="url"
              />
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 text-lg font-medium">
                Generate Article
              </Button>
            </form>
          </Card>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Or, check out our{' '}
              <Link href="/recent" className="text-purple-600 hover:text-purple-700 font-medium">
                most recent articles →
              </Link>
            </p>

            <div className="flex justify-center">
              <Link 
                href="https://chrome.google.com/webstore" 
                target="_blank"
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                <Image 
                  src="/Images/icons8-chrome.svg" 
                  alt="Chrome" 
                  width={16} 
                  height={16} 
                />
                Also available as Chrome extension →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


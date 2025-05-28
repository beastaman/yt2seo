import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function ImageAdder() {
  const [images, setImages] = useState<string[]>([])

  const addImage = () => {
    // In a real application, this would call an AI image generation service
    const newImage = `/placeholder.svg?height=300&width=400&text=AI Generated Image ${images.length + 1}`
    setImages([...images, newImage])
  }

  return (
    <div className="space-y-4">
      <Button onClick={addImage}>Add AI-Generated Image</Button>
      <div className="grid grid-cols-2 gap-4">
        {images.map((src, index) => (
          <Image key={index} src={src} alt={`AI Generated Image ${index + 1}`} width={400} height={300} />
        ))}
      </div>
    </div>
  )
}


import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface BlogPostDisplayProps {
  blogPost: {
    title: string;
    metaDescription: string;
    content: string;
    imageDescriptions: string[];
    seoMetrics: {
      trafficPotential: string;
      keywordDifficulty: string;
      estimatedCTR: string;
      estimatedRPM: string;
    };
    topKeywords: string[];
    internalLinkingSuggestions: string[];
    externalResources: { title: string; url: string }[];
    faqs: { question: string; answer: string }[];
    cta: string;
  };
  images: { url: string; alt: string }[];
}

export function BlogPostDisplay({ blogPost, images }: BlogPostDisplayProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{blogPost.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{blogPost.metaDescription}</p>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <Card key={index}>
            <CardContent className="p-2">
              <Image src={image.url} alt={image.alt} width={600} height={400} className="rounded-lg object-cover w-full h-48" />
              <p className="mt-2 text-sm text-muted-foreground">{image.alt}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="font-medium">Traffic Potential</dt>
              <dd>
                <Badge variant={blogPost.seoMetrics.trafficPotential === 'high' ? 'default' : 'secondary'}>
                  {blogPost.seoMetrics.trafficPotential}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="font-medium">Keyword Difficulty</dt>
              <dd>
                <Badge variant={blogPost.seoMetrics.keywordDifficulty === 'easy' ? 'default' : 'secondary'}>
                  {blogPost.seoMetrics.keywordDifficulty}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="font-medium">Estimated CTR</dt>
              <dd>{blogPost.seoMetrics.estimatedCTR}</dd>
            </div>
            <div>
              <dt className="font-medium">Estimated RPM</dt>
              <dd>${blogPost.seoMetrics.estimatedRPM}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {blogPost.topKeywords.map((keyword, index) => (
              <Badge key={index} variant="outline">{keyword}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="internal-linking">
          <AccordionTrigger>Internal Linking Suggestions</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5">
              {blogPost.internalLinkingSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="external-resources">
          <AccordionTrigger>External Resources</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5">
              {blogPost.externalResources.map((resource, index) => (
                <li key={index}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faqs">
          <AccordionTrigger>Frequently Asked Questions</AccordionTrigger>
          <AccordionContent>
            {blogPost.faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Call to Action</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{blogPost.cta}</p>
        </CardContent>
      </Card>
    </div>
  )
}


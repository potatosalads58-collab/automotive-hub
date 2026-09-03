import { NextResponse } from 'next/server'

type NewsItem = {
  category: 'News' | 'Reviews'
  title: string
  link: string
  img: string
  date: string
}

function decodeEntities(str: string) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function parseRss(xml: string, category: 'News' | 'Reviews'): NewsItem[] {
  const items: NewsItem[] = []
  const blocks = xml.split('<item>').slice(1)

  for (const block of blocks) {
    const title = block.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/s)
    const link = block.match(/<link>(.*?)<\/link>/s)
    const date = block.match(/<pubDate>(.*?)<\/pubDate>/s)
    const media =
      block.match(/<media:content[^>]*url="([^"]+)"/) ||
      block.match(/<enclosure[^>]*url="([^"]+)"/) ||
      block.match(/<img[^>]*src="([^"]+)"/)

    if (title && link) {
      items.push({
        category,
        title: decodeEntities(title[1].trim()),
        link: link[1].trim(),
        img: media ? media[1] : '',
        date: date
          ? new Date(date[1]).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
          : '',
      })
    }
  }
  return items
}

export async function GET() {
  try {
    const [newsRes, reviewsRes] = await Promise.all([
      fetch('https://www.motor1.com/rss/news/all/', { next: { revalidate: 1800 } }),
      fetch('https://www.motor1.com/rss/reviews/all/', { next: { revalidate: 1800 } }),
    ])
    const [newsXml, reviewsXml] = await Promise.all([newsRes.text(), reviewsRes.text()])

    const news = parseRss(newsXml, 'News').slice(0, 12)
    const reviews = parseRss(reviewsXml, 'Reviews').slice(0, 12)

    return NextResponse.json([...news, ...reviews])
  } catch {
    return NextResponse.json([])
  }
}
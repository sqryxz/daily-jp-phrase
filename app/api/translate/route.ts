import { NextResponse } from 'next/server'
import { getCachedValue, setCachedValue, generateCacheKey, shouldUseCache } from '@/app/utils/redis'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

if (!DEEPSEEK_API_KEY) {
  throw new Error('DEEPSEEK_API_KEY environment variable is not set')
}

async function callDeepseek(prompt: string) {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a Japanese language expert. Provide accurate translations and explanations. Always respond in a concise manner without any additional commentary.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent translations
        stream: false
      }),
    })

    if (!response.ok) {
      throw new Error('Translation API request failed')
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('DeepSeek API error:', error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const { text, type } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    let result
    if (type === 'translation') {
      // Check cache first
      if (shouldUseCache(text)) {
        const cacheKey = generateCacheKey('translation', text)
        const cachedTranslation = await getCachedValue(cacheKey)
        
        if (cachedTranslation) {
          return NextResponse.json({ translation: cachedTranslation })
        }
      }

      const prompt = `Translate this Japanese text to natural English. Respond with only the English translation, no explanations:
${text}`

      const translation = await callDeepseek(prompt)
      result = { translation }

      // Cache the result
      if (shouldUseCache(text)) {
        const cacheKey = generateCacheKey('translation', text)
        await setCachedValue(cacheKey, translation)
      }
    } else if (type === 'reading') {
      // Check cache first
      if (shouldUseCache(text)) {
        const cacheKey = generateCacheKey('reading', text)
        const cachedReading = await getCachedValue(cacheKey)
        
        if (cachedReading) {
          const [reading, meaning] = JSON.parse(cachedReading)
          return NextResponse.json({ reading, meaning })
        }
      }

      const prompt = `For the Japanese word "${text}", provide its reading in hiragana and English meaning.
Format exactly like this (replace brackets with actual content):
Reading: [hiragana]
Meaning: [brief english meaning]`

      const response = await callDeepseek(prompt)
      const [readingLine, meaningLine] = response.split('\n')
      
      result = {
        reading: readingLine.replace('Reading: ', '').trim(),
        meaning: meaningLine.replace('Meaning: ', '').trim()
      }

      // Cache the result
      if (shouldUseCache(text)) {
        const cacheKey = generateCacheKey('reading', text)
        await setCachedValue(cacheKey, JSON.stringify([result.reading, result.meaning]))
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid translation type' },
        { status: 400 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
} 
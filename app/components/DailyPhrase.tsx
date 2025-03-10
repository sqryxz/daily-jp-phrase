'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { translateJapaneseToEnglish, getReadingAndMeaning } from '../utils/translate'

interface VocabularyItem {
  word: string
  reading: string
  meaning: string
}

interface Phrase {
  japanese: string
  english: string
  vocabulary: VocabularyItem[]
  grammarNote?: string
  date: string
  source?: string
  needsTranslation?: boolean
}

function GrammarNotes({ notes }: { notes: string }) {
  if (!notes) return null;

  const sections = notes.split('\n\n');

  return (
    <div className="mt-6 bg-blue-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Grammar Notes</h3>
      <div className="space-y-4">
        {sections.map((section, index) => {
          const [title, ...content] = section.split('\n');
          return (
            <div key={index} className="border-b border-blue-100 pb-3 last:border-0">
              <h4 className="font-medium text-blue-800">{title}</h4>
              {content.map((line, i) => (
                <p key={i} className="text-blue-600 mt-1">
                  {line}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DailyPhrase() {
  const [phrase, setPhrase] = useState<Phrase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [translating, setTranslating] = useState(false)

  // Function to translate the entire phrase
  const translatePhrase = async (phrase: Phrase) => {
    setTranslating(true)
    try {
      // Translate main text
      const translatedText = await translateJapaneseToEnglish(phrase.japanese)
      
      // Translate vocabulary
      const translatedVocabulary = await Promise.all(
        phrase.vocabulary.map(async (item) => {
          const { reading, meaning } = await getReadingAndMeaning(item.word)
          return {
            ...item,
            reading,
            meaning,
          }
        })
      )

      // Update phrase with translations
      setPhrase({
        ...phrase,
        english: translatedText,
        vocabulary: translatedVocabulary,
        needsTranslation: false,
      })
    } catch (error) {
      console.error('Translation error:', error)
      setError('Failed to translate. Please try again later.')
    } finally {
      setTranslating(false)
    }
  }

  useEffect(() => {
    const fetchPhrase = async () => {
      try {
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const data = await response.json()
        setPhrase(data)
        setError(null)

        // If translation is needed, trigger it automatically
        if (data.needsTranslation) {
          translatePhrase(data)
        }
      } catch (error) {
        console.error('Error fetching phrase:', error)
        setError('Failed to load today\'s phrase. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPhrase()
  }, [])

  if (loading) {
    return <div className="text-center">Loading today's phrase...</div>
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>
  }

  if (!phrase) {
    return <div className="text-center">No phrase available</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-sm text-gray-500 mb-4">
        {format(new Date(phrase.date), 'MMMM d, yyyy')}
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{phrase.japanese}</h2>
        <p className="text-gray-600">
          {translating ? 'Translating...' : phrase.english}
        </p>
        {phrase.source && (
          <a 
            href={phrase.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block"
          >
            Read full article →
          </a>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Vocabulary</h3>
        <div className="space-y-2">
          {phrase.vocabulary.map((item, index) => (
            <div key={index} className="border-b pb-2">
              <div className="font-medium">
                {item.word} 
                {item.reading && `(${item.reading})`}
              </div>
              <div className="text-gray-600">
                {translating ? 'Translating...' : item.meaning}
              </div>
            </div>
          ))}
        </div>
      </div>

      {phrase.grammarNote && <GrammarNotes notes={phrase.grammarNote} />}

      {phrase.needsTranslation && !translating && (
        <button
          onClick={() => translatePhrase(phrase)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Translate Again
        </button>
      )}
    </div>
  )
} 
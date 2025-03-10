import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { detectGrammarPatterns, generateGrammarNote } from '../utils/grammarPatterns';

const parser = new Parser();
const RSS_URL = 'http://rss.asahi.com/rss/asahi/newsheadlines.rdf';

// Simple function to extract kanji words
function extractKanjiWords(text: string): string[] {
  // Match sequences of kanji characters
  const kanjiPattern = /[\u4e00-\u9faf]+/g;
  const matches = text.match(kanjiPattern) || [];
  return [...new Set(matches)]; // Remove duplicates
}

export async function GET() {
  try {
    // Fetch and parse RSS feed
    const feed = await parser.parseURL(RSS_URL);
    
    // Get the first item from the feed
    const newsItem = feed.items[0];
    
    if (!newsItem) {
      throw new Error('No news items found');
    }

    // Extract Japanese text
    const japanese = newsItem.title || '';

    // Extract kanji words for vocabulary
    const kanjiWords = extractKanjiWords(japanese);

    // For now, we'll use placeholder translations
    // In a production app, you'd want to use a proper translation service or dictionary
    const vocabulary = kanjiWords.slice(0, 3).map(word => ({
      word,
      reading: '', // You could integrate with a furigana service here
      meaning: '(Translation needed)', // Placeholder for translation
    }));

    // Detect grammar patterns
    const grammarPatterns = detectGrammarPatterns(japanese);
    const grammarNote = generateGrammarNote(grammarPatterns);

    return NextResponse.json({
      japanese,
      english: '(Translation needed)', // Placeholder for translation
      vocabulary,
      grammarNote,
      date: new Date().toISOString(),
      source: newsItem.link,
      needsTranslation: true, // Flag to indicate translation is needed
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 
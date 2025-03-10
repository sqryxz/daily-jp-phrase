export async function translateJapaneseToEnglish(text: string): Promise<string> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        type: 'translation',
      }),
    })

    if (!response.ok) {
      throw new Error('Translation failed')
    }

    const data = await response.json()
    return data.translation
  } catch (error) {
    console.error('Translation error:', error)
    throw error
  }
}

export async function getReadingAndMeaning(word: string): Promise<{ reading: string; meaning: string }> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: word,
        type: 'reading',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get reading and meaning')
    }

    const data = await response.json()
    return {
      reading: data.reading,
      meaning: data.meaning,
    }
  } catch (error) {
    console.error('Reading/meaning error:', error)
    throw error
  }
} 
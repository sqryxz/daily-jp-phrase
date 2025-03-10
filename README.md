# Daily Japanese Phrase Aggregator

A modern web application that helps you learn Japanese through real news headlines. The app fetches daily news from Asahi Shimbun (朝日新聞), provides translations, vocabulary explanations, and grammar notes.

![Daily Japanese Phrase Aggregator](https://raw.githubusercontent.com/sqryxz/daily-jp-phrase/main/public/screenshot.png)

## Features

- 🗞️ **Real Japanese News**: Daily headlines from Asahi Shimbun RSS feed
- 🔄 **AI-Powered Translation**: Accurate translations using DeepSeek's language model
- 📚 **Vocabulary Learning**: Key words with readings and meanings
- 📝 **Grammar Analysis**: Automatic detection and explanation of grammar patterns
- 💾 **Smart Caching**: Efficient caching system to reduce API calls
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Translation**: DeepSeek API
- **Caching**: In-memory cache (Redis ready)
- **Data Source**: Asahi Shimbun RSS Feed

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn
- DeepSeek API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sqryxz/daily-jp-phrase.git
cd daily-jp-phrase
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
DEEPSEEK_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Grammar Patterns

The application automatically detects and explains common Japanese grammar patterns, including:

- て/で form + いる (ongoing actions)
- になる (becoming/changing state)
- ようになる (acquired ability)
- ことができる (potential)
- てみる (trying)
- なければならない (obligation)
- かもしれない (possibility)
- と思う (thoughts/opinions)
- たいと思う (desires)
- てしまう (completion/regret)

## Caching System

The application includes a smart caching system that:

- Caches translations for 24 hours
- Skips caching for very short texts (≤2 characters)
- Skips caching for very long texts (>1000 characters)
- Supports both in-memory and Redis caching

## API Endpoints

### GET /api/news
Fetches the latest news headline from Asahi Shimbun.

Response:
```json
{
  "japanese": "...",
  "english": "...",
  "vocabulary": [
    {
      "word": "...",
      "reading": "...",
      "meaning": "..."
    }
  ],
  "grammarNote": "...",
  "date": "2025-03-08T...",
  "source": "http://..."
}
```

### POST /api/translate
Translates Japanese text and provides readings/meanings.

Request:
```json
{
  "text": "日本語",
  "type": "translation" | "reading"
}
```

Response (translation):
```json
{
  "translation": "Japanese language"
}
```

Response (reading):
```json
{
  "reading": "にほんご",
  "meaning": "Japanese language"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Redis integration for production caching
- [ ] More sophisticated grammar pattern detection
- [ ] Furigana support for Japanese text
- [ ] User accounts and progress tracking
- [ ] Spaced repetition for vocabulary learning
- [ ] Multiple news sources integration
- [ ] Mobile app version

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Asahi Shimbun](http://www.asahi.com/) for providing the RSS feed
- [DeepSeek](https://api-docs.deepseek.com/) for translation services
- Next.js and React teams for the amazing frameworks
- All contributors and users of this project 
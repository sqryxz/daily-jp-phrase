import { Suspense } from 'react'
import DailyPhrase from './components/DailyPhrase'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">Daily Japanese Phrase</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <DailyPhrase />
        </Suspense>
      </div>
    </main>
  )
} 
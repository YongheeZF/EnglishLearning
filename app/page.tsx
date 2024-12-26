'use client'

import { useState } from 'react'
import PronunciationPractice from '../components/PronunciationPractice'
import PageSelection from '../components/PageSelection'
import { BackgroundEffects } from '../components/BackgroundEffects'

export default function Home() {
  const [currentPage, setCurrentPage] = useState<string | null>(null)

  const handlePageSelection = (page: string) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'pronunciation':
        return <PronunciationPractice />
      case 'vocabulary':
        return <div>หน้าเรียนรู้คำศัพท์ (ยังไม่ได้สร้าง)</div>
      case 'grammar':
        return <div>หน้าฝึกไวยากรณ์ (ยังไม่ได้สร้าง)</div>
      default:
        return <PageSelection onSelectPage={handlePageSelection} />
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 relative">
      <BackgroundEffects />
      <h1 className="text-4xl font-bold mb-8 glow-text relative z-10">เว็บไซต์ฝึกภาษาอังกฤษ</h1>
      <div className="relative z-10">
        {renderPage()}
        {currentPage && (
          <button
            className="mt-8 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            onClick={() => setCurrentPage(null)}
          >
            กลับหน้าหลัก
          </button>
        )}
      </div>
    </main>
  )
}


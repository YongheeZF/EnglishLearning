'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TextToSpeech() {
  const [text, setText] = useState('')

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    } else {
      alert('ขออภัย เบราว์เซอร์ของคุณไม่รองรับการอ่านออกเสียง')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">ระบบอ่านออกเสียงคำ</h1>
      <textarea
        className="w-full max-w-lg p-2 mb-4 border rounded"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="พิมพ์ข้อความที่ต้องการให้อ่านออกเสียง"
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleSpeak}
      >
        อ่านออกเสียง
      </button>
      <Link href="/" className="mt-8 text-blue-500 hover:underline">
        กลับไปหน้าหลัก
      </Link>
    </main>
  )
}


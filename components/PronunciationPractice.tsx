'use client'

import { useState, useEffect, useRef } from 'react'
import { getPhonics } from '../utils/sentences'
import AudioPlayer from './AudioPlayer'

const PronunciationPractice = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phonics, setPhonics] = useState<Array<{
    letter: string,
    thaiPhonetic: string,
    keyPoints: string[]
  }>>([])
  const [isRecording, setIsRecording] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [attempts, setAttempts] = useState(0)
  
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const allPhonics = getPhonics()
    setPhonics(allPhonics)
  }, [])

  const currentPhonics = phonics[currentIndex] || {
    letter: '',
    thaiPhonetic: '',
    keyPoints: []
  }

  const startRecording = () => {
    setIsRecording(true)
    setScore(null)
    setFeedback('')

    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'th-TH' // Set to Thai to better recognize Thai-accented English

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim()
        const confidence = event.results[0][0].confidence
        
        // Improved matching logic
        const score = calculateScore(transcript, currentPhonics.thaiPhonetic)
        let feedback = ''

        if (score === 100) {
          feedback = 'ยอดเยี่ยม! คุณออกเสียงได้ถูกต้อง'
        } else if (score >= 70) {
          feedback = 'ดีมาก! เกือบถูกต้องแล้ว ลองฟังและออกเสียงอีกครั้ง'
        } else if (score >= 40) {
          feedback = 'พยายามอีกนิด ลองฟังเสียงตัวอย่างและออกเสียงตาม'
        } else {
          feedback = 'ลองใหม่อีกครั้ง ฟังเสียงตัวอย่างและพยายามออกเสียงให้เหมือน'
        }
        
        setScore(score)
        setFeedback(feedback)
        setAttempts(prev => prev + 1)

        if (score >= 70 || attempts >= 2) {
          setTimeout(() => {
            if (currentIndex < phonics.length - 1) {
              setCurrentIndex(prev => prev + 1)
              setAttempts(0)
            }
          }, 1500)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }

      recognitionRef.current.start()
    } else {
      alert('Speech recognition is not supported in your browser.')
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
  }

  const handleSkip = () => {
    if (currentIndex < phonics.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setScore(null)
      setFeedback('')
      setAttempts(0)
    }
  }

  const calculateScore = (spoken: string, expected: string): number => {
    const spokenParts = spoken.split('')
    const expectedParts = expected.split('')
    let matchCount = 0

    for (let i = 0; i < Math.min(spokenParts.length, expectedParts.length); i++) {
      if (spokenParts[i] === expectedParts[i]) {
        matchCount++
      }
    }

    const accuracy = matchCount / expectedParts.length
    return Math.round(accuracy * 100)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border rounded-lg shadow-lg bg-black/50 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">ฝึกออกเสียงตัวอักษร:</h2>
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="text-8xl font-bold mb-4">{currentPhonics.letter}</div>
          <div className="text-4xl text-purple-300 mb-6">{currentPhonics.thaiPhonetic}</div>
          <div className="flex gap-4 mb-4">
            <AudioPlayer 
              src={`/audio/${currentPhonics.letter.toLowerCase()}.mp3`} 
              label="ฟังเสียงตัวอย่าง" 
            />
            <button
              onClick={handleSkip}
              disabled={isRecording}
              className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 disabled:opacity-50"
            >
              ข้ามตัวนี้
            </button>
          </div>
        </div>
        <div className="mb-6 text-sm text-purple-200">
          <p className="font-medium mb-2">จุดสำคัญในการออกเสียง:</p>
          {currentPhonics.keyPoints.map((point, index) => (
            <p key={index} className="mb-1">• {point}</p>
          ))}
        </div>
        <div className="flex justify-center mb-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
            >
              เริ่มอัดเสียง
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-lg"
            >
              หยุดอัดเสียง
            </button>
          )}
        </div>
        {score !== null && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">คะแนนของคุณ: {score}%</h3>
            <p className="text-lg mb-4 text-purple-200">{feedback}</p>
            {score >= 70 ? (
              <p className="text-green-400">ผ่านแล้ว! กำลังไปตัวถัดไป...</p>
            ) : (
              <p className="text-yellow-400">ลองใหม่อีกครั้ง</p>
            )}
          </div>
        )}
        <div className="mt-8 text-center text-sm text-purple-300">
          ตัวที่ {currentIndex + 1} จาก {phonics.length}
        </div>
      </div>
    </div>
  )
}

export default PronunciationPractice


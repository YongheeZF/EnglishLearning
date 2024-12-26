'use client'

import { useState, useEffect, useRef } from 'react'
import AudioButton from './AudioButton'
import { getWords } from '../utils/sentences'
import { compareWords } from '../utils/compareWords'

interface Word {
  word: string;
  keyPoints: string[];
}

const PronunciationPractice = () => {
  const [currentWord, setCurrentWord] = useState<string>('')
  const [currentKeyPoints, setCurrentKeyPoints] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string>('')
  const [lowScoreStreak, setLowScoreStreak] = useState<number>(0)
  const [words, setWords] = useState<Word[]>([])
  
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const allWords = getWords()
    if (allWords.length > 0) {
      setWords(allWords)
      const randomIndex = Math.floor(Math.random() * allWords.length)
      setCurrentWord(allWords[randomIndex].word)
      setCurrentKeyPoints(allWords[randomIndex].keyPoints)
    }
  }, [])

  const setRandomWord = (wordList: Word[]) => {
    if (wordList.length > 0) {
      const randomIndex = Math.floor(Math.random() * wordList.length)
      setCurrentWord(wordList[randomIndex].word)
      setCurrentKeyPoints(wordList[randomIndex].keyPoints)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setScore(null)
    setFeedback('')

    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim()
        const confidence = event.results[0][0].confidence
        const { score, feedback } = compareWords(currentWord, transcript)
        setScore(score)
        setFeedback(feedback)

        if (score < 75) {
          setLowScoreStreak(prev => prev + 1)
        } else {
          setLowScoreStreak(0)
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

  const handleNextWord = () => {
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length)
      setCurrentWord(words[randomIndex].word)
      setCurrentKeyPoints(words[randomIndex].keyPoints)
    }
    setScore(null)
    setFeedback('')
  }

  const showNextButton = score !== null && (score >= 75 || lowScoreStreak >= 5)

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border rounded-lg shadow-lg bg-black/50 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">คำที่ต้องอ่าน:</h2>
        <div className="flex flex-wrap justify-center items-center mb-4 gap-2">
          <p className="text-6xl font-bold mr-4">{currentWord}</p>
          <AudioButton word={currentWord} disabled={isRecording} />
          <button
            onClick={handleNextWord}
            disabled={isRecording}
            className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ข้ามคำนี้
          </button>
        </div>
        <div className="mb-6 text-sm text-gray-300">
          <p className="font-medium mb-1">จุดสำคัญในการออกเสียง:</p>
          {currentKeyPoints.map((point, index) => (
            <p key={index}>• {point}</p>
          ))}
        </div>
        <div className="flex justify-center mb-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              เริ่มอัดเสียง
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              หยุดอัดเสียง
            </button>
          )}
        </div>
        {score !== null && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">คะแนนของคุณ: {score}%</h3>
            <p className="text-lg mb-4 whitespace-pre-line">{feedback}</p>
            {showNextButton && (
              <button
                onClick={handleNextWord}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ลองคำใหม่
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PronunciationPractice
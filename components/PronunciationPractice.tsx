'use client'

import { useState, useEffect, useRef } from 'react'
import AudioButton from '../components/AudioButton'

const PronunciationPractice = () => {
  const getWords = () => {
    return [
      { 
        word: 'hello', 
        keyPoints: ['h sound at start', 'stress on lo', 'end with oʊ diphthong']
      },
      { 
        word: 'shower', 
        keyPoints: ['sh sound at start', 'stress on first syllable', 'er ending']
      },
      { 
        word: 'cheese', 
        keyPoints: ['ch sound at start', 'long ee sound', 'z sound at end']
      },
      { 
        word: 'sun', 
        keyPoints: ['s sound at start', 'short u sound', 'n sound at end']
      },
      { 
        word: 'cat', 
        keyPoints: ['k sound at start', 'short a sound', 't sound at end']
      },
      { 
        word: 'zebra', 
        keyPoints: ['z sound at start', 'stress on first syllable', 'schwa sound at end']
      },
      { 
        word: 'table', 
        keyPoints: ['t sound at start', 'long a sound', 'l sound at end']
      },
      { 
        word: 'think', 
        keyPoints: ['th sound at start', 'short i sound', 'ng sound at end']
      }
    ]
  }

  const compareWords = (target: string, spoken: string, confidence: number) => {
    if (!target || !spoken) {
      return { score: 0, feedback: 'ไม่สามารถได้ยินเสียงพูด กรุณาลองใหม่อีกครั้ง' }
    }

    const targetLower = target.toLowerCase()
    const spokenLower = spoken.toLowerCase()

    // คำนวณคะแนนความถูกต้องของคำ (40%)
    const wordAccuracyScore = calculateWordAccuracy(targetLower, spokenLower)

    // คะแนน confidence จาก API (30%)
    // ปรับ confidence score ให้เข้มงวดขึ้น
    const confidenceScore = Math.round(confidence * 70) // ลดคะแนนลง 30% จาก confidence ที่ได้

    // คะแนนสำเนียง (30%)
    const pronunciationScore = calculatePronunciationScore(targetLower, spokenLower, confidence)

    // คำนวณคะแนนรวมโดยให้น้ำหนักแต่ละส่วน
    const totalScore = Math.round(
      (wordAccuracyScore * 0.4) + 
      (confidenceScore * 0.3) + 
      (pronunciationScore * 0.3)
    )

    // สร้างคำแนะนำที่เฉพาะเจาะจง
    const feedback = generateDetailedFeedback(
      targetLower, 
      spokenLower, 
      wordAccuracyScore, 
      confidenceScore,
      pronunciationScore
    )

    return { score: totalScore, feedback }
  }

  const calculateWordAccuracy = (target: string, spoken: string) => {
    const distance = levenshteinDistance(target, spoken)
    const maxLength = Math.max(target.length, spoken.length)
    return Math.max(0, Math.round((1 - distance / maxLength) * 100))
  }

  const calculatePronunciationScore = (target: string, spoken: string, confidence: number) => {
    let score = 100

    // หักคะแนนมากขึ้นสำหรับความแตกต่างของความยาว
    const lengthDiff = Math.abs(target.length - spoken.length)
    score -= lengthDiff * 10

    // ตรวจสอบการลงท้ายของคำอย่างเข้มงวด
    if (target.slice(-2) !== spoken.slice(-2)) {
      score -= 30
    }

    // ตรวจสอบพยัญชนะต้นอย่างเข้มงวด
    if (target[0] !== spoken[0]) {
      score -= 35
    }

    // หักคะแนนตาม confidence
    if (confidence < 0.8) {
      score -= Math.round((0.8 - confidence) * 100)
    }

    // ตรวจสอบความเร็วในการพูด (ถ้ามีช่องว่างมากเกินไประหว่างคำ)
    const targetSpaces = (target.match(/ /g) || []).length
    const spokenSpaces = (spoken.match(/ /g) || []).length
    if (targetSpaces !== spokenSpaces) {
      score -= 20
    }

    return Math.max(0, score)
  }

  const generateDetailedFeedback = (
    target: string, 
    spoken: string, 
    wordScore: number,
    confidenceScore: number,
    pronunciationScore: number
  ) => {
    let feedback = []

    if (wordScore < 40) {
      feedback.push('🔴 คำที่พูดไม่ตรงกับคำที่กำหนด')
    }

    if (confidenceScore < 70) {
      feedback.push('🔸 สำเนียงยังไม่เป็นธรรมชาติพอ ควรฝึกออกเสียงให้ชัดเจนและเป็นธรรมชาติมากขึ้น')
    }

    if (pronunciationScore < 60) {
      if (target[0] !== spoken[0]) {
        feedback.push('🔸 การออกเสียงพยัญชนะต้นไม่ชัดเจน')
      }
      if (target.slice(-2) !== spoken.slice(-2)) {
        feedback.push('🔸 การออกเสียงท้ายคำไม่ชัดเจน')
      }
      feedback.push('💡 ลองฟังการออกเสียงจาก native speaker และฝึกตาม')
    }

    if (Math.abs(target.length - spoken.length) > 2) {
      feedback.push('🔸 ความยาวของคำที่พูดไม่เหมาะสม พูดเร็วหรือช้าเกินไป')
    }

    if (feedback.length === 0) {
      if (wordScore + confidenceScore + pronunciationScore > 250) {
        return '🌟 ยอดเยี่ยม! สำเนียงและการออกเสียงใกล้เคียง native speaker มาก'
      }
      return '👍 ดี! แต่ยังมีที่ปรับปรุงได้อีกเล็กน้อย ลองฝึกสำเนียงให้เป็นธรรมชาติมากขึ้น'
    }

    return feedback.join('\n')
  }

  const levenshteinDistance = (str1: string, str2: string) => {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null)
    )

    for (let i = 0; i <= str1.length; i++) {
      track[0][i] = i
    }
    for (let j = 0; j <= str2.length; j++) {
      track[j][0] = j
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        )
      }
    }

    return track[str2.length][str1.length]
  }

  const [currentWord, setCurrentWord] = useState<string>('')
  const [currentKeyPoints, setCurrentKeyPoints] = useState<string[]>([])
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string>('')
  const [lowScoreStreak, setLowScoreStreak] = useState<number>(0)
  const [words, setWords] = useState<Array<{word: string, keyPoints: string[]}>>([])
  
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const allWords = getWords()
    setWords(allWords)
    setRandomWord(allWords)
  }, [])

  const setRandomWord = (wordList: Array<{word: string, keyPoints: string[]}>) => {
    const randomIndex = Math.floor(Math.random() * wordList.length)
    setCurrentWord(wordList[randomIndex].word)
    setCurrentKeyPoints(wordList[randomIndex].keyPoints)
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
        const { score, feedback } = compareWords(currentWord, transcript, confidence)
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
    setRandomWord(words)
    setScore(null)
    setFeedback('')
  }

  const showNextButton = score !== null && (score >= 75 || lowScoreStreak >= 5)

  return (
    <div className="w-full max-w-2xl mx-auto p-6 border rounded-lg shadow-lg bg-white">
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
        <div className="mb-6 text-sm text-gray-500">
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


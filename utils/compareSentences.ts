export const compareSentences = (original: string, spoken: string) => {
  const wordsOriginal = original.toLowerCase().split(' ')
  const wordsSpoken = spoken.toLowerCase().split(' ')
  
  let correctWords = 0
  wordsSpoken.forEach((word, index) => {
    if (word === wordsOriginal[index]) {
      correctWords++
    }
  })

  const score = Math.round((correctWords / wordsOriginal.length) * 100)

  let feedback = ''
  if (score === 100) {
    feedback = 'ยอดเยี่ยม! คุณออกเสียงได้ถูกต้องทั้งหมด'
  } else if (score >= 80) {
    feedback = 'ดีมาก! มีเพียงไม่กี่คำที่ต้องปรับปรุง'
  } else if (score >= 60) {
    feedback = 'ดี! แต่ยังมีหลายคำที่ต้องฝึกฝนเพิ่มเติม'
  } else {
    feedback = 'พยายามต่อไป! ลองฝึกทีละคำและฟังการออกเสียงที่ถูกต้อง'
  }

  return { score, feedback }
}


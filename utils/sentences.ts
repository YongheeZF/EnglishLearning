interface Word {
  word: string;
  keyPoints: string[];
}

const wordKeyPoints: Record<string, string[]> = {
  fish: ["เน้นเสียง 'f' ต้นคำ", "ลงท้ายด้วยเสียง 'sh' แบบนุ่มนวล"],
  shell: ["เริ่มต้นด้วยเสียง 'sh' แบบนุ่มนวล", "เน้นเสียง 'l' ท้ายคำ"],
}

export const getWords = (): Word[] => {
  const wordList = [
    "fish", "shell", "house", "shoe", "ship", "sheep", "fox", "five", 
    "half", "hoof", "safe", "surf", "soft", "shaft", "shift", "shave", 
    "shelf", "sheriff", "shuffle", "sphere", "sphinx", "splash", "staff", 
    "stuff", "stiff", "thief", "thrift", "thrush", "thrust", "whiff"
  ]
  
  return wordList.map(word => ({
    word,
    keyPoints: wordKeyPoints[word] || ["ฝึกออกเสียงตามตัวอย่าง"]
  }))
}
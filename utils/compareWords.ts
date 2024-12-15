// Levenshtein distance function to measure similarity between two strings
function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}

// Function to calculate similarity percentage
function calculateSimilarity(original: string, spoken: string): number {
  const distance = levenshteinDistance(original.toLowerCase(), spoken.toLowerCase());
  const maxLength = Math.max(original.length, spoken.length);
  const similarity = (1 - distance / maxLength) * 100;
  return Math.round(similarity);
}

export const compareWords = (original: string, spoken: string) => {
  const score = calculateSimilarity(original, spoken);

  let feedback = '';
  if (score === 100) {
    feedback = 'ยอดเยี่ยม! คุณออกเสียงได้ถูกต้องสมบูรณ์';
  } else if (score >= 80) {
    feedback = 'ดีมาก! คุณออกเสียงได้ใกล้เคียงมาก ลองฝึกต่อไปนะ';
  } else if (score >= 60) {
    feedback = 'ดี! แต่ยังมีบางส่วนที่ต้องปรับปรุง ลองฟังและออกเสียงอีกครั้ง';
  } else {
    feedback = 'ยังไม่ถูกต้องนัก ลองฟังการออกเสียงที่ถูกต้องและพยายามอีกครั้ง';
  }

  return { score, feedback };
}


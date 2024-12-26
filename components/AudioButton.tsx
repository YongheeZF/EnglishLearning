import { useState, useEffect } from 'react'

interface AudioButtonProps {
  word: string;
  disabled?: boolean;
}

const AudioButton: React.FC<AudioButtonProps> = ({ word, disabled = false }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAudio(new Audio(`https://api.dictionaryapi.dev/media/pronunciations/en/${word}-us.mp3`))
    setError(null) 
  }, [word])

  const playAudio = () => {
    setError(null) 
    if (audio) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setError('ไม่สามารถเล่นเสียงได้ สู้ๆนะ');
      });
    } else {
      setError('ขออภัยในความไม่สะดวก');
    }
  };

  return (
    <div>
      <button
        onClick={playAudio}
        disabled={disabled}
        className={`px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        🔊 ฟังเสียง
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

export default AudioButton


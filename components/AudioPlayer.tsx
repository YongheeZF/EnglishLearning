import React, { useState, useRef } from 'react'

interface AudioPlayerProps {
  src: string
  label: string
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, label }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div>
      <button
        onClick={togglePlay}
        className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        {isPlaying ? '⏸️ หยุด' : '▶️ ' + label}
      </button>
      <audio ref={audioRef} src={src} onEnded={handleEnded} />
    </div>
  )
}

export default AudioPlayer


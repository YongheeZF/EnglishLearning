import React from 'react'

interface PageSelectionProps {
  onSelectPage: (page: string) => void;
}

const PageSelection: React.FC<PageSelectionProps> = ({ onSelectPage }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-semibold mb-4">เลือกหมวดการเรียนรู้</h2>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        onClick={() => onSelectPage('pronunciation')}
      >
        ฝึกออกเสียงภาษาอังกฤษ
      </button>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        onClick={() => onSelectPage('vocabulary')}
      >
        เรียนรู้คำศัพท์
      </button>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        onClick={() => onSelectPage('grammar')}
      >
        ฝึกไวยากรณ์
      </button>
    </div>
  )
}

export default PageSelection


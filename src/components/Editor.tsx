import { useState } from 'react'
import './Editor.css'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  onAnalyze: () => void
  loading: boolean
  selectedText: string
  onSelect: (text: string) => void
}

export default function Editor({
  content,
  onChange,
  onAnalyze,
  loading,
  selectedText,
  onSelect,
}: EditorProps) {
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    onChange(text)
    updateStats(text)
  }

  const handleSelect = () => {
    const textarea = document.querySelector('.editor-textarea') as HTMLTextAreaElement
    if (textarea) {
      onSelect(textarea.value.substring(textarea.selectionStart, textarea.selectionEnd))
    }
  }

  const updateStats = (text: string) => {
    setCharCount(text.length)
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    setTimeout(() => {
      const textarea = e.currentTarget
      updateStats(textarea.value)
    }, 0)
  }

  return (
    <div className="editor">
      <div className="editor-header">
        <h2>محرر النص</h2>
        <button
          className="analyze-btn"
          onClick={onAnalyze}
          disabled={!content.trim() || loading}
        >
          {loading ? 'جاري التحليل...' : 'تحليل النص'}
        </button>
      </div>

      <textarea
        className="editor-textarea"
        value={content}
        onChange={handleTextChange}
        onSelect={handleSelect}
        onPaste={handlePaste}
        placeholder="اكتب أو الصق نصك هنا..."
        spellCheck="false"
      />

      <div className="editor-stats">
        <div className="stat">
          <span className="stat-label">الكلمات</span>
          <span className="stat-value">{wordCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">الأحرف</span>
          <span className="stat-value">{charCount}</span>
        </div>
        {selectedText && (
          <div className="stat selected">
            <span className="stat-label">محدد</span>
            <span className="stat-value">{selectedText.length}</span>
          </div>
        )}
      </div>
    </div>
  )
}

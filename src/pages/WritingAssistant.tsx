import { useState, useCallback } from 'react'
import Editor from '../components/Editor'
import SuggestionsPanel from '../components/SuggestionsPanel'
import { analyzeText } from '../services/analyzer'
import './WritingAssistant.css'

interface Suggestion {
  id: string
  type: 'grammar' | 'spelling' | 'punctuation' | 'style'
  message: string
  position: number
  length: number
  suggestion?: string
}

export default function WritingAssistant() {
  const [content, setContent] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedText, setSelectedText] = useState('')

  const handleAnalyze = useCallback(async () => {
    if (!content.trim()) return

    setLoading(true)
    try {
      const result = await analyzeText(content)
      setSuggestions(result)
    } catch (error) {
      console.error('خطأ في التحليل:', error)
    } finally {
      setLoading(false)
    }
  }, [content])

  const applySuggestion = (suggestion: Suggestion) => {
    if (suggestion.suggestion) {
      const newContent =
        content.slice(0, suggestion.position) +
        suggestion.suggestion +
        content.slice(suggestion.position + suggestion.length)
      setContent(newContent)
      setSuggestions(suggestions.filter(s => s.id !== suggestion.id))
    }
  }

  const dismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id))
  }

  return (
    <div className="writing-assistant">
      <header className="wa-header">
        <h1>مساعد الكتابة الذكي</h1>
        <p className="subtitle">تحليل وتحسين نصوصك بذكاء اصطناعي</p>
      </header>

      <div className="wa-container">
        <div className="wa-main">
          <Editor
            content={content}
            onChange={setContent}
            onAnalyze={handleAnalyze}
            loading={loading}
            selectedText={selectedText}
            onSelect={setSelectedText}
          />
        </div>

        <aside className="wa-sidebar">
          <SuggestionsPanel
            suggestions={suggestions}
            onApply={applySuggestion}
            onDismiss={dismissSuggestion}
            loading={loading}
          />
        </aside>
      </div>
    </div>
  )
}

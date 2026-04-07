import './SuggestionsPanel.css'

interface Suggestion {
  id: string
  type: 'grammar' | 'spelling' | 'punctuation' | 'style'
  message: string
  position: number
  length: number
  suggestion?: string
}

interface SuggestionsPanelProps {
  suggestions: Suggestion[]
  onApply: (suggestion: Suggestion) => void
  onDismiss: (id: string) => void
  loading: boolean
}

const typeLabels: Record<string, string> = {
  grammar: 'قواعد',
  spelling: 'إملاء',
  punctuation: 'ترقيم',
  style: 'أسلوب',
}

const typeColors: Record<string, string> = {
  grammar: '#FF6B6B',
  spelling: '#4ECDC4',
  punctuation: '#FFE66D',
  style: '#95E1D3',
}

export default function SuggestionsPanel({
  suggestions,
  onApply,
  onDismiss,
  loading,
}: SuggestionsPanelProps) {
  if (loading && suggestions.length === 0) {
    return (
      <div className="suggestions-panel loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>جاري التحليل...</p>
        </div>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <div className="suggestions-panel empty">
        <div className="empty-state">
          <p className="empty-icon">✓</p>
          <p className="empty-title">ممتاز!</p>
          <p className="empty-text">لا توجد اقتراحات حالياً</p>
        </div>
      </div>
    )
  }

  const grouped = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = []
    }
    acc[suggestion.type].push(suggestion)
    return acc
  }, {} as Record<string, Suggestion[]>)

  return (
    <div className="suggestions-panel">
      <h3 className="panel-title">الاقتراحات ({suggestions.length})</h3>

      <div className="suggestions-list">
        {Object.entries(grouped).map(([type, items]) => (
          <div key={type} className="suggestion-group">
            <h4 className="group-title" style={{ borderColor: typeColors[type] }}>
              <span className="type-badge" style={{ backgroundColor: typeColors[type] }}>
                {typeLabels[type]}
              </span>
            </h4>

            {items.map((suggestion) => (
              <div key={suggestion.id} className="suggestion-item">
                <p className="suggestion-message">{suggestion.message}</p>
                {suggestion.suggestion && (
                  <p className="suggestion-text">
                    <strong>الاقتراح:</strong> {suggestion.suggestion}
                  </p>
                )}
                <div className="suggestion-actions">
                  {suggestion.suggestion && (
                    <button
                      className="btn-apply"
                      onClick={() => onApply(suggestion)}
                      title="تطبيق الاقتراح"
                    >
                      تطبيق
                    </button>
                  )}
                  <button
                    className="btn-dismiss"
                    onClick={() => onDismiss(suggestion.id)}
                    title="رفض الاقتراح"
                  >
                    تجاهل
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

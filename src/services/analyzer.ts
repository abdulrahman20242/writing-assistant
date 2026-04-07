interface Suggestion {
  id: string
  type: 'grammar' | 'spelling' | 'punctuation' | 'style'
  message: string
  position: number
  length: number
  suggestion?: string
}

export async function analyzeText(text: string): Promise<Suggestion[]> {
  const suggestions: Suggestion[] = []
  let idCounter = 0

  // تحليل الأخطاء الإملائية الشائعة
  const spellingPatterns = [
    { pattern: /\bالة\b/g, suggestion: 'آلة', message: 'كلمة "الة" الصحيح كتابتها "آلة"' },
    { pattern: /\bاللهم\b/g, suggestion: 'اللهم', message: 'تحقق من كتابة "اللهم"' },
    { pattern: /\bتالي\b/g, suggestion: 'تالية', message: 'قد تكون الكلمة بصيغة أنثى "تالية"' },
  ]

  spellingPatterns.forEach((pattern) => {
    let match
    while ((match = pattern.pattern.exec(text)) !== null) {
      suggestions.push({
        id: `spelling-${idCounter++}`,
        type: 'spelling',
        message: pattern.message,
        position: match.index,
        length: match[0].length,
        suggestion: pattern.suggestion,
      })
    }
  })

  // تحليل علامات الترقيم
  const punctuationIssues = findPunctuationIssues(text)
  punctuationIssues.forEach((issue) => {
    suggestions.push({
      ...issue,
      id: `punctuation-${idCounter++}`,
    })
  })

  // تحليل القواعس النحوية البسيطة
  const grammarIssues = findGrammarIssues(text)
  grammarIssues.forEach((issue) => {
    suggestions.push({
      ...issue,
      id: `grammar-${idCounter++}`,
    })
  })

  // تحليل الأسلوب
  const styleIssues = findStyleIssues(text)
  styleIssues.forEach((issue) => {
    suggestions.push({
      ...issue,
      id: `style-${idCounter++}`,
    })
  })

  return suggestions
}

function findPunctuationIssues(text: string): Omit<Suggestion, 'id'>[] {
  const issues: Omit<Suggestion, 'id'>[] = []

  // تحقق من عدم وجود نقطة في نهاية الجمل
  const sentences = text.split(/[.!?؟،]/g)
  let position = 0
  sentences.forEach((sentence, index) => {
    if (sentence.trim() && index < sentences.length - 1) {
      const trimmed = sentence.trim()
      if (trimmed.length > 10 && !text[position + sentence.length].match(/[.!?؟،]/)) {
        issues.push({
          type: 'punctuation',
          message: 'قد تحتاج الجملة إلى علامة ترقيم في النهاية',
          position: position + sentence.length,
          length: 1,
        })
      }
    }
    position += sentence.length + 1
  })

  // تحقق من المسافات قبل علامات الترقيم
  const noSpacePattern = / +[.,؟،!]/g
  let match
  while ((match = noSpacePattern.exec(text)) !== null) {
    issues.push({
      type: 'punctuation',
      message: 'يجب حذف المسافة قبل علامة الترقيم',
      position: match.index,
      length: match[0].length,
      suggestion: match[0].replace(/ +/, ''),
    })
  }

  return issues
}

function findGrammarIssues(text: string): Omit<Suggestion, 'id'>[] {
  const issues: Omit<Suggestion, 'id'>[] = []

  // تحقق من الأخطاء الشائعة في التذكير والتأنيث
  const grammarPatterns = [
    {
      pattern: /\bهذا\s+ال(كتاب|درس|موضوع|مقال)/g,
      message: 'تأكد من استخدام الصيغة الصحيحة للتذكير والتأنيث',
    },
  ]

  grammarPatterns.forEach((pattern) => {
    let match
    while ((match = pattern.pattern.exec(text)) !== null) {
      issues.push({
        type: 'grammar',
        message: pattern.message,
        position: match.index,
        length: match[0].length,
      })
    }
  })

  return issues
}

function findStyleIssues(text: string): Omit<Suggestion, 'id'>[] {
  const issues: Omit<Suggestion, 'id'>[] = []

  // تحقق من الكلمات المكررة المتتالية
  const repeatedWords = /\b(\w+)\s+\1\b/g
  let match
  while ((match = repeatedWords.exec(text)) !== null) {
    issues.push({
      type: 'style',
      message: `كلمة "${match[1]}" مكررة بلا داع`,
      position: match.index,
      length: match[0].length,
      suggestion: match[1],
    })
  }

  // تحقق من الجمل الطويلة جداً
  const sentences = text.split(/[.!?؟]/g)
  let position = 0
  sentences.forEach((sentence) => {
    if (sentence.trim().length > 120) {
      issues.push({
        type: 'style',
        message: 'الجملة طويلة جداً، حاول تقسيمها إلى جمل أقصر',
        position: position,
        length: sentence.length,
      })
    }
    position += sentence.length + 1
  })

  return issues
}

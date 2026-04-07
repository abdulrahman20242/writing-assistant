import { useState } from 'react'
import WritingAssistant from './pages/WritingAssistant'
import './App.css'

function App() {
  const [darkMode] = useState(true)

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <WritingAssistant />
    </div>
  )
}

export default App

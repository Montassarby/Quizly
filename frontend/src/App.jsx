import { useState } from 'react'
import Home from './pages/Home'
import Config from './pages/Config'
import Quiz from './pages/Quiz'
import Results from './pages/Results'

export default function App() {
  const [screen, setScreen] = useState(1)
  const [pdfFile, setPdfFile] = useState(null)
  const [config, setConfig] = useState({
    nbQuestions: 10,
    difficulty: 'moyen',
    language: 'français'
  })
  const [questions, setQuestions] = useState([])
  const [score, setScore] = useState({ correct: 0, wrong: 0, answers: [] })

  const goTo = (n) => setScreen(n)

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F7F4EE]/90 backdrop-blur border-b border-[#E4E1DA] h-[60px] flex items-center justify-between px-10">
        <div className="font-syne font-extrabold text-xl tracking-tight flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 72 72" fill="none">
            <rect width="72" height="72" rx="18" fill="#00E5A0"/>
            <path d="M22 36C22 27.163 29.163 20 38 20C46.837 20 54 27.163 54 36C54 44.837 46.837 52 38 52C34.1 52 30.55 50.55 27.85 48.15L24 52H20L25.3 46.7C23.2 43.9 22 40.1 22 36Z" fill="#0D0D0F"/>
            <circle cx="38" cy="36" r="9" fill="#00E5A0"/>
            <circle cx="53" cy="19" r="5" fill="#FF5C3A"/>
          </svg>
          Quiz<span className="text-[#00B87D]">ly</span>
        </div>
        <div className="flex items-center gap-1">
          {['Upload','Configurer','Quiz','Résultats'].map((label, i) => (
            <button
              key={i}
              onClick={() => goTo(i + 1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-syne text-xs font-semibold transition-all
                ${screen === i + 1 ? 'bg-white border border-[#E4E1DA] shadow-sm text-[#0D0D0F]' :
                  screen > i + 1 ? 'text-[#00B87D]' : 'text-[#6B6B7B] hover:text-[#0D0D0F]'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                ${screen === i + 1 ? 'bg-[#0D0D0F] text-white' :
                  screen > i + 1 ? 'bg-[#00E5A0] text-[#0D0D0F]' : 'bg-[#F0EDE6] text-[#0D0D0F]'}`}>
                {screen > i + 1 ? '✓' : i + 1}
              </span>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="pt-[60px]">
        {screen === 1 && <Home goTo={goTo} setPdfFile={setPdfFile} pdfFile={pdfFile} />}
        {screen === 2 && <Config goTo={goTo} config={config} setConfig={setConfig} pdfFile={pdfFile} setQuestions={setQuestions} />}
        {screen === 3 && <Quiz goTo={goTo} questions={questions} setScore={setScore} />}
        {screen === 4 && <Results goTo={goTo} score={score} config={config} />}
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'

export default function Quiz({ goTo, questions, setScore }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(60)

  const q = questions[current]

  useEffect(() => {
    setTimeLeft(60)
  }, [current])

  useEffect(() => {
    if (answered) return
    if (timeLeft <= 0) { handleNext(); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, answered])

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
  }

  const handleValidate = () => {
    if (selected === null || answered) return
    setAnswered(true)
    const isCorrect = selected === q.correctIndex
    if (isCorrect) setCorrect(c => c + 1)
    else setWrong(w => w + 1)
    setAnswers(a => [...a, { question: q.question, selected, correct: q.correctIndex, isCorrect }])
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setScore({ correct, wrong, answers })
      goTo(4)
      return
    }
    setCurrent(c => c + 1)
    setSelected(null)
    setAnswered(false)
  }

  if (!q) return <div className="flex items-center justify-center h-screen font-syne">Chargement…</div>

  const progress = ((current + 1) / questions.length) * 100
  const letters = ['A','B','C','D']

  return (
    <div className="max-w-2xl mx-auto px-10 py-12">
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 max-w-sm">
          <div className="flex justify-between font-syne text-xs font-semibold text-[#6B6B7B] mb-2">
            <span>Question {current + 1} sur {questions.length}</span>
            <div className="flex gap-3">
              <span className="text-[#00B87D]">✓ {correct}</span>
              <span className="text-[#FF5C3A]">✗ {wrong}</span>
            </div>
          </div>
          <div className="h-1.5 bg-[#E4E1DA] rounded-full overflow-hidden">
            <div className="h-full bg-[#00B87D] rounded-full transition-all duration-500" style={{width: `${progress}%`}}/>
          </div>
        </div>
        <div className={`ml-6 flex items-center gap-2 px-4 py-2 rounded-full border font-syne font-bold text-sm
          ${timeLeft <= 10 ? 'border-[#FF5C3A] text-[#FF5C3A]' : 'border-[#E4E1DA] text-[#0D0D0F]'}`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${timeLeft <= 10 ? 'bg-[#FF5C3A]' : 'bg-[#00B87D]'}`}/>
          {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}
        </div>
      </div>

      <div className="bg-white border border-[#E4E1DA] rounded-3xl p-10 mb-5 shadow-sm">
        <div className="font-syne text-xs font-semibold tracking-widest uppercase text-[#00B87D] mb-4">
          Question {current + 1}
        </div>
        <h2 className="font-syne font-bold text-xl leading-snug mb-8 tracking-tight">{q.question}</h2>

        <div className="flex flex-col gap-3">
          {q.options.map((opt, idx) => (
            <div key={idx} onClick={() => handleSelect(idx)}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
                ${!answered && selected === idx ? 'border-[#00B87D] bg-[#E8F9F3]' : ''}
                ${answered && idx === q.correctIndex ? 'border-[#00B87D] bg-[#E8F9F3]' : ''}
                ${answered && selected === idx && idx !== q.correctIndex ? 'border-[#FF5C3A] bg-[#FFF0ED]' : ''}
                ${!answered && selected !== idx ? 'border-[#E4E1DA] bg-[#F7F4EE] hover:border-[#0D0D0F] hover:translate-x-1' : ''}
                ${answered && idx !== q.correctIndex && selected !== idx ? 'border-[#E4E1DA] bg-[#F7F4EE] opacity-50' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-syne text-xs font-extrabold flex-shrink-0 transition-all
                ${answered && idx === q.correctIndex ? 'bg-[#00B87D] text-white' : ''}
                ${answered && selected === idx && idx !== q.correctIndex ? 'bg-[#FF5C3A] text-white' : ''}
                ${!answered && selected === idx ? 'bg-[#00B87D] text-white' : ''}
                ${(answered ? idx !== q.correctIndex && selected !== idx : selected !== idx) ? 'bg-white border border-[#E4E1DA] text-[#0D0D0F]' : ''}`}>
                {letters[idx]}
              </div>
              <span className="text-sm text-[#0D0D0F]">{opt}</span>
            </div>
          ))}
        </div>

        {answered && q.explanation && (
          <div className="mt-6 p-4 bg-[#E8F9F3] border border-[#00B87D]/20 rounded-xl">
            <div className="font-syne text-xs font-semibold tracking-widest uppercase text-[#00B87D] mb-1">💡 Explication</div>
            <p className="text-sm text-[#0D0D0F] leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={handleNext}
          className="px-5 py-3 border border-[#E4E1DA] rounded-xl font-syne text-sm font-semibold text-[#6B6B7B] hover:border-[#0D0D0F] hover:text-[#0D0D0F] transition-all">
          Passer →
        </button>
        <button onClick={answered ? handleNext : handleValidate}
          className={`px-8 py-3.5 rounded-xl font-syne font-bold text-sm flex items-center gap-2 transition-all hover:-translate-y-0.5
            ${answered ? 'bg-[#00B87D] text-white' : 'bg-[#0D0D0F] text-white hover:bg-[#1f1f2e]'}`}>
          {answered ? 'Question suivante →' : 'Valider la réponse'}
        </button>
      </div>
    </div>
  )
}
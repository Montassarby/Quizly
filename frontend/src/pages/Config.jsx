import { useState } from 'react'
import axios from 'axios'

export default function Config({ goTo, config, setConfig, pdfFile, setQuestions }) {
  const [loading, setLoading] = useState(false)
  const [loadStep, setLoadStep] = useState(0)

  const steps = ['Extraction du texte PDF…', 'Analyse du contenu…', 'Génération des questions…', 'Finalisation…']

  const generate = async () => {
    if (!pdfFile) return
    setLoading(true)
    setLoadStep(0)

    const interval = setInterval(() => {
      setLoadStep(s => Math.min(s + 1, steps.length - 1))
    }, 1500)

    try {
      const formData = new FormData()
      formData.append('pdf', pdfFile)
      formData.append('nbQuestions', config.nbQuestions)
      formData.append('difficulty', config.difficulty)
      formData.append('language', config.language)

      const res = await axios.post('http://localhost:3001/api/generate', formData)
      setQuestions(res.data.quiz)
      clearInterval(interval)
      setLoading(false)
      goTo(3)
    } catch (err) {
      clearInterval(interval)
      setLoading(false)
      alert('Erreur : ' + (err.response?.data?.error || err.message))
    }
  }

  if (loading) return (
    <div className="fixed inset-0 bg-[#F7F4EE]/95 backdrop-blur flex flex-col items-center justify-center gap-6 z-50">
      <div className="font-syne font-extrabold text-2xl">Quiz<span className="text-[#00B87D]">ly</span></div>
      <div className="flex flex-col gap-3 w-72">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 text-sm transition-all
            ${i < loadStep ? 'text-[#00B87D]' : i === loadStep ? 'text-[#0D0D0F]' : 'text-[#6B6B7B] opacity-40'}`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0
              ${i < loadStep ? 'bg-[#00E5A0] border-[#00E5A0] text-[#0D0D0F]' :
                i === loadStep ? 'border-[#0D0D0F] animate-spin' : 'border-[#E4E1DA]'}`}>
              {i < loadStep ? '✓' : ''}
            </div>
            {s}
          </div>
        ))}
      </div>
      <div className="w-72 h-1 bg-[#E4E1DA] rounded-full overflow-hidden">
        <div className="h-full bg-[#00B87D] rounded-full transition-all duration-500"
          style={{ width: `${(loadStep / steps.length) * 100}%` }}/>
      </div>
      <div className="text-sm text-[#6B6B7B] font-light">Claude AI génère ton quiz…</div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-10 py-16">
      <div className="mb-12">
        <div className="font-syne text-xs font-semibold tracking-widest uppercase text-[#00B87D] mb-3">✦ Étape 2 sur 4</div>
        <h2 className="font-syne font-extrabold text-4xl tracking-tight mb-2">Configure ton quiz</h2>
        <p className="text-[#6B6B7B] font-light">Personnalise la génération selon tes besoins.</p>
        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-[#E8F9F3] border border-[#00B87D]/20 rounded-full">
          <div className="w-5 h-5 bg-[#00E5A0] rounded flex items-center justify-center font-syne text-[8px] font-extrabold">PDF</div>
          <span className="font-syne text-xs font-semibold text-[#00B87D]">{pdfFile?.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Nombre de questions */}
        <div className="bg-[#F7F4EE] border border-[#E4E1DA] rounded-2xl p-6">
          <div className="font-syne text-xs font-semibold tracking-widest uppercase text-[#6B6B7B] mb-4">Nombre de questions</div>
          <div className="flex items-center gap-4">
            <button onClick={() => setConfig(c => ({...c, nbQuestions: Math.max(5, c.nbQuestions - 5)}))}
              className="w-10 h-10 rounded-xl border border-[#E4E1DA] bg-white font-light text-xl hover:bg-[#0D0D0F] hover:text-white hover:border-[#0D0D0F] transition-all">−</button>
            <span className="font-syne font-extrabold text-4xl tracking-tight w-14 text-center">{config.nbQuestions}</span>
            <button onClick={() => setConfig(c => ({...c, nbQuestions: Math.min(50, c.nbQuestions + 5)}))}
              className="w-10 h-10 rounded-xl border border-[#E4E1DA] bg-white font-light text-xl hover:bg-[#0D0D0F] hover:text-white hover:border-[#0D0D0F] transition-all">+</button>
          </div>
          <div className="text-xs text-[#6B6B7B] mt-2">Entre 5 et 50 questions</div>
        </div>

        {/* Difficulté */}
        <div className="bg-[#F7F4EE] border border-[#E4E1DA] rounded-2xl p-6">
          <div className="font-syne text-xs font-semibold tracking-widest uppercase text-[#6B6B7B] mb-4">Difficulté</div>
          <div className="flex flex-col gap-2">
            {[['facile','Facile','Définitions et concepts','#00E5A0'],
              ['moyen','Moyen','Compréhension et application','#FFB800'],
              ['difficile','Difficile','Analyse et cas complexes','#FF5C3A']].map(([val,label,desc,color]) => (
              <div key={val} onClick={() => setConfig(c => ({...c, difficulty: val}))}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
                  ${config.difficulty === val ? 'border-[#00B87D] bg-[#E8F9F3]' : 'border-[#E4E1DA] bg-white hover:border-[#0D0D0F]'}`}>
                <div>
                  <div className="font-syne font-semibold text-sm">{label}</div>
                  <div className="text-xs text-[#6B6B7B]">{desc}</div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full" style={{background: color}}/>
              </div>
            ))}
          </div>
        </div>

        {/* Langue */}
        <div className="bg-[#F7F4EE] border border-[#E4E1DA] rounded-2xl p-6">
          <div className="font-syne text-xs font-semibold tracking-widest uppercase text-[#6B6B7B] mb-4">Langue</div>
          <div className="flex gap-2 flex-wrap">
            {[['français','🇫🇷 Français'],['english','🇬🇧 English'],['español','🇪🇸 Español']].map(([val,label]) => (
              <button key={val} onClick={() => setConfig(c => ({...c, language: val}))}
                className={`px-4 py-2 rounded-full border font-syne text-xs font-semibold transition-all
                  ${config.language === val ? 'border-[#00B87D] bg-[#E8F9F3] text-[#00B87D]' : 'border-[#E4E1DA] bg-white hover:border-[#0D0D0F]'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-[#0D0D0F] rounded-2xl p-6 flex flex-col justify-between">
          <div className="font-syne text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">Résumé</div>
          <div className="grid grid-cols-2 gap-4">
            {[['Questions', config.nbQuestions],['Difficulté', config.difficulty],['Langue', config.language],['Durée est.', `~${Math.round(config.nbQuestions * 0.8)} min`]].map(([k,v]) => (
              <div key={k}>
                <div className="text-[10px] font-syne font-semibold tracking-widest uppercase text-white/30 mb-1">{k}</div>
                <div className="font-syne font-extrabold text-white text-lg capitalize">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={generate}
        className="w-full py-4 bg-[#00E5A0] text-[#0D0D0F] rounded-xl font-syne font-bold text-base flex items-center justify-center gap-2 hover:bg-[#00B87D] hover:text-white transition-all hover:-translate-y-0.5 shadow-lg shadow-[#00E5A0]/20">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        Générer avec Claude AI
      </button>
    </div>
  )
}
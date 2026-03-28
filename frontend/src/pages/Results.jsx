export default function Results({ goTo, score, config }) {
  const total = score.correct + score.wrong
  const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0
  const circumference = 2 * Math.PI * 65
  const offset = circumference - (pct / 100) * circumference

  const grade = pct >= 80 ? ['Excellent !','Tu maîtrises parfaitement ce contenu. 🎉'] :
                pct >= 60 ? ['Bien !','Quelques points à revoir mais bonne base.'] :
                ['À retravailler','Reprends ce cours et retente le quiz.']

  return (
    <div className="bg-[#0D0D0F] min-h-[calc(100vh-60px)]">
      <div className="max-w-3xl mx-auto px-10 py-16">

        <div className="text-center mb-14">
          <div className="relative w-40 h-40 mx-auto mb-7">
            <svg viewBox="0 0 160 160" className="-rotate-90 w-full h-full">
              <circle cx="80" cy="80" r="65" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
              <circle cx="80" cy="80" r="65" fill="none" stroke="#00E5A0" strokeWidth="8"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                style={{transition: 'stroke-dashoffset 1.5s ease'}}/>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-syne font-extrabold text-white text-4xl tracking-tight">
                {score.correct}<span className="text-[#00E5A0] text-2xl">/{total}</span>
              </div>
              <div className="text-white/40 text-sm">{pct}%</div>
            </div>
          </div>
          <div className="font-syne text-xs font-semibold tracking-widest uppercase text-[#00E5A0] mb-2">✦ {grade[0]}</div>
          <h2 className="font-syne font-extrabold text-3xl text-white tracking-tight mb-2">{grade[0]}</h2>
          <p className="text-white/40 font-light">{grade[1]}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-10">
          {[['Correctes', score.correct, '#00E5A0'],
            ['Incorrectes', score.wrong, '#FF5C3A'],
            ['Score', `${pct}%`, 'white']].map(([label, val, color]) => (
            <div key={label} className="bg-white/5 border border-white/8 rounded-2xl p-5 text-center">
              <div className="font-syne font-extrabold text-3xl mb-1" style={{color}}>{val}</div>
              <div className="font-syne text-xs font-semibold tracking-widest uppercase text-white/30">{label}</div>
            </div>
          ))}
        </div>

        {score.answers?.length > 0 && (
          <>
            <div className="font-syne text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">Révision des réponses</div>
            <div className="flex flex-col gap-2 mb-10">
              {score.answers.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white/4 border border-white/6 rounded-xl">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0
                    ${a.isCorrect ? 'bg-[#00E5A0]/20 text-[#00E5A0]' : 'bg-[#FF5C3A]/20 text-[#FF5C3A]'}`}>
                    {a.isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <div className="text-white/70 text-sm">{a.question}</div>
                    {!a.isCorrect && (
                      <div className="text-xs mt-1 text-[#FF5C3A]">
                        Ta réponse incorrecte — la bonne était : option {String.fromCharCode(65 + a.correct)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => goTo(3)}
            className="px-7 py-3.5 bg-[#00E5A0] text-[#0D0D0F] rounded-xl font-syne font-bold flex items-center gap-2 hover:bg-[#00B87D] hover:text-white transition-all hover:-translate-y-0.5">
            🔁 Recommencer
          </button>
          <button onClick={() => goTo(1)}
            className="px-7 py-3.5 bg-white/8 text-white border border-white/12 rounded-xl font-syne font-bold flex items-center gap-2 hover:bg-white/12 transition-all hover:-translate-y-0.5">
            📄 Nouveau PDF
          </button>
        </div>
      </div>
    </div>
  )
}
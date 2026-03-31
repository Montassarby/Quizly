import { useState } from 'react'

const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export default function Home({ goTo, setPdfFile, pdfFile }) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = (file) => {
    setError(null)

    if (!file || file.type !== 'application/pdf') {
      setError('Fichier PDF uniquement.')
      return
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(`Fichier trop volumineux : ${(file.size / 1024 / 1024).toFixed(1)} Mo. La limite est de ${MAX_SIZE_MB} Mo.`)
      setPdfFile(null)
      return
    }

    setPdfFile(file)
  }

  return (
    <div className="min-h-[calc(100vh-60px)] grid grid-cols-2">
      <div className="p-16 flex flex-col justify-center border-r border-[#E4E1DA]">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8F9F3] border border-[#00B87D]/20 rounded-full font-syne text-xs font-semibold text-[#00B87D] mb-8 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B87D] animate-pulse"/>
          Propulsé par Groq AI
        </div>
        <h1 className="font-syne font-extrabold text-5xl leading-tight tracking-tight mb-5">
          Transforme tes<br/>
          cours en <span className="text-[#00B87D]">quiz</span><br/>
          en 10 secondes.
        </h1>
        <p className="text-[#6B6B7B] text-base font-light leading-relaxed max-w-sm mb-10">
          Upload n'importe quel PDF de cours et Quizly génère automatiquement un QCM intelligent adapté à ton contenu.
        </p>
        <div className="flex gap-8 pt-8 border-t border-[#E4E1DA]">
          {[['10s','Génération moyenne'],['50+','Questions max'],['3','Niveaux difficulté']].map(([val,desc]) => (
            <div key={val}>
              <div className="font-syne font-extrabold text-2xl text-[#00B87D]">{val}</div>
              <div className="text-xs text-[#6B6B7B] mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-16 flex flex-col justify-center bg-white">
        <div className="font-syne text-xs font-semibold tracking-widest uppercase text-[#6B6B7B] mb-5">
          Étape 1 — Importe ton cours
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => document.getElementById('fileInput').click()}
          className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all
            ${error
              ? 'border-[#FF5C3A] bg-[#FFF0ED]'
              : dragging
                ? 'border-[#00B87D] bg-[#E8F9F3]'
                : 'border-[#E4E1DA] hover:border-[#00B87D] hover:bg-[#E8F9F3]'
            }`}
        >
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center ${error ? 'bg-[#FF5C3A]' : 'bg-[#0D0D0F]'}`}>
            {error ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            )}
          </div>

          <div className="font-syne font-bold text-lg mb-2">Glisse ton PDF ici</div>
          <div className="text-sm text-[#6B6B7B]">Dépose ton fichier de cours au format <span className="text-[#00B87D] font-medium">PDF</span></div>
          <div className="flex justify-center gap-2 mt-4">
            {['PDF', `MAX ${MAX_SIZE_MB}MB`].map(t => (
              <span key={t} className="px-2.5 py-1 bg-white border border-[#E4E1DA] rounded text-xs font-syne font-semibold text-[#6B6B7B]">{t}</span>
            ))}
          </div>
        </div>

        <input
          id="fileInput"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
          // Reset la valeur pour permettre de re-sélectionner le même fichier
          onClick={(e) => { e.target.value = null }}
        />

        {/* Message d'erreur */}
        {error && (
          <div className="mt-4 p-3.5 bg-[#FFF0ED] border border-[#FF5C3A]/30 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 bg-[#FF5C3A] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-syne font-semibold text-sm text-[#FF5C3A]">Fichier refusé</div>
              <div className="text-xs text-[#6B6B7B] mt-0.5">{error}</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setError(null) }}
              className="text-[#6B6B7B] hover:text-[#0D0D0F] transition-colors flex-shrink-0 mt-0.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 my-6 text-xs text-[#6B6B7B]">
          <div className="flex-1 h-px bg-[#E4E1DA]"/>ou<div className="flex-1 h-px bg-[#E4E1DA]"/>
        </div>

        <button
          onClick={() => document.getElementById('fileInput').click()}
          className="w-full py-3.5 bg-[#0D0D0F] text-white rounded-xl font-syne font-bold flex items-center justify-center gap-2 hover:bg-[#1f1f2e] transition-all hover:-translate-y-0.5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Parcourir mes fichiers
        </button>

        {pdfFile && !error && (
          <>
            <div className="mt-5 p-3.5 bg-[#E8F9F3] border border-[#00B87D]/20 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 bg-[#00E5A0] rounded-lg flex items-center justify-center font-syne text-[9px] font-extrabold">PDF</div>
              <div>
                <div className="font-syne font-semibold text-sm">{pdfFile.name}</div>
                <div className="text-xs text-[#6B6B7B]">{(pdfFile.size / 1024 / 1024).toFixed(1)} MB</div>
              </div>
              <div className="ml-auto w-6 h-6 bg-[#00B87D] rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
            <button
              onClick={() => goTo(2)}
              className="mt-3 w-full py-4 bg-[#00E5A0] text-[#0D0D0F] rounded-xl font-syne font-bold flex items-center justify-center gap-2 hover:bg-[#00B87D] hover:text-white transition-all hover:-translate-y-0.5"
            >
              Configurer mon quiz
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

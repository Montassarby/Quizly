import fs from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export async function extractTextFromPDF(filePath) {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const buffer = fs.readFileSync(filePath)
    const uint8Array = new Uint8Array(buffer)

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise
    let fullText = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map(item => item.str).join(' ')
      fullText += pageText + '\n'
    }

    fs.unlinkSync(filePath)

    return fullText
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 12000)

  } catch (err) {
    throw new Error('Impossible de lire le PDF : ' + err.message)
  }
}
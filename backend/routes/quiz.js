import express from 'express';
import multer from 'multer';
import path from 'path';
import { extractTextFromPDF } from '../services/pdfExtractor.js';
import { generateQuiz } from '../services/quizGenerator.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Fichier PDF uniquement'));
  }
});

router.post('/generate', upload.single('pdf'), async (req, res) => {
  try {
    const { nbQuestions = 10, difficulty = 'moyen', language = 'français' } = req.body;

    // 1. Extraire le texte du PDF
    const text = await extractTextFromPDF(req.file.path);

    if (!text || text.length < 100) {
      return res.status(400).json({ error: 'PDF trop court ou illisible.' });
    }

    // 2. Générer le quiz avec groq
    const quiz = await generateQuiz(text, { nbQuestions, difficulty, language });

    res.json({ success: true, quiz });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
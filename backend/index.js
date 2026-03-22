import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import quizRouter from './routes/quiz.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api', quizRouter);

app.listen(PORT, () => {
  console.log(`✅ Quizly backend running on http://localhost:${PORT}`);
});
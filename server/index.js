import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cs-revision', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Question Schema
const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  correctAnswer: {
    type: String,
    required: true,
    trim: true
  },
  
 
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },

}, {
  timestamps: true
});

const Question = mongoose.model('Question', questionSchema);

// Routes

// Get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const { subject } = req.query;
    const filter = subject ? { subject } : {};
    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Question.distinct('subject');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single question
app.get('/api/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create question
app.post('/api/questions', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update question
app.put('/api/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete question
app.delete('/api/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit answer
app.post('/api/questions/:id/answer', async (req, res) => {
  try {
    const { userAnswer } = req.body;
    const question = await Question.findById(req.params.id);
    
    if (!question) return res.status(404).json({ message: 'Question not found' });
    
    const isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    
    question.userAnswer = userAnswer;
    question.isAnswered = true;
    question.isCorrect = isCorrect;
    question.lastReviewed = new Date();
    
    await question.save();
    res.json({ question, isCorrect });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
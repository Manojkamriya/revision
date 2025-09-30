import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    question: '',
    correctAnswer: '',
    difficulty: 'medium'
  });

  useEffect(() => {
    fetchQuestions();
    fetchSubjects();
  }, []);

  const fetchQuestions = async (subject = '') => {
    try {
      setError(null);
      const url = subject ? `${API_URL}/api/questions?subject=${subject}` : API_URL;
      const response = await axios.get(url);
      setQuestions(response.data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to fetch questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/subjects`);
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
  };

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
    fetchQuestions(subject);
  };

  const handleSubmitAnswer = async (questionId, userAnswer) => {
    try {
      const response = await axios.post(`${API_URL}/${questionId}/answer`, { userAnswer });
      const updatedQuestion = response.data.question;
      
      setQuestions(questions.map(q => 
        q._id === questionId ? updatedQuestion : q
      ));
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Error submitting answer. Please try again.');
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setShowModal(false);
      setFormData({ subject: '', question: '', correctAnswer: '', difficulty: 'medium' });
      fetchQuestions(selectedSubject);
      fetchSubjects();
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Error creating question. Please try again.');
    }
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editingQuestion._id}`, formData);
      setShowModal(false);
      setEditingQuestion(null);
      setFormData({ subject: '', question: '', correctAnswer: '', difficulty: 'medium' });
      fetchQuestions(selectedSubject);
      fetchSubjects();
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Error updating question. Please try again.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchQuestions(selectedSubject);
        fetchSubjects();
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Error deleting question. Please try again.');
      }
    }
  };

  const openEditModal = (question) => {
    setEditingQuestion(question);
    setFormData({
      subject: question.subject,
      question: question.question,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setFormData({ subject: '', question: '', correctAnswer: '', difficulty: 'medium' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingQuestion(null);
  };

  // Safe filtering with array check
  const filteredQuestions = Array.isArray(questions) 
    ? questions.filter(question =>
        question.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const stats = {
    total: Array.isArray(questions) ? questions.length : 0,
   
  };

  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error" style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#e74c3c',
          background: '#ffeaea',
          borderRadius: '8px',
          margin: '2rem 0'
        }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>CS Revision App</h1>
        <p>Personalized Computer Science Question Bank</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>Total Questions</h3>
          <p>{stats.total}</p>
        </div>
     
      </div>

      <div className="controls">
        <select 
          value={selectedSubject} 
          onChange={(e) => handleSubjectChange(e.target.value)}
        >
          <option value="">All Subjects</option>
          {Array.isArray(subjects) && subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />

        <button onClick={openCreateModal}>Add New Question</button>
      </div>

      {filteredQuestions.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#666' 
        }}>
          <h3>No questions found</h3>
          <p>Add your first question to get started!</p>
        </div>
      ) : (
        <div className="questions-grid">
          {filteredQuestions.map(question => (
            <QuestionCard
              key={question._id}
              question={question}
              onAnswerSubmit={handleSubmitAnswer}
              onEdit={openEditModal}
              onDelete={handleDeleteQuestion}
            />
          ))}
        </div>
      )}

      {showModal && (
        <QuestionModal
          formData={formData}
          setFormData={setFormData}
          onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
          onClose={closeModal}
          isEditing={!!editingQuestion}
          subjects={subjects}
        />
      )}
    </div>
  );
}

function QuestionCard({ question, onEdit, onDelete }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [submittedAnswer, setSubmittedAnswer] = useState(null); // store shown answer
  const [answered, setAnswered] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // keep local state in sync if question prop changes (e.g. loaded from server)
  useEffect(() => {
    setAnswered(Boolean(question?.isAnswered));
    setIsCorrect(question?.isCorrect ?? null);
    setSubmittedAnswer(question?.userAnswer ?? null);
    setShowAnswer(false);
    setUserAnswer('');
  }, [question]);

  const normalize = (s) => (s ?? '').toString().trim().toLowerCase();

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = userAnswer.trim();
    if (trimmed) {
      const correct = normalize(trimmed) === normalize(question.correctAnswer);
      setIsCorrect(correct);
      setSubmittedAnswer(trimmed);
    } else {
      // empty input — treat as skipped/incorrect per your requirement
      setIsCorrect(false);
      setSubmittedAnswer('(skipped)');
    }

    setAnswered(true);
    setShowAnswer(true);
    setUserAnswer(''); // clear input, but we keep submittedAnswer for display

    // NOTE: no API call here (per your request). If you want to save later, call API from parent.
  };

  const handleShowAnswer = () => {
    // If not already answered, mark as answered (skipped if input empty)
    if (!answered) {
      const trimmed = userAnswer.trim();
      if (trimmed) {
        const correct = normalize(trimmed) === normalize(question.correctAnswer);
        setIsCorrect(correct);
        setSubmittedAnswer(trimmed);
      } else {
        setIsCorrect(false);
        setSubmittedAnswer('(skipped)');
      }
      setAnswered(true);
    }
    setShowAnswer(true);
    setUserAnswer('');
  };

  if (!question) return null;

  const containerClass = `question-card ${answered ? 'answered' : ''} ${answered ? (isCorrect ? 'correct' : 'incorrect') : ''}`;

  return (
    <div
      className={containerClass}
      style={{
        backgroundColor: answered ? (isCorrect ? '#d4edda' : '#f8d7da') : undefined,
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '8px'
      }}
    >
      <div className="subject-badge">{question.subject || 'No Subject'}</div>
      <div className="question-text">{question.question || 'No question text'}</div>

      {!answered ? (
        <form onSubmit={handleSubmit} className="answer-section">
          <input
            type="text"
            className="answer-input"
            placeholder="Your answer..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <div className='answer-buttons'>
<button type="submit">Submit Answer</button>
        
          <button type="button" onClick={handleShowAnswer}>
            Show Answer
          </button>
          </div>
          
        </form>
      ) : (
        <div className="answer-section">
          <div className={`user-answer ${isCorrect ? 'correct' : 'incorrect'}`} style={{ fontWeight: '600', marginBottom: '.5rem' }}>
            Your answer: {submittedAnswer} {isCorrect ? '✓' : '✗'}
          </div>

          {showAnswer && (
            <div className="correct-answer" style={{ background: '#e6ffed', padding: '.5rem', borderRadius: '4px' }}>
              Correct answer: {question.correctAnswer}
            </div>
          )}

          <button type="button" onClick={() => setShowAnswer(prev => !prev)} style={{ marginTop: '.5rem' }}>
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>
      )}

      <div className="actions" style={{ marginTop: '1rem' }}>
        <button onClick={() => onEdit(question)}>Edit</button>
        <button className="danger" onClick={() => onDelete(question._id)}>Delete</button>
      </div>
    </div>
  );
}


function QuestionModal({ formData, setFormData, onSubmit, onClose, isEditing, subjects }) {
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isEditing ? 'Edit Question' : 'Add New Question'}</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Subject:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              list="subjects"
              required
            />
            <datalist id="subjects">
              {Array.isArray(subjects) && subjects.map(subject => (
                <option key={subject} value={subject} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label>Question:</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Correct Answer:</label>
            <textarea
              type="text"
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Difficulty:</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
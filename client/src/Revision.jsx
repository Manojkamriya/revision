import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Revision.css'; 
import './accordionAnimation.css'; // ✅ Import animation CSS

const RevisionComponent = () => {
 const API_URL = import.meta.env.VITE_API_URL;
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('MERN');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchQuestions(selectedSubject);
    } else {
      setQuestions([]);
    }
  }, [selectedSubject]);

  const fetchQuestions = async (subject) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}?subject=${subject}`);
      setQuestions(response.data || []);
      setExpandedQuestions(new Set()); // collapse all
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
      const response =  await axios.get(`${API_URL}/api/subjects`);
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
  };

  const getDifficultyClass = (difficulty) => {
    return `difficulty-badge difficulty-${difficulty.toLowerCase()}`;
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedQuestions(new Set(questions.map((q) => q._id)));
  };

  const collapseAll = () => {
    setExpandedQuestions(new Set());
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Revision Mode</h1>
        <p>Review questions by subject - Click to reveal answers</p>
      </div>

      <div className="controls">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select a subject</option>
          {Array.isArray(subjects) &&
            subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
        </select>

        {questions.length > 0 && (
          <div>
            <button onClick={expandAll}>Expand All</button>
            <button onClick={collapseAll}>Collapse All</button>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {!selectedSubject ? (
        <div className="empty-state">
          <h3>Select a subject to start revision</h3>
          <p>Choose a subject from the dropdown above to view questions</p>
        </div>
      ) : loading ? (
        <div className="loading">Loading questions</div>
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <h3>No questions found for {selectedSubject}</h3>
          <p>Add some questions in this subject to start revising</p>
        </div>
      ) : (
        <div className="revision-container">
          <div className="accordion">
            {questions.map((question, index) => {
              const isExpanded = expandedQuestions.has(question._id);
              return (
                <div key={question._id} className="accordion-item">
                  <div
                    className="accordion-header"
                    onClick={() => toggleQuestion(question._id)}
                  >
                    <div className="question-content">
                      <span className="question-number">{index + 1}.</span>
                      <span className="question-text">{question.question}</span>
                    </div>
                    <div className="question-meta">
                      {/* <span className={getDifficultyClass(question.difficulty)}>
                        {question.difficulty}
                      </span> */}
                      <span
                        className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                      >
                        {isExpanded ? '-' : '+'}
                      </span>
                    </div>
                  </div>

                  {/* ✅ Keep element mounted for animation */}
                  <div
                    className={`accordion-content ${
                      isExpanded ? 'open' : 'closed'
                    }`}
                  >
                    <div className="accordion-content-inner">
                      <div className="answer-section">
                        <span className="answer-label">Correct Answer:</span>
                        <div className="answer-content correct">
                          {question.correctAnswer}
                        </div>
                      </div>

                      {question.userAnswer && (
                        <div className="answer-section">
                          <span className="answer-label">Your Answer:</span>
                          <div
                            className={`answer-content ${
                              question.isCorrect ? 'correct' : 'incorrect'
                            }`}
                          >
                            {question.userAnswer}
                            <span
                              className={`answer-status ${
                                question.isCorrect ? 'correct' : 'incorrect'
                              }`}
                            >
                              {question.isCorrect
                                ? '✓ Correct'
                                : '✗ Incorrect'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RevisionComponent;

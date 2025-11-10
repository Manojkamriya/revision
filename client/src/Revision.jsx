import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Revision.css'; 
import './accordionAnimation.css'; 

const RevisionComponent = () => {
 const API_URL = import.meta.env.VITE_API_URL;
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("MERN");
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

  const fetchQuestions = async (subject, forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // check cache if not force refreshing
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(`questions_${subject}`);
        if (cachedData) {
          setQuestions(JSON.parse(cachedData));
          setExpandedQuestions(new Set());
          setLoading(false);
          return;
        }
      }

      // fetch from API
      const response = await axios.get(
        `${API_URL}/api/questions?subject=${subject}`
      );
      const data = response.data || [];

      setQuestions(data);
      setExpandedQuestions(new Set());

      // save to cache
      localStorage.setItem(`questions_${subject}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to fetch questions");
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
      console.error("Error fetching subjects:", error);
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

  const clearCache = () => {
    // remove all subject cache
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("questions_")) {
        localStorage.removeItem(key);
      }
    });
    // refetch fresh data for current subject
    fetchQuestions(selectedSubject, true);
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
             <button onClick={clearCache}>Refresh</button>
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
                       <span
                        className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                      >
                        {isExpanded ? '-' : '+'}
                      </span>
                       </div>
 
                  </div>

                  <div
                    className={`accordion-content ${
                      isExpanded ? 'open' : 'closed'
                    }`}
                  >
                    <div className="accordion-content-inner">
                      <div className="answer-section">
                        <span className="answer-label" style={{ whiteSpace: 'pre-wrap'}}>Correct Answer:</span>
                        <div className="answer-content correct">
                          {question.correctAnswer}
                        </div>
                      </div>

                    
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

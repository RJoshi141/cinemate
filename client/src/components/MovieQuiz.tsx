import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieQuiz.css';

const MovieQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<string[]>(new Array(4).fill(''));
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Example questions and options for the quiz
  const questions = [
    {
      question: "What type of movie do you prefer?",
      options: ["Action", "Comedy", "Drama", "Horror"],
    },
    {
      question: "Do you like movies with a lot of special effects?",
      options: ["Yes", "No"],
    },
    {
      question: "What's your favorite movie setting?",
      options: ["Space", "Fantasy", "Realistic", "Historical"],
    },
    {
      question: "Do you prefer movies with a happy or sad ending?",
      options: ["Happy", "Sad", "Any"],
    },
  ];

  // Handle answer selection
  const handleAnswerSelection = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  // Handle form submission (redirect to recommendations page)
  const handleSubmit = () => {
    if (answers.includes('')) {
      setError('Please answer all questions');
      return;
    }
    // Redirect to recommendations page and pass answers as state
    navigate('/recommendations', { state: { answers } });
  };

  return (
    <div className="movie-quiz">
      <h2>Movie Quiz</h2>
      <div className="quiz-container">
        {questions.map((question, index) => (
          <div className="quiz-question" key={index}>
            <p>{question.question}</p>
            <div className="quiz-options">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  className={`quiz-option ${answers[index] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelection(index, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <div className="error">{error}</div>}

      <div className="quiz-footer">
        <button className="quiz-submit" onClick={handleSubmit}>
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default MovieQuiz;

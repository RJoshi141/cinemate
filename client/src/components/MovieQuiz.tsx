import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faFireFlameCurved, faSmileBeam, faMasksTheater, faGhost } from '@fortawesome/free-solid-svg-icons';
import './MovieQuiz.css';

const questionIcons = [faFilm, faFireFlameCurved, faSmileBeam, faMasksTheater];

const questions = [
  {
    question: "Pick tonight's vibe",
    options: ['Action', 'Comedy', 'Drama', 'Horror'],
  },
  {
    question: 'Crave spectacle?',
    options: ['Absolutely', 'Prefer practical magic'],
  },
  {
    question: 'Dream setting',
    options: ['Out in space', 'Epic fantasy', 'Real-world grit', 'Historical saga'],
  },
  {
    question: 'How should it end?',
    options: ['Give me hope', 'Break my heart', 'Surprise me'],
  },
];

const MovieQuiz: React.FC = () => {
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAnswerSelection = (questionIndex: number, answer: string) => {
    setAnswers((prev) => {
      const clone = [...prev];
      clone[questionIndex] = answer;
      return clone;
    });
  };

  const handleSubmit = () => {
    if (answers.some((answer) => !answer)) {
      setError('Select an answer for each question to unlock your perfect pick.');
      return;
    }
    navigate('/', { state: { answers } });
  };

  return (
    <div className="movie-quiz">
      <div className="quiz-hero">
        <span className="quiz-pill">
          <FontAwesomeIcon icon={faGhost} />
          Cinemate Quiz
        </span>
        <h1>Build Tonight’s Scene</h1>
        <p>
          Answer a few quick questions and we’ll cue up the movie that matches your mood. No algorithms in sight—just
          pure cinema intuition.
        </p>
      </div>

      <div className="quiz-grid">
        {questions.map((question, index) => (
          <div className="quiz-card" key={question.question}>
            <div className="quiz-card__icon">
              <FontAwesomeIcon icon={questionIcons[index % questionIcons.length]} />
            </div>
            <h3>{question.question}</h3>
            <div className="quiz-options">
              {question.options.map((option) => (
                <button
                  key={option}
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

      {error && <div className="quiz-error">{error}</div>}

      <div className="quiz-footer">
        <button className="quiz-submit" onClick={handleSubmit}>
          Reveal My Match
        </button>
      </div>
    </div>
  );
};

export default MovieQuiz;

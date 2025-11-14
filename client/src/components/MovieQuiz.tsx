import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faFireFlameCurved, faSmileBeam, faMasksTheater } from '@fortawesome/free-solid-svg-icons';
import './MovieQuiz.css';

const questionIcons = [faFilm, faFireFlameCurved, faSmileBeam, faMasksTheater];

const questions = [
  {
    id: 'mood',
    question: "What's tonight's energy?",
    options: [
      { label: 'Adrenaline rush', value: 'mood_action' },
      { label: 'Feel-good laughs', value: 'mood_comedy' },
      { label: 'Character-driven drama', value: 'mood_drama' },
      { label: 'Dark and twisty', value: 'mood_thriller' },
      { label: 'Bold sci-fi adventure', value: 'mood_scifi' },
    ],
  },
  {
    id: 'pace',
    question: 'Choose the pace',
    options: [
      { label: 'High-octane and fast', value: 'pace_fast' },
      { label: 'Balanced with big moments', value: 'pace_balanced' },
      { label: 'Slow-burn and immersive', value: 'pace_slow' },
    ],
  },
  {
    id: 'setting',
    question: 'Pick a backdrop',
    options: [
      { label: 'Futuristic worlds', value: 'setting_futuristic' },
      { label: 'Historical epics', value: 'setting_historical' },
      { label: 'Urban grit', value: 'setting_urban' },
      { label: 'Mythic realms', value: 'setting_fantasy' },
    ],
  },
  {
    id: 'release',
    question: 'How recent should it feel?',
    options: [
      { label: 'Latest releases', value: 'release_recent' },
      { label: 'Past decade standouts', value: 'release_decade' },
      { label: 'Modern classics', value: 'release_modern' },
      { label: 'Throwback gems', value: 'release_classic' },
    ],
  },
];

interface QuizRecommendation {
  params: Record<string, string>;
  tags: string[];
  headline: string;
}

const buildRecommendation = (answers: string[]): QuizRecommendation => {
  const [mood, pace, setting, release] = answers;

  const params: Record<string, string> = {
    include_adult: 'false',
    language: 'en-US',
    'vote_count.gte': '100',
  };
  const genres = new Set<number>();
  const tags: string[] = [];

  const moodConfig: Record<string, { genres: number[]; tag: string }> = {
    mood_action: { genres: [28, 53], tag: 'Adrenaline-fueled thrills' },
    mood_comedy: { genres: [35, 10751], tag: 'Feel-good laughs' },
    mood_drama: { genres: [18, 10749], tag: 'Character-driven drama' },
    mood_thriller: { genres: [53, 9648], tag: 'Dark and twisty suspense' },
    mood_scifi: { genres: [878, 12], tag: 'Bold sci-fi adventures' },
  };

  const paceConfig: Record<string, { sortBy: string; extraParams?: Record<string, string>; tag: string }> = {
    pace_fast: {
      sortBy: 'popularity.desc',
      extraParams: { 'vote_count.gte': '300' },
      tag: 'High-energy crowd pleasers',
    },
    pace_balanced: {
      sortBy: 'vote_average.desc',
      extraParams: { 'vote_count.gte': '400' },
      tag: 'Critically-loved standouts',
    },
    pace_slow: {
      sortBy: 'vote_average.desc',
      extraParams: { 'with_runtime.gte': '120', 'vote_count.gte': '200' },
      tag: 'Slow-burn immersive tales',
    },
  };

  const settingConfig: Record<string, { genres?: number[]; tag: string }> = {
    setting_futuristic: { genres: [878], tag: 'Futuristic worlds' },
    setting_historical: { genres: [36], tag: 'Historical epics' },
    setting_urban: { genres: [80], tag: 'Urban grit' },
    setting_fantasy: { genres: [14], tag: 'Mythic realms' },
  };

  const releaseConfig: Record<string, { gte?: string; lte?: string; tag: string }> = (() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const recentStart = `${currentYear - 1}-01-01`;
    const decadeStart = `${currentYear - 9}-01-01`;
    const modernStart = '2000-01-01';
    const modernEnd = `${currentYear - 10}-12-31`;
    const classicEnd = '1990-12-31';
    return {
      release_recent: { gte: recentStart, tag: 'Latest releases' },
      release_decade: { gte: decadeStart, tag: 'Past decade standouts' },
      release_modern: { gte: modernStart, lte: modernEnd, tag: 'Modern classics' },
      release_classic: { lte: classicEnd, tag: 'Throwback gems' },
    };
  })();

  const applyGenres = (list?: number[]) => {
    if (list) {
      list.forEach((id) => genres.add(id));
    }
  };

  const moodRule = moodConfig[mood];
  if (moodRule) {
    applyGenres(moodRule.genres);
    tags.push(moodRule.tag);
  }

  const paceRule = paceConfig[pace];
  if (paceRule) {
    params.sort_by = paceRule.sortBy;
    if (paceRule.extraParams) {
      Object.entries(paceRule.extraParams).forEach(([key, value]) => {
        params[key] = value;
      });
    }
    tags.push(paceRule.tag);
  } else if (!params.sort_by) {
    params.sort_by = 'popularity.desc';
  }

  const settingRule = settingConfig[setting];
  if (settingRule) {
    applyGenres(settingRule.genres);
    tags.push(settingRule.tag);
  }

  const releaseRule = releaseConfig[release];
  if (releaseRule) {
    if (releaseRule.gte) params['primary_release_date.gte'] = releaseRule.gte;
    if (releaseRule.lte) params['primary_release_date.lte'] = releaseRule.lte;
    tags.push(releaseRule.tag);
  }

  if (genres.size > 0) {
    params.with_genres = Array.from(genres).join(',');
  }

  if (!params.sort_by) {
    params.sort_by = 'popularity.desc';
  }

  return {
    params,
    tags,
    headline: 'Quiz Picks',
  };
};

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
    setError(null);
  };

  const answeredCount = answers.filter(Boolean).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);
  const isComplete = answeredCount === questions.length;

  const handleSubmit = () => {
    if (answers.some((answer) => !answer)) {
      setError('Select an answer for each question to unlock your perfect pick.');
      return;
    }
    const recommendation = buildRecommendation(answers);
    navigate('/', { state: { quizRecommendation: recommendation } });
  };

  return (
    <section className="movie-quiz-screen">
    <div className="movie-quiz">
      <div className="quiz-hero">
        <h1>Build Tonight’s Scene</h1>
        <p>
          Answer a few quick questions and we’ll cue up the movie that matches your mood. No algorithms in sight—just
          pure cinema intuition.
        </p>
      </div>

        <div className="quiz-progress">
          <div className="quiz-progress__meta">
            <span className="quiz-progress__label">Progress</span>
            <span className="quiz-progress__value">
              {answeredCount}/{questions.length}
            </span>
          </div>
          <div className="quiz-progress__bar">
            <div className="quiz-progress__bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

      <div className="quiz-grid">
        {questions.map((question, index) => (
          <div className="quiz-card" key={question.question}>
              <div className="quiz-card__meta">
                <span className="quiz-card__number">{String(index + 1).padStart(2, '0')}</span>
            <div className="quiz-card__icon">
              <FontAwesomeIcon icon={questionIcons[index % questionIcons.length]} />
                </div>
            </div>
            <h3>{question.question}</h3>
            <div className="quiz-options">
              {question.options.map((option) => (
                <button
                    key={option.value}
                    className={`quiz-option ${answers[index] === option.value ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelection(index, option.value)}
                >
                    <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <div className="quiz-error">{error}</div>}

      <div className="quiz-footer">
          <button className="quiz-submit" onClick={handleSubmit} disabled={!isComplete}>
          Reveal My Match
        </button>
      </div>
    </div>
    </section>
  );
};

export default MovieQuiz;

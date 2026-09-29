import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, ArrowRight } from 'lucide-react';
import { COMPREHENSION_QUESTIONS } from '../data/storyData';

export const QuizView: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleCheckAnswers = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qId, ans]) => {
    const q = COMPREHENSION_QUESTIONS.find((item) => item.id === Number(qId));
    return acc + (q && q.correctAnswer === ans ? 1 : 0);
  }, 0);

  const allAnswered = COMPREHENSION_QUESTIONS.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 pb-32">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2 border border-amber-300">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>A2 Reading & Listening Comprehension Check</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Story Understanding Quiz
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto mt-1">
          Test what you learned from listening to Ali's good day in the village.
        </p>
      </div>

      {submitted && (
        <div className="mb-8 p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-600 text-white flex items-center justify-center mb-3 shadow-md">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">
            You scored {score} out of {COMPREHENSION_QUESTIONS.length}!
          </h3>
          <p className="text-sm text-stone-600 mt-1 max-w-sm mx-auto">
            {score === COMPREHENSION_QUESTIONS.length
              ? 'Outstanding! You understood the story and lessons perfectly!'
              : 'Great effort! Review the explanations below to master the story.'}
          </p>
          <button
            onClick={handleReset}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      <div className="space-y-6">
        {COMPREHENSION_QUESTIONS.map((q, idx) => {
          const userAnswer = selectedAnswers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-rose-50/70 border-rose-300'
                  : 'bg-white border-stone-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center shrink-0 border border-stone-300">
                  {idx + 1}
                </span>
                <h4 className="font-serif text-base sm:text-lg font-semibold text-stone-900">
                  {q.question}
                </h4>
              </div>

              <div className="space-y-2.5 ml-1 sm:ml-10">
                {q.options.map((option, optIdx) => {
                  const isOptionSelected = userAnswer === optIdx;
                  let optionClass =
                    'border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 text-stone-700';

                  if (submitted) {
                    if (optIdx === q.correctAnswer) {
                      optionClass = 'border-emerald-500 bg-emerald-100 text-emerald-950 font-semibold';
                    } else if (isOptionSelected) {
                      optionClass = 'border-rose-400 bg-rose-100 text-rose-950';
                    } else {
                      optionClass = 'border-stone-200 bg-stone-50 opacity-50';
                    }
                  } else if (isOptionSelected) {
                    optionClass = 'border-amber-500 bg-amber-100 text-amber-950 font-semibold shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={submitted}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionClass}`}
                    >
                      <span>{option}</span>
                      {submitted && optIdx === q.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {submitted && isOptionSelected && optIdx !== q.correctAnswer && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-4 p-3 rounded-xl bg-white/80 border border-stone-200/80 text-xs sm:text-sm text-stone-600 ml-1 sm:ml-10">
                  <span className="font-semibold text-stone-800">Explanation: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="mt-8 text-center">
          <button
            onClick={handleCheckAnswers}
            disabled={!allAnswered}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm shadow-md transition-all ${
              allAnswered
                ? 'bg-amber-600 hover:bg-amber-700 text-white hover:scale-105 active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Check My Answers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {!allAnswered && (
            <p className="text-xs text-stone-500 mt-2">
              Please answer all 4 questions before checking your score.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

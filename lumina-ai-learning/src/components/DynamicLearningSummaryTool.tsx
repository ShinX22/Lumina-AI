import React, { useState, useRef } from 'react';
import {
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText,
  Brain,
  ChevronDown,
  Send,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  analyzeLargeDocument,
  evaluateUserResponse,
  DocumentAnalysis,
  DocumentQuestion,
  UserFeedback,
} from '../tools/dynamicLearningSummaryTool';

interface DLTComponentProps {
  apiKey: string;
}

interface EvaluationState {
  isEvaluating: boolean;
  evaluation: null | { evaluation: string; score: number; suggestions: string[] };
  error: null | string;
}

export default function DynamicLearningSummaryTool({ apiKey }: DLTComponentProps) {
  const [documentText, setDocumentText] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [userFeedback, setUserFeedback] = useState<Record<string, UserFeedback>>({});
  const [evaluations, setEvaluations] = useState<
    Record<
      string,
      { evaluation: string; score: number; suggestions: string[] }
    >
  >({});
  const [evaluatingQuestionId, setEvaluatingQuestionId] = useState<
    string | null
  >(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setDocumentText(text);
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleAnalyzeDocument = async () => {
    if (!documentText.trim()) {
      setError('Please upload a document first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeLargeDocument(
        documentText,
        documentTitle || 'Untitled Document',
        apiKey
      );
      setAnalysis(result);
      setCurrentQuestionIndex(0);
      setUserResponses({});
      setUserFeedback({});
      setEvaluations({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResponseChange = (questionId: string, response: string) => {
    setUserResponses((prev) => ({
      ...prev,
      [questionId]: response,
    }));
  };

  const handleFeedbackChange = (
    questionId: string,
    field: keyof UserFeedback,
    value: any
  ) => {
    setUserFeedback((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        [field]: value,
      },
    }));
  };

  const handleEvaluateResponse = async (questionId: string) => {
    if (!analysis || !userResponses[questionId]) {
      setError('Please provide a response before evaluating');
      return;
    }

    setEvaluatingQuestionId(questionId);
    setIsEvaluating(true);

    try {
      const question = analysis.questions.find((q) => q.id === questionId);
      if (!question) return;

      const feedback = userFeedback[questionId] || {
        questionId,
        userResponse: userResponses[questionId],
        clarity: 3,
        difficulty: 3,
      };

      const evaluation = await evaluateUserResponse(
        question,
        userResponses[questionId],
        documentText.substring(0, 5000),
        feedback,
        apiKey
      );

      setEvaluations((prev) => ({
        ...prev,
        [questionId]: evaluation,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Evaluation failed. Please try again.'
      );
    } finally {
      setIsEvaluating(false);
      setEvaluatingQuestionId(null);
    }
  };

  const currentQuestion = analysis?.questions[currentQuestionIndex];
  const currentEvaluation = currentQuestion
    ? evaluations[currentQuestion.id]
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-lg p-6 mb-6 border border-purple-500">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-cyan-400" />
          <h2 className="text-3xl font-bold text-white">
            Dynamic Learning Summary Tool
          </h2>
        </div>
        <p className="text-purple-200">
          Upload a document and get 5 unique, complex questions tailored to its
          content
        </p>
      </div>

      {/* Document Upload Section */}
      {!analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-lg p-6 border border-slate-700 mb-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Step 1: Upload Document
          </h3>

          <div
            className="border-2 border-dashed border-purple-500 rounded-lg p-8 text-center cursor-pointer hover:bg-purple-900/20 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="text-white font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-slate-400 text-sm">
              TXT, PDF (as text), or any text document
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.md,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {documentText && (
            <div className="mt-4 p-4 bg-slate-800 rounded border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <p className="text-white font-medium">{documentTitle}</p>
              </div>
              <p className="text-slate-400 text-sm">
                {documentText.length.toLocaleString()} characters
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <button
            onClick={handleAnalyzeDocument}
            disabled={!documentText || isAnalyzing}
            className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Document...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Generate 5 Complex Questions
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Questions Section */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Analysis Summary */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Document Analysis
            </h3>
            <p className="text-slate-300 mb-4">{analysis.summary}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-slate-400 text-sm mb-2">Key Topics</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyTopics.slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="bg-blue-900/40 text-blue-200 px-3 py-1 rounded text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">Main Themes</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.mainThemes.slice(0, 3).map((theme, i) => (
                    <span
                      key={i}
                      className="bg-purple-900/40 text-purple-200 px-3 py-1 rounded text-sm"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setAnalysis(null);
                setDocumentText('');
                setUserResponses({});
                setUserFeedback({});
                setEvaluations({});
              }}
              className="text-slate-400 hover:text-white text-sm underline"
            >
              ← Upload Different Document
            </button>
          </div>

          {/* Questions Navigation */}
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Question {currentQuestionIndex + 1} of {analysis.questions.length}
              </h3>
              <div className="flex gap-2">
                {analysis.questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`w-10 h-10 rounded-lg font-bold transition ${
                      i === currentQuestionIndex
                        ? 'bg-cyan-500 text-slate-900'
                        : evaluations[q.id]
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    {evaluations[q.id] ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      i + 1
                    )}
                  </button>
                ))}
              </div>
            </div>

            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Question */}
                <div className="bg-slate-800 p-4 rounded border border-slate-600">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-white font-medium">
                      {currentQuestion.question}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        currentQuestion.difficulty === 'expert'
                          ? 'bg-red-900 text-red-200'
                          : currentQuestion.difficulty === 'advanced'
                            ? 'bg-orange-900 text-orange-200'
                            : 'bg-yellow-900 text-yellow-200'
                      }`}
                    >
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Topic: {currentQuestion.topic}
                  </p>
                  <p className="text-slate-500 text-xs mt-2 italic">
                    Context: {currentQuestion.context.substring(0, 100)}...
                  </p>
                </div>

                {/* Response Input */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    Your Response
                  </label>
                  <textarea
                    value={userResponses[currentQuestion.id] || ''}
                    onChange={(e) =>
                      handleResponseChange(currentQuestion.id, e.target.value)
                    }
                    disabled={!!currentEvaluation}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 outline-none disabled:opacity-50"
                    placeholder="Type your detailed response here..."
                    rows={4}
                  />
                </div>

                {/* Feedback Section */}
                {!currentEvaluation && (
                  <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded border border-slate-700">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Question Clarity
                      </label>
                      <select
                        value={
                          userFeedback[currentQuestion.id]?.clarity || 3
                        }
                        onChange={(e) =>
                          handleFeedbackChange(
                            currentQuestion.id,
                            'clarity',
                            parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5
                          )
                        }
                        className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                      >
                        <option value="1">Very Unclear</option>
                        <option value="2">Unclear</option>
                        <option value="3">Neutral</option>
                        <option value="4">Clear</option>
                        <option value="5">Very Clear</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">
                        Perceived Difficulty
                      </label>
                      <select
                        value={
                          userFeedback[currentQuestion.id]?.difficulty || 3
                        }
                        onChange={(e) =>
                          handleFeedbackChange(
                            currentQuestion.id,
                            'difficulty',
                            parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5
                          )
                        }
                        className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                      >
                        <option value="1">Too Easy</option>
                        <option value="2">Easy</option>
                        <option value="3">Fair</option>
                        <option value="4">Hard</option>
                        <option value="5">Too Hard</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Evaluation Result */}
                {currentEvaluation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-900/20 border border-green-500 rounded p-4 space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                      <h4 className="text-lg font-bold text-green-200">
                        Evaluation Complete
                      </h4>
                    </div>

                    <div className="bg-slate-900/50 p-3 rounded">
                      <p className="text-slate-300 mb-3">
                        {currentEvaluation.evaluation}
                      </p>

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-slate-400 font-medium">
                            Score
                          </span>
                          <span className="text-2xl font-bold text-cyan-400">
                            {currentEvaluation.score}/100
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-cyan-400 h-2 rounded-full"
                            style={{
                              width: `${currentEvaluation.score}%`,
                            }}
                          />
                        </div>
                      </div>

                      {currentEvaluation.suggestions.length > 0 && (
                        <div>
                          <p className="text-slate-400 text-sm font-medium mb-2">
                            Suggestions for Improvement:
                          </p>
                          <ul className="space-y-2">
                            {currentEvaluation.suggestions.map((s, i) => (
                              <li
                                key={i}
                                className="text-slate-300 text-sm pl-4 border-l border-cyan-500"
                              >
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Evaluate Button */}
                {!currentEvaluation && (
                  <button
                    onClick={() => handleEvaluateResponse(currentQuestion.id)}
                    disabled={
                      !userResponses[currentQuestion.id] ||
                      evaluatingQuestionId === currentQuestion.id
                    }
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {evaluatingQuestionId === currentQuestion.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit for Evaluation
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* Progress Summary */}
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <p className="text-slate-300">
                Progress:{' '}
                <span className="font-bold text-cyan-400">
                  {Object.keys(evaluations).length}/{analysis.questions.length}
                </span>{' '}
                questions evaluated
              </p>
              {Object.keys(evaluations).length === analysis.questions.length && (
                <div className="flex items-center gap-2 text-green-400">
                  <Star className="w-5 h-5" />
                  <span className="font-bold">All questions complete!</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { api, getAuthToken, removeAuthToken } from "@/lib/api";
import "./page.css";

// Types
type UserProfile = {
  id?: number | string;
  name: string;
  email: string;
  role?: string;
  target?: string;
};

type CourseItem = {
  id: number;
  code: string;
  title: string;
  category: string;
  instructor: string;
  progress: number;
  enrolled: boolean;
  topics: string[];
};

type ExamQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
};

type ExamItem = {
  id: number;
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "practice" | "mock";
  questions: ExamQuestion[];
};

type ExamResult = {
  id: string;
  examTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  date: string;
  answers: {
    question: string;
    selected: string;
    correct: string;
    isCorrect: boolean;
    explanation: string;
  }[];
};

// Initial Demo Courses matching SAGE curriculum
const initialCourses: CourseItem[] = [
  {
    id: 1,
    code: "LIT-201",
    title: "Literature & Text Analysis",
    category: "Literature",
    instructor: "Mr. Joseph O. Giwa",
    progress: 72,
    enrolled: true,
    topics: [
      "Critical Text Analysis & Unseen Poetry",
      "Mastery of Literary Devices & Figures of Speech",
      "Dramatic Irony, Soliloquies & Thematic Development",
      "Character Motivation & Structural Essay Composition",
    ],
  },
  {
    id: 2,
    code: "GOV-102",
    title: "Government & Political Systems",
    category: "Civics & Governance",
    instructor: "Mr. Joseph O. Giwa",
    progress: 85,
    enrolled: true,
    topics: [
      "Forms of Government: Unitary, Federal & Confederal",
      "Separation of Powers & Constitutional Checks",
      "Historical Events, Timelines & Civic Evolution",
      "Electoral Systems, Political Parties & Public Administration",
    ],
  },
  {
    id: 3,
    code: "ENG-101",
    title: "English Language & Advanced Composition",
    category: "Language",
    instructor: "Mr. Joseph O. Giwa",
    progress: 60,
    enrolled: true,
    topics: [
      "Complex Grammar, Syntax & Lexical Precision",
      "Reading Comprehension & Contextual Inference",
      "Persuasive, Expository & Argumentative Essays",
      "Vocabulary Expansion & Standard Academic Writing",
    ],
  },
  {
    id: 4,
    code: "CRS-101",
    title: "Christian Religious Studies",
    category: "Religious & Moral Thought",
    instructor: "Mr. Joseph O. Giwa",
    progress: 40,
    enrolled: false,
    topics: [
      "Sovereignty of God & Early Biblical Narratives",
      "The Prophetic Tradition & Moral Leadership",
      "Pauline Epistles & Theological Doctrines",
      "Faith, Ethics & Civic Responsibility in Practice",
    ],
  },
];

// Curated Practice Exams
const sampleExams: ExamItem[] = [
  {
    id: 101,
    title: "Literature: Text Analysis & Literary Devices Diagnostic",
    subject: "Literature",
    durationMinutes: 15,
    totalQuestions: 5,
    difficulty: "Intermediate",
    type: "practice",
    questions: [
      {
        id: 1,
        question:
          "In poetry analysis, when a writer attributes human emotions or qualities to inanimate nature, which literary device is primarily employed?",
        options: ["Pathetic fallacy", "Onomatopoeia", "Synecdoche", "Metonymy"],
        correctAnswer: 0,
        explanation:
          "Pathetic fallacy is a specific type of personification where inanimate nature or the weather is depicted as having human emotions or sympathy.",
        subject: "Literature",
      },
      {
        id: 2,
        question:
          "Read the phrase: 'The pen is mightier than the sword.' Which figure of speech is demonstrated here?",
        options: ["Hyperbole", "Metonymy", "Oxymoron", "Apostrophe"],
        correctAnswer: 1,
        explanation:
          "Metonymy replaces the name of a thing with something closely associated with it ('pen' for the written word/diplomacy, 'sword' for military force).",
        subject: "Literature",
      },
      {
        id: 3,
        question:
          "What is the term for a dramatic speech delivered by a character alone on stage, revealing their private inner thoughts?",
        options: ["Dialogue", "Monologue", "Soliloquy", "Aside"],
        correctAnswer: 2,
        explanation:
          "A soliloquy is a speech in drama where a character speaks their private thoughts while alone onstage.",
        subject: "Literature",
      },
      {
        id: 4,
        question:
          "When the audience or reader knows crucial information that a character in the story is unaware of, this is known as:",
        options: [
          "Verbal irony",
          "Dramatic irony",
          "Situational irony",
          "Cosmic irony",
        ],
        correctAnswer: 1,
        explanation:
          "Dramatic irony occurs when the audience understands the true significance of a situation, but the characters do not.",
        subject: "Literature",
      },
      {
        id: 5,
        question:
          "Which meter consists of five metrical feet, each containing an unstressed syllable followed by a stressed syllable?",
        options: [
          "Trochaic octameter",
          "Anapestic tetrameter",
          "Iambic pentameter",
          "Dactylic hexameter",
        ],
        correctAnswer: 2,
        explanation:
          "Iambic pentameter consists of five iambs (da-DUM da-DUM da-DUM da-DUM da-DUM), the classical meter used by Shakespeare and Milton.",
        subject: "Literature",
      },
    ],
  },
  {
    id: 102,
    title: "Government: Political Systems, Constitutions & Civic Life",
    subject: "Government",
    durationMinutes: 15,
    totalQuestions: 5,
    difficulty: "Advanced",
    type: "practice",
    questions: [
      {
        id: 1,
        question:
          "Which constitutional system distributes sovereign power between a central national authority and autonomous regional component states?",
        options: [
          "Unitary system",
          "Federal system",
          "Confederal system",
          "Monarchical system",
        ],
        correctAnswer: 1,
        explanation:
          "A federal system constitutionally divides and shares power between a central national government and regional or state subdivisions.",
        subject: "Government",
      },
      {
        id: 2,
        question:
          "The doctrine of 'Separation of Powers' was most prominently articulated by which political philosopher?",
        options: [
          "Thomas Hobbes",
          "John Locke",
          "Baron de Montesquieu",
          "Jean-Jacques Rousseau",
        ],
        correctAnswer: 2,
        explanation:
          "Baron de Montesquieu outlined the separation of executive, legislative, and judicial branches in 'The Spirit of the Laws' (1748).",
        subject: "Government",
      },
      {
        id: 3,
        question:
          "What is the fundamental principle that every citizen and governing body is subject to the law without arbitrary privilege?",
        options: [
          "Rule of Law",
          "Popular Sovereignty",
          "Prerogative of Mercy",
          "Judicial Precedent",
        ],
        correctAnswer: 0,
        explanation:
          "The Rule of Law asserts that laws apply equally to all people, leaders, and institutions, preventing arbitrary governance.",
        subject: "Government",
      },
      {
        id: 4,
        question:
          "In a parliamentary system of government, from where does the Executive branch derive its democratic mandate?",
        options: [
          "Direct popular presidential ballot",
          "The military council",
          "The Legislature (Parliament)",
          "The Judiciary",
        ],
        correctAnswer: 2,
        explanation:
          "In a parliamentary system, the prime minister and cabinet are chosen from and held accountable to the legislative assembly.",
        subject: "Government",
      },
      {
        id: 5,
        question:
          "Which mechanism empowers citizens to vote directly on a specific proposed constitutional amendment or national law?",
        options: ["Plebiscitary veto", "Referendum", "Filibuster", "Impeachment"],
        correctAnswer: 1,
        explanation:
          "A referendum is a direct vote by the electorate on a specific legislative or constitutional proposal.",
        subject: "Government",
      },
    ],
  },
  {
    id: 103,
    title: "English: Advanced Comprehension, Grammar & Syntax",
    subject: "English Language",
    durationMinutes: 12,
    totalQuestions: 4,
    difficulty: "Intermediate",
    type: "practice",
    questions: [
      {
        id: 1,
        question:
          "Identify the sentence that correctly maintains subject-verb agreement:",
        options: [
          "Neither the tutor nor the students was present in the hall.",
          "Neither the tutor nor the students were present in the hall.",
          "Neither the students nor the tutor were present in the hall.",
          "Either of the books are acceptable for the exam.",
        ],
        correctAnswer: 1,
        explanation:
          "When subjects are joined by 'neither... nor', the verb agrees with the subject closest to it ('students were').",
        subject: "English Language",
      },
      {
        id: 2,
        question:
          "Choose the word that is most nearly opposite in meaning to 'EPHEMERAL':",
        options: ["Transient", "Fleeting", "Perpetual", "Momentary"],
        correctAnswer: 2,
        explanation:
          "'Ephemeral' means lasting a very short time. 'Perpetual' means lasting forever or indefinitely.",
        subject: "English Language",
      },
      {
        id: 3,
        question:
          "Which of the following contains a dangling modifier?",
        options: [
          "Having finished the essay, the laptop was shut down by Samuel.",
          "Having finished the essay, Samuel shut down his laptop.",
          "While Samuel wrote the essay, his laptop battery ran low.",
          "Samuel shut down his laptop after completing the essay.",
        ],
        correctAnswer: 0,
        explanation:
          "In option A, 'Having finished the essay' grammatically modifies 'the laptop', suggesting the laptop wrote the essay.",
        subject: "English Language",
      },
      {
        id: 4,
        question:
          "Select the option containing the correct punctuation for a compound sentence joined by a conjunctive adverb:",
        options: [
          "She prepared thoroughly, however, the exam was demanding.",
          "She prepared thoroughly; however, the exam was demanding.",
          "She prepared thoroughly however; the exam was demanding.",
          "She prepared thoroughly: however the exam was demanding.",
        ],
        correctAnswer: 1,
        explanation:
          "Two independent clauses joined by a conjunctive adverb ('however') must be separated by a semicolon before and a comma after.",
        subject: "English Language",
      },
    ],
  },
];

// Initial past test result
const initialResults: ExamResult[] = [
  {
    id: "att-101",
    examTitle: "Literature: Text Analysis & Literary Devices Diagnostic",
    subject: "Literature",
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    passed: true,
    date: "2026-10-18",
    answers: [
      {
        question: "Pathetic fallacy vs personification identification",
        selected: "Pathetic fallacy",
        correct: "Pathetic fallacy",
        isCorrect: true,
        explanation: "Correctly recognized attribution of emotional states to nature.",
      },
      {
        question: "Metonymy identification in classical idioms",
        selected: "Metonymy",
        correct: "Metonymy",
        isCorrect: true,
        explanation: "Correctly identified pen and sword as metonyms.",
      },
      {
        question: "Soliloquy definition in drama",
        selected: "Soliloquy",
        correct: "Soliloquy",
        isCorrect: true,
        explanation: "Correctly identified private thought speech onstage.",
      },
      {
        question: "Dramatic irony mechanisms",
        selected: "Dramatic irony",
        correct: "Dramatic irony",
        isCorrect: true,
        explanation: "Correctly distinguished audience knowledge from character knowledge.",
      },
      {
        question: "Iambic pentameter metrical scansion",
        selected: "Iambic pentameter",
        correct: "Iambic pentameter",
        isCorrect: true,
        explanation: "Correctly counted five iambic feet.",
      },
    ],
  },
];

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "exams" | "results" | "resources"
  >("overview");

  // User state
  const [user, setUser] = useState<UserProfile>({
    name: "Samuel Oluwabusayo Deborah",
    email: "samuel.deb@sageacademic.com",
    role: "Student",
    target: "University of Ibadan (UI) · Political Science",
  });

  const [isLiveSession, setIsLiveSession] = useState(false);
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [exams] = useState<ExamItem[]>(sampleExams);
  const [results, setResults] = useState<ExamResult[]>(initialResults);

  // Active Exam Taking Engine State
  const [activeExam, setActiveExam] = useState<ExamItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [lastExamResult, setLastExamResult] = useState<ExamResult | null>(null);
  const [reviewResult, setReviewResult] = useState<ExamResult | null>(null);

  // Check auth & fetch user info
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsLiveSession(true);
      api
        .getMe()
        .then((res) => {
          if (res?.data?.user) {
            const u = res.data.user as { name?: string; email?: string; role?: string };
            setUser((prev) => ({
              ...prev,
              name: u.name || prev.name,
              email: u.email || prev.email,
              role: u.role || prev.role,
            }));
          }
        })
        .catch(() => {
          // Fallback to local profile
        });

      // Fetch live courses if available
      api
        .getMyCourses()
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            // Can merge with local data
          }
        })
        .catch(() => {});
    }
  }, []);

  // Timer effect during active exam
  useEffect(() => {
    if (!activeExam || examFinished) return;

    if (timeRemainingSeconds <= 0) {
      handleCompleteExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, timeRemainingSeconds, examFinished]);

  // Handle Logout
  function handleLogout() {
    removeAuthToken();
    window.location.href = "/login";
  }

  // Toggle Course Enrollment
  function handleToggleEnrollment(courseId: number) {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, enrolled: !c.enrolled } : c
      )
    );
  }

  // Launch Exam Runner
  function handleStartExam(exam: ExamItem) {
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemainingSeconds(exam.durationMinutes * 60);
    setExamFinished(false);
    setLastExamResult(null);
  }

  // Select option in current question
  function handleSelectOption(optionIndex: number) {
    if (!activeExam || examFinished) return;
    const currentQ = activeExam.questions[currentQuestionIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  }

  // Complete & Grade Exam
  function handleCompleteExam() {
    if (!activeExam) return;

    let correctCount = 0;
    const breakdown = activeExam.questions.map((q) => {
      const selectedIndex = selectedAnswers[q.id];
      const isCorrect = selectedIndex === q.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        question: q.question,
        selected: selectedIndex !== undefined ? q.options[selectedIndex] : "Unanswered",
        correct: q.options[q.correctAnswer],
        isCorrect,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((correctCount / activeExam.totalQuestions) * 100);
    const passed = percentage >= 60;

    const newResult: ExamResult = {
      id: `att-${Date.now()}`,
      examTitle: activeExam.title,
      subject: activeExam.subject,
      score: correctCount,
      totalQuestions: activeExam.totalQuestions,
      percentage,
      passed,
      date: new Date().toISOString().split("T")[0],
      answers: breakdown,
    };

    setResults((prev) => [newResult, ...prev]);
    setLastExamResult(newResult);
    setExamFinished(true);
  }

  // Format seconds to mm:ss
  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  // Stats calculation
  const totalEnrolled = courses.filter((c) => c.enrolled).length;
  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce((acc, curr) => acc + curr.percentage, 0) / results.length
        )
      : 0;

  return (
    <div className="dashboard-layout">
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="header-brand-wrap">
          <BrandLogo href="/" />
          <span className="header-badge">STUDENT PORTAL</span>
        </div>

        <div className="header-actions">
          {!isLiveSession && (
            <span className="demo-indicator" title="Local interactive mode">
              <span className="demo-dot" />
              Demo Mode · Samuel O. Deborah
            </span>
          )}

          <div className="user-profile-badge">
            <div className="user-avatar-circle">
              {user.name.charAt(0)}
            </div>
            <div className="user-text-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.target || "Student"}</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout} title="Sign Out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="dashboard-body">
        {/* Navigation Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => {
                setActiveExam(null);
                setActiveTab("overview");
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Overview</span>
            </button>

            <button
              className={`nav-item ${activeTab === "courses" ? "active" : ""}`}
              onClick={() => {
                setActiveExam(null);
                setActiveTab("courses");
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>My Subjects</span>
              <span className="nav-badge">{totalEnrolled}</span>
            </button>

            <button
              className={`nav-item ${activeTab === "exams" ? "active" : ""}`}
              onClick={() => {
                setActiveExam(null);
                setActiveTab("exams");
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Practice Tests & CBT</span>
              <span className="nav-badge pulse">{exams.length}</span>
            </button>

            <button
              className={`nav-item ${activeTab === "results" ? "active" : ""}`}
              onClick={() => {
                setActiveExam(null);
                setActiveTab("results");
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Gradebook & Results</span>
            </button>

            <button
              className={`nav-item ${activeTab === "resources" ? "active" : ""}`}
              onClick={() => {
                setActiveExam(null);
                setActiveTab("resources");
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span>Study Resources</span>
            </button>
          </nav>

          {/* Lead Tutor Card */}
          <div className="tutor-direct-card">
            <span className="tutor-card-label">LEAD MENTOR</span>
            <div className="tutor-card-inner">
              <div className="tutor-card-avatar">
                <Image
                  src="/brand/sage-boss.jpeg"
                  alt="Mr. Joseph O. Giwa"
                  width={42}
                  height={42}
                  className="tutor-avatar-img"
                />
              </div>
              <div className="tutor-card-meta">
                <strong>Mr. Joseph O. Giwa</strong>
                <small>Literature & Civics Tutor</small>
              </div>
            </div>
            <a
              href="https://wa.me/2347066597693"
              target="_blank"
              rel="noreferrer"
              className="tutor-contact-btn"
            >
              Ask Tutor a Question
            </a>
          </div>
        </aside>

        {/* Dynamic Content View */}
        <main className="dashboard-main-content">
          {/* ========================================================= */}
          {/* 1. EXAM RUNNER ENGINE VIEW                                 */}
          {/* ========================================================= */}
          {activeExam && !examFinished && (
            <div className="exam-runner-card">
              <div className="exam-runner-header">
                <div>
                  <span className="exam-runner-badge">{activeExam.subject} CBT ENGINE</span>
                  <h2>{activeExam.title}</h2>
                </div>
                <div className={`exam-timer-box ${timeRemainingSeconds < 180 ? "timer-warning" : ""}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{formatTime(timeRemainingSeconds)}</span>
                </div>
              </div>

              {/* Progress and Question Navigator */}
              <div className="exam-navigator-bar">
                <span className="q-progress-text">
                  Question {currentQuestionIndex + 1} of {activeExam.totalQuestions}
                </span>
                <div className="q-dots-wrap">
                  {activeExam.questions.map((q, idx) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const isCurrent = idx === currentQuestionIndex;
                    return (
                      <button
                        key={q.id}
                        className={`q-dot-btn ${isCurrent ? "current" : ""} ${
                          isAnswered ? "answered" : ""
                        }`}
                        onClick={() => setCurrentQuestionIndex(idx)}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current Question Block */}
              {activeExam.questions[currentQuestionIndex] && (
                <div className="exam-question-body">
                  <p className="question-text">
                    {activeExam.questions[currentQuestionIndex].question}
                  </p>

                  <div className="options-grid">
                    {activeExam.questions[currentQuestionIndex].options.map(
                      (opt, optIdx) => {
                        const currentQId = activeExam.questions[currentQuestionIndex].id;
                        const isSelected = selectedAnswers[currentQId] === optIdx;
                        const letters = ["A", "B", "C", "D", "E"];

                        return (
                          <button
                            key={opt}
                            className={`option-btn ${isSelected ? "selected" : ""}`}
                            onClick={() => handleSelectOption(optIdx)}
                          >
                            <span className="option-letter">{letters[optIdx]}</span>
                            <span className="option-text">{opt}</span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Footer Controls */}
              <div className="exam-runner-footer">
                <button
                  className="exam-nav-btn"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                >
                  ← Previous
                </button>

                <div className="exam-footer-right">
                  {currentQuestionIndex < activeExam.totalQuestions - 1 ? (
                    <button
                      className="exam-nav-btn primary"
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      className="exam-submit-btn"
                      onClick={handleCompleteExam}
                    >
                      Submit Exam Now ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 1.5 EXAM SCORE RESULTS MODAL / SUMMARY                     */}
          {/* ========================================================= */}
          {activeExam && examFinished && lastExamResult && (
            <div className="exam-result-summary-card">
              <div className="result-header">
                <span className={`result-status-tag ${lastExamResult.passed ? "passed" : "failed"}`}>
                  {lastExamResult.passed ? "PASSED · EXCELLENT" : "NEEDS PRACTICE"}
                </span>
                <h2>Exam Complete: Automated Grading Report</h2>
                <p>{lastExamResult.examTitle}</p>
              </div>

              <div className="score-hero-block">
                <div className="score-circle">
                  <span className="score-percent">{lastExamResult.percentage}%</span>
                  <span className="score-ratio">
                    {lastExamResult.score} / {lastExamResult.totalQuestions} Correct
                  </span>
                </div>

                <div className="score-feedback">
                  <h3>
                    {lastExamResult.percentage >= 80
                      ? "Outstanding Mastery! 🌟"
                      : lastExamResult.percentage >= 60
                      ? "Good Effort! Keep Reinforcing! 👏"
                      : "Review Required. Review the concepts below. 📚"}
                  </h3>
                  <p>
                    Your submission has been automatically evaluated by the SAGE grading
                    system. Review the question-by-question breakdown below to inspect
                    the rationales and deepen your understanding.
                  </p>
                  <div className="score-actions">
                    <button
                      className="button button-primary"
                      onClick={() => setActiveExam(null)}
                    >
                      Return to Dashboard
                    </button>
                    <button
                      className="button-outline"
                      onClick={() => setReviewResult(lastExamResult)}
                    >
                      Detailed Answers Breakdown
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. OVERVIEW TAB                                            */}
          {/* ========================================================= */}
          {!activeExam && activeTab === "overview" && (
            <div className="dashboard-overview-pane">
              {/* Welcome Banner */}
              <div className="welcome-banner">
                <div className="welcome-copy">
                  <span className="welcome-eyebrow">ACADEMIC JOURNEY IN PROGRESS</span>
                  <h1>Welcome back, {user.name}!</h1>
                  <p>
                    Targeting excellence in <strong>{user.target}</strong>.
                    You are currently enrolled in {totalEnrolled} active subjects. Keep your study momentum steady!
                  </p>
                  <div className="welcome-actions">
                    <button
                      className="button button-primary"
                      onClick={() => setActiveTab("exams")}
                    >
                      Take a Practice CBT Test
                    </button>
                    <button
                      className="button-outline"
                      onClick={() => setActiveTab("courses")}
                    >
                      View Syllabus & Notes
                    </button>
                  </div>
                </div>
                <div className="welcome-quote-card">
                  <span className="quote-label">TUTOR&apos;S NOTE</span>
                  <p>
                    &ldquo;With regular practice in text analysis and clear understanding of
                    political structures, every concept becomes straightforward.&rdquo;
                  </p>
                  <small>— Mr. Joseph O. Giwa</small>
                </div>
              </div>

              {/* KPI Metrics */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon-wrap green">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                  <div className="metric-data">
                    <span className="metric-value">{totalEnrolled}</span>
                    <span className="metric-title">Enrolled Subjects</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-wrap lime">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="metric-data">
                    <span className="metric-value">{results.length}</span>
                    <span className="metric-title">Tests Completed</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-wrap sage">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="metric-data">
                    <span className="metric-value">{averageScore}%</span>
                    <span className="metric-title">Average CBT Score</span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon-wrap gold">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="metric-data">
                    <span className="metric-value">10/10</span>
                    <span className="metric-title">Readiness Index</span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Quick Practice & Recent Performance */}
              <div className="overview-split-row">
                {/* Left: Quick Practice Tests */}
                <div className="overview-card">
                  <div className="overview-card-header">
                    <div>
                      <h3>Ready Practice Drills</h3>
                      <p>Pick a subject and sharpen your exam speed</p>
                    </div>
                    <button
                      className="view-all-text-link"
                      onClick={() => setActiveTab("exams")}
                    >
                      All CBTs →
                    </button>
                  </div>

                  <div className="exam-quick-list">
                    {exams.slice(0, 2).map((item) => (
                      <div className="exam-quick-item" key={item.id}>
                        <div className="exam-item-info">
                          <span className="exam-item-tag">{item.subject}</span>
                          <h4>{item.title}</h4>
                          <small>
                            ⏱ {item.durationMinutes} mins · {item.totalQuestions} Questions · {item.difficulty}
                          </small>
                        </div>
                        <button
                          className="start-test-pill-btn"
                          onClick={() => handleStartExam(item)}
                        >
                          Start Test
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Enrolled Subjects Progress */}
                <div className="overview-card">
                  <div className="overview-card-header">
                    <div>
                      <h3>My Active Subjects</h3>
                      <p>Syllabus completion & module progress</p>
                    </div>
                    <button
                      className="view-all-text-link"
                      onClick={() => setActiveTab("courses")}
                    >
                      Manage →
                    </button>
                  </div>

                  <div className="course-progress-list">
                    {courses
                      .filter((c) => c.enrolled)
                      .map((c) => (
                        <div className="course-progress-item" key={c.id}>
                          <div className="course-progress-meta">
                            <strong>{c.title}</strong>
                            <span>{c.progress}% completed</span>
                          </div>
                          <div className="progress-track">
                            <div
                              className="progress-fill"
                              style={{ width: `${c.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. MY COURSES TAB                                          */}
          {/* ========================================================= */}
          {!activeExam && activeTab === "courses" && (
            <div className="dashboard-courses-pane">
              <div className="section-title-wrap">
                <div>
                  <span className="eyebrow">ACADEMIC CURRICULUM</span>
                  <h2>My Subjects & Syllabus</h2>
                  <p>
                    Manage your enrolled subjects, view lecture topics, and master critical competencies.
                  </p>
                </div>
              </div>

              <div className="courses-grid">
                {courses.map((course) => (
                  <div className="course-card" key={course.id}>
                    <div className="course-card-top">
                      <span className="course-code-tag">{course.code}</span>
                      <span
                        className={`enroll-status-badge ${
                          course.enrolled ? "enrolled" : "available"
                        }`}
                      >
                        {course.enrolled ? "✓ Enrolled" : "+ Available"}
                      </span>
                    </div>

                    <h3>{course.title}</h3>
                    <p className="course-instructor">Instructor: {course.instructor}</p>

                    <div className="course-topics-block">
                      <span>CORE TOPICS & STUDY MODULES:</span>
                      <ul>
                        {course.topics.map((t) => (
                          <li key={t}>
                            <span className="check-bullet">▪</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="course-card-footer">
                      <div className="progress-line-wrap">
                        <small>{course.progress}% Syllabus Completed</small>
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        className={`enroll-toggle-btn ${course.enrolled ? "enrolled" : ""}`}
                        onClick={() => handleToggleEnrollment(course.id)}
                      >
                        {course.enrolled ? "Unenroll" : "Enroll in Subject"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. PRACTICE TESTS & CBT TAB                                */}
          {/* ========================================================= */}
          {!activeExam && activeTab === "exams" && (
            <div className="dashboard-exams-pane">
              <div className="section-title-wrap">
                <div>
                  <span className="eyebrow">COMPUTER-BASED TESTING (CBT)</span>
                  <h2>Practice Tests & Mock Drills</h2>
                  <p>
                    Test your knowledge with real-time timed questions, instant scoring, and comprehensive explanations.
                  </p>
                </div>
              </div>

              <div className="exams-grid">
                {exams.map((exam) => (
                  <div className="exam-card" key={exam.id}>
                    <div className="exam-card-header">
                      <span className="exam-subject-badge">{exam.subject}</span>
                      <span className="exam-diff-tag">{exam.difficulty}</span>
                    </div>

                    <h3>{exam.title}</h3>
                    <div className="exam-meta-specs">
                      <div>
                        <span>Questions</span>
                        <strong>{exam.totalQuestions}</strong>
                      </div>
                      <div>
                        <span>Duration</span>
                        <strong>{exam.durationMinutes} mins</strong>
                      </div>
                      <div>
                        <span>Format</span>
                        <strong>Timed CBT</strong>
                      </div>
                    </div>

                    <p className="exam-note">
                      Instant feedback and detailed analysis provided automatically upon completion.
                    </p>

                    <button
                      className="button button-primary full-width"
                      onClick={() => handleStartExam(exam)}
                    >
                      Start Exam Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. RESULTS & GRADEBOOK TAB                                 */}
          {/* ========================================================= */}
          {!activeExam && activeTab === "results" && (
            <div className="dashboard-results-pane">
              <div className="section-title-wrap">
                <div>
                  <span className="eyebrow">STUDENT PERFORMANCE & ANALYTICS</span>
                  <h2>Gradebook & Past Submissions</h2>
                  <p>
                    Detailed records of your automated exam assessments, scores, and review breakdowns.
                  </p>
                </div>
              </div>

              {results.length === 0 ? (
                <div className="empty-state-card">
                  <p>You haven&apos;t completed any tests yet.</p>
                  <button
                    className="button button-primary"
                    onClick={() => setActiveTab("exams")}
                  >
                    Take Your First Practice Test
                  </button>
                </div>
              ) : (
                <div className="results-table-wrap">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Exam Title</th>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((res) => (
                        <tr key={res.id}>
                          <td>{res.date}</td>
                          <td className="table-bold">{res.examTitle}</td>
                          <td>
                            <span className="table-subject-tag">{res.subject}</span>
                          </td>
                          <td>
                            {res.score} / {res.totalQuestions}
                          </td>
                          <td className="table-bold">{res.percentage}%</td>
                          <td>
                            <span
                              className={`status-pill ${
                                res.passed ? "passed" : "failed"
                              }`}
                            >
                              {res.passed ? "Passed" : "Needs Review"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="table-review-btn"
                              onClick={() => setReviewResult(res)}
                            >
                              View Breakdown
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. STUDY RESOURCES TAB                                     */}
          {/* ========================================================= */}
          {!activeExam && activeTab === "resources" && (
            <div className="dashboard-resources-pane">
              <div className="section-title-wrap">
                <div>
                  <span className="eyebrow">HIGH-YIELD REVISION NOTES</span>
                  <h2>Study Guides & Analytical Frameworks</h2>
                  <p>
                    Curated references prepared by lead tutor Mr. Joseph O. Giwa for quick mastery.
                  </p>
                </div>
              </div>

              <div className="resources-grid">
                <article className="resource-card">
                  <span className="resource-tag">Literature</span>
                  <h3>Essential Literary Devices Handbook</h3>
                  <p>
                    Comprehensive definitions and exam examples of Metaphor, Metonymy, Synecdoche,
                    Pathetic Fallacy, Soliloquy, Dramatic Irony, and Iambic Pentameter.
                  </p>
                  <div className="resource-footer">
                    <span>Format: Quick Reference Guide</span>
                    <a className="resource-link" href="#guide-lit">
                      Read Online →
                    </a>
                  </div>
                </article>

                <article className="resource-card">
                  <span className="resource-tag">Government</span>
                  <h3>Constitutional Systems & Political Frameworks</h3>
                  <p>
                    In-depth breakdown of Federal vs. Unitary governments, Separation of Powers,
                    Rule of Law, Electoral Systems, and Historical Civic Developments.
                  </p>
                  <div className="resource-footer">
                    <span>Format: Summary Notes</span>
                    <a className="resource-link" href="#guide-gov">
                      Read Online →
                    </a>
                  </div>
                </article>

                <article className="resource-card">
                  <span className="resource-tag">English Language</span>
                  <h3>Mastering Structural Essay Composition & Syntax</h3>
                  <p>
                    Guide to advanced grammar rules, subject-verb agreement with compound
                    connectors, avoiding dangling modifiers, and structuring persuasive essays.
                  </p>
                  <div className="resource-footer">
                    <span>Format: Writing Guide</span>
                    <a className="resource-link" href="#guide-eng">
                      Read Online →
                    </a>
                  </div>
                </article>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* DETAILED RESULTS BREAKDOWN MODAL                           */}
      {/* ========================================================= */}
      {reviewResult && (
        <div className="modal-backdrop" onClick={() => setReviewResult(null)}>
          <div
            className="modal-content review-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">AUTOMATED GRADING BREAKDOWN</span>
                <h2>{reviewResult.examTitle}</h2>
                <p>
                  Score: {reviewResult.score}/{reviewResult.totalQuestions} ({reviewResult.percentage}%) · Completed on {reviewResult.date}
                </p>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setReviewResult(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="review-questions-list">
                {reviewResult.answers.map((item, idx) => (
                  <div
                    key={idx}
                    className={`review-question-card ${
                      item.isCorrect ? "correct" : "incorrect"
                    }`}
                  >
                    <div className="review-q-top">
                      <span className="q-index-badge">Question {idx + 1}</span>
                      <span className={`eval-badge ${item.isCorrect ? "correct" : "incorrect"}`}>
                        {item.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>

                    <p className="review-question-text">{item.question}</p>

                    <div className="review-answer-comparison">
                      <div>
                        <span className="ans-label">Your Answer:</span>
                        <span className={`ans-val ${item.isCorrect ? "good" : "bad"}`}>
                          {item.selected}
                        </span>
                      </div>
                      {!item.isCorrect && (
                        <div>
                          <span className="ans-label">Correct Answer:</span>
                          <span className="ans-val correct-key">{item.correct}</span>
                        </div>
                      )}
                    </div>

                    <div className="review-explanation-box">
                      <strong>Tutor Explanation:</strong>
                      <p>{item.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="button button-primary"
                onClick={() => setReviewResult(null)}
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

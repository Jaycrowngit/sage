"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { api, getAuthToken, removeAuthToken } from "@/lib/api";
import "./page.css";

/* ------------------------------------------------------------------ */
/*  Types aligned with the Laravel API response shapes                 */
/* ------------------------------------------------------------------ */

type UserProfile = {
  id?: number | string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  role?: string;
  target?: string;
  created_at?: string;
};

type ApiCourse = {
  id: number | string;
  _id?: string;
  code?: string;
  name?: string;
  title?: string;
  category?: string;
  description?: string;
};

type ApiOption = {
  id: number | string;
  _id?: string;
  option_letter?: string;
  option_text: string;
  question_id?: string | number;
};

type ApiQuestion = {
  id: number | string;
  _id?: string;
  question_text: string;
  explanation?: string;
  marks?: number;
  options: ApiOption[];
};

type ApiExam = {
  id: number | string;
  _id?: string;
  title: string;
  description?: string;
  type: "practice" | "live";
  duration_minutes: number;
  total_marks?: number;
  pass_percentage?: number;
  is_published?: boolean;
  is_live_active?: boolean;
  scheduled_start_at?: string;
  scheduled_end_at?: string;
  questions_count?: number;
  course?: ApiCourse | null;
  course_id?: string | number;
  user_attempt?: {
    id: string | number;
    status: string;
    score: number;
    percentage: number;
    passed: boolean;
    submitted_at: string;
  } | null;
};

type ApiExamSession = {
  attempt_id: string | number;
  exam: {
    id: string | number;
    title: string;
    description?: string;
    course?: string;
    type: string;
    duration_minutes: number;
    pass_percentage: number;
    total_questions: number;
  };
  session: {
    started_at: string;
    expires_at: string;
    remaining_seconds: number;
  };
  questions: ApiQuestion[];
};

type ApiResult = {
  id?: string | number;
  _id?: string;
  exam_id?: string | number;
  score?: number;
  total_possible?: number;
  percentage?: number;
  passed?: boolean;
  status?: string;
  started_at?: string;
  submitted_at?: string;
  exam?: {
    id?: string | number;
    title?: string;
    type?: string;
    course?: ApiCourse | null;
  };
};

type SubmitBreakdown = {
  question_id: string | number;
  question_text: string;
  explanation?: string;
  is_correct: boolean;
  marks: number;
  marks_awarded: number;
  selected_option: { id: string | number; letter?: string; text: string } | null;
  correct_option: { id: string | number; letter?: string; text: string } | null;
};

type SubmitResult = {
  attempt_id: string | number;
  exam_title: string;
  score: number;
  total_possible: number;
  percentage: number;
  passed: boolean;
  correct_answers_count: number;
  incorrect_answers_count: number;
  unanswered_count: number;
  breakdown: SubmitBreakdown[];
};

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "practice" | "live" | "results" | "resources" | "profile"
  >("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth & loading states
  const [authChecked, setAuthChecked] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // User state
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    role: "student",
  });

  // Profile Form states
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileStatusMessage, setProfileStatusMessage] = useState<string | null>(null);
  const [profileStatusType, setProfileStatusType] = useState<"success" | "error" | null>(null);

  // Data states
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [myCourseIds, setMyCourseIds] = useState<Set<string | number>>(new Set());
  const [exams, setExams] = useState<ApiExam[]>([]);
  const [results, setResults] = useState<ApiResult[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  // Active Exam Taking Engine State
  const [activeExamSession, setActiveExamSession] = useState<ApiExamSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | number | null>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [lastSubmitResult, setLastSubmitResult] = useState<SubmitResult | null>(null);
  const [reviewResult, setReviewResult] = useState<SubmitResult | null>(null);
  const [examStarting, setExamStarting] = useState(false);
  const [examSubmitting, setExamSubmitting] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Auth guard — redirect to /login if no token                      */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    api
      .getMe()
      .then((res) => {
        const u = res?.data?.user as Record<string, string> | undefined;
        if (u) {
          const profileData: UserProfile = {
            id: u.id || u._id,
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            bio: u.bio || "",
            role: u.role || "student",
            target: u.target,
            created_at: u.created_at,
          };
          setUser(profileData);
          setProfileName(profileData.name);
          setProfilePhone(profileData.phone || "");
          setProfileBio(profileData.bio || "");
        }
        setAuthChecked(true);
        setPageLoading(false);
      })
      .catch(() => {
        removeAuthToken();
        window.location.href = "/login";
      });
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Fetch live data once auth is verified                           */
  /* ---------------------------------------------------------------- */
  const fetchCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      const [allRes, myRes] = await Promise.all([
        api.getCourses().catch(() => ({ data: [] as unknown[] })),
        api.getMyCourses().catch(() => ({ data: [] as unknown[] })),
      ]);

      const allCourses = (Array.isArray(allRes.data) ? allRes.data : []) as ApiCourse[];
      setCourses(allCourses);

      const myCourses = (Array.isArray(myRes.data) ? myRes.data : []) as ApiCourse[];
      const myIds = new Set<string | number>(
        myCourses.map((c) => c.id || c._id || "")
      );
      setMyCourseIds(myIds);
    } catch {
      // silently handle
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  const fetchExams = useCallback(async () => {
    setLoadingExams(true);
    try {
      const res = await api.getExams();
      const data = res?.data as { data?: ApiExam[] } | ApiExam[];
      const examsList = Array.isArray(data) ? data : (data as { data?: ApiExam[] })?.data || [];
      setExams(examsList);
    } catch {
      setExams([]);
    } finally {
      setLoadingExams(false);
    }
  }, []);

  const fetchResults = useCallback(async () => {
    setLoadingResults(true);
    try {
      const res = await api.getMyResults();
      const data = res?.data as { data?: ApiResult[] } | ApiResult[];
      const resultsList = Array.isArray(data) ? data : (data as { data?: ApiResult[] })?.data || [];
      setResults(resultsList);
    } catch {
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    fetchCourses();
    fetchExams();
    fetchResults();
  }, [authChecked, fetchCourses, fetchExams, fetchResults]);

  /* ---------------------------------------------------------------- */
  /*  Timer effect during active exam                                  */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (!activeExamSession || examFinished) return;

    if (timeRemainingSeconds <= 0) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeExamSession, timeRemainingSeconds, examFinished]);

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                         */
  /* ---------------------------------------------------------------- */

  function handleLogout() {
    api.logout().catch(() => {});
    removeAuthToken();
    window.location.href = "/login";
  }

  async function handleStartExam(examId: string | number) {
    setExamStarting(true);
    try {
      const res = await api.startExam(Number(examId));
      const session = res.data as unknown as ApiExamSession;
      setActiveExamSession(session);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeRemainingSeconds(session.session.remaining_seconds);
      setExamFinished(false);
      setLastSubmitResult(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start exam session.";
      alert(msg);
    } finally {
      setExamStarting(false);
    }
  }

  function handleSelectOption(questionId: string | number, optionId: string | number) {
    if (examFinished) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [String(questionId)]: optionId,
    }));
  }

  async function handleSubmitExam() {
    if (!activeExamSession || examSubmitting) return;
    setExamSubmitting(true);

    const answers = activeExamSession.questions.map((q) => {
      const qId = q.id || (q as Record<string, unknown>)._id;
      return {
        question_id: Number(qId),
        selected_option_id: selectedAnswers[String(qId)]
          ? Number(selectedAnswers[String(qId)])
          : null,
      };
    });

    try {
      const res = await api.submitExam(Number(activeExamSession.attempt_id), answers);
      const submitData = res.data as unknown as SubmitResult;
      setLastSubmitResult(submitData);
      setExamFinished(true);
      fetchResults();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit exam.";
      alert(msg);
    } finally {
      setExamSubmitting(false);
    }
  }

  async function handleToggleEnrollment(courseId: string | number) {
    const idStr = String(courseId);
    const isEnrolled = myCourseIds.has(courseId);

    if (isEnrolled) {
      const newIds = [...myCourseIds].filter((id) => String(id) !== idStr).map(Number);
      try {
        await api.selectPreferredCourses(newIds);
        setMyCourseIds((prev) => {
          const next = new Set(prev);
          next.delete(courseId);
          return next;
        });
      } catch {
        /* ignore */
      }
    } else {
      const newIds = [...myCourseIds, courseId].map(Number);
      try {
        await api.selectPreferredCourses(newIds);
        setMyCourseIds((prev) => new Set([...prev, courseId]));
      } catch {
        /* ignore */
      }
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileStatusMessage(null);
    setProfileStatusType(null);

    try {
      const payload: { name?: string; phone?: string; bio?: string; password?: string } = {
        name: profileName.trim(),
        phone: profilePhone.trim() || undefined,
        bio: profileBio.trim() || undefined,
      };

      if (profilePassword.trim()) {
        if (profilePassword.trim().length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }
        payload.password = profilePassword.trim();
      }

      await api.updateProfile(payload);
      setUser((prev) => ({
        ...prev,
        name: profileName.trim(),
        phone: profilePhone.trim(),
        bio: profileBio.trim(),
      }));
      setProfilePassword("");
      setProfileStatusType("success");
      setProfileStatusMessage("Profile updated successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      setProfileStatusType("error");
      setProfileStatusMessage(msg);
    } finally {
      setProfileSaving(false);
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  /* ---------------------------------------------------------------- */
  /*  Computed Values                                                  */
  /* ---------------------------------------------------------------- */
  const practiceExams = exams.filter((e) => e.type === "practice");
  const liveExams = exams.filter((e) => e.type === "live");
  const enrolledCoursesList = courses.filter((c) => myCourseIds.has(c.id || c._id || ""));

  const totalEnrolled = myCourseIds.size;
  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce((acc, r) => acc + (r.percentage || 0), 0) / results.length
        )
      : 0;
  const passedCount = results.filter((r) => r.passed).length;

  /* ---------------------------------------------------------------- */
  /*  Loading Screen                                                   */
  /* ---------------------------------------------------------------- */
  if (pageLoading) {
    return (
      <div className="dashboard-layout">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "16px",
            color: "#164a35",
          }}
        >
          <BrandLogo href="/" />
          <p style={{ fontSize: "14px", fontWeight: 600 }}>
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render Helper for Exam Cards                                     */
  /* ---------------------------------------------------------------- */
  function renderExamCard(exam: ApiExam, isLive: boolean) {
    const examId = exam.id || exam._id || "";
    return (
      <div className="exam-card" key={String(examId)}>
        <div className="exam-card-header">
          <span className="exam-subject-badge">{exam.course?.name || exam.course?.title || "General"}</span>
          <span className={`exam-diff-tag ${isLive ? "live" : "practice"}`}>
            {isLive && <span className="live-indicator-dot" />}
            {isLive ? "Live Exam" : "Practice Drill"}
          </span>
        </div>

        <h3>{exam.title}</h3>
        {exam.description && <p className="exam-note">{exam.description}</p>}

        <div className="exam-meta-specs">
          <div>
            <span>Questions</span>
            <strong>{exam.questions_count || "—"}</strong>
          </div>
          <div>
            <span>Duration</span>
            <strong>{exam.duration_minutes} mins</strong>
          </div>
          <div>
            <span>Passing Mark</span>
            <strong>{exam.pass_percentage || 50}%</strong>
          </div>
        </div>

        {exam.user_attempt ? (
          <div style={{ marginTop: "10px", fontSize: "11px", color: "#555" }}>
            Last score: {exam.user_attempt.percentage}% — {exam.user_attempt.passed ? "Passed ✓" : "Needs Review"}
          </div>
        ) : null}

        <button
          className="button button-primary full-width"
          onClick={() => handleStartExam(examId)}
          disabled={examStarting}
          style={{ marginTop: "12px", background: isLive ? "#b91c1c" : "var(--green)" }}
        >
          {examStarting ? "Starting..." : isLive ? "Enter Live Examination" : exam.user_attempt ? "Retake Practice Test" : "Start Practice Drill"}
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="header-brand-wrap">
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
          <BrandLogo href="/" />
          <span className="header-badge">STUDENT PORTAL</span>
        </div>

        <div className="header-actions">
          {/* Clickable Student Profile Badge */}
          <div
            className="user-profile-badge clickable"
            onClick={() => {
              setActiveExamSession(null);
              setActiveTab("profile");
            }}
            title="Click to view and edit student profile"
          >
            <div className="user-avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-text-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">Student Profile</span>
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

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Container */}
      <div className="dashboard-body">
        {/* Navigation Sidebar Drawer */}
        <aside className={`dashboard-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
          {/* Mobile Drawer Header */}
          <div className="sidebar-mobile-header">
            <div className="sidebar-mobile-profile">
              <div className="user-avatar-circle small">
                {user.name ? user.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="sidebar-mobile-user-info">
                <span className="sidebar-mobile-name">{user.name || "Student"}</span>
                <span className="sidebar-mobile-email">{user.email || ""}</span>
              </div>
            </div>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => {
                setActiveExamSession(null);
                setActiveTab("overview");
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Overview</span>
            </button>

            {/* STUDENT PROFILE NAVIGATION */}
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => {
                setActiveExamSession(null);
                setActiveTab("profile");
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Student Profile</span>
            </button>

            <button
              className={`nav-item ${activeTab === "courses" ? "active" : ""}`}
              onClick={() => {
                setActiveExamSession(null);
                setActiveTab("courses");
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>My Subjects</span>
              {totalEnrolled > 0 && <span className="nav-badge">{totalEnrolled}</span>}
            </button>

            {/* SEPARATE TAB 1: PRACTICE TESTS */}
            <button
              className={`nav-item ${activeTab === "practice" ? "active" : ""}`}
              onClick={() => {
                setActiveExamSession(null);
                setActiveTab("practice");
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Practice Tests</span>
              {practiceExams.length > 0 ? (
                <span className="nav-badge">{practiceExams.length}</span>
              ) : (
                <span className="nav-badge soon">Soon</span>
              )}
            </button>

            {/* SEPARATE TAB 2: LIVE EXAMINATIONS */}
            <button
              className={`nav-item ${activeTab === "live" ? "active" : ""}`}
              onClick={() => {
                setActiveExamSession(null);
                setActiveTab("live");
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Live Examinations</span>
              {liveExams.length > 0 ? (
                <span className="nav-badge pulse" style={{ background: "#dc2626", color: "#fff" }}>
                  {liveExams.length}
                </span>
              ) : (
                <span className="nav-badge soon">Soon</span>
              )}
            </button>

            <button
              className={`nav-item ${activeTab === "results" ? "active" : ""}`}
              onClick={() => {
                setActiveExamSession(null);
                setActiveTab("results");
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Gradebook &amp; Results</span>
            </button>

            <button
              className={`nav-item ${activeTab === "resources" ? "active" : ""}`}
              onClick={() => {
                setActiveExamSession(null);
                setActiveTab("resources");
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span>Study Resources</span>
              <span className="nav-badge soon">Soon</span>
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
                <small>Literature &amp; Civics Tutor</small>
              </div>
            </div>
            <a
              href="https://wa.me/2347066597693"
              target="_blank"
              rel="noreferrer"
              className="tutor-contact-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Ask Tutor a Question</span>
            </a>
          </div>

          {/* Mobile Sign Out in Drawer */}
          <div className="sidebar-mobile-footer">
            <button
              type="button"
              className="sidebar-signout-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Content View */}
        <main className="dashboard-main-content">

          {/* ========================================================= */}
          {/* EXAM RUNNER ENGINE VIEW                                   */}
          {/* ========================================================= */}
          {activeExamSession && !examFinished && (() => {
            const isLive = activeExamSession.exam.type === "live";
            return (
              <div className={`exam-runner-card ${isLive ? "live-runner" : ""}`}>
                <div className="exam-runner-header">
                  <div>
                    <span className={`exam-runner-badge ${isLive ? "live-runner-badge" : ""}`}>
                      {isLive ? "🔴 LIVE EXAMINATION ROOM" : "PRACTICE CBT DRILL · SELF-PACED"}
                    </span>
                    <h2>{activeExamSession.exam.title}</h2>
                    {activeExamSession.exam.course && (
                      <small style={{ color: "var(--muted)" }}>Subject: {activeExamSession.exam.course}</small>
                    )}
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
                    Question {currentQuestionIndex + 1} of {activeExamSession.questions.length}
                  </span>
                  <div className="q-dots-wrap">
                    {activeExamSession.questions.map((q, idx) => {
                      const qId = String(q.id || (q as Record<string, unknown>)._id);
                      const isAnswered = selectedAnswers[qId] !== undefined;
                      const isCurrent = idx === currentQuestionIndex;
                      return (
                        <button
                          key={qId}
                          className={`q-dot-btn ${isCurrent ? "current" : ""} ${isAnswered ? "answered" : ""}`}
                          onClick={() => setCurrentQuestionIndex(idx)}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Current Question Block */}
                {activeExamSession.questions[currentQuestionIndex] && (() => {
                  const currentQ = activeExamSession.questions[currentQuestionIndex];
                  const currentQId = String(currentQ.id || (currentQ as Record<string, unknown>)._id);
                  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

                  return (
                    <div className="exam-question-body">
                      <p className="question-text">
                        {currentQ.question_text}
                      </p>
                      <div className="options-grid">
                        {currentQ.options.map((opt, optIdx) => {
                          const optId = opt.id || (opt as Record<string, unknown>)._id;
                          const isSelected = String(selectedAnswers[currentQId]) === String(optId);
                          return (
                            <button
                              key={String(optId)}
                              className={`option-btn ${isSelected ? "selected" : ""}`}
                              onClick={() => handleSelectOption(currentQId, optId as string | number)}
                            >
                              <span className="option-letter">{opt.option_letter || letters[optIdx]}</span>
                              <span className="option-text">{opt.option_text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Footer Controls */}
                <div className="exam-runner-footer">
                  <button
                    className="exam-nav-btn"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  >
                    Previous
                  </button>

                  <div className="exam-footer-right">
                    {currentQuestionIndex < activeExamSession.questions.length - 1 ? (
                      <button
                        className="exam-nav-btn primary"
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        className="exam-submit-btn"
                        onClick={handleSubmitExam}
                        disabled={examSubmitting}
                        style={{ background: isLive ? "#b91c1c" : "var(--green)" }}
                      >
                        {examSubmitting ? "Submitting..." : isLive ? "Submit Official Exam ✓" : "Finish Practice Drill ✓"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* EXAM SCORE RESULTS SUMMARY                                 */}
          {/* ========================================================= */}
          {activeExamSession && examFinished && lastSubmitResult && (
            <div className="exam-result-summary-card">
              <div className="result-header">
                <span className={`result-status-tag ${lastSubmitResult.passed ? "passed" : "failed"}`}>
                  {lastSubmitResult.passed ? "PASSED · EXCELLENT" : "NEEDS PRACTICE"}
                </span>
                <h2>Exam Complete: Automated Grading Report</h2>
                <p>{lastSubmitResult.exam_title}</p>
              </div>

              <div className="score-hero-block">
                <div className="score-circle">
                  <span className="score-percent">{lastSubmitResult.percentage}%</span>
                  <span className="score-ratio">
                    {lastSubmitResult.correct_answers_count} / {lastSubmitResult.correct_answers_count + lastSubmitResult.incorrect_answers_count + lastSubmitResult.unanswered_count} Correct
                  </span>
                </div>

                <div className="score-feedback">
                  <h3>
                    {lastSubmitResult.percentage >= 80
                      ? "Outstanding Mastery! 🌟"
                      : lastSubmitResult.percentage >= 60
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
                      onClick={() => {
                        setActiveExamSession(null);
                        setExamFinished(false);
                        setLastSubmitResult(null);
                      }}
                    >
                      Return to Dashboard
                    </button>
                    <button
                      className="button-outline"
                      onClick={() => setReviewResult(lastSubmitResult)}
                    >
                      Detailed Answers Breakdown
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. OVERVIEW TAB                                            */}
          {/* ========================================================= */}
          {!activeExamSession && activeTab === "overview" && (
            <div className="dashboard-overview-pane">
              {/* Welcome Banner */}
              <div className="welcome-banner">
                <div className="welcome-copy">
                  <span className="welcome-eyebrow">ACADEMIC JOURNEY IN PROGRESS</span>
                  <h1>Welcome back, {user.name || "Student"}!</h1>
                  <p>
                    You are currently enrolled in <strong>{totalEnrolled} active subject{totalEnrolled !== 1 ? "s" : ""}</strong>.
                    Review your curriculum notes and track your ongoing preparation.
                  </p>
                  <div className="welcome-actions">
                    <button
                      className="button button-primary"
                      onClick={() => setActiveTab("courses")}
                    >
                      View My Subjects &amp; Syllabus
                    </button>
                    <button
                      className="button-outline"
                      onClick={() => setActiveTab("profile")}
                    >
                      Manage Student Profile
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
                    <span className="metric-title">Average Score</span>
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
                    <span className="metric-value">Active</span>
                    <span className="metric-title">Account Verified</span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="overview-split-row">
                {/* Left: Practice Drills Status */}
                <div className="overview-card">
                  <div className="overview-card-header">
                    <div>
                      <h3>Practice Tests &amp; Drills</h3>
                      <p>Self-paced test questions with immediate answers</p>
                    </div>
                    <button
                      className="view-all-text-link"
                      onClick={() => setActiveTab("practice")}
                    >
                      View
                    </button>
                  </div>

                  <div className="exam-quick-list">
                    {loadingExams ? (
                      <p style={{ padding: "16px", fontSize: "12px", color: "#777" }}>Loading practice drills...</p>
                    ) : practiceExams.length > 0 ? (
                      practiceExams.slice(0, 3).map((item) => {
                        const examId = item.id || item._id || "";
                        return (
                          <div className="exam-quick-item" key={String(examId)}>
                            <div className="exam-item-info">
                              <span className="exam-item-tag">{item.course?.name || "Practice Drill"}</span>
                              <h4>{item.title}</h4>
                              <small>
                                ⏱ {item.duration_minutes} mins · {item.questions_count || "?"} Questions
                              </small>
                            </div>
                            <button
                              className="start-test-pill-btn"
                              onClick={() => handleStartExam(examId)}
                              disabled={examStarting}
                            >
                              {examStarting ? "..." : "Start Drill"}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ padding: "24px 16px", textAlign: "center" }}>
                        <span className="coming-soon-badge">Coming Soon</span>
                        <h4 style={{ margin: "10px 0 6px", fontSize: "14px", color: "var(--ink)" }}>
                          Practice Question Banks
                        </h4>
                        <p style={{ margin: 0, fontSize: "11.5px", color: "var(--muted)", lineHeight: 1.5 }}>
                          Self-paced diagnostic drills and test questions are currently being compiled by lead instructors.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Recent Results */}
                <div className="overview-card">
                  <div className="overview-card-header">
                    <div>
                      <h3>Recent Results</h3>
                      <p>Your latest test performance</p>
                    </div>
                    <button
                      className="view-all-text-link"
                      onClick={() => setActiveTab("results")}
                    >
                      View All
                    </button>
                  </div>

                  <div className="course-progress-list">
                    {loadingResults ? (
                      <p style={{ padding: "16px", fontSize: "12px", color: "#777" }}>Loading results...</p>
                    ) : results.length === 0 ? (
                      <div style={{ padding: "24px 16px", textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}>
                          No test submissions yet. Records will be automatically displayed here upon completion.
                        </p>
                      </div>
                    ) : (
                      results.slice(0, 4).map((r) => {
                        const rId = String(r.id || r._id || Math.random());
                        return (
                          <div className="course-progress-item" key={rId}>
                            <div className="course-progress-meta">
                              <strong>{r.exam?.title || "Exam"}</strong>
                              <span>{r.percentage || 0}% · {r.passed ? "Passed ✓" : "Needs Review"}</span>
                            </div>
                            <div className="progress-track">
                              <div
                                className="progress-fill"
                                style={{ width: `${r.percentage || 0}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STUDENT PROFILE TAB                                       */}
          {/* ========================================================= */}
          {!activeExamSession && activeTab === "profile" && (
            <div className="dashboard-profile-pane">
              <div className="section-title-wrap">
                <div>
                  <span className="eyebrow">SCHOLAR ACCOUNT</span>
                  <h2>Student Profile &amp; Settings</h2>
                  <p>
                    Manage your personal student details, enrolled curriculum focus, and security credentials.
                  </p>
                </div>
              </div>

              {/* Profile Hero Card */}
              <div className="profile-hero-card">
                <div className="profile-hero-left">
                  <div className="profile-avatar-large">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-hero-details">
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <div className="profile-tag-row">
                      <span className="profile-role-tag">Sage Scholar ({user.role})</span>
                      {user.created_at && (
                        <span className="profile-date-tag">
                          Member since {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Highlights Grid */}
              <div className="profile-stats-grid">
                <div className="profile-stat-box">
                  <span className="stat-label">Enrolled Subjects</span>
                  <span className="stat-number">{totalEnrolled}</span>
                  <span className="stat-hint">Active Courses</span>
                </div>

                <div className="profile-stat-box">
                  <span className="stat-label">Tests Completed</span>
                  <span className="stat-number">{results.length}</span>
                  <span className="stat-hint">Attempted Exams</span>
                </div>

                <div className="profile-stat-box">
                  <span className="stat-label">Average Score</span>
                  <span className="stat-number">{averageScore}%</span>
                  <span className="stat-hint">Cumulative Mark</span>
                </div>

                <div className="profile-stat-box">
                  <span className="stat-label">Passed Tests</span>
                  <span className="stat-number">{passedCount}</span>
                  <span className="stat-hint">Benchmark Achieved</span>
                </div>
              </div>

              {/* Enrolled Courses Preview */}
              <div className="profile-section-card">
                <h3>My Registered Subjects</h3>
                <p className="subtitle">
                  Academic subjects and preparation syllabi you have enrolled in.
                </p>

                {enrolledCoursesList.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                    You have not enrolled in any subjects yet.{" "}
                    <button
                      className="view-all-text-link"
                      onClick={() => setActiveTab("courses")}
                      style={{ textDecoration: "underline" }}
                    >
                      Browse courses to enroll
                    </button>
                  </p>
                ) : (
                  <div className="enrolled-subjects-pill-list">
                    {enrolledCoursesList.map((course) => (
                      <span className="enrolled-subject-pill" key={String(course.id || course._id)}>
                        <span>✓</span>
                        <strong>{course.code || course.name}</strong>
                        {course.title ? ` — ${course.title}` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Details Edit Form */}
              <div className="profile-section-card">
                <h3>Edit Personal Information</h3>
                <p className="subtitle">
                  Update your contact details or change your account password.
                </p>

                <form className="profile-form" onSubmit={handleSaveProfile}>
                  <div className="profile-form-row">
                    <div className="profile-form-group">
                      <label htmlFor="student-full-name">Full Name</label>
                      <input
                        id="student-full-name"
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="profile-form-group">
                      <label htmlFor="student-email">Email Address (Registered)</label>
                      <input
                        id="student-email"
                        type="email"
                        value={user.email}
                        disabled
                        title="Registered email cannot be modified"
                      />
                      <small>Linked to your Sage student account.</small>
                    </div>
                  </div>

                  <div className="profile-form-row">
                    <div className="profile-form-group">
                      <label htmlFor="student-phone">Phone / WhatsApp Number</label>
                      <input
                        id="student-phone"
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="e.g. +234 801 234 5678"
                      />
                      <small>Used for session notifications &amp; tutor communication.</small>
                    </div>

                    <div className="profile-form-group">
                      <label htmlFor="student-password">New Password (Optional)</label>
                      <input
                        id="student-password"
                        type="password"
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        minLength={8}
                      />
                      <small>Must be at least 8 characters long.</small>
                    </div>
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="student-bio">Target University / Academic Aspirations</label>
                    <textarea
                      id="student-bio"
                      rows={3}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      placeholder="e.g. Preparing for JAMB/UTME with focus on Law / Political Science at UI or UNILAG..."
                    />
                  </div>

                  <div className="profile-form-actions">
                    <div>
                      {profileStatusMessage && (
                        <span className={`profile-feedback-message ${profileStatusType}`}>
                          {profileStatusType === "success" ? "✓ " : "⚠ "}
                          {profileStatusMessage}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="button button-primary"
                      disabled={profileSaving}
                    >
                      {profileSaving ? "Saving Updates..." : "Save Profile Details"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. MY COURSES TAB                                          */}
          {/* ========================================================= */}
          {!activeExamSession && activeTab === "courses" && (
            <div className="dashboard-courses-pane">
              <div className="section-title-wrap">
                <div>
                  <span className="eyebrow">ACADEMIC CURRICULUM</span>
                  <h2>My Subjects &amp; Courses</h2>
                  <p>
                    Browse available courses and manage your enrolled subjects.
                  </p>
                </div>
              </div>

              {loadingCourses ? (
                <div className="empty-state-card">
                  <p>Loading courses from server...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="coming-soon-card">
                  <div className="coming-soon-icon">📚</div>
                  <span className="coming-soon-badge">Coming Soon</span>
                  <h3>Curriculum Being Updated</h3>
                  <p>
                    Course modules and syllabus structures are being populated by instructors. Please check back shortly.
                  </p>
                </div>
              ) : (
                <div className="courses-grid">
                  {courses.map((course) => {
                    const cId = course.id || course._id || "";
                    const isEnrolled = myCourseIds.has(cId);
                    return (
                      <div className="course-card" key={String(cId)}>
                        <div className="course-card-top">
                          <span className="course-code-tag">{course.code || course.name || "Course"}</span>
                          <span
                            className={`enroll-status-badge ${isEnrolled ? "enrolled" : "available"}`}
                          >
                            {isEnrolled ? "✓ Enrolled" : "+ Available"}
                          </span>
                        </div>

                        <h3>{course.name || course.title || "Untitled Course"}</h3>
                        {course.category && <p className="course-instructor">Category: {course.category}</p>}
                        {course.description && (
                          <div className="course-topics-block">
                            <p>{course.description}</p>
                          </div>
                        )}

                        <div className="course-card-footer">
                          <button
                            className={`enroll-toggle-btn ${isEnrolled ? "enrolled" : ""}`}
                            onClick={() => handleToggleEnrollment(cId)}
                          >
                            {isEnrolled ? "Unenroll" : "Enroll in Subject"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. PRACTICE TESTS TAB (COMING SOON)                        */}
          {/* ========================================================= */}
          {!activeExamSession && activeTab === "practice" && (
            <div className="dashboard-exams-pane">
              <div className="section-title-wrap">
                <div>
                  <span className="eyebrow">SELF-PACED DRILLS</span>
                  <h2>Practice Tests &amp; Diagnostic Drills</h2>
                  <p>
                    Sharpen your subject mastery with untimed or timed self-paced question banks.
                  </p>
                </div>
              </div>

              {loadingExams ? (
                <div className="empty-state-card">
                  <p>Loading practice tests...</p>
                </div>
              ) : practiceExams.length > 0 ? (
                <div className="exams-grid">
                  {practiceExams.map((exam) => renderExamCard(exam, false))}
                </div>
              ) : (
                <div className="coming-soon-card">
                  <div className="coming-soon-icon">📝</div>
                  <span className="coming-soon-badge">Coming Soon</span>
                  <h3>Practice Tests &amp; Diagnostic Question Banks</h3>
                  <p>
                    Our lead tutors are currently compiling and verifying comprehensive practice question banks with automated instant marking, explanations, and progress metrics.
                  </p>
                  <button
                    className="button button-primary"
                    onClick={() => setActiveTab("courses")}
                  >
                    View My Subjects &amp; Syllabus
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. LIVE EXAMINATIONS TAB (COMING SOON)                     */}
          {/* ========================================================= */}
          {!activeExamSession && activeTab === "live" && (
            <div className="dashboard-exams-pane">
              <div className="section-title-wrap">
                <div>
                  <span className="eyebrow" style={{ color: "#b91c1c" }}>
                    <span className="live-indicator-dot" style={{ marginRight: 6 }} />
                    OFFICIAL EXAMINATION ROOM
                  </span>
                  <h2>Scheduled Live Examinations</h2>
                  <p>
                    Official timed assessments and national challenges. Live exams are evaluated in real time with ranking on the leaderboard.
                  </p>
                </div>
              </div>

              {loadingExams ? (
                <div className="empty-state-card">
                  <p>Checking live exam schedule...</p>
                </div>
              ) : liveExams.length > 0 ? (
                <div className="exams-grid">
                  {liveExams.map((exam) => renderExamCard(exam, true))}
                </div>
              ) : (
                <div className="coming-soon-card">
                  <div className="coming-soon-icon live">🔴</div>
                  <span className="coming-soon-badge" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                    Coming Soon
                  </span>
                  <h3>Live Scheduled CBT Examinations</h3>
                  <p>
                    Official timed examinations and national challenge competitions are scheduled periodically. Test dates, syllabus scopes, and entry windows will be announced here.
                  </p>
                  <button
                    className="button button-primary"
                    onClick={() => setActiveTab("courses")}
                  >
                    Prepare with Course Syllabus
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. RESULTS & GRADEBOOK TAB                                 */}
          {/* ========================================================= */}
          {!activeExamSession && activeTab === "results" && (
            <div className="dashboard-results-pane">
              <div className="section-title-wrap">
                <div>
                  <span className="eyebrow">STUDENT PERFORMANCE &amp; ANALYTICS</span>
                  <h2>Gradebook &amp; Past Submissions</h2>
                  <p>
                    Detailed records of your automated exam assessments, scores, and review breakdowns.
                  </p>
                </div>
              </div>

              {loadingResults ? (
                <div className="empty-state-card">
                  <p>Loading your results...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="coming-soon-card">
                  <div className="coming-soon-icon">📊</div>
                  <span className="coming-soon-badge">No Submissions Yet</span>
                  <h3>Gradebook Ready</h3>
                  <p>
                    As soon as you participate in practice drills or scheduled examinations, your automated grades, performance analytics, and question breakdowns will appear here.
                  </p>
                  <button
                    className="button button-primary"
                    onClick={() => setActiveTab("courses")}
                  >
                    Explore My Subjects
                  </button>
                </div>
              ) : (
                <div className="results-table-wrap">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Exam Title</th>
                        <th>Type</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((res) => {
                        const rId = String(res.id || res._id || Math.random());
                        const dateStr = res.submitted_at
                          ? new Date(res.submitted_at).toLocaleDateString()
                          : "—";
                        const isLive = res.exam?.type === "live";
                        return (
                          <tr key={rId}>
                            <td>{dateStr}</td>
                            <td className="table-bold">{res.exam?.title || "Exam"}</td>
                            <td>
                              <span className={`exam-diff-tag ${isLive ? "live" : "practice"}`}>
                                {isLive ? "Live" : "Practice"}
                              </span>
                            </td>
                            <td>
                              {res.score ?? 0} / {res.total_possible ?? 0}
                            </td>
                            <td className="table-bold">{res.percentage ?? 0}%</td>
                            <td>
                              <span
                                className={`status-pill ${res.passed ? "passed" : "failed"}`}
                              >
                                {res.passed ? "Passed" : "Needs Review"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. STUDY RESOURCES TAB (COMING SOON)                       */}
          {/* ========================================================= */}
          {!activeExamSession && activeTab === "resources" && (
            <div className="dashboard-resources-pane">
              <div className="section-title-wrap">
                <div>
                  <span className="eyebrow">HIGH-YIELD REVISION NOTES</span>
                  <h2>Study Guides &amp; Analytical Frameworks</h2>
                  <p>
                    Curated references prepared by lead tutor Mr. Joseph O. Giwa for quick mastery.
                  </p>
                </div>
              </div>

              <div className="coming-soon-card">
                <div className="coming-soon-icon">📚</div>
                <span className="coming-soon-badge">Coming Soon</span>
                <h3>High-Yield Study Guides &amp; Revision Notes</h3>
                <p>
                  Comprehensive notes, analytical frameworks, and exam revision guides prepared by lead tutor Mr. Joseph O. Giwa (covering Literature, Government, and English Language) are currently being finalized for publication.
                </p>
                <button
                  className="button button-primary"
                  onClick={() => setActiveTab("courses")}
                >
                  View Active Subjects &amp; Syllabus
                </button>
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
                <h2>{reviewResult.exam_title}</h2>
                <p>
                  Score: {reviewResult.correct_answers_count}/{reviewResult.correct_answers_count + reviewResult.incorrect_answers_count + reviewResult.unanswered_count} ({reviewResult.percentage}%)
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
                {reviewResult.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className={`review-question-card ${item.is_correct ? "correct" : "incorrect"}`}
                  >
                    <div className="review-q-top">
                      <span className="q-index-badge">Question {idx + 1}</span>
                      <span className={`eval-badge ${item.is_correct ? "correct" : "incorrect"}`}>
                        {item.is_correct ? "✓ Correct" : "✗ Incorrect"}
                      </span>
                    </div>

                    <p className="review-question-text">{item.question_text}</p>

                    <div className="review-answer-comparison">
                      <div>
                        <span className="ans-label">Your Answer:</span>
                        <span className={`ans-val ${item.is_correct ? "good" : "bad"}`}>
                          {item.selected_option
                            ? `${item.selected_option.letter ? item.selected_option.letter + ". " : ""}${item.selected_option.text}`
                            : "Unanswered"}
                        </span>
                      </div>
                      {!item.is_correct && item.correct_option && (
                        <div>
                          <span className="ans-label">Correct Answer:</span>
                          <span className="ans-val correct-key">
                            {item.correct_option.letter ? item.correct_option.letter + ". " : ""}
                            {item.correct_option.text}
                          </span>
                        </div>
                      )}
                    </div>

                    {item.explanation && (
                      <div className="review-explanation-box">
                        <strong>Tutor Explanation:</strong>
                        <p>{item.explanation}</p>
                      </div>
                    )}
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

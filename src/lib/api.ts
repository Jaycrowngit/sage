/**
 * Sage Academic - Frontend API Client
 * Connects Next.js frontend to the Laravel backend endpoint.
 */

function resolveApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  const base = envUrl || "https://sage-endpoint.onrender.com/api";
  const normalized = base.replace(/\/+$/, "");
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

export const API_BASE_URL = resolveApiBaseUrl();

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sage_auth_token");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("sage_auth_token", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("sage_auth_token");
  }
}

/** Error thrown for non-2xx responses; `status` is 0 when the request never reached the server. */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message: string; data: T }> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your internet connection.", 0);
  }

  let json: { message?: string; error?: string } | null = null;
  const text = await response.text();
  try {
    json = JSON.parse(text);
  } catch {
    json = { message: text || `HTTP ${response.status}` };
  }

  if (!response.ok) {
    const errorMessage =
      json?.message ||
      json?.error ||
      `Request failed with status ${response.status}`;
    throw new ApiError(errorMessage, response.status);
  }

  return json as { success: boolean; message: string; data: T };
}

export const api = {
  // Auth
  register: (payload: { name: string; email: string; password: string; phone?: string; course_ids?: Array<string | number> }) =>
    request<{ user: unknown; token: string }>("auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ user: unknown; token: string }>("auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMe: () => request<{ user: unknown; stats?: unknown }>("auth/me"),
  updateProfile: (payload: { name?: string; phone?: string; bio?: string; password?: string }) =>
    request<{ user: unknown }>("auth/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  /** `avatar` is a data URL produced by imageFileToAvatar(). */
  uploadAvatar: (avatar: string) =>
    request<{ avatar_url?: string | null }>("auth/avatar", {
      method: "POST",
      body: JSON.stringify({ avatar }),
    }),
  removeAvatar: () => request("auth/avatar", { method: "DELETE" }),
  logout: () => request("auth/logout", { method: "POST" }),

  // Courses
  getCourses: () => request<unknown[]>("courses"),
  selectPreferredCourses: (courseIds: Array<string | number>) =>
    request("student/courses/choose", {
      method: "POST",
      body: JSON.stringify({ course_ids: courseIds }),
    }),
  getMyCourses: () => request<unknown[]>("student/courses"),

  // Student Exams & Instant Automated Grading
  getExams: (params?: { type?: "practice" | "live"; course_id?: string | number; preferred_only?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set("type", params.type);
    if (params?.course_id) searchParams.set("course_id", params.course_id.toString());
    if (params?.preferred_only) searchParams.set("preferred_only", "1");
    const qs = searchParams.toString();
    return request<unknown>(`exams${qs ? `?${qs}` : ""}`);
  },

  startExam: (examId: string | number) =>
    request<{
      attempt_id: string | number;
      exam: unknown;
      session: unknown;
      questions: unknown[];
      /** answers autosaved earlier in this attempt, keyed by question id */
      saved_answers?: Record<string, string>;
    }>(`student/exams/${examId}/start`, { method: "POST" }),

  /** Practice tests only: mark one answer instantly. The first answer to a question is final. */
  checkAnswer: (attemptId: string | number, questionId: string, selectedOptionId: string) =>
    request<{
      question_id: string;
      selected_option_id: string;
      is_correct: boolean;
      correct_option_id: string | null;
      correct_option_letter: string | null;
      explanation: string | null;
      already_answered: boolean;
    }>(`student/attempts/${attemptId}/check`, {
      method: "POST",
      body: JSON.stringify({ question_id: questionId, selected_option_id: selectedOptionId }),
    }),

  /**
   * Move past a question (exams are forward-only). For live exams the answer is saved in the
   * same step; once passed, the question can't be revisited or changed.
   */
  nextQuestion: (attemptId: string | number, questionId: string, selectedOptionId: string | null) =>
    request<{ passed_question_ids: string[] }>(`student/attempts/${attemptId}/next`, {
      method: "POST",
      body: JSON.stringify({ question_id: questionId, selected_option_id: selectedOptionId }),
    }),

  /** Autosave answers while the exam is open. */
  saveAnswers: (
    attemptId: string | number,
    answers: Array<{ question_id: string; selected_option_id: string | null }>
  ) =>
    request<{ saved: number; saved_at: string }>(`student/attempts/${attemptId}/answers`, {
      method: "PUT",
      body: JSON.stringify({ answers }),
    }),

  submitExam: (
    attemptId: string | number,
    answers: Array<{ question_id: string | number; selected_option_id: string | number | null }>
  ) =>
    request<{
      attempt_id: string | number;
      score: number;
      total_possible: number;
      percentage: number;
      passed: boolean;
      correct_answers_count: number;
      incorrect_answers_count: number;
      unanswered_count: number;
      breakdown: unknown[];
    }>(`student/attempts/${attemptId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  // Student Results
  getMyResults: (params?: { type?: "practice" | "live"; course_id?: string | number }) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set("type", params.type);
    if (params?.course_id) searchParams.set("course_id", params.course_id.toString());
    const qs = searchParams.toString();
    return request<unknown>(`student/results${qs ? `?${qs}` : ""}`);
  },

  getResultDetail: (attemptId: string | number) =>
    request<{ attempt: unknown; answers: unknown[] }>(`student/results/${attemptId}`),
};

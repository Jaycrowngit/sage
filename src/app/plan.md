Way forward (suggested order)
Phase 0: today, small changes, highest risk

Change the Atlas password and remove the hard-coded database address and APP_KEY.
Change the default admin password.
Remove tutor from public registration. Only admins should create tutors.
Add exam-ownership checks to every question endpoint. A Laravel Policy class would do this cleanly.
Stop sending explanation when an exam starts.
Hide correct answers in live-exam results until scheduled_end_at has passed.



Phase 1: get the backend behaving correctly

Rewrite the exception handler so it only deals with unexpected errors. Let 401, 404 and 422 through with their real codes, and show no file or line details unless APP_DEBUG is on.
Add throttle limits on auth/*, plus a cap on OTP attempts.
Check the deadline when an exam is submitted, using min(started_at + duration, scheduled_end_at) plus a short grace period.
Make submission atomic: change the attempt from in_progress to submitting in a single conditional update.
Add unique and lookup indexes, store emails in lower case, cap per_page, and fix the leaderboard crash on deleted users.



Phase 2: protect students' work

Add a "save answer" endpoint (PUT /student/attempts/{id}/answers) that saves each answer as it's picked.
When an attempt is resumed, return the saved answers and keep the same question order (store the shuffle order on the attempt).
On the frontend, run the timer from expires_at, retry auto-submit when it fails, and lock navigation during an exam.


Phase 3: data integrity

Update question options in place instead of deleting and recreating them, or save a copy of each question on the attempt, so old results stay correct.
Pick one rule for multiple correct options (forbid them, or accept any of them) and check it on the backend.
Make total_marks either drive scoring or come from the question marks.


Phase 4: background work

Send email through a queue with a worker, or a transactional email service, instead of inside the request. Only notify enrolled students.
Fix the email links so they point to a route that exists, such as /dashboard?exam=….



Phase 5: missing features

OTP verification screen and requiring a verified email.
Forgot and reset password.
Result detail page on the student site.
Pagination on the student dashboard.
Tutor screens, either a tutor mode in the admin panel or a separate portal.
Token expiry.



Phase 6: tests

Add PHPUnit feature tests for login, roles, exam timing and grading (none exist today).
Run lint and type checks in CI for both Next.js apps.
If you'd like, I can start on Phase 0. Each fix there is small and can be done on its own.
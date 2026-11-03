import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import {
  ArrowRight, ArrowUpRight, AudioLines, BookOpen, BriefcaseBusiness, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleHelp, ClipboardCheck, Clock3, Copy, ExternalLink,
  FileAudio, FileText, Headphones, Home, Lightbulb, Link2, LockKeyhole, Mic, MicOff,
  Play, Printer, Search, Send, ShieldAlert, Sparkles, Target, TrendingUp, Trophy,
  Upload, Volume2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type RoleId = "support" | "analyst" | "qa";
type PageId = "Dashboard" | "Job roles" | "AI research" | "Mock interview" | "STAR answer bank" | "Interview checklist" | "Progress" | "AI verification" | "Prompt library" | "Audio practice";
type RoundId = "HR Interview" | "Technical Interview" | "Behavioural Interview";
type ScoreParts = { relevance: number; technical: number; communication: number; confidence: number; problemSolving: number };
type InterviewRecord = { score: number; date: string; role: RoleId; round: RoundId };
type StarAnswer = { situation: string; task: string; action: string; result: string };
type StoredData = { role: RoleId; interviews: InterviewRecord[]; starAnswers: Record<number, StarAnswer>; checks: boolean[] };
type Role = {
  id: RoleId; name: string; short: string; description: string; icon: LucideIcon; color: string;
  skills: string[]; softSkills: string[]; responsibilities: string[]; qualifications: string[];
  questions: string[]; onet: string; onetLabel: string; accent: string;
};

const roles: Role[] = [
  {
    id: "support", name: "IT Support Engineer", short: "IT Support", description: "Help people and systems work better, every day.",
    icon: Headphones, color: "#eaf2ff", accent: "#4c7fe7",
    skills: ["Windows & macOS", "Troubleshooting", "Networking basics", "Active Directory", "Ticketing systems", "Microsoft 365"],
    softSkills: ["Patient listening", "Clear explanations", "Customer empathy", "Prioritization"],
    responsibilities: ["Resolve hardware, software, and access issues.", "Document solutions in a ticketing system.", "Support users remotely and in person.", "Escalate complex incidents with clear notes."],
    qualifications: ["Degree, diploma, or equivalent IT experience.", "Foundational knowledge of operating systems and networking.", "Customer-facing experience is useful; entry-level certifications can help."],
    questions: ["How would you troubleshoot a user who cannot connect to Wi-Fi?", "A colleague cannot access their account. What would you check first?", "How would you explain a technical issue to a non-technical user?"],
    onet: "https://www.onetonline.org/link/summary/15-1232.00", onetLabel: "O*NET · Computer User Support Specialists",
  },
  {
    id: "analyst", name: "Business Analyst", short: "Business Analyst", description: "Turn complex challenges into clear next steps.",
    icon: BriefcaseBusiness, color: "#eff8f2", accent: "#449c6a",
    skills: ["Requirements gathering", "Excel & data analysis", "Process mapping", "SQL fundamentals", "User stories", "PowerPoint"],
    softSkills: ["Active listening", "Stakeholder management", "Structured thinking", "Facilitation"],
    responsibilities: ["Meet stakeholders to understand business needs.", "Document requirements, user stories, and acceptance criteria.", "Map current processes and identify improvements.", "Collaborate with delivery teams and validate outcomes."],
    qualifications: ["Degree or equivalent experience in a relevant area.", "Comfort working with spreadsheets and written requirements.", "Demonstrable project or analytical experience; domain knowledge is helpful."],
    questions: ["How do you gather requirements when stakeholders disagree?", "How would you explain a data insight to a non-technical audience?", "Tell me about a process you would improve and how you would measure success."],
    onet: "https://www.onetonline.org/link/summary/13-1111.00", onetLabel: "O*NET · Management Analysts",
  },
  {
    id: "qa", name: "QA Tester", short: "QA Tester", description: "Catch the little things that make a big difference.",
    icon: Target, color: "#fff3e8", accent: "#dc8b40",
    skills: ["Test cases & plans", "Bug reporting", "Regression testing", "SDLC basics", "API testing", "SQL basics"],
    softSkills: ["Curiosity", "Attention to detail", "Clear documentation", "Constructive collaboration"],
    responsibilities: ["Review requirements and design test scenarios.", "Execute manual or automated tests and report defects.", "Re-test fixes and perform regression checks.", "Work with developers to support product quality."],
    qualifications: ["Degree, diploma, or equivalent practical experience.", "A working understanding of software testing and development lifecycles.", "Sample test cases or a small practice project can demonstrate skills."],
    questions: ["How would you test a sign-in page?", "What is the difference between severity and priority?", "How would you write a bug report a developer can act on?"],
    onet: "https://www.onetonline.org/link/summary/15-1253.00", onetLabel: "O*NET · Software Quality Assurance Analysts and Testers",
  },
];

const rounds: RoundId[] = ["HR Interview", "Technical Interview", "Behavioural Interview"];
const hrQuestions = ["Tell me about yourself.", "What are your strengths and weaknesses?", "Why should we hire you?"];
const behaviouralQuestions = ["Tell me about a time you had to solve a difficult problem.", "Describe a time you worked with someone whose approach was different from yours.", "Tell me about a time you learned something quickly to complete a task."];
const starQuestions = [
  "Tell me about yourself.", "What are your strengths and weaknesses?", "Why should we hire you?",
  "Tell me about a challenge you overcame.", "Describe a time you worked in a team.",
  "Tell me about a mistake you learned from.", "How do you handle competing priorities?",
  "Describe a time you showed initiative.", "Tell me about a time you received feedback.",
  "Where do you see yourself in five years?",
];
const checklistSections = [
  { title: "Resume preparation", icon: FileText, items: ["Tailor your resume to the role", "Check dates, spelling, and contact details", "Prepare examples for your key achievements"] },
  { title: "Company research", icon: Search, items: ["Understand the company’s product and mission", "Read the job description carefully", "Prepare two thoughtful questions"] },
  { title: "Technical preparation", icon: Target, items: ["Review core role-specific fundamentals", "Practise explaining how you solve problems", "Try one realistic practice exercise"] },
  { title: "Communication practice", icon: AudioLines, items: ["Practise a concise introduction aloud", "Use STAR for experience-based questions", "Pause, listen, and clarify when needed"] },
  { title: "Interview questions", icon: CircleHelp, items: ["Prepare answers to common interview questions", "Have examples ready for strengths and challenges", "Practise asking clear follow-up questions"] },
  { title: "Interview day", icon: CheckCircle2, items: ["Confirm the time, format, and location", "Test your device and internet if remote", "Prepare a notebook, water, and a calm start"] },
];
const scoringPrompts = [
  { title: "Interviewer prompt", prompt: "Act as a supportive interviewer for a [ROLE] fresher. Ask one question at a time. Wait for the candidate's answer before continuing. Keep questions appropriate to entry-level experience.", version: "v1.2", result: "Three questions delivered in sequence, with a pause for the candidate after each." },
  { title: "Answer evaluation prompt", prompt: "Review this interview answer for relevance (25), technical knowledge (25), communication (20), confidence and clarity (15), and problem solving (15). Return a score out of 100, specific evidence, one improvement, and a sample answer. Do not invent experience.", version: "v1.1", result: "A rubric-based score, actionable feedback, and an honest answer outline." },
  { title: "STAR answer generation", prompt: "Help me structure my real example using Situation, Task, Action, and Result. Ask for missing details. Do not make up events, metrics, or outcomes. The example is: [YOUR REAL EXAMPLE].", version: "v1.0", result: "A structured STAR draft based only on details supplied by the candidate." },
  { title: "Technical question generation", prompt: "Create three entry-level interview questions for a [ROLE]. Focus on skills supported by this job description: [PASTE JOB DESCRIPTION]. Label any assumptions and do not claim these exact questions are used by a company.", version: "v1.0", result: "Three role-matched practice questions; questions are preparation ideas, not predictions." },
  { title: "Answer improvement", prompt: "Make this answer clearer and more concise while preserving the candidate's facts, voice, and experience. Flag unsupported claims instead of rewriting them as facts: [PASTE ANSWER].", version: "v1.0", result: "A clearer draft that flags missing evidence instead of inventing details." },
];

function getStoredData(): StoredData {
  const fallback: StoredData = { role: "support", interviews: [], starAnswers: {}, checks: Array(checklistSections.reduce((sum, section) => sum + section.items.length, 0)).fill(false) };
  try {
    const saved = localStorage.getItem("freshstart-data");
    if (!saved) return fallback;
    const data = JSON.parse(saved) as Partial<StoredData>;
    return {
      ...fallback,
      ...data,
      role: roles.some((role) => role.id === data.role) ? data.role as RoleId : fallback.role,
      interviews: Array.isArray(data.interviews) ? data.interviews : fallback.interviews,
      starAnswers: data.starAnswers && typeof data.starAnswers === "object" ? data.starAnswers : fallback.starAnswers,
      checks: Array.isArray(data.checks) && data.checks.length === fallback.checks.length ? data.checks : fallback.checks,
    };
  } catch (error) {
    console.warn("Could not read saved interview practice data.", error);
    return fallback;
  }
}

function calculateScore(answer: string, role: Role): ScoreParts {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const text = answer.toLowerCase();
  const relevantTerms = [...role.skills, ...role.responsibilities].map((item) => item.toLowerCase().split(/[ &]/)[0]).filter((word) => word.length > 4);
  const matched = relevantTerms.filter((term) => text.includes(term)).length;
  const relevance = Math.min(25, Math.round(8 + Math.min(matched, 5) * 3 + (words.length >= 12 ? 2 : 0)));
  const technical = Math.min(25, Math.round((words.length >= 8 ? 8 : words.length * 0.7) + Math.min(matched, 4) * 3.5 + (/\b(example|because|for instance|for example)\b/.test(text) ? 3 : 0)));
  const communication = Math.min(20, Math.round(Math.min(words.length / 5, 9) + (/[.!?]/.test(answer) ? 3 : 0) + (words.length >= 20 && words.length <= 110 ? 8 : 3)));
  const confidence = Math.min(15, Math.round((/\b(i|my|we|our)\b/.test(text) ? 6 : 2) + (words.length >= 12 ? 4 : 1) + (/[.!?]/.test(answer) ? 3 : 1)));
  const problemSolving = Math.min(15, Math.round((/\b(problem|solution|solved|approach|step|result|outcome|learned|improved)\b/.test(text) ? 7 : 2) + (/\b(first|then|finally|because|so that)\b/.test(text) ? 4 : 1) + (words.length >= 18 ? 4 : 2)));
  return { relevance, technical, communication, confidence, problemSolving };
}
const scoreTotal = (scores: ScoreParts) => scores.relevance + scores.technical + scores.communication + scores.confidence + scores.problemSolving;
function getFeedback(answer: string, scores: ScoreParts) {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const feedback: string[] = [];
  if (words < 12) feedback.push("Add a little more context; a specific example makes your answer easier to assess.");
  if (!/\b(example|for instance|for example)\b/i.test(answer)) feedback.push("Include one real example to show how you applied this skill.");
  if (!/\b(result|outcome|improved|learned)\b/i.test(answer)) feedback.push("End with the result or what you learned.");
  if (scores.relevance < 18) feedback.push("Connect your answer more directly to the role's requirements.");
  if (feedback.length === 0) feedback.push("A well-developed answer. Keep it focused, specific, and natural when speaking.");
  return feedback.slice(0, 3);
}
function ScoreBreakdown({ scores }: { scores: ScoreParts }) {
  const rows: { label: string; value: number; max: number }[] = [
    { label: "Relevance", value: scores.relevance, max: 25 }, { label: "Technical knowledge", value: scores.technical, max: 25 },
    { label: "Communication", value: scores.communication, max: 20 }, { label: "Confidence & clarity", value: scores.confidence, max: 15 },
    { label: "Problem solving", value: scores.problemSolving, max: 15 },
  ];
  return <div className="space-y-3">{rows.map((row) => <div key={row.label}><div className="mb-1.5 flex justify-between text-xs"><span className="text-slate-600">{row.label}</span><span className="font-semibold text-slate-700">{row.value}<span className="font-normal text-slate-400"> / {row.max}</span></span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-500" style={{ width: `${row.value / row.max * 100}%` }} /></div></div>)}</div>;
}
function ScoreDial({ score, size = 80 }: { score: number; size?: number }) {
  const r = 34, circumference = 2 * Math.PI * r;
  return <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}><svg width={size} height={size} viewBox="0 0 80 80" className="ring-progress"><circle cx="40" cy="40" r={r} fill="none" stroke="#eeeefa" strokeWidth="7" /><circle cx="40" cy="40" r={r} fill="none" stroke="#7562e9" strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)} /></svg><span className="absolute font-display text-lg font-extrabold text-slate-800">{score}</span></div>;
}

function App() {
  const [stored, setStored] = useState<StoredData>(getStoredData);
  const [page, setPage] = useState<PageId>("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("freshstart-theme");
      return saved ? JSON.parse(saved) === true : false;
    } catch (error) {
      console.warn("Could not read saved theme preference.", error);
      return false;
    }
  });
  const [selectedRound, setSelectedRound] = useState<RoundId>("HR Interview");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [draftAnswer, setDraftAnswer] = useState("");
  const [submitted, setSubmitted] = useState<{ answer: string; scores: ScoreParts } | null>(null);
  const [roundScores, setRoundScores] = useState<ScoreParts[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [verificationText, setVerificationText] = useState("");
  const [verificationResult, setVerificationResult] = useState(false);
  const [editingStar, setEditingStar] = useState<number | null>(null);
  const [starDraft, setStarDraft] = useState<StarAnswer>({ situation: "", task: "", action: "", result: "" });
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [audioTranscript, setAudioTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const [listening, setListening] = useState(false);
  const [audioScores, setAudioScores] = useState<ScoreParts | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioStream = useRef<MediaStream | null>(null);
  const speechRecognition = useRef<{ stop: () => void } | null>(null);
  const role = roles.find((item) => item.id === stored.role) ?? roles[0];
  const mockQuestions = selectedRound === "HR Interview" ? hrQuestions : selectedRound === "Technical Interview" ? role.questions : behaviouralQuestions;
  const currentQuestion = mockQuestions[questionIndex] ?? mockQuestions[0];
  const completedCount = stored.interviews.length;
  const average = completedCount ? Math.round(stored.interviews.reduce((sum, item) => sum + item.score, 0) / completedCount) : 0;
  const progress = Math.min(100, Math.round((completedCount * 12 + stored.checks.filter(Boolean).length * 2.2) / 1.2));

  useEffect(() => {
    try { localStorage.setItem("freshstart-data", JSON.stringify(stored)); }
    catch (error) { console.warn("Could not save interview practice data in this browser.", error); }
  }, [stored]);
  useEffect(() => {
    document.body.dataset.theme = isDarkMode ? "dark" : "light";
    try { localStorage.setItem("freshstart-theme", JSON.stringify(isDarkMode)); }
    catch (error) { console.warn("Could not save theme preference in this browser.", error); }
  }, [isDarkMode]);
  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);
  useEffect(() => () => { audioStream.current?.getTracks().forEach((track) => track.stop()); speechRecognition.current?.stop(); }, []);

  function changeRole(id: RoleId) { setStored((old) => ({ ...old, role: id })); }
  function startRound(round: RoundId) { setSelectedRound(round); setQuestionIndex(0); setDraftAnswer(""); setSubmitted(null); setRoundScores([]); setPage("Mock interview"); }
  function submitAnswer(event: FormEvent) {
    event.preventDefault();
    if (!draftAnswer.trim()) return;
    setSubmitted({ answer: draftAnswer.trim(), scores: calculateScore(draftAnswer, role) });
  }
  function nextQuestion() {
    if (!submitted) return;
    if (questionIndex + 1 < mockQuestions.length) {
      setRoundScores((scores) => [...scores, submitted.scores]);
      setQuestionIndex((index) => index + 1); setDraftAnswer(""); setSubmitted(null);
      return;
    }
    const scores = [...roundScores, submitted.scores];
    const averageScores = Object.fromEntries(
      (Object.keys(submitted.scores) as (keyof ScoreParts)[]).map((key) => [
        key,
        Math.round(scores.reduce((sum, item) => sum + item[key], 0) / scores.length),
      ]),
    ) as ScoreParts;
    const score = scoreTotal(averageScores);
    setStored((old) => ({ ...old, interviews: [...old.interviews, { score, date: new Date().toISOString(), role: old.role, round: selectedRound }] }));
    setQuestionIndex(0); setDraftAnswer(""); setSubmitted(null); setRoundScores([]); setPage("Progress");
  }
  function editStar(index: number) {
    const current = stored.starAnswers[index];
    setStarDraft(current ? { ...current } : { situation: "", task: "", action: "", result: "" });
    setEditingStar(index);
  }
  function saveStar(event: FormEvent) {
    event.preventDefault();
    if (editingStar === null) return;
    setStored((old) => ({ ...old, starAnswers: { ...old.starAnswers, [editingStar]: starDraft } }));
    setEditingStar(null);
  }
  function toggleChecklist(index: number) {
    setStored((old) => ({ ...old, checks: old.checks.map((checked, i) => i === index ? !checked : checked) }));
  }
  async function copyPrompt(title: string, prompt: string) {
    try { await navigator.clipboard.writeText(prompt); setCopiedPrompt(title); window.setTimeout(() => setCopiedPrompt(null), 1800); }
    catch (error) { console.warn("Clipboard access was unavailable.", error); }
  }
  function startRecording() {
    void navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioStream.current = stream;
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        setAudioUrl((oldUrl) => { if (oldUrl) URL.revokeObjectURL(oldUrl); return URL.createObjectURL(blob); });
        stream.getTracks().forEach((track) => track.stop());
        audioStream.current = null;
      };
      recorder.start(); mediaRecorder.current = recorder; setRecording(true);
    }).catch((error: unknown) => { console.error("Could not start audio recording.", error); window.alert("Microphone access was not available. Check your browser permission and try again."); });
  }
  function stopRecording() {
    if (mediaRecorder.current?.state === "recording") mediaRecorder.current.stop();
    setRecording(false);
  }
  function uploadAudio(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(URL.createObjectURL(file)); setAudioScores(null);
  }
  function startTranscription() {
    type RecognitionResult = { transcript: string };
    type Recognition = { lang: string; continuous: boolean; interimResults: boolean; onresult: ((event: { results: ArrayLike<ArrayLike<RecognitionResult>> }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void; stop: () => void };
    type RecognitionConstructor = new () => Recognition;
    const speechWindow = window as Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) { window.alert("Live speech-to-text is not supported in this browser. You can type or paste your transcript instead."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || "en-US"; recognition.continuous = true; recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0]?.transcript ?? "").join("");
      setAudioTranscript(transcript);
    };
    recognition.onerror = () => { setListening(false); };
    recognition.onend = () => setListening(false);
    speechRecognition.current = recognition;
    try { recognition.start(); setListening(true); } catch (error) { console.error("Could not start speech recognition.", error); window.alert("Speech recognition could not start. Check your browser microphone permission and try again."); }
  }
  function analyzeTranscript(event: FormEvent) {
    event.preventDefault();
    if (audioTranscript.trim()) setAudioScores(calculateScore(audioTranscript, role));
  }

  const navGroups: { title: string; items: { name: PageId; icon: LucideIcon }[] }[] = [
    { title: "Workspace", items: [{ name: "Dashboard", icon: Home }, { name: "Job roles", icon: BriefcaseBusiness }, { name: "AI research", icon: Search }] },
    { title: "Practice", items: [{ name: "Mock interview", icon: AudioLines }, { name: "STAR answer bank", icon: BookOpen }, { name: "Audio practice", icon: Headphones }, { name: "Interview checklist", icon: ClipboardCheck }] },
    { title: "Insights", items: [{ name: "Progress", icon: TrendingUp }, { name: "AI verification", icon: ShieldAlert }, { name: "Prompt library", icon: Sparkles }] },
  ];
  const pageDescriptions: Record<PageId, string> = {
    Dashboard: "Your interview preparation, all in one place.", "Job roles": "Find a first role that fits your goals.", "AI research": "Research the role. Bring a real job description.",
    "Mock interview": "Practise at your pace. One question at a time.", "STAR answer bank": "Build clear, honest stories from your experience.",
    "Interview checklist": "A calmer interview starts with a plan.", Progress: "Small practice sessions add up.",
    "AI verification": "Slow down, check claims, and look for sources.", "Prompt library": "Transparent prompts for a thoughtful practice experience.",
    "Audio practice": "Get comfortable hearing your own answers out loud.",
  };
  const setChecked = (index: number) => stored.checks[index] ?? false;
  const completedChecklist = stored.checks.filter(Boolean).length;
  const totalChecklist = stored.checks.length;
  const section = (title: string, description?: string, action?: ReactNode) => (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-lg font-bold text-slate-800">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>{action}</div>
  );
  const statCard = (label: string, value: string | number, detail: string, Icon: LucideIcon, color: string) => (
    <div className="panel soft-shadow p-5"><div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: color }}><Icon size={19} className="text-violet-700" /></div><ArrowUpRight size={17} className="text-slate-300" /></div><div className="mt-4 font-display text-2xl font-extrabold text-slate-800">{value}</div><div className="mt-1 text-sm font-semibold text-slate-700">{label}</div><div className="mt-1 text-xs text-slate-400">{detail}</div></div>
  );

  function renderDashboard() {
    return <>
      <div className="mb-7 overflow-hidden rounded-[26px] bg-[radial-gradient(circle_at_top_left,_rgba(167,155,255,0.45),_transparent_32%),linear-gradient(135deg,#2e2b5f_0%,#1f2345_100%)] px-7 py-7 text-white sm:px-9 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-6"><div className="max-w-[560px]"><div className="mb-2 flex items-center gap-2 text-sm text-indigo-200"><Sparkles size={15} /> YOUR NEXT CHAPTER STARTS HERE</div><h2 className="font-display text-2xl font-extrabold leading-tight sm:text-[30px]">You’ve got this, Alex.</h2><p className="mt-2 text-sm leading-6 text-indigo-100/80">A little practice today can make a big difference tomorrow. Let’s get you ready.</p><div className="mt-5 flex flex-wrap items-center gap-3"><button onClick={() => startRound("HR Interview")} className="primary-btn inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700">Start a mock interview <ArrowRight size={16} /></button><div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-indigo-100">Today&apos;s focus: {role.short}</div></div></div><div className="hidden items-center justify-center sm:flex"><div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_16px_40px_rgba(138,128,255,0.25)]"><div className="absolute inset-3 rounded-full border-[7px] border-white/10" style={{ borderTopColor: "#a99cf8", borderRightColor: "#a99cf8", transform: "rotate(-38deg)" }} /><div className="text-center"><div className="font-display text-3xl font-extrabold">{progress}%</div><div className="mt-0.5 text-xs text-indigo-200">ready to go</div></div></div></div></div>
      </div>
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{statCard("Mock interviews", completedCount, completedCount ? "Practice sessions completed" : "Your first one is waiting", AudioLines, "#f1edff")}{statCard("Average score", completedCount ? `${average}%` : "—", completedCount ? "Across all practice rounds" : "Complete a round to get scored", Trophy, "#fff5e8")}{statCard("Your selected role", role.short, "Tap to explore role details", BriefcaseBusiness, "#eaf5f0")}{statCard("Preparation progress", `${progress}%`, `${completedChecklist} of ${totalChecklist} checklist items done`, TrendingUp, "#e9f2ff")}</div>
      <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <div className="panel soft-shadow p-5 sm:p-6">{section("Your next steps", "A few thoughtful minutes go a long way.")}<div className="space-y-2.5">
          {[{ icon: BriefcaseBusiness, title: `Explore the ${role.name} role`, sub: "Skills, responsibilities & interview questions", page: "Job roles" as PageId, bg: "#efedff" }, { icon: AudioLines, title: "Try a short mock interview", sub: "Answer a question, then get helpful feedback", page: "Mock interview" as PageId, bg: "#eaf5f0" }, { icon: ClipboardCheck, title: "Get interview-day ready", sub: "Your printable checklist is ready to go", page: "Interview checklist" as PageId, bg: "#fff4e8" }].map((item) => <button key={item.title} onClick={() => item.page === "Mock interview" ? startRound("HR Interview") : setPage(item.page)} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-violet-200 hover:bg-violet-50/40"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: item.bg }}><item.icon size={18} className="text-violet-700" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-700">{item.title}</span><span className="mt-0.5 block text-xs text-slate-400">{item.sub}</span></span><ChevronRight size={17} className="text-slate-400" /></button>)}</div></div>
        <div className="panel soft-shadow p-5 sm:p-6">{section("Recent practice", "Your latest interview activity.")}{stored.interviews.length ? <div className="space-y-4">{[...stored.interviews].reverse().slice(0, 4).map((item, index) => <div key={`${item.date}-${index}`} className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Check size={17} /></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-slate-700">{item.round}</div><div className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()} · {roles.find((r) => r.id === item.role)?.short}</div></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{item.score}/100</span></div>)}</div> : <div className="rounded-xl bg-[#faf9ff] px-4 py-5 text-center"><div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-violet-600"><AudioLines size={18} /></div><p className="mt-3 text-sm font-semibold text-slate-700">Your first practice session starts here.</p><p className="mt-1 text-xs leading-5 text-slate-400">Once you finish an interview round, you’ll see your activity here.</p></div>}<button onClick={() => setPage("Progress")} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-600">View your progress <ArrowRight size={15} /></button></div>
      </div>
      <p className="mt-5 text-center text-xs text-slate-400">A supportive practice partner, not a substitute for your own judgment. Your answers stay on this device.</p>
    </>;
  }

  function renderRoles() {
    return <>
      <div className="mb-6 grid gap-3 md:grid-cols-3">{roles.map((item) => <button key={item.id} onClick={() => changeRole(item.id)} className={`panel p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${role.id === item.id ? "border-violet-300 ring-2 ring-violet-100" : ""}`}><div className="mb-3 flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: item.color }}><item.icon size={19} style={{ color: item.accent }} /></span>{role.id === item.id && <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700">SELECTED</span>}</div><div className="font-display text-base font-bold text-slate-800">{item.name}</div><p className="mt-1 text-xs text-slate-500">{item.description}</p></button>)}</div>
      <div className="panel soft-shadow p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-[15px]" style={{ background: role.color }}><role.icon size={23} style={{ color: role.accent }} /></span><div><h2 className="font-display text-xl font-extrabold text-slate-800">{role.name}</h2><p className="mt-1 text-sm text-slate-500">{role.description}</p></div></div><button onClick={() => setPage("AI research")} className="inline-flex items-center gap-2 rounded-xl border border-violet-100 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-50"><Search size={15} /> Research this role</button></div>
        <div className="grid gap-x-8 gap-y-7 pt-6 sm:grid-cols-2">
          {[{ title: "Technical skills", items: role.skills, icon: Target, color: "#eeeaff" }, { title: "People skills", items: role.softSkills, icon: Lightbulb, color: "#fff4e6" }, { title: "Typical responsibilities", items: role.responsibilities, icon: BriefcaseBusiness, color: "#eaf5f0" }, { title: "A helpful starting point", items: role.qualifications, icon: GraduationIcon, color: "#eaf2ff" }].map(({ title, items, icon: Icon, color }) => <div key={title}><h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700"><span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: color }}><Icon size={14} className="text-slate-600" /></span>{title}</h3><ul className="space-y-2">{items.map((item) => <li key={item} className="flex items-start gap-2 text-sm leading-5 text-slate-500"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />{item}</li>)}</ul></div>)}
          <div className="sm:col-span-2"><h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50"><CircleHelp size={15} className="text-violet-600" /></span>Good questions to practise</h3><div className="grid gap-2 sm:grid-cols-3">{role.questions.map((question, index) => <div key={question} className="rounded-xl bg-slate-50 p-3 text-sm leading-5 text-slate-600"><span className="mb-1 block text-[11px] font-bold text-violet-600">QUESTION 0{index + 1}</span>{question}</div>)}</div><button onClick={() => startRound("Technical Interview")} className="primary-btn mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white">Practise these questions <ArrowRight size={15} /></button></div>
        </div></div>
      <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500"><Link2 size={15} className="text-violet-500" /> For current occupational details, check the published <a href={role.onet} target="_blank" rel="noreferrer" className="font-semibold text-violet-600 underline decoration-violet-200 underline-offset-2">{role.onetLabel} <ExternalLink size={11} className="inline" /></a>. Role summaries above are general preparation guidance; qualifications vary by employer and country.</div>
    </>;
  }

  function renderResearch() {
    const tokens = jobDescription.toLowerCase().match(/[a-z][a-z+#.]{2,}/g) ?? [];
    const seen = new Set<string>();
    const query = encodeURIComponent(`${role.name} interview questions skills job responsibilities`);
    return <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-violet-100 bg-[#f7f5ff] p-4"><div className="flex items-start gap-3"><span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600"><Sparkles size={18} /></span><div><div className="text-sm font-bold text-slate-700">Research links—not made-up citations</div><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">This demo doesn’t call Perplexity or fetch live job listings. Use the official occupational profile and open a real Perplexity search to verify current details.</p></div></div><a href={`https://www.perplexity.ai/search?q=${query}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white hover:bg-violet-700">Search Perplexity <ExternalLink size={13} /></a></div>
      <div className="grid gap-5 lg:grid-cols-[1fr_.85fr]">
        <div className="panel soft-shadow p-5 sm:p-6">{section("Start with a trusted source", role.name)}<a href={role.onet} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50/30"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><ExternalLink size={18} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-700">{role.onetLabel}</span><span className="mt-1 block truncate text-xs text-slate-400">{role.onet}</span></span><ArrowUpRight size={17} className="text-violet-500" /></a><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Technical skills to explore</h3><div className="flex flex-wrap gap-2">{role.skills.map((skill) => <span key={skill} className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-medium text-violet-700">{skill}</span>)}</div></div><div><h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">People skills to explore</h3><div className="flex flex-wrap gap-2">{role.softSkills.map((skill) => <span key={skill} className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700">{skill}</span>)}</div></div></div><div className="mt-5 rounded-xl bg-slate-50 p-4"><h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">Responsibilities in brief</h3><ul className="mt-2 space-y-2">{role.responsibilities.map((item) => <li key={item} className="flex items-start gap-2 text-sm leading-5 text-slate-600"><Check size={14} className="mt-0.5 shrink-0 text-emerald-500" />{item}</li>)}</ul></div></div>
        <div className="panel soft-shadow p-5 sm:p-6"><div className="mb-2 flex items-center gap-2"><FileText size={17} className="text-violet-600" /><h2 className="font-display text-base font-bold text-slate-800">Bring your own job description</h2></div><p className="mb-4 text-xs leading-5 text-slate-500">Paste a real listing to compare its language against this role’s skill checklist. Your text stays in this browser.</p><textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={7} placeholder="Paste the job description here…" className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50" /><div className="mt-4 border-t border-slate-100 pt-4"><h3 className="mb-3 text-sm font-bold text-slate-700">Skill phrase matches <span className="font-normal text-slate-400">({jobDescription.trim() ? "based only on your pasted text" : "waiting for a job description"})</span></h3>{jobDescription.trim() ? <div className="flex flex-wrap gap-2">{role.skills.map((skill) => { const match = tokens.some((token) => skill.toLowerCase().includes(token) || token.includes(skill.toLowerCase().split(/[ &]/)[0])); if (match) seen.add(skill); return <span key={skill} className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${match ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>{match ? "✓ " : ""}{skill}</span>; })}<p className="mt-3 w-full text-xs leading-5 text-slate-400">Simple text matches only; missing matches do not mean a skill is absent. This is not a live job-market analysis.</p></div> : <p className="text-xs text-slate-400">Add a listing above to see which skill phrases appear.</p>}</div></div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2"><div className="panel p-5"><h2 className="mb-3 font-display text-base font-bold text-slate-800">Questions worth practising</h2><ol className="space-y-3">{role.questions.map((question, i) => <li key={question} className="flex gap-3 text-sm leading-5 text-slate-600"><span className="font-bold text-violet-500">0{i + 1}</span>{question}</li>)}</ol><button onClick={() => startRound("Technical Interview")} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-violet-600">Practise now <ArrowRight size={15} /></button></div><div className="panel p-5"><h2 className="mb-3 font-display text-base font-bold text-slate-800">Where this information comes from</h2><p className="text-sm leading-6 text-slate-500">Occupational profile: <a href={role.onet} target="_blank" rel="noreferrer" className="font-semibold text-violet-600 underline">{role.onetLabel}</a>. The profile describes an occupation broadly; a specific employer’s job description may have different requirements. Check the source’s own date and citations before relying on details.</p><p className="mt-3 text-xs text-slate-400">No job postings, real-time employer trends, or Perplexity responses are retrieved in this sample app.</p></div></div>
    </>;
  }

  function renderMockInterview() {
    const questionNumber = questionIndex + 1;
    return <>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">{rounds.map((round, index) => <button key={round} onClick={() => { setSelectedRound(round); setQuestionIndex(0); setDraftAnswer(""); setSubmitted(null); setRoundScores([]); }} className={`panel flex items-center gap-3 p-4 text-left transition ${selectedRound === round ? "border-violet-300 ring-2 ring-violet-100" : "hover:border-slate-300"}`}><span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${selectedRound === round ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"}`}>0{index + 1}</span><span><span className="block text-sm font-bold text-slate-700">{round}</span><span className="text-xs text-slate-400">{index === 0 ? "Getting to know you" : index === 1 ? role.short + " questions" : "Real-world situations"}</span></span></button>)}</div>
      <div className="grid gap-5 lg:grid-cols-[1fr_330px]"><div className="panel soft-shadow p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">{selectedRound.toUpperCase()}</span><span className="text-xs text-slate-400">QUESTION {questionNumber} OF {mockQuestions.length}</span></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${questionNumber / mockQuestions.length * 100}%` }} /></div><h2 className="mt-7 font-display text-xl font-extrabold leading-8 text-slate-800 sm:text-2xl">{currentQuestion}</h2><p className="mt-2 text-sm text-slate-500">Take a breath. There’s no rush to answer.</p><form onSubmit={submitAnswer} className="mt-5"><label htmlFor="mock-answer" className="mb-2 block text-sm font-semibold text-slate-700">Your answer</label><textarea id="mock-answer" value={draftAnswer} onChange={(e) => setDraftAnswer(e.target.value)} disabled={!!submitted} rows={7} placeholder="Share your honest experience, or describe how you would approach this as a fresher…" className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-50 disabled:opacity-70" /><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-400">{draftAnswer.trim() ? `${draftAnswer.trim().split(/\s+/).length} words` : "Tip: Try Situation → Task → Action → Result for behavioural questions."}</p>{submitted ? <button type="button" onClick={nextQuestion} className="primary-btn inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white">{questionNumber < mockQuestions.length ? "Next question" : "Finish this round"} <ArrowRight size={15} /></button> : <button disabled={!draftAnswer.trim()} className="primary-btn inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white">Get feedback <Send size={14} /></button>}</div></form></div>
        <div className="space-y-4"><div className="panel p-5"><div className="flex items-center gap-2"><Sparkles size={16} className="text-violet-600" /><h3 className="text-sm font-bold text-slate-700">A friendly heads-up</h3></div><p className="mt-2 text-xs leading-5 text-slate-500">This demo gives local, rules-based feedback—it does not connect to an AI service. Your answer is saved only in this browser if you choose to keep practising.</p><div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">There’s no single “perfect” interview answer. Be truthful, specific, and yourself.</div></div>
          {submitted ? <div className="panel p-5"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-bold text-slate-800">Your practice score</h3><p className="mt-1 text-[11px] text-slate-400">Demo rubric · out of 100</p></div><ScoreDial score={scoreTotal(submitted.scores)} size={67} /></div><ScoreBreakdown scores={submitted.scores} /><div className="mt-4 rounded-xl bg-violet-50/70 p-3"><h4 className="text-xs font-bold text-violet-800">Areas to improve</h4><ul className="mt-1 space-y-1.5">{getFeedback(submitted.answer, submitted.scores).map((item) => <li key={item} className="flex items-start gap-1.5 text-xs leading-5 text-slate-600"><ArrowRight size={12} className="mt-1 shrink-0 text-violet-500" />{item}</li>)}</ul></div><div className="mt-3 rounded-xl border border-slate-100 p-3"><h4 className="text-xs font-bold text-slate-600">Sample revised answer · personalize with your real details</h4><p className="mt-1 text-xs leading-5 text-slate-500">“During <strong>[a real course, project, or experience]</strong>, I noticed <strong>[specific challenge]</strong>. I was responsible for <strong>[your task]</strong>. I took <strong>[actions you actually took]</strong>, which led to <strong>[honest result or learning]</strong>. I’d bring that same <strong>[relevant skill]</strong> to this role.”</p><p className="mt-2 text-[10px] leading-4 text-slate-400">This is a fill-in outline, not a generated answer. Keep it accurate to your own experience.</p></div></div> : <div className="panel p-5"><h3 className="mb-3 text-sm font-bold text-slate-700">Quick round guide</h3><div className="space-y-2.5">{mockQuestions.map((question, index) => <div key={question} className={`flex gap-2 text-xs leading-5 ${index === questionIndex ? "font-semibold text-violet-700" : "text-slate-400"}`}><span>{index < questionIndex ? "✓" : `0${index + 1}`}</span>{question}</div>)}</div></div>}</div></div>
    </>;
  }

  function renderStarBank() {
    const fields: { key: keyof StarAnswer; label: string; hint: string }[] = [{ key: "situation", label: "Situation", hint: "Set the scene. What was happening?" }, { key: "task", label: "Task", hint: "What were you responsible for?" }, { key: "action", label: "Action", hint: "What steps did you take personally?" }, { key: "result", label: "Result", hint: "What happened? What did you learn?" }];
    return <><div className="mb-5 flex items-start gap-3 rounded-xl border border-violet-100 bg-[#f7f5ff] p-4"><BookOpen size={19} className="mt-0.5 shrink-0 text-violet-600" /><p className="text-xs leading-5 text-slate-600"><strong className="text-slate-700">A real story beats a perfect script.</strong> Use genuine examples from studies, volunteering, personal projects, or everyday life. Your saved notes stay in this browser.</p></div><div className="grid gap-3 md:grid-cols-2">{starQuestions.map((question, index) => { const answer = stored.starAnswers[index]; const isEditing = editingStar === index; return <div key={question} className="panel p-4 sm:p-5"><div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-xs font-bold text-violet-700">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0 flex-1"><h3 className="text-sm font-bold leading-5 text-slate-700">{question}</h3>{!isEditing && <p className="mt-1 text-xs text-slate-400">{answer?.situation ? "Your STAR answer is saved" : "No answer yet — add your experience"}</p>}</div><button onClick={() => editStar(index)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">{answer?.situation ? "Edit" : "Add answer"}</button></div>{isEditing && <form onSubmit={saveStar} className="mt-4 space-y-3">{fields.map((field) => <label key={field.key} className="block"><span className="mb-1 block text-xs font-semibold text-slate-600">{field.label} <span className="font-normal text-slate-400">· {field.hint}</span></span><textarea rows={2} value={starDraft[field.key]} onChange={(e) => setStarDraft((old) => ({ ...old, [field.key]: e.target.value }))} placeholder={`${field.hint} (use your own details)`} className="w-full resize-y rounded-lg border border-slate-200 p-2.5 text-xs leading-5 text-slate-700 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-50" /></label>)}<div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingStar(null)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500">Cancel</button><button className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white">Save answer</button></div></form>}{answer?.situation && !isEditing && <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">{fields.map((field) => answer[field.key] && <p key={field.key} className="text-xs leading-5 text-slate-500"><span className="font-bold text-slate-700">{field.label}: </span>{answer[field.key]}</p>)}</div>}</div>; })}</div></>;
  }

  function renderChecklist() {
    let flatIndex = 0;
    return <><div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-100 bg-[#f7f5ff] px-4 py-3"><div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><ClipboardCheck size={17} className="text-violet-600" />{completedChecklist} of {totalChecklist} steps ready</div><button onClick={() => window.print()} className="no-print inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-700 hover:bg-violet-50"><Printer size={15} /> Print checklist</button></div><div className="print-area"><div className="print-only mb-5"><div className="font-display text-2xl font-extrabold text-slate-800">Your interview-day checklist</div><p className="mt-1 text-sm text-slate-500">{role.name} · A freshstart practice resource</p></div><div className="checklist-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">{checklistSections.map((item) => { const Icon = item.icon; return <div key={item.title} className="panel p-5"><h3 className="mb-4 flex items-center gap-2.5 font-display text-sm font-bold text-slate-800"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><Icon size={16} /></span>{item.title}</h3><div className="space-y-3">{item.items.map((text) => { const index = flatIndex++; const checked = setChecked(index); return <label key={text} className="flex cursor-pointer items-start gap-2.5"><input type="checkbox" checked={checked} onChange={() => toggleChecklist(index)} className="mt-1 h-3.5 w-3.5 accent-violet-600" /><span className={`text-xs leading-5 ${checked ? "text-slate-400 line-through" : "text-slate-600"}`}>{text}</span></label>; })}</div></div>; })}</div><div className="panel mt-5 flex flex-wrap items-center justify-between gap-4 p-5"><div><h3 className="text-sm font-bold text-slate-800">Want to make it your own?</h3><p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">Print this page to save as a PDF, then upload it as a new design in Canva to add your colors and personal notes. This workflow needs no Canva connection.</p></div><a href="https://www.canva.com/create/" target="_blank" rel="noreferrer" className="no-print inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Open Canva <ExternalLink size={13} /></a></div></div></>;
  }

  function renderProgress() {
    const first = stored.interviews[0];
    const third = stored.interviews[2];
    const improvement = first && third ? third.score - first.score : null;
    const max = Math.max(100, ...stored.interviews.map((i) => i.score));
    return <>    <div className="mb-5 grid gap-4 sm:grid-cols-3">{[{ label: "First mock interview", score: first?.score, empty: "Not yet recorded", icon: Play }, { label: "Third mock interview", score: third?.score, empty: "Keep practising", icon: Target }, { label: "Marks improved", score: improvement, empty: "Compare after 3 rounds", icon: TrendingUp }].map((card) => <div key={card.label} className="panel p-5"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">{card.label}</span><card.icon size={17} className="text-violet-500" /></div><div className="mt-3 font-display text-3xl font-extrabold text-slate-800">{card.score === undefined || card.score === null ? "—" : card.label === "Marks improved" ? `${card.score > 0 ? "+" : ""}${card.score}` : `${card.score}/100`}</div><div className="mt-1 text-xs text-slate-400">{card.score === undefined || card.score === null ? card.empty : card.label === "Marks improved" ? "first to third interview" : `${roles.find((r) => r.id === (card.label.startsWith("First") ? first?.role : third?.role))?.short ?? role.short} · demo rubric`}</div></div>)}</div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><div className="panel p-5 sm:p-6">{section("Your practice scores", "A simple view of your saved mock interviews.")}{stored.interviews.length ? <div className="mt-6 flex h-52 items-end gap-3 overflow-x-auto border-b border-l border-slate-100 px-3 pb-0 pt-3 sm:gap-5">{stored.interviews.map((item, index) => <div key={`${item.date}-${index}`} className="flex h-full min-w-[35px] flex-1 flex-col items-center justify-end gap-2"><span className="text-[11px] font-bold text-slate-500">{item.score}</span><div className={`w-full max-w-[42px] rounded-t-lg ${index === 0 || index === 2 ? "bg-violet-500" : "bg-violet-200"}`} style={{ height: `${Math.max(8, item.score / max * 145)}px` }} /><span className="pb-2 text-[10px] text-slate-400">#{index + 1}</span></div>)}</div> : <div className="flex h-44 flex-col items-center justify-center rounded-xl bg-slate-50 text-center"><TrendingUp size={23} className="text-violet-400" /><p className="mt-2 text-sm font-semibold text-slate-600">Your chart starts with interview one.</p><p className="mt-1 text-xs text-slate-400">Complete a mock round to record your first score.</p></div>}<div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400"><span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-violet-500" />First & third rounds</span><span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-violet-200" />Other rounds</span></div></div>
        <div className="panel p-5 sm:p-6"><h2 className="font-display text-base font-bold text-slate-800">A gentle improvement plan</h2><p className="mt-1 text-xs text-slate-400">Small, repeatable steps work best.</p><div className="mt-5 space-y-4">{[{ icon: BookOpen, title: "Build one STAR story", sub: "Add a real study, project, or volunteering example.", page: "STAR answer bank" as PageId }, { icon: AudioLines, title: "Practise out loud", sub: "Notice your pace, then try the answer once more.", page: "Audio practice" as PageId }, { icon: Search, title: "Use the job description", sub: "Match your examples to the role’s actual language.", page: "AI research" as PageId }].map((item) => <button key={item.title} onClick={() => setPage(item.page)} className="flex w-full items-start gap-3 text-left"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"><item.icon size={15} /></span><span><span className="block text-sm font-semibold text-slate-700">{item.title}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{item.sub}</span></span><ChevronRight size={15} className="ml-auto mt-1 shrink-0 text-slate-300" /></button>)}</div>{improvement !== null && <div className={`mt-5 flex items-start gap-2 rounded-xl p-3 ${improvement >= 0 ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}><Lightbulb size={15} className="mt-0.5 shrink-0" /><p className="text-xs leading-5">{improvement >= 0 ? `Your saved score changed by ${improvement} points between your first and third rounds. Keep the habits that helped you; a practice score is only one signal.` : `Your third practice score is ${Math.abs(improvement)} points lower. One score is a snapshot, not a verdict—try a specific STAR example and take another round at your own pace.`}</p></div>}</div></div><div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-100 px-4 py-3 text-xs leading-5 text-slate-500"><Clock3 size={15} className="mt-0.5 shrink-0" />Scores are generated by a simple local demo rubric and saved on this device. They are practice prompts, not an objective measure of job readiness.</div></>;
  }

  function renderVerification() {
    const verify = (event: FormEvent) => { event.preventDefault(); if (verificationText.trim()) setVerificationResult(true); };
    return <><div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"><ShieldAlert size={19} className="mt-0.5 shrink-0 text-amber-600" /><p className="text-xs leading-5 text-amber-900"><strong>This is a careful-review checklist, not an AI fact-checker.</strong> Text analysis cannot establish whether a claim is true. Always check the original source, its publication date, and an authoritative second source.</p></div><div className="grid gap-5 lg:grid-cols-[1fr_.85fr]"><div className="panel p-5 sm:p-6"><h2 className="font-display text-base font-bold text-slate-800">Review a claim or AI-generated answer</h2><p className="mt-1 text-xs leading-5 text-slate-500">Paste the exact answer or claim. The local demo flags common signals that call for checking; it does not verify facts against the internet.</p><form onSubmit={verify} className="mt-4"><textarea rows={8} value={verificationText} onChange={(e) => { setVerificationText(e.target.value); setVerificationResult(false); }} placeholder="Paste a factual claim or AI-generated interview answer…" className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm leading-6 text-slate-700 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50" /><div className="mt-3 flex justify-end"><button disabled={!verificationText.trim()} className="rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white">Review this text <ArrowRight size={14} className="ml-1 inline" /></button></div></form></div><div className="panel p-5 sm:p-6"><h2 className="font-display text-base font-bold text-slate-800">What to look out for</h2><div className="mt-4 space-y-3">{[{ title: "Numbers without a source", sub: "Statistics, percentages, and exact dates need evidence.", icon: ShieldAlert }, { title: "Time-sensitive claims", sub: "Company policies and role requirements can change.", icon: Clock3 }, { title: "Experience you didn’t have", sub: "An answer should never invent your work or achievements.", icon: CircleHelp }, { title: "Specific facts stated confidently", sub: "Fluent writing isn’t proof. Confirm details independently.", icon: Search }].map((item) => <div key={item.title} className="flex items-start gap-3"><item.icon size={16} className="mt-0.5 shrink-0 text-amber-500" /><div><h3 className="text-xs font-bold text-slate-700">{item.title}</h3><p className="mt-0.5 text-xs leading-5 text-slate-400">{item.sub}</p></div></div>)}</div></div></div>{verificationResult && <div className="panel mt-5 p-5 sm:p-6"><div className="mb-4 flex items-center gap-2"><ShieldAlert size={18} className="text-amber-600" /><h2 className="font-display text-base font-bold text-slate-800">Review notes for your text</h2></div><div className="grid gap-4 md:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><h3 className="text-xs font-bold text-slate-500">ORIGINAL TEXT</h3><p className="mt-2 text-sm leading-6 text-slate-700">{verificationText}</p></div><div className="rounded-xl bg-amber-50 p-4"><h3 className="text-xs font-bold text-amber-800">POTENTIAL REVIEW POINTS</h3><ul className="mt-2 space-y-2 text-xs leading-5 text-amber-900">{/\d/.test(verificationText) && <li>• A number or date is present; look for its original source and publication date.</li>}{/\b(always|never|guaranteed|definitely|everyone|all employers)\b/i.test(verificationText) && <li>• Absolute language may overstate what available evidence supports.</li>}{!/\b(source|according to|https?:\/\/|study|report)\b/i.test(verificationText) && <li>• No source is mentioned in the text; look for a traceable primary reference.</li>}<li>• Check any first-person examples against your own actual experience.</li></ul></div><div className="rounded-xl bg-emerald-50 p-4"><h3 className="text-xs font-bold text-emerald-800">SAFER NEXT STEP</h3><p className="mt-2 text-xs leading-5 text-emerald-900">No factual correction can be established here. Verify this claim against an authoritative, current primary source. If you cannot confirm it, remove it or clearly label it as unverified. For interview examples, replace unsupported details with what you personally did and learned.</p></div></div><p className="mt-3 text-xs text-slate-400">These are text-pattern flags only—not detected errors. This check is not a guarantee of accuracy and does not search for or validate any cited source.</p></div>}</>;
  }

  function renderPrompts() {
    return <><div className="mb-5 flex items-start gap-3 rounded-xl border border-violet-100 bg-[#f7f5ff] p-4"><LockKeyhole size={17} className="mt-0.5 shrink-0 text-violet-600" /><p className="text-xs leading-5 text-slate-600">These example prompts are versioned starter templates. The results below describe intended outputs—not responses from a live AI model. Prompts are visible so you can understand what the demo would ask an AI to do.</p></div><div className="grid gap-4 md:grid-cols-2">{scoringPrompts.map((item) => <div key={item.title} className="panel soft-shadow flex flex-col p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-base font-bold text-slate-800">{item.title}</h2><span className="mt-1 inline-block rounded-md bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">{item.version}</span></div><button onClick={() => void copyPrompt(item.title, item.prompt)} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50"><Copy size={13} />{copiedPrompt === item.title ? "Copied" : "Copy"}</button></div><pre className="mt-4 flex-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 font-sans text-xs leading-5 text-slate-600">{item.prompt}</pre><div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3"><h3 className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">Intended result · not generated</h3><p className="mt-1 text-xs leading-5 text-slate-600">{item.result}</p></div></div>)}</div></>;
  }

  function renderAudio() {
    return <><div className="mb-5 flex items-start gap-3 rounded-xl border border-violet-100 bg-[#f7f5ff] p-4"><LockKeyhole size={17} className="mt-0.5 shrink-0 text-violet-600" /><p className="text-xs leading-5 text-slate-600"><strong className="text-slate-700">Your audio stays local.</strong> This browser demo does not upload or store your recording. Live transcription uses browser speech recognition if available; file transcription needs a separate speech-to-text service.</p></div><div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="panel soft-shadow p-5 sm:p-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Headphones size={21} /></span><h2 className="mt-4 font-display text-lg font-bold text-slate-800">Practise one answer aloud</h2><p className="mt-1 text-xs leading-5 text-slate-500">Try this question, then listen back for clarity, pace, and a specific example.</p><div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">{role.questions[0]}</div><div className="mt-4 flex flex-wrap gap-2">{recording ? <button onClick={stopRecording} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3.5 py-2.5 text-xs font-bold text-white"><span className="h-2 w-2 animate-pulse rounded-full bg-white" />Stop recording</button> : <button onClick={startRecording} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3.5 py-2.5 text-xs font-bold text-white"><Mic size={14} />Record answer</button>}<label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"><Upload size={14} />Upload audio<input type="file" accept="audio/*" className="sr-only" onChange={uploadAudio} /></label></div>{audioUrl && <div className="mt-4 rounded-xl border border-slate-100 p-3"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-600"><FileAudio size={15} className="text-violet-500" />Your local recording</div><audio controls src={audioUrl} className="h-9 w-full" /></div>}<div className="mt-4 border-t border-slate-100 pt-4"><h3 className="text-xs font-bold text-slate-700">How transcription works</h3><p className="mt-1 text-xs leading-5 text-slate-400">Record or upload for playback, then use live transcription or type your transcript into the editor. An uploaded file will not be automatically transcribed in this offline demo.</p></div></div>
        <div className="panel p-5 sm:p-6"><div className="mb-2 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-lg font-bold text-slate-800">Transcript & practice feedback</h2><p className="mt-1 text-xs text-slate-500">Capture your answer in your own words.</p></div>{listening ? <button onClick={() => { speechRecognition.current?.stop(); setListening(false); }} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700"><MicOff size={14} />Stop listening</button> : <button onClick={startTranscription} className="inline-flex items-center gap-2 rounded-xl border border-violet-200 px-3 py-2 text-xs font-bold text-violet-700 hover:bg-violet-50"><Mic size={14} />Live transcription</button>}</div><form onSubmit={analyzeTranscript}><textarea value={audioTranscript} onChange={(e) => { setAudioTranscript(e.target.value); setAudioScores(null); }} rows={9} placeholder="Live transcript appears here, or type what you said…" className="mt-4 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm leading-6 text-slate-700 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50" /><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-slate-400">{audioTranscript.trim() ? `${audioTranscript.trim().split(/\s+/).length} words` : "Press the microphone or type your transcript"}</span><button disabled={!audioTranscript.trim()} className="rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white">Review transcript <ArrowRight size={14} className="ml-1 inline" /></button></div></form>{audioScores && <div className="mt-5 rounded-xl border border-slate-100 p-4"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-bold text-slate-800">Transcript practice score</h3><p className="mt-1 text-[11px] text-slate-400">Same local demo rubric as mock interviews</p></div><ScoreDial score={scoreTotal(audioScores)} size={68} /></div><ScoreBreakdown scores={audioScores} /><ul className="mt-4 space-y-2 border-t border-slate-100 pt-3">{getFeedback(audioTranscript, audioScores).map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-slate-500"><Lightbulb size={13} className="mt-0.5 shrink-0 text-violet-500" />{item}</li>)}</ul></div>}</div></div><div className="mt-5 panel flex flex-wrap items-center gap-3 p-4"><Volume2 size={17} className="text-violet-500" /><p className="flex-1 text-xs leading-5 text-slate-500">Tip: Speak at a comfortable pace, pause between thoughts, and use an example you can explain honestly.</p><button onClick={() => startRound("Behavioural Interview")} className="inline-flex items-center gap-2 text-xs font-bold text-violet-600">Practise a behavioural question <ArrowRight size={14} /></button></div></>;
  }

  function renderPage() {
    switch (page) {
      case "Dashboard": return renderDashboard();
      case "Job roles": return renderRoles();
      case "AI research": return renderResearch();
      case "Mock interview": return renderMockInterview();
      case "STAR answer bank": return renderStarBank();
      case "Interview checklist": return renderChecklist();
      case "Progress": return renderProgress();
      case "AI verification": return renderVerification();
      case "Prompt library": return renderPrompts();
      case "Audio practice": return renderAudio();
    }
  }

  return <div className="app-shell">
    <aside className={`sidebar border-r border-[#ececf4] bg-white ${mobileMenu ? "block" : ""}`}><div className="sidebar-inner flex h-full flex-col px-4 py-6"><button onClick={() => setPage("Dashboard")} className="brand-row mb-8 flex items-center gap-3 rounded-xl px-2 text-left"><span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-violet-600 text-white"><Sparkles size={21} /></span><span className="brand-copy"><span className="font-display text-lg font-extrabold tracking-tight text-slate-800">freshstart</span><span className="block text-[10px] font-medium tracking-wide text-slate-400">YOUR INTERVIEW COACH</span></span></button><div className="nav-list flex flex-1 flex-col gap-5">{navGroups.map((group) => <div key={group.title} className="nav-group"><div className="nav-section-label mb-2 px-3 text-[10px] font-bold uppercase tracking-[.13em] text-slate-400">{group.title}</div><div className="flex flex-col gap-1">{group.items.map(({ name, icon: Icon }) => <button key={name} onClick={() => { setPage(name); setMobileMenu(false); }} title={name} className={`nav-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold ${page === name ? "bg-violet-50 text-violet-700 shadow-[inset_0_0_0_1px_rgba(124,104,255,0.08)]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}><Icon size={17} strokeWidth={page === name ? 2.1 : 1.8} /><span className="sidebar-label">{name}</span></button>)}</div></div>)}</div><div className="sidebar-bottom mt-4 rounded-2xl bg-[#f7f5ff] p-3.5"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-violet-600"><Sparkles size={16} /></div><div className="sidebar-bottom-copy mt-2 text-xs font-bold text-slate-700">Your journey, your pace</div><div className="sidebar-bottom-copy mt-1 text-[10px] leading-4 text-slate-500">Every great interview starts with one practice question.</div></div></div></aside>
    <main className="page-main"><div className="mobile-topbar hidden items-center justify-between border-b border-slate-100 bg-white px-4 py-3"><button onClick={() => setPage("Dashboard")} className="flex items-center gap-2 font-display font-extrabold text-slate-800"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white"><Sparkles size={16} /></span>freshstart</button><span className="text-xs font-semibold text-slate-500">{page}</span></div><div className="page-wrap"><header className="page-topbar mb-7 flex flex-wrap items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[.12em] text-slate-400"><span className="topbar-pill">Home</span><ChevronRight size={11} className="text-slate-300" /><span className="topbar-pill alt">{page}</span></div><h1 className="font-display text-[25px] font-extrabold tracking-tight text-slate-800">{page}</h1><p className="mt-1 text-sm text-slate-500">{pageDescriptions[page]}</p></div><div className="no-print flex items-center gap-2"><button onClick={() => setIsDarkMode((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-violet-200 hover:text-violet-700">{isDarkMode ? "Light" : "Dark"}</button><button onClick={() => setPage("Job roles")} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-[0_10px_25px_rgba(38,31,84,0.04)] hover:border-violet-200 hover:text-violet-700"><span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#efedff]"><role.icon size={13} className="text-violet-700" /></span><span className="flex flex-col items-start leading-none"><span className="text-[10px] uppercase tracking-[.12em] text-slate-400">Role</span><span className="mt-0.5 text-sm font-bold text-slate-700">{role.short}</span></span><ChevronDown size={14} className="text-slate-400" /></button></div></header>{renderPage()}<footer className="mt-8 border-t border-slate-100 pt-4 text-center text-[10px] text-slate-400">Freshstart · A beginner-friendly interview practice project · Private by design</footer></div></main>
  </div>;
}

function GraduationIcon(props: { size?: number; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={props.size ?? 24} height={props.size ?? 24} className={props.className}><path d="m2 10 10-5 10 5-10 5-10-5Z" /><path d="M6 12v5c3.5 3 8.5 3 12 0v-5M22 10v6" /></svg>;
}

export default App;

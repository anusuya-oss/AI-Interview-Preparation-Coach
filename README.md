# AI Interview Preparation Coach for Freshers

> A responsive interview-practice workspace for freshers, built to help users prepare thoughtfully, structure their examples, and track practice on their own device.

## Project Description

AI Interview Preparation Coach for Freshers is a browser-based preparation dashboard for people getting ready for entry-level interviews. It offers role-specific practice questions, mock interview rounds, a STAR answer bank, a preparation checklist, progress tracking, audio practice, and guidance for reviewing factual claims.

Despite the project title, the current application does **not** connect to a generative AI service. Mock interview feedback and scores are calculated locally using a simple rules-based rubric. Prompt templates and external research links are provided as optional resources; they are not live AI responses or research results.

## Project Objectives

- Give freshers a simple place to practise common HR, technical, and behavioural interview questions.
- Provide role-specific preparation guidance for three entry-level job paths.
- Encourage clear, honest examples using the Situation, Task, Action, and Result (STAR) format.
- Offer transparent, local practice feedback and a record of completed mock interview rounds.
- Help users review their interview preparation with a checklist and progress view.
- Demonstrate privacy-conscious use of browser storage and media features.

## Key Features

- Dashboard with a selected role, preparation progress, recent practice, and next-step shortcuts.
- Role profiles with skills, people skills, responsibilities, qualifications, sample questions, and links to O*NET profiles.
- Three mock interview round types: HR, technical, and behavioural.
- Local answer feedback with a five-part practice rubric and improvement suggestions.
- STAR answer bank with editable, locally saved answers.
- Interview preparation checklist with saved checkboxes and browser print support.
- Progress view showing saved practice scores and the difference between the first and third rounds when available.
- Job-description skill phrase matching based on the text the user pastes into the research page.
- AI verification guidance that highlights text patterns to review without claiming to check factual accuracy.
- Prompt library with starter prompt templates that can be copied.
- Audio recording or audio-file playback in the browser, plus transcript entry or browser speech recognition where supported.
- Light and dark themes, with the selected theme saved in the browser.
- Responsive navigation and layouts for desktop and smaller screens.

## Target Job Roles

The role selector includes the following practice tracks:

- IT Support Engineer
- Business Analyst
- QA Tester

Each profile provides general preparation guidance. Requirements can vary by employer, location, and job description.

## AI Tools Used

There is no integrated AI model, API, or backend in the current application. In particular:

- The mock interview questions are fixed examples in the app, not generated dynamically.
- Scores and feedback are produced by a local rules-based demo rubric, not by an AI evaluator.
- The AI verification page provides text-pattern review notes; it does not search the web, validate sources, or establish whether a claim is true.
- The prompt library displays templates and intended outcomes only. It does not submit prompts to a model or show generated results.
- The research page links to public O*NET occupational profiles and opens a Perplexity search in a separate page. The app does not fetch or summarize results from either service.
- Audio transcription uses the browser's SpeechRecognition or webkitSpeechRecognition API if available. Browser support and any associated processing are controlled by the browser; this app does not provide a transcription server.

## AI Skills Demonstrated

The project demonstrates AI-related preparation and responsible-use concepts without presenting them as active AI integrations:

- Writing prompt templates for interviewer behavior, answer evaluation, question generation, and answer improvement.
- Defining an example scoring rubric with weighted categories.
- Structuring behavioral interview examples with the STAR method.
- Reviewing claims for source references, dates, numbers, absolute language, and unsupported personal experience.
- Communicating limitations, uncertainty, and the need for independent source checking.
- Keeping prompts and intended outputs transparent rather than labeling examples as generated results.

## Technologies Used

- **React 18** for the user interface.
- **TypeScript 5** for application types and type checking.
- **Vite 6** for local development and production builds.
- **Tailwind CSS 4** with the Tailwind Vite plugin for utility styling.
- **Lucide React** for interface icons.
- **Browser APIs** for local storage, audio recording and playback, object URLs, printing, clipboard access, and optional speech recognition.
- **npm** for package management and project scripts.

## Project Workflow

1. Select one of the three target job roles.
2. Review the role profile, suggested questions, and linked occupational information.
3. Optionally paste a job description to see simple text matches against the selected role's listed skills.
4. Choose a mock interview round and answer the displayed questions one at a time.
5. Review the local rubric score and feedback suggestions after each answer.
6. Save practice progress automatically in the browser and revisit it on the dashboard or Progress page.
7. Prepare reusable examples in the STAR answer bank and mark items complete in the checklist.
8. Optionally practise aloud, enter a transcript, and review it with the same local rubric.

## Mock Interview Process

The mock interview page supports HR, technical, and behavioural rounds. It displays one fixed question at a time, accepts a written answer, and then provides local practice feedback. A round is recorded after its final question; the saved result contains the round's average rubric score, date, and selected role.

The interview flow is for self-practice. It does not use a live interviewer, automatically generate follow-up questions, or provide an AI-generated answer.

## STAR Answer Bank

The answer bank provides ten common interview prompts. For each prompt, users can add or edit four fields:

- **Situation:** What was happening?
- **Task:** What were you responsible for?
- **Action:** What steps did you take?
- **Result:** What happened or what did you learn?

Saved STAR answers are stored in the browser's local storage. The app encourages users to use real examples from studies, projects, volunteering, or other relevant experience.

## Answer Evaluation and Scoring

The app calculates a local demo score out of 100 using five categories:

| Category | Maximum |
| --- | ---: |
| Relevance | 25 |
| Technical knowledge | 25 |
| Communication | 20 |
| Confidence and clarity | 15 |
| Problem solving | 15 |

The rules consider answer length, selected role terms, and simple phrase patterns. The app also gives short suggestions, such as adding a real example or describing an outcome. This is not an AI assessment, a validated measurement, or an objective measure of job readiness.

## Before vs After Performance Comparison

The Progress page compares the first and third saved mock interview scores, when those rounds exist, and shows their point difference. It also displays a chart of saved practice scores.

This is a simple comparison of local rubric results. It does not demonstrate a verified improvement in interview ability, and the scores should be treated as practice signals only.

## Multimodal Features

The app combines written practice with optional audio tools:

- Record audio using the browser's microphone permission and play the recording in the page.
- Upload an audio file for in-browser playback.
- Use browser speech recognition for live transcript input where supported, or type/paste a transcript manually.
- Review a transcript using the same local rules-based rubric as mock interview answers.

Uploaded audio is not automatically transcribed. The application does not upload audio to a transcription service, and it does not include image or video interview analysis.

## AI Verification and Error Analysis

The verification page lets a user paste a claim or answer and see potential review points based on simple text patterns, such as numbers or dates, absolute language, and missing source references. It also reminds users to check current primary sources and ensure personal examples are accurate.

These are prompts for human review, not detected factual errors. The application does not browse the web, check cited sources, correct claims, or guarantee that any text is accurate.

## Responsible AI

The application is transparent about its current limitations: it has no live AI integration, uses a simple local scoring rubric, and cannot verify facts. It encourages users to keep their examples truthful, check claims against authoritative sources, and treat practice results as guidance rather than a verdict.

Users should avoid entering sensitive personal information. If speech recognition is used, review the browser's own privacy and permission settings because recognition behavior depends on the browser implementation.

## Installation Instructions

**Prerequisites:** Node.js LTS with npm, and Git if cloning the repository.

Clone the repository and move into the project directory:

```bash
git clone https://github.com/anusuya-oss/AI-Interview-Preparation-Coach.git
cd AI-Interview-Preparation-Coach
```

Install the project dependencies:

```bash
npm install
```

## How to Run the Project

Start the local development server:

```bash
npm run dev
```

Open the local URL printed by Vite in your browser. To type-check and create a production build, run:

```bash
npm run build
```

To serve the production build locally, first build the project and then run:

```bash
npm run preview
```

## Project Structure

```text
.
├── index.html             # HTML entry point and page metadata
├── package.json           # Dependencies and npm scripts
├── package-lock.json      # Locked dependency versions
├── vite.config.ts         # Vite, React, and Tailwind plugin configuration
├── tsconfig.json          # TypeScript project references
├── tsconfig.app.json      # Application TypeScript configuration
├── tsconfig.node.json     # Vite configuration TypeScript settings
├── src/
│   ├── App.tsx            # Pages, role data, interactions, and local scoring
│   ├── index.css          # Tailwind import, app styles, responsive and print styles
│   └── main.tsx           # React application entry point
└── README.md
```

## Privacy and Security

- There are no API keys or service credentials required by the current application.
- Interview progress, STAR answers, checklist selections, selected role, and theme preference are stored in this browser's local storage.
- Job-description text, verification text, and transcript input are used in the active page and are not sent to an application backend.
- Audio recordings and uploaded audio are handled locally by browser media features; recordings are held in browser memory for playback and are not uploaded by this app.
- Browser speech recognition may have privacy behavior governed by the browser or its provider.
- Do not enter passwords, confidential employer information, or other sensitive personal data.

## Future Enhancements

The following are possible future improvements and are not implemented in the current version:

- Add an optional, secure server-side AI integration for dynamic questions and feedback.
- Add user-controlled export and deletion for locally saved progress.
- Add more role profiles, questions, and localization options.
- Improve accessibility testing and add automated component tests.
- Add optional transcription through a clearly disclosed service, with user consent and secure server-side handling.

## Live Demo

GitHub Pages is prepared to deploy this project at [https://anusuya-oss.github.io/AI-Interview-Preparation-Coach/](https://anusuya-oss.github.io/AI-Interview-Preparation-Coach/). The demo will be available after the deployment workflow is pushed and completes successfully. Until then, run the application locally using the instructions above.

## GitHub Repository

Source code: [AI Interview Preparation Coach for Freshers](https://github.com/anusuya-oss/AI-Interview-Preparation-Coach)

# AI Interview Preparation Coach for Freshers

A beginner-friendly interview preparation dashboard built with React, TypeScript, Vite, and Tailwind CSS. This project helps freshers practice mock interviews, prepare for common questions, save STAR stories, review progress, and improve confidence before job interviews.

## Project description

This application is designed for students and freshers who want to improve their interview preparation in a simple and structured way. It includes role-based interview practice, AI-style prompt library, performance tracking, STAR answer storage, and a practical interview checklist.

## Objectives

- Help freshers prepare for HR, technical, and behavioural interviews
- Provide role-based interview guidance for IT Support Engineer, Business Analyst, and QA Tester roles
- Offer a mock interview flow with scoring feedback based on local rules
- Encourage structured answers using STAR method
- Track progress over time with saved interview results
- Promote responsible and privacy-friendly interview practice

## Features

- Dashboard with interview preparation overview
- Role selection for different job tracks
- Mock interview mode for multiple interview rounds
- Local score calculation and feedback suggestions
- STAR answer bank for saving interview stories
- Interview checklist for preparation and presentation
- Progress tracking for practice sessions
- AI verification guidance for checking claim quality and source reliability
- Prompt library for interview and answer review templates
- Audio practice area with local recording and transcript feedback
- Responsive UI for desktop and mobile screens

## Technologies used

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- Local browser storage for saved data

## AI tools used

This project is intentionally designed as a privacy-conscious local demo. It does not upload interview answers to any external AI service by default. It includes educational prompt templates and browser-based tools for practice, but no API keys, secrets, or service credentials are required in the frontend.

## Installation instructions

1. Install Node.js LTS on your computer.
2. Open a terminal in the project folder.
3. Run the following command:

   npm install

## How to run the project

1. In the project folder, run:

   npm run dev

2. Open the local Vite URL shown in the terminal.
3. To create a production build, run:

   npm run build

## Project structure

- src/ - React app source code
- public/ - Static assets (if added)
- index.html - app entry point
- package.json - project configuration and scripts
- vite.config.ts - Vite configuration
- tsconfig.* - TypeScript configuration
- .gitignore - files ignored by Git

## Privacy and security notes

- No API keys are included in this project
- No .env files are required for the current local demo
- Sensitive credentials are not stored in source files
- Interview answers remain in the browser local storage for local practice only

## Notes for contributors

This project is suitable for educational and portfolio use. If you wish to connect a live AI backend in the future, keep the API keys on a secure server and never expose them in browser code.

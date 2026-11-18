# LearnMate AI – Personalized Learning Agent

A beginner-friendly hackathon prototype for challenge **PS04: Personalized AI Learning Agent**.

## Features
- Create a learning plan using a topic, skill level, and available time.
- View a simple sequence of learning activities.
- Mark lessons as completed.
- Take a short interactive knowledge-check quiz.
- Receive feedback based on quiz answers.
- Save progress in browser Local Storage.

## Run locally
1. Download or clone this repository.
2. Open the project folder.
3. Double-click `index.html` to open it in a browser.

You can also use the VS Code **Live Server** extension and select **Open with Live Server**.

## Project files
- `index.html` – page structure
- `style.css` – layout and visual design
- `script.js` – learning plan, quiz, and progress logic

## Current limitations
This is an early frontend prototype. It does not yet connect to an AI model or a backend database. The learning plan and quiz use sample logic/content to demonstrate the workflow. Browser Local Storage saves progress only on the current browser and device.

## Planned improvements
- Connect an AI API to generate explanations, study plans, and quizzes dynamically.
- Add topic-specific lesson content.
- Add user accounts and cloud-based progress storage.
- Adapt the next lesson based on quiz performance.
- Add accessibility improvements and automated tests.

## Tech stack
HTML, CSS, JavaScript, Browser Local Storage.

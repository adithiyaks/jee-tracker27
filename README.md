# JEE Tracker

A React + TypeScript study tracking application for JEE exam preparation with Firebase backend.

## Features
- 📅 Daily study tracking with calendar view
- 📊 Progress statistics and streak tracking
- 🔥 Motivational cards and gamification
- 📈 Subject-wise distribution charts
- 🎯 JEE countdown timer

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Firebase (Authentication + Firestore)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router v7

## Setup

1. Clone the repository:
```bash
git clone https://github.com/adithiyaks/jee-tracker27.git
cd jee-tracker27
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

4. Enable Authentication (Email/Password) and Firestore Database

5. Create `.env` file from `.env.example` and add your Firebase config:
```bash
cp .env.example .env
```

6. Update `.env` with your Firebase credentials from Project Settings

7. Run development server:
```bash
npm run dev
```

## Deployment

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables in Netlify dashboard

## License
MIT

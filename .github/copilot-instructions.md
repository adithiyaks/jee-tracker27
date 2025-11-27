# JEE Tracker - AI Coding Instructions

## Project Overview
A React + TypeScript study tracking application for JEE exam preparation. Uses Vite for build tooling, Supabase for backend (authentication + PostgreSQL database), and Tailwind CSS for styling.

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v7
- **Backend**: Supabase (Auth + PostgreSQL with RLS)
- **Styling**: Tailwind CSS v3
- **Charts**: Recharts
- **Rich Text**: React Quill
- **Date Utils**: date-fns v4
- **Icons**: lucide-react

### Core Data Flow
1. **Authentication**: `useAuth` hook manages Supabase auth state, auto-creates profile on signup
2. **Study Data**: `useStudyData` hook fetches/updates study days, calculates stats in real-time
3. **Immediate UI Updates**: Local state updates happen synchronously before server responses for responsive UX
4. **Type Safety**: Database schema types defined in `src/lib/supabase.ts` (Database interface) mirror Supabase tables

### File Structure
- `src/hooks/` - Custom React hooks for auth and data management
- `src/pages/` - Top-level route components (AuthPage, DashboardPage)
- `src/components/` - Reusable UI components (Calendar, DayModal, StatsCard, etc.)
- `src/types/` - TypeScript interfaces (separate from DB types in supabase.ts)
- `src/utils/` - Pure utility functions (date formatting, motivational messages)
- `supabase/migrations/` - Database schema migrations (SQL)

## Key Patterns

### Database Operations
```typescript
// ALWAYS use upsert with onConflict for study days (unique constraint: user_id + date)
await supabase.from('study_days').upsert(data, { onConflict: 'user_id,date' })

// ALWAYS update local state immediately after mutations for responsive UI
setStudyDays(current => [...current, newDay])
```

### Custom Hooks Pattern
- `useAuth`: Returns `{ user, loading, signUp, signIn, signOut }`
- `useStudyData`: Returns `{ studyDays, stats, loading, updateStudyDay, getStudyDay, deleteStudyDay, refetch }`
- Both handle loading states and auto-subscribe to real-time updates

### Stats Calculation
Stats are computed client-side in `useStudyData` whenever `studyDays` changes:
- **Current Streak**: Counts backward from today until first gap
- **Longest Streak**: Finds maximum consecutive productive/partial days
- **Subject Distribution**: Percentage breakdown (Physics/Chemistry/Math)
- **JEE Countdown**: Hardcoded to Jan 22, 2027 (update in `useStudyData.ts`)

### Study Day Status
Three states: `'productive' | 'partial' | 'unproductive'`
- Used for color coding (green/yellow/red) and streak calculations
- Partial days count as 0.5 in productivity percentage
- Status affects emoji display: 🔥 productive, ⚡ partial, 😞 unproductive

## Development Workflow

### Running the App
```powershell
npm run dev          # Start Vite dev server (default: http://localhost:5173)
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build
npm run lint         # ESLint check
```

### Environment Variables
Required in `.env` (not in repo):
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Schema
Three tables with Row Level Security (RLS):
1. **profiles**: User metadata (username, target_year, exam_type)
2. **study_days**: Daily study records (status, hours, subjects, notes)
3. **study_goals**: User-defined goals (currently unused in UI)

All tables use `user_id` FK to `auth.users` with CASCADE delete. RLS policies ensure users only access their own data.

## Common Tasks

### Adding a New Stat
1. Update `StudyStats` interface in `src/types/index.ts`
2. Calculate in `calculateStats` function in `useStudyData.ts`
3. Display in `DashboardPage.tsx` or `ProgressChart.tsx`

### Modifying Calendar Behavior
Calendar logic in `src/components/Calendar.tsx`:
- Uses `getCalendarDays` from `dateUtils.ts` to generate 6-week grid
- Status colors: green (productive), yellow (partial), red (unproductive), white (untracked)
- Clicking a day opens `DayModal` for editing or creating entries

### Updating Database Schema
1. Create new migration file in `supabase/migrations/`
2. Update `Database` interface in `src/lib/supabase.ts`
3. Update corresponding TypeScript types in `src/types/index.ts`
4. Run migration via Supabase CLI or dashboard

### Styling Conventions
- Use Tailwind utility classes (no custom CSS files except `index.css` for global styles)
- Color palette: blue (primary), green (productive), yellow (partial), red (unproductive)
- Transitions: `transition-all duration-200`, `hover:scale-105` for interactive elements
- Responsive: Mobile-first with `md:` and `lg:` breakpoints

## Important Notes
- **Date Format**: Always use `'yyyy-MM-dd'` string format for date keys (via `formatDate` utility)
- **Modal Pattern**: Two modal types - `DayModal` (edit) and `ReadOnlyDayModal` (view only)
- **Optimistic Updates**: UI updates before database confirms to avoid lag
- **Deployment**: Uses `_redirects` file for SPA routing on Netlify (all routes → index.html)
- **Icons**: Import from `lucide-react`, not heroicons or other libraries

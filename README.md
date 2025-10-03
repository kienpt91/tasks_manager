# Task Manager App

![Test Suite](https://github.com/kienpt91/tasks_manager/actions/workflows/test.yml/badge.svg)
![Build](https://github.com/kienpt91/tasks_manager/actions/workflows/build.yml/badge.svg)

A full-stack task management application built with Next.js, TypeScript, and Supabase.

## Features

- User authentication (sign up, login, logout)
- Create, read, update, and delete tasks
- Filter tasks by status (To Do, In Progress, Done)
- Protected routes - only authenticated users can access tasks
- Row-level security with Supabase
- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task_manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the migration script from `supabase/migrations/20250101000000_init.sql`

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Sign up for a new account or log in

## Database Schema

### Tasks Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Foreign key to auth.users |
| title | text | Task title |
| description | text | Task description |
| status | enum | Task status: 'todo', 'in-progress', or 'done' |
| created_at | timestamp | Creation timestamp |

### Row Level Security (RLS)

The tasks table has RLS enabled with policies that ensure:
- Users can only view their own tasks
- Users can only create tasks for themselves
- Users can only update their own tasks
- Users can only delete their own tasks

## Project Structure

```
task_manager/
├── app/
│   ├── api/
│   │   └── tasks/          # API routes for CRUD operations
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── tasks/              # Tasks management page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── TaskCard.tsx        # Task display component
│   └── TaskForm.tsx        # Task form component
├── lib/
│   └── supabase/           # Supabase client configuration
├── types/
│   └── task.ts             # TypeScript type definitions
├── supabase/
│   └── migrations/         # Database migrations
├── middleware.ts           # Route protection middleware
└── .env.example            # Environment variables template
```

## API Routes

- `GET /api/tasks` - Get all tasks for authenticated user
- `GET /api/tasks?status=<status>` - Filter tasks by status
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase

Your Supabase project is already hosted. Just ensure:
- The migration script has been run
- RLS policies are enabled
- API keys are correctly configured

## License

MIT

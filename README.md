# Task Manager App

![Test Suite](https://github.com/kienpt91/tasks_manager/actions/workflows/test.yml/badge.svg)
![Build](https://github.com/kienpt91/tasks_manager/actions/workflows/build.yml/badge.svg)

A full-stack task management application built with Next.js, TypeScript, and Supabase.

## 🚀 Live Demo

**Production URL**: https://tasks-manager-rust.vercel.app/

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

3. Sign up for a new account

### Demo Account

For quick testing, use these credentials:
- **Email**: `dev@example.com`
- **Password**: `Demo@123456`

This account has 12 sample tasks demonstrating the application features.

### Seeding Sample Data

To populate your own account with sample tasks:
```bash
npm run seed your-email@example.com your-password
```

This will create 12 sample tasks demonstrating the application features.

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

### Vercel (Production)

The application is deployed at: **https://tasks-manager-rust.vercel.app/**

To deploy your own instance:

1. **Import Repository**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add these variables for all environments (Production, Preview, Development):
     - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key

3. **Deploy**:
   - Vercel will automatically build and deploy
   - Get your deployment URL (e.g., `https://your-app.vercel.app`)

4. **Update Supabase Configuration**:
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Update "Site URL" to your Vercel URL
   - Add Redirect URLs:
     ```
     https://your-app.vercel.app/**
     http://localhost:3000/**
     ```

### Supabase

Your Supabase project is already hosted. Ensure:
- The migration script has been run
- RLS policies are enabled
- Redirect URLs include your Vercel deployment URL

## License

MIT

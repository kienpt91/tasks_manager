import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

const sampleTasks = [
  {
    title: 'Implement authentication pages',
    description: 'Create login and signup pages with Supabase Auth integration',
    status: 'done',
  },
  {
    title: 'Set up database schema',
    description: 'Design and implement tasks table with RLS policies',
    status: 'done',
  },
  {
    title: 'Build REST API endpoints',
    description: 'Create API routes for CRUD operations on tasks',
    status: 'done',
  },
  {
    title: 'Develop task components',
    description: 'Build TaskForm and TaskCard reusable components',
    status: 'done',
  },
  {
    title: 'Add task filtering',
    description: 'Implement filter buttons for todo, in-progress, and done statuses',
    status: 'done',
  },
  {
    title: 'Write comprehensive tests',
    description: 'Add unit tests, component tests, and integration tests',
    status: 'done',
  },
  {
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and builds',
    status: 'done',
  },
  {
    title: 'Add search functionality',
    description: 'Implement search by task title and description',
    status: 'todo',
  },
  {
    title: 'Implement pagination',
    description: 'Add pagination for better performance with large task lists',
    status: 'todo',
  },
  {
    title: 'Add bulk operations',
    description: 'Create "Mark all as done" feature for bulk task updates',
    status: 'in-progress',
  },
  {
    title: 'Deploy to production',
    description: 'Deploy application to Vercel with Supabase backend',
    status: 'in-progress',
  },
  {
    title: 'Write documentation',
    description: 'Create comprehensive README with setup instructions',
    status: 'done',
  },
];

async function seedTasks() {
  console.log('Starting seed process...\n');

  const email = process.argv[2] || await prompt('Enter your email: ');
  const password = process.argv[3] || await prompt('Enter your password: ');

  console.log('\nSigning in...');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim(),
  });

  if (signInError) {
    console.error('Error signing in:', signInError.message);
    console.log('\nPlease make sure you have created an account at http://localhost:4000/signup');
    rl.close();
    return;
  }

  const userId = signInData.user?.id;
  console.log('User ID:', userId);

  console.log('\nSeeding tasks...');
  for (const task of sampleTasks) {
    const { error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: userId }]);

    if (error) {
      console.error(`Error creating task "${task.title}":`, error);
    } else {
      console.log(`✓ Created: ${task.title}`);
    }
  }

  console.log('\n✅ Seed completed!');
  console.log('You can now login at http://localhost:4000/login with your credentials');
  rl.close();
}

seedTasks();

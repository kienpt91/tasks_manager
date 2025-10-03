import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TasksPage from '@/app/tasks/page';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/supabase/client');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();
global.confirm = jest.fn(() => true);

describe('Tasks Page Integration', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    });
  });

  it('renders tasks page with navigation', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /my tasks/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('displays filter buttons', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /to do/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /in progress/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^done$/i })).toBeInTheDocument();
  });

  it('fetches and displays tasks', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
        status: 'todo',
        user_id: 'user-1',
        created_at: '2025-01-01',
      },
      {
        id: '2',
        title: 'Task 2',
        description: 'Description 2',
        status: 'done',
        user_id: 'user-1',
        created_at: '2025-01-02',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTasks,
    });

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('shows empty state when no tasks', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });
  });

  it('creates a new task', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '3',
          title: 'New Task',
          description: 'New Description',
          status: 'todo',
          user_id: 'user-1',
          created_at: '2025-01-03',
        }),
      });

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /new task/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /new task/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create new task/i })).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/title/i), 'New Task');
    await user.type(screen.getByLabelText(/description/i), 'New Description');
    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/tasks',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            title: 'New Task',
            description: 'New Description',
            status: 'todo',
          }),
        })
      );
    });
  });

  it('filters tasks by status', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /to do/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /to do/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tasks?status=todo');
    });
  });

  it('handles logout', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    mockSignOut.mockResolvedValue({ error: null });

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('displays error message on fetch failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    render(<TasksPage />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch tasks/i)).toBeInTheDocument();
    });
  });
});

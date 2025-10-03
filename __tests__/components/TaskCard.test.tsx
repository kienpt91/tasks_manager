import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '@/components/TaskCard';
import { Task } from '@/types/task';

describe('TaskCard Component', () => {
  const mockTask: Task = {
    id: 'task-1',
    user_id: 'user-123',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    created_at: '2025-01-01T00:00:00Z',
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('displays correct status badge color for todo', () => {
    render(<TaskCard task={mockTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const statusBadge = screen.getByText('To Do');
    expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('displays correct status badge color for in-progress', () => {
    const inProgressTask = { ...mockTask, status: 'in-progress' as const };
    render(<TaskCard task={inProgressTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const statusBadge = screen.getByText('In Progress');
    expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('displays correct status badge color for done', () => {
    const doneTask = { ...mockTask, status: 'done' as const };
    render(<TaskCard task={doneTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const statusBadge = screen.getByText('Done');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('shows edit and delete buttons', () => {
    render(<TaskCard task={mockTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('switches to edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockOnDelete).toHaveBeenCalledWith('task-1');
  });

  it('does not render description if null', () => {
    const taskWithoutDescription = { ...mockTask, description: null };
    render(
      <TaskCard
        task={taskWithoutDescription}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('cancels edit mode when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('calls onUpdate with correct data when form is submitted in edit mode', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));

    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Task');

    await user.click(screen.getByRole('button', { name: /update task/i }));

    expect(mockOnUpdate).toHaveBeenCalledWith('task-1', expect.objectContaining({
      title: 'Updated Task',
    }));
  });
});

/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/tasks/route';
import { PATCH, DELETE } from '@/app/api/tasks/[id]/route';
import { createClient } from '@/lib/supabase/server';

jest.mock('@/lib/supabase/server');

const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
};

describe('Tasks API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe('GET /api/tasks', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const request = new Request('http://localhost:3000/api/tasks');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return tasks for authenticated user', async () => {
      const mockUser = { id: 'user-123' };
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'todo', user_id: 'user-123' },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockTasks, error: null }),
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockQuery),
      });

      const request = new Request('http://localhost:3000/api/tasks');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTasks);
    });

    it('should filter tasks by status query parameter', async () => {
      const mockUser = { id: 'user-123' };
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'todo', user_id: 'user-123' },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockTasks, error: null }),
      };

      const mockSelect = {
        eq: jest.fn().mockReturnValue(mockQuery),
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockSelect),
      });

      const request = new Request('http://localhost:3000/api/tasks?status=todo');
      const response = await GET(request);

      expect(mockSelect.eq).toHaveBeenCalledWith('status', 'todo');
      expect(response.status).toBe(200);
    });

    it('should return 500 on database error', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockQuery),
      });

      const request = new Request('http://localhost:3000/api/tasks');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error');
    });
  });

  describe('POST /api/tasks', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const request = new Request('http://localhost:3000/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Task', status: 'todo' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should create a new task for authenticated user', async () => {
      const mockUser = { id: 'user-123' };
      const newTask = {
        id: 'task-1',
        title: 'New Task',
        description: 'Description',
        status: 'todo',
        user_id: 'user-123',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: newTask, error: null }),
          }),
        }),
      });

      const request = new Request('http://localhost:3000/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Task',
          description: 'Description',
          status: 'todo',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(newTask);
    });

    it('should return 500 on database error during creation', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Insert failed' },
            }),
          }),
        }),
      });

      const request = new Request('http://localhost:3000/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Task', status: 'todo' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Insert failed');
    });
  });

  describe('PATCH /api/tasks/[id]', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const request = new Request('http://localhost:3000/api/tasks/task-1', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'done' }),
      });

      const response = await PATCH(request, { params: { id: 'task-1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should update a task for authenticated user', async () => {
      const mockUser = { id: 'user-123' };
      const updatedTask = {
        id: 'task-1',
        title: 'Updated',
        status: 'done',
        user_id: 'user-123',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: updatedTask, error: null }),
          }),
        }),
      });

      const request = new Request('http://localhost:3000/api/tasks/task-1', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'done' }),
      });

      const response = await PATCH(request, { params: { id: 'task-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(updatedTask);
    });

    it('should return 500 on database error during update', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Update failed' },
            }),
          }),
        }),
      });

      const request = new Request('http://localhost:3000/api/tasks/task-1', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'done' }),
      });

      const response = await PATCH(request, { params: { id: 'task-1' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Update failed');
    });
  });

  describe('DELETE /api/tasks/[id]', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const request = new Request('http://localhost:3000/api/tasks/task-1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: 'task-1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should delete a task for authenticated user', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEqChain = {
        eq: jest.fn().mockResolvedValue({ error: null }),
      };

      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue(mockEqChain),
        }),
      });

      const request = new Request('http://localhost:3000/api/tasks/task-1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: 'task-1' } });

      expect(response.status).toBe(200);
    });

    it('should return 500 on database error during deletion', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockEqChain = {
        eq: jest.fn().mockResolvedValue({
          error: { message: 'Delete failed' },
        }),
      };

      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue(mockEqChain),
        }),
      });

      const request = new Request('http://localhost:3000/api/tasks/task-1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: { id: 'task-1' } });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Delete failed');
    });
  });
});

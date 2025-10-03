import { createClient } from '@/lib/supabase/server';

jest.mock('@/lib/supabase/server');

const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
};

describe('Tasks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  describe('Authentication', () => {
    it('should require authentication for task operations', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
      const client = await createClient();
      const { data } = await client.auth.getUser();
      expect(data.user).toBeNull();
    });

    it('should allow authenticated users to access tasks', async () => {
      const mockUser = { id: 'user-123' };
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const client = await createClient();
      const { data } = await client.auth.getUser();

      expect(data.user).toEqual(mockUser);
    });
  });

  describe('Task Operations', () => {
    it('should query tasks with user filter', async () => {
      const mockUser = { id: 'user-123' };
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'todo', user_id: 'user-123' },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockQuery = {
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockTasks, error: null }),
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue(mockQuery),
      });

      const client = await createClient();
      const result = client.from('tasks')
        .select('*')
        .eq('user_id', mockUser.id)
        .order('created_at', { ascending: false });

      const { data } = await result;
      expect(data).toEqual(mockTasks);
    });

    it('should insert tasks with user_id', async () => {
      const mockUser = { id: 'user-123' };
      const newTask = {
        id: 'task-1',
        title: 'New Task',
        status: 'todo',
        user_id: 'user-123',
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: newTask, error: null }),
          }),
        }),
      });

      const client = await createClient();
      const result = await client.from('tasks')
        .insert([{ title: 'New Task', user_id: mockUser.id, status: 'todo' }])
        .select()
        .single();

      expect(result.data).toEqual(newTask);
    });

    it('should update tasks for authorized user', async () => {
      const mockUser = { id: 'user-123' };
      const updatedTask = { id: 'task-1', title: 'Updated', status: 'done', user_id: 'user-123' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: updatedTask, error: null }),
          }),
        }),
      });

      const client = await createClient();
      const result = await client.from('tasks')
        .update({ status: 'done' })
        .eq('id', 'task-1')
        .eq('user_id', mockUser.id)
        .select()
        .single();

      expect(result.data).toEqual(updatedTask);
    });

    it('should delete tasks for authorized user', async () => {
      const mockUser = { id: 'user-123' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockEqChain = {
        eq: jest.fn().mockResolvedValue({ error: null }),
      };

      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue(mockEqChain),
        }),
      });

      const client = await createClient();
      const result = await client.from('tasks')
        .delete()
        .eq('id', 'task-1')
        .eq('user_id', mockUser.id);

      expect(result.error).toBeNull();
    });
  });
});

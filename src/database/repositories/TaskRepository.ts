import { v4 as uuidv4 } from 'uuid';
import { Priority, Task, TaskCategory, TaskStatus } from '@/types';
import { getDB } from '../index';

export class TaskRepository {
  private executeSql(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      const db: any = getDB();
      db.transaction((tx: any) => {
        tx.executeSql(
          sql,
          params,
          (_: any, result: any) => resolve(result),
          (_: any, error: any) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async create(input: {
    userId: string;
    title: string;
    description?: string;
    priority?: Priority;
    category?: TaskCategory;
    dueDate?: Date;
  }): Promise<Task> {
    const id = uuidv4();
    const createdAt = new Date();
    const updatedAt = createdAt;

    const priority = input.priority ?? Priority.MEDIUM;
    const category = input.category ?? TaskCategory.PERSONAL;
    const status = TaskStatus.PENDING;

    const sql = `
      INSERT INTO tasks (
        id, user_id, title, description, priority, status, category,
        due_date, start_time, estimated_duration, energy_required, mood_tag,
        completed_at, created_at, updated_at, subtasks, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
      input.userId,
      input.title,
      input.description ?? null,
      priority,
      status,
      category,
      input.dueDate ? input.dueDate.getTime() : null,
      null,
      null,
      null,
      null,
      null,
      createdAt.getTime(),
      updatedAt.getTime(),
      null,
      null,
    ];

    await this.executeSql(sql, params);

    return {
      id,
      userId: input.userId,
      title: input.title,
      description: input.description,
      priority,
      status,
      category,
      dueDate: input.dueDate,
      createdAt,
      updatedAt,
    } as Task;
  }

  async findByUserId(userId: string, limit: number = 100): Promise<Task[]> {
    const sql = `
      SELECT * FROM tasks
      WHERE user_id = ?
      ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'in_progress' THEN 1 WHEN 'completed' THEN 2 ELSE 3 END,
               COALESCE(due_date, 32503680000000) ASC,
               updated_at DESC
      LIMIT ?
    `;
    const result = await this.executeSql(sql, [userId, limit]);

    const tasks: Task[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      tasks.push(this.mapRowToTask(result.rows.item(i)));
    }
    return tasks;
  }

  async toggleComplete(id: string, completed: boolean): Promise<void> {
    const status = completed ? TaskStatus.COMPLETED : TaskStatus.PENDING;
    const completedAt = completed ? new Date().getTime() : null;
    const sql = `UPDATE tasks SET status = ?, completed_at = ?, updated_at = ? WHERE id = ?`;
    await this.executeSql(sql, [status, completedAt, Date.now(), id]);
  }

  async delete(id: string): Promise<void> {
    await this.executeSql('DELETE FROM tasks WHERE id = ?', [id]);
  }

  private mapRowToTask(row: any): Task {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description ?? undefined,
      priority: row.priority as Priority,
      status: row.status as TaskStatus,
      category: row.category as TaskCategory,
      dueDate: row.due_date ? new Date(row.due_date) : undefined,
      startTime: row.start_time ? new Date(row.start_time) : undefined,
      estimatedDuration: row.estimated_duration ?? undefined,
      energyRequired: row.energy_required ?? undefined,
      moodTag: row.mood_tag ?? undefined,
      completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      subtasks: row.subtasks ? JSON.parse(row.subtasks) : undefined,
      tags: row.tags ? JSON.parse(row.tags) : undefined,
    } as Task;
  }
}

export const taskRepository = new TaskRepository();

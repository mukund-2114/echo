import { v4 as uuidv4 } from 'uuid';
import { Priority, Task, TaskCategory, TaskStatus } from '@/types';
import { getDB } from '../index';
import { pushTaskToCloud, deleteTaskInCloud } from '@/services/taskSync';

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

    // Push to cloud (best-effort)
    try {
      await pushTaskToCloud({
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
      } as Task);
    } catch {}

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
    const updatedAt = Date.now();
    await this.executeSql(sql, [status, completedAt, updatedAt, id]);
    // Push to cloud
    try {
      const t = await this.getById(id);
      if (t) await pushTaskToCloud(t);
    } catch {}
  }

  async update(
    id: string,
    updates: { title?: string; priority?: Priority; dueDate?: Date | null; status?: TaskStatus; category?: TaskCategory }
  ): Promise<void> {
    const fields: string[] = [];
    const params: any[] = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      params.push(updates.title);
    }
    if (updates.priority !== undefined) {
      fields.push('priority = ?');
      params.push(updates.priority);
    }
    if (updates.dueDate !== undefined) {
      fields.push('due_date = ?');
      params.push(updates.dueDate ? updates.dueDate.getTime() : null);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      params.push(updates.status);
    }
    if (updates.category !== undefined) {
      fields.push('category = ?');
      params.push(updates.category);
    }
    if (fields.length === 0) return;
    fields.push('updated_at = ?');
    params.push(Date.now());
    params.push(id);
    const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
    await this.executeSql(sql, params);
    // Push to cloud
    try {
      const t = await this.getById(id);
      if (t) await pushTaskToCloud(t);
    } catch {}
  }

  async delete(id: string): Promise<void> {
    await this.executeSql('DELETE FROM tasks WHERE id = ?', [id]);
    try {
      await deleteTaskInCloud(id);
    } catch {}
  }

  private async getById(id: string): Promise<Task | null> {
    const result = await this.executeSql('SELECT * FROM tasks WHERE id = ?', [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToTask(result.rows.item(0));
  }

  // Insert or update a task coming from cloud, preserving its id and timestamps
  async upsertFromCloud(task: Task): Promise<void> {
    const db: any = getDB();
    const select = await this.executeSql('SELECT id, updated_at FROM tasks WHERE id = ?', [task.id]);
    const exists = select.rows.length > 0;
    if (!exists) {
      const sql = `
        INSERT INTO tasks (
          id, user_id, title, description, priority, status, category,
          due_date, start_time, estimated_duration, energy_required, mood_tag,
          completed_at, created_at, updated_at, subtasks, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await this.executeSql(sql, [
        task.id,
        task.userId,
        task.title,
        task.description ?? null,
        task.priority,
        task.status,
        task.category,
        task.dueDate ? task.dueDate.getTime() : null,
        task.startTime ? task.startTime.getTime() : null,
        task.estimatedDuration ?? null,
        task.energyRequired ?? null,
        task.moodTag ?? null,
        task.completedAt ? task.completedAt.getTime() : null,
        task.createdAt.getTime(),
        task.updatedAt.getTime(),
        task.subtasks ? JSON.stringify(task.subtasks) : null,
        task.tags ? JSON.stringify(task.tags) : null,
      ]);
      return;
    }
    // Update only if remote is newer
    const localUpdatedAt = select.rows.item(0).updated_at as number;
    if (task.updatedAt.getTime() <= localUpdatedAt) return;
    const updateSql = `UPDATE tasks SET 
      title = ?, description = ?, priority = ?, status = ?, category = ?,
      due_date = ?, start_time = ?, estimated_duration = ?, energy_required = ?, mood_tag = ?,
      completed_at = ?, created_at = ?, updated_at = ?, subtasks = ?, tags = ?
      WHERE id = ?`;
    await this.executeSql(updateSql, [
      task.title,
      task.description ?? null,
      task.priority,
      task.status,
      task.category,
      task.dueDate ? task.dueDate.getTime() : null,
      task.startTime ? task.startTime.getTime() : null,
      task.estimatedDuration ?? null,
      task.energyRequired ?? null,
      task.moodTag ?? null,
      task.completedAt ? task.completedAt.getTime() : null,
      task.createdAt.getTime(),
      task.updatedAt.getTime(),
      task.subtasks ? JSON.stringify(task.subtasks) : null,
      task.tags ? JSON.stringify(task.tags) : null,
      task.id,
    ]);
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

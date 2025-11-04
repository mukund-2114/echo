import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ensureAnonymousAuth } from './firebase';
import type { Task } from '@/types';
import { taskRepository } from '@/database/repositories/TaskRepository';

function serializeTask(t: Task) {
  return {
    id: t.id,
    userId: t.userId,
    title: t.title,
    description: t.description ?? null,
    priority: t.priority,
    status: t.status,
    category: t.category,
    dueDate: t.dueDate ? t.dueDate.getTime() : null,
    startTime: t.startTime ? t.startTime.getTime() : null,
    estimatedDuration: t.estimatedDuration ?? null,
    energyRequired: t.energyRequired ?? null,
    moodTag: t.moodTag ?? null,
    completedAt: t.completedAt ? t.completedAt.getTime() : null,
    createdAt: t.createdAt.getTime(),
    updatedAt: t.updatedAt.getTime(),
    subtasks: t.subtasks ?? null,
    tags: t.tags ?? null,
  };
}

function deserializeTask(d: any): Task {
  return {
    id: d.id,
    userId: d.userId,
    title: d.title,
    description: d.description ?? undefined,
    priority: d.priority,
    status: d.status,
    category: d.category,
    dueDate: d.dueDate ? new Date(d.dueDate) : undefined,
    startTime: d.startTime ? new Date(d.startTime) : undefined,
    estimatedDuration: d.estimatedDuration ?? undefined,
    energyRequired: d.energyRequired ?? undefined,
    moodTag: d.moodTag ?? undefined,
    completedAt: d.completedAt ? new Date(d.completedAt) : undefined,
    createdAt: new Date(d.createdAt),
    updatedAt: new Date(d.updatedAt),
    subtasks: d.subtasks ?? undefined,
    tags: d.tags ?? undefined,
  } as Task;
}

export async function pushTaskToCloud(task: Task) {
  const uid = await ensureAnonymousAuth();
  const ref = doc(db, 'users', uid, 'tasks', task.id);
  await setDoc(ref, serializeTask(task), { merge: true });
}

export async function deleteTaskInCloud(taskId: string) {
  const uid = await ensureAnonymousAuth();
  const ref = doc(db, 'users', uid, 'tasks', taskId);
  await deleteDoc(ref);
}

export async function pullTasksFromCloudAndMerge(userId: string) {
  const uid = await ensureAnonymousAuth();
  const coll = collection(db, 'users', uid, 'tasks');
  const snap = await getDocs(coll);
  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const task = deserializeTask(data);
    // Only merge tasks for the given userId (should match uid mapping)
    if (task.userId === userId) {
      await taskRepository.upsertFromCloud(task);
    }
  }
}

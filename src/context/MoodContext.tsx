import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MoodEntry, MoodType } from '@/types';
import { moodRepository } from '@/database/repositories/MoodRepository';

interface MoodContextValue {
  loading: boolean;
  recent: MoodEntry[];
  latest: MoodEntry | null;
  average7: number;
  addMood: (data: { moodType: MoodType; intensity: number; note?: string }) => Promise<void>;
  reload: () => Promise<void>;
}

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

const DEFAULT_USER_ID = 'user-1';

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<MoodEntry[]>([]);
  const [latest, setLatest] = useState<MoodEntry | null>(null);
  const [average7, setAverage7] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [latestEntry, recentEntries, avg] = await Promise.all([
        moodRepository.getLatest(DEFAULT_USER_ID),
        moodRepository.findByUserId(DEFAULT_USER_ID, 10),
        moodRepository.getAverageMood(DEFAULT_USER_ID, 7),
      ]);
      setLatest(latestEntry);
      setRecent(recentEntries);
      setAverage7(Math.round((avg || 0) * 10) / 10);
    } catch (e) {
      console.error('MoodContext reload failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addMood = useCallback(async (data: { moodType: MoodType; intensity: number; note?: string }) => {
    await moodRepository.create({
      userId: DEFAULT_USER_ID,
      moodType: data.moodType,
      intensity: data.intensity,
      note: data.note,
      timestamp: new Date(),
    });
    await load();
  }, [load]);

  const value = useMemo(() => ({ loading, recent, latest, average7, addMood, reload: load }), [loading, recent, latest, average7, addMood, load]);

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error('useMood must be used within a MoodProvider');
  return ctx;
}

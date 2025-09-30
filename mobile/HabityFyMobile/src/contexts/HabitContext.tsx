import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { habitsAPI } from "../utils/api";
import { useAuth } from "./AuthContext";

interface HabitHistory {
  date: string;
  completed: boolean;
  completedAt?: string;
}

interface Habit {
  _id: string;
  userId: string;
  masterHabitId: string;
  title: string;
  description?: string;
  category:
    | "health_fitness"
    | "mental_wellbeing"
    | "learning_growth"
    | "productivity_career"
    | "lifestyle_relationships";
  frequency: "daily" | "weekly" | "custom";
  timeOfDay: string[];
  primaryTime: string;
  duration: string;
  customDuration?: number;
  targetValue?: number;
  unit?: string;
  reminderEnabled: boolean;
  reminderTimes: string[];
  isActive: boolean;
  priority: "low" | "medium" | "high";
  tags: string[];
  history: HabitHistory[];
  currentStreak: number;
  maxStreak: number;
  createdAt: string;
  updatedAt: string;
}

interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  categoryStats: {
    [key: string]: {
      total: number;
      completed: number;
      completionRate: number;
    };
  };
}

interface HabitContextType {
  habits: Habit[];
  stats: HabitStats | null;
  loading: boolean;
  error: string | null;
  fetchHabits: (params?: any) => Promise<void>;
  fetchStats: () => Promise<void>;
  createHabit: (
    habitData: any
  ) => Promise<{ success: boolean; error?: string; data?: any }>;
  updateHabit: (
    id: string,
    habitData: any
  ) => Promise<{ success: boolean; error?: string; data?: any }>;
  deleteHabit: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleHabit: (
    id: string,
    date?: string
  ) => Promise<{ success: boolean; error?: string; data?: any }>;
  getHabitsForDate: (
    date: string,
    params?: any
  ) => Promise<{
    success: boolean;
    habits?: Habit[];
    targetDate?: string;
    error?: string;
  }>;
  getTodayStatus: (habit: Habit) => boolean;
  getTodayCompletedHabits: () => Habit[];
  getActiveHabits: () => Habit[];
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabits must be used within a HabitProvider");
  }
  return context;
};

interface HabitProviderProps {
  children: ReactNode;
}

export const HabitProvider: React.FC<HabitProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch habits
  const fetchHabits = async (params: any = {}) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const response = await habitsAPI.getHabits(params);
      setHabits(response.data.habits);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  };

  // Fetch habit stats
  const fetchStats = async () => {
    if (!user) return;

    try {
      const response = await habitsAPI.getHabitStats();
      setStats(response.data.stats);
    } catch (err: any) {
      console.error("Failed to fetch stats:", err);
    }
  };

  // Create habit
  const createHabit = async (habitData: any) => {
    try {
      const response = await habitsAPI.createHabit(habitData);
      setHabits((prev) => [response.data.habit, ...prev]);
      await fetchStats(); // Refresh stats
      return { success: true, data: response.data };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create habit",
      };
    }
  };

  // Update habit
  const updateHabit = async (id: string, habitData: any) => {
    try {
      const response = await habitsAPI.updateHabit(id, habitData);
      setHabits((prev) =>
        prev.map((habit) => (habit._id === id ? response.data.habit : habit))
      );
      await fetchStats(); // Refresh stats
      return { success: true, data: response.data };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update habit",
      };
    }
  };

  // Delete habit
  const deleteHabit = async (id: string) => {
    try {
      await habitsAPI.deleteHabit(id);
      setHabits((prev) => prev.filter((habit) => habit._id !== id));
      await fetchStats(); // Refresh stats
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to delete habit",
      };
    }
  };

  // Toggle habit completion
  const toggleHabit = async (id: string, date?: string) => {
    try {
      const response = await habitsAPI.toggleHabit(id, date);
      setHabits((prev) =>
        prev.map((habit) =>
          habit._id === id ? { ...habit, ...response.data.habit } : habit
        )
      );
      await fetchStats(); // Refresh stats
      return { success: true, data: response.data };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to toggle habit",
      };
    }
  };

  // Get habits for specific date
  const getHabitsForDate = async (date: string, params: any = {}) => {
    if (!user) return { success: false, error: "User not authenticated" };

    try {
      const response = await habitsAPI.getHabitsForDate(date, params);
      return {
        success: true,
        habits: response.data.habits,
        targetDate: response.data.targetDate,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to fetch habits for date",
      };
    }
  };

  // Get today's completion status for a habit
  const getTodayStatus = (habit: Habit): boolean => {
    const today = new Date().toISOString().split("T")[0];
    const todayEntry = habit.history?.find((entry) => entry.date === today);
    return todayEntry?.completed || false;
  };

  // Get habits completed today
  const getTodayCompletedHabits = (): Habit[] => {
    return habits.filter((habit) => getTodayStatus(habit));
  };

  // Get active habits
  const getActiveHabits = (): Habit[] => {
    return habits.filter((habit) => habit.isActive);
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchStats();
    } else {
      setHabits([]);
      setStats(null);
    }
  }, [user]);

  const value: HabitContextType = {
    habits,
    stats,
    loading,
    error,
    fetchHabits,
    fetchStats,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    getHabitsForDate,
    getTodayStatus,
    getTodayCompletedHabits,
    getActiveHabits,
  };

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
};

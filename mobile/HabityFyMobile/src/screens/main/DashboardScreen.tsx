import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { useHabits } from "../../contexts/HabitContext";

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const {
    habits,
    stats,
    loading,
    error,
    fetchHabits,
    fetchStats,
    getTodayCompletedHabits,
    getActiveHabits,
    toggleHabit,
  } = useHabits();

  const activeHabits = getActiveHabits();
  const completedToday = getTodayCompletedHabits();

  useEffect(() => {
    fetchHabits();
    fetchStats();
  }, []);

  const handleToggleHabit = async (habitId: string) => {
    await toggleHabit(habitId);
  };

  const onRefresh = () => {
    fetchHabits();
    fetchStats();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.userName}>{user?.username || "User"}!</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{completedToday.length}</Text>
          <Text style={styles.statLabel}>Completed Today</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={24} color="#3b82f6" />
          <Text style={styles.statNumber}>{stats?.currentStreak || 0}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{stats?.longestStreak || 0}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>

      {/* Today's Habits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Habits</Text>
        {activeHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="add-circle-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySubtext}>
              Start by creating your first habit!
            </Text>
          </View>
        ) : (
          activeHabits.map((habit) => {
            const isCompleted = completedToday.some((h) => h._id === habit._id);
            return (
              <TouchableOpacity
                key={habit._id}
                style={[
                  styles.habitCard,
                  isCompleted && styles.habitCardCompleted,
                ]}
                onPress={() => handleToggleHabit(habit._id)}
              >
                <View style={styles.habitContent}>
                  <View style={styles.habitInfo}>
                    <Text
                      style={[
                        styles.habitTitle,
                        isCompleted && styles.habitTitleCompleted,
                      ]}
                    >
                      {habit.title}
                    </Text>
                    <Text style={styles.habitCategory}>
                      {habit.category.replace("_", " ").toUpperCase()}
                    </Text>
                    <Text style={styles.habitTime}>
                      {habit.primaryTime} • {habit.duration}
                    </Text>
                  </View>
                  <View style={styles.habitAction}>
                    <Ionicons
                      name={
                        isCompleted ? "checkmark-circle" : "ellipse-outline"
                      }
                      size={32}
                      color={isCompleted ? "#10b981" : "#d1d5db"}
                    />
                  </View>
                </View>
                {habit.currentStreak > 0 && (
                  <View style={styles.streakContainer}>
                    <Ionicons name="flame" size={16} color="#f59e0b" />
                    <Text style={styles.streakText}>
                      {habit.currentStreak} day streak
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Quick Stats */}
      {stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Total Habits</Text>
              <Text style={styles.progressValue}>{stats.totalHabits}</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Active Habits</Text>
              <Text style={styles.progressValue}>{stats.activeHabits}</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Completion Rate</Text>
              <Text style={styles.progressValue}>
                {Math.round(stats.completionRate)}%
              </Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#6b7280",
  },
  userName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "white",
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
    textAlign: "center",
  },
  habitCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  habitCardCompleted: {
    backgroundColor: "#f0fdf4",
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  habitContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  habitTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },
  habitCategory: {
    fontSize: 12,
    color: "#ef4444",
    fontWeight: "500",
    marginBottom: 4,
  },
  habitTime: {
    fontSize: 14,
    color: "#6b7280",
  },
  habitAction: {
    marginLeft: 16,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  streakText: {
    fontSize: 14,
    color: "#f59e0b",
    fontWeight: "500",
    marginLeft: 4,
  },
  progressCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  progressLabel: {
    fontSize: 16,
    color: "#6b7280",
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
});

export default DashboardScreen;

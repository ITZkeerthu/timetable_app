import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Bell, Clock, MapPin, User, BookOpen, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Period {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  startTime: string;
  endTime: string;
  color: string;
  isBreak?: boolean;
}

export default function Dashboard() {
  const { colors } = useTheme();
  const [nextClass, setNextClass] = useState<Period | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<Period[]>([]);
  const [lowAttendanceAlert, setLowAttendanceAlert] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockSchedule: Period[] = [
      {
        id: '1',
        subject: 'Physics',
        faculty: 'Dr. Mehra',
        room: 'Lab 3B',
        startTime: '09:00',
        endTime: '10:00',
        color: '#3B82F6'
      },
      {
        id: '2',
        subject: 'Mathematics',
        faculty: 'Prof. Singh',
        room: 'Room 101',
        startTime: '10:15',
        endTime: '11:15',
        color: '#10B981'
      },
      {
        id: '3',
        subject: 'Chemistry',
        faculty: 'Dr. Patel',
        room: 'Lab 2A',
        startTime: '11:30',
        endTime: '12:30',
        color: '#F59E0B'
      },
      {
        id: '4',
        subject: 'Break',
        faculty: '',
        room: '',
        startTime: '12:30',
        endTime: '13:30',
        color: '#6B7280',
        isBreak: true
      },
      {
        id: '5',
        subject: 'Computer Science',
        faculty: 'Prof. Kumar',
        room: 'Lab 4C',
        startTime: '13:30',
        endTime: '14:30',
        color: '#8B5CF6'
      }
    ];

    setTodaySchedule(mockSchedule);
    setNextClass(mockSchedule[0]);
    
    // Simulate low attendance alert
    setTimeout(() => setLowAttendanceAlert(true), 2000);
  }, []);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'physics':
      case 'chemistry':
        return <BookOpen size={20} color="#FFFFFF" />;
      case 'mathematics':
        return <BookOpen size={20} color="#FFFFFF" />;
      case 'computer science':
        return <BookOpen size={20} color="#FFFFFF" />;
      default:
        return <BookOpen size={20} color="#FFFFFF" />;
    }
  };

  const dismissAlert = () => {
    setLowAttendanceAlert(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Low Attendance Alert */}
      {lowAttendanceAlert && (
        <View style={[styles.alertBanner, { backgroundColor: colors.errorLight, borderColor: colors.error }]}>
          <View style={styles.alertContent}>
            <AlertCircle size={20} color={colors.error} />
            <Text style={[styles.alertText, { color: colors.error }]}>
              ⚠️ Low attendance in Physics – 60%. Maintain at least 75%
            </Text>
          </View>
          <TouchableOpacity onPress={dismissAlert}>
            <Text style={[styles.alertDismiss, { color: colors.error }]}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>Good Morning!</Text>
          <Text style={[styles.date, { color: colors.textTertiary }]}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        {/* Next Class Notification */}
        {nextClass && !nextClass.isBreak && (
          <View style={[styles.nextClassCard, { backgroundColor: colors.card }]}>
            <View style={styles.nextClassHeader}>
              <Bell size={20} color={colors.primary} />
              <Text style={[styles.nextClassTitle, { color: colors.primary }]}>Next Class</Text>
            </View>
            <Text style={[styles.nextClassSubject, { color: colors.text }]}>{nextClass.subject}</Text>
            <View style={styles.nextClassDetails}>
              <View style={styles.detailRow}>
                <User size={16} color={colors.textTertiary} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>{nextClass.faculty}</Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={16} color={colors.textTertiary} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>{nextClass.room}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock size={16} color={colors.textTertiary} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                  {formatTime(nextClass.startTime)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Today's Schedule */}
        <View style={styles.scheduleSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Schedule</Text>
          
          {todaySchedule.map((period) => (
            <View key={period.id} style={[styles.periodCard, { backgroundColor: colors.card }]}>
              <View 
                style={[styles.colorStrip, { backgroundColor: period.color }]}
              />
              
              <View style={styles.periodContent}>
                <View style={styles.periodHeader}>
                  <View 
                    style={[styles.subjectIcon, { backgroundColor: period.color }]}
                  >
                    {getSubjectIcon(period.subject)}
                  </View>
                  <View style={styles.periodInfo}>
                    <Text style={[styles.subjectName, { color: colors.text }]}>
                      {period.isBreak ? 'Break' : period.subject}
                    </Text>
                    {!period.isBreak && (
                      <>
                        <Text style={[styles.facultyName, { color: colors.textTertiary }]}>{period.faculty}</Text>
                        <Text style={[styles.roomName, { color: colors.textTertiary }]}>{period.room}</Text>
                      </>
                    )}
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                      {formatTime(period.startTime)}
                    </Text>
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                      {formatTime(period.endTime)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alertBanner: {
    borderWidth: 1,
    margin: 16,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  alertDismiss: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    marginTop: 4,
  },
  nextClassCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  nextClassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextClassTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  nextClassSubject: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  nextClassDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    marginLeft: 8,
  },
  scheduleSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  periodCard: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  colorStrip: {
    width: 4,
  },
  periodContent: {
    flex: 1,
    padding: 16,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
  },
  facultyName: {
    fontSize: 14,
    marginTop: 2,
  },
  roomName: {
    fontSize: 14,
    marginTop: 2,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar, Check, X, TriangleAlert as AlertTriangle, BookOpen, Save } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface AttendanceRecord {
  subject: string;
  status: 'present' | 'absent' | 'od' | null;
  color: string;
}

export default function Attendance() {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([
    { subject: 'Physics', status: null, color: '#3B82F6' },
    { subject: 'Mathematics', status: null, color: '#10B981' },
    { subject: 'Chemistry', status: null, color: '#F59E0B' },
    { subject: 'Computer Science', status: null, color: '#8B5CF6' },
    { subject: 'English', status: null, color: '#EF4444' },
  ]);

  const handleStatusChange = (index: number, status: 'present' | 'absent' | 'od') => {
    setAttendanceData(prev => 
      prev.map((record, i) => 
        i === index ? { ...record, status } : record
      )
    );
  };

  const saveAttendance = () => {
    const incompleteSubjects = attendanceData.filter(record => record.status === null);
    
    if (incompleteSubjects.length > 0) {
      Alert.alert(
        'Incomplete Attendance',
        `Please mark attendance for: ${incompleteSubjects.map(s => s.subject).join(', ')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Attendance Saved',
      `Attendance for ${selectedDate} has been saved successfully!`,
      [{ text: 'OK' }]
    );
  };

  const getStatusIcon = (status: 'present' | 'absent' | 'od' | null) => {
    switch (status) {
      case 'present':
        return <Check size={18} color="#10B981" />;
      case 'absent':
        return <X size={18} color="#EF4444" />;
      case 'od':
        return <AlertTriangle size={18} color="#F59E0B" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: 'present' | 'absent' | 'od' | null) => {
    switch (status) {
      case 'present':
        return '#10B981';
      case 'absent':
        return '#EF4444';
      case 'od':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Attendance</Text>
      </View>

      {/* Date Selector */}
      <View style={[styles.dateSelector, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.dateSelectorContent}>
          <Calendar size={20} color={colors.primary} />
          <Text style={[styles.selectedDate, { color: colors.textSecondary }]}>{formatDate(selectedDate)}</Text>
        </View>
        <TouchableOpacity style={[styles.changeDateButton, { backgroundColor: colors.borderLight }]}>
          <Text style={[styles.changeDateText, { color: colors.primary }]}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Attendance List */}
      <ScrollView style={styles.attendanceList}>
        {attendanceData.map((record, index) => (
          <View key={record.subject} style={[styles.subjectCard, { backgroundColor: colors.card }]}>
            <View style={styles.subjectHeader}>
              <View 
                style={[styles.subjectIcon, { backgroundColor: record.color }]}
              >
                <BookOpen size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.subjectName, { color: colors.text }]}>{record.subject}</Text>
              {record.status && (
                <View style={styles.statusIcon}>
                  {getStatusIcon(record.status)}
                </View>
              )}
            </View>

            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[
                  { ...styles.statusButton, borderColor: colors.border, backgroundColor: colors.borderLight },
                  record.status === 'present' && styles.statusButtonActive,
                  record.status === 'present' && { backgroundColor: colors.successLight, borderColor: colors.success },
                ]}
                onPress={() => handleStatusChange(index, 'present')}
              >
                <Check 
                  size={16} 
                  color={record.status === 'present' ? colors.success : colors.textTertiary} 
                />
                <Text 
                  style={[
                    { ...styles.statusButtonText, color: colors.textTertiary },
                    record.status === 'present' && { color: colors.success, fontWeight: '600' },
                  ]}
                >
                  Present
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  { ...styles.statusButton, borderColor: colors.border, backgroundColor: colors.borderLight },
                  record.status === 'absent' && styles.statusButtonActive,
                  record.status === 'absent' && { backgroundColor: colors.errorLight, borderColor: colors.error },
                ]}
                onPress={() => handleStatusChange(index, 'absent')}
              >
                <X 
                  size={16} 
                  color={record.status === 'absent' ? colors.error : colors.textTertiary} 
                />
                <Text 
                  style={[
                    { ...styles.statusButtonText, color: colors.textTertiary },
                    record.status === 'absent' && { color: colors.error, fontWeight: '600' },
                  ]}
                >
                  Absent
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  { ...styles.statusButton, borderColor: colors.border, backgroundColor: colors.borderLight },
                  record.status === 'od' && styles.statusButtonActive,
                  record.status === 'od' && { backgroundColor: colors.warningLight, borderColor: colors.warning },
                ]}
                onPress={() => handleStatusChange(index, 'od')}
              >
                <AlertTriangle 
                  size={16} 
                  color={record.status === 'od' ? colors.warning : colors.textTertiary} 
                />
                <Text 
                  style={[
                    { ...styles.statusButtonText, color: colors.textTertiary },
                    record.status === 'od' && { color: colors.warning, fontWeight: '600' },
                  ]}
                >
                  OD
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.saveContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={saveAttendance}>
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateSelector: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  dateSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  changeDateButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeDateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  attendanceList: {
    flex: 1,
    padding: 16,
  },
  subjectCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  statusIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusButtonActive: {
    borderWidth: 2,
  },
  statusButtonText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  saveContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
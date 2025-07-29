import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ChartBar as BarChart3, Download, Calendar, TrendingUp, TrendingDown, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SubjectAttendance {
  subject: string;
  percentage: number;
  present: number;
  total: number;
  color: string;
}

export default function Reports() {
  const { colors } = useTheme();
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  
  const attendanceData: SubjectAttendance[] = [
    { subject: 'Physics', percentage: 85, present: 17, total: 20, color: '#3B82F6' },
    { subject: 'Mathematics', percentage: 92, present: 23, total: 25, color: '#10B981' },
    { subject: 'Chemistry', percentage: 60, present: 12, total: 20, color: '#F59E0B' },
    { subject: 'Computer Science', percentage: 88, present: 22, total: 25, color: '#8B5CF6' },
    { subject: 'English', percentage: 75, present: 15, total: 20, color: '#EF4444' },
  ];

  const overallAttendance = Math.round(
    attendanceData.reduce((acc, subject) => acc + subject.percentage, 0) / attendanceData.length
  );

  const lowAttendanceSubjects = attendanceData.filter(subject => subject.percentage < 75);

  const exportToPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF export feature would be implemented here');
  };

  const renderProgressBar = (percentage: number, color: string) => {
    const screenWidth = Dimensions.get('window').width;
    const barWidth = screenWidth - 120; // Account for padding and text
    
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarBackground, { width: barWidth }]}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: (barWidth * percentage) / 100,
                backgroundColor: percentage >= 75 ? color : '#EF4444'
              }
            ]} 
          />
        </View>
        <Text style={[
          styles.percentageText,
          { color: percentage >= 75 ? color : '#EF4444' }
        ]}>
          {percentage}%
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Attendance Reports</Text>
        <TouchableOpacity style={[styles.exportButton, { backgroundColor: colors.primaryLight }]} onPress={exportToPDF}>
          <Download size={16} color={colors.primary} />
          <Text style={[styles.exportButtonText, { color: colors.primary }]}>Export PDF</Text>
        </TouchableOpacity>
      </View>

      {/* View Toggle */}
      <View style={[styles.toggleContainer, { backgroundColor: colors.borderLight }]}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewType === 'weekly' && { backgroundColor: colors.surface },
          ]}
          onPress={() => setViewType('weekly')}
        >
          <Text
            style={[
              { fontSize: 14, fontWeight: '500', color: viewType === 'weekly' ? colors.textSecondary : colors.textTertiary },
              viewType === 'weekly' && { fontWeight: '600' },
            ]}
          >
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewType === 'monthly' && { backgroundColor: colors.surface },
          ]}
          onPress={() => setViewType('monthly')}
        >
          <Text
            style={[
              { fontSize: 14, fontWeight: '500', color: viewType === 'monthly' ? colors.textSecondary : colors.textTertiary },
              viewType === 'monthly' && { fontWeight: '600' },
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Overall Attendance */}
        <View style={[styles.overallCard, { backgroundColor: colors.card }]}>
          <View style={styles.overallHeader}>
            <View style={[styles.overallIconContainer, { backgroundColor: colors.primary }]}>
              <BarChart3 size={24} color="#FFFFFF" />
            </View>
            <View style={styles.overallInfo}>
              <Text style={[styles.overallTitle, { color: colors.text }]}>Overall Attendance</Text>
              <Text style={[styles.overallSubtitle, { color: colors.textTertiary }]}>
                {viewType === 'weekly' ? 'This Week' : 'This Month'}
              </Text>
            </View>
            <Text style={[
              styles.overallPercentage,
              { color: overallAttendance >= 75 ? colors.success : colors.error }
            ]}>
              {overallAttendance}%
            </Text>
          </View>
          
          {overallAttendance >= 75 ? (
            <View style={styles.statusRow}>
              <TrendingUp size={16} color={colors.success} />
              <Text style={[styles.statusTextGood, { color: colors.success }]}>Good attendance record</Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <TrendingDown size={16} color={colors.error} />
              <Text style={[styles.statusTextBad, { color: colors.error }]}>Needs improvement</Text>
            </View>
          )}
        </View>

        {/* Low Attendance Alert */}
        {lowAttendanceSubjects.length > 0 && (
          <View style={[styles.alertCard, { backgroundColor: colors.errorLight, borderColor: colors.error }]}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={20} color={colors.error} />
              <Text style={[styles.alertTitle, { color: colors.error }]}>Low Attendance Alert</Text>
            </View>
            <Text style={[styles.alertText, { color: colors.error }]}>
              {lowAttendanceSubjects.length} subject{lowAttendanceSubjects.length > 1 ? 's' : ''} below 75% threshold
            </Text>
            <View style={styles.alertSubjects}>
              {lowAttendanceSubjects.map((subject, index) => (
                <Text key={index} style={[styles.alertSubject, { color: colors.error }]}>
                  • {subject.subject} ({subject.percentage}%)
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Subject-wise Attendance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Subject-wise Attendance</Text>
          
          {attendanceData.map((subject, index) => (
            <View key={index} style={[styles.subjectCard, { backgroundColor: colors.card }]}>
              <View style={styles.subjectHeader}>
                <View 
                  style={[styles.subjectIcon, { backgroundColor: subject.color }]}
                />
                <View style={styles.subjectInfo}>
                  <Text style={[styles.subjectName, { color: colors.text }]}>{subject.subject}</Text>
                  <Text style={[styles.subjectDetails, { color: colors.textTertiary }]}>
                    {subject.present}/{subject.total} classes attended
                  </Text>
                </View>
              </View>
              
              {renderProgressBar(subject.percentage, subject.color)}
              
              {subject.percentage < 75 && (
                <View style={styles.warningRow}>
                  <AlertTriangle size={14} color={colors.warning} />
                  <Text style={[styles.warningText, { color: colors.warning }]}>
                    Need {Math.ceil((75 * subject.total - 100 * subject.present) / 25)} more classes for 75%
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Summary Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Summary</Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {attendanceData.reduce((acc, s) => acc + s.total, 0)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Total Classes</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {attendanceData.reduce((acc, s) => acc + s.present, 0)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Classes Attended</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.statValue, { color: colors.error }]}>
                {attendanceData.reduce((acc, s) => acc + (s.total - s.present), 0)}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Classes Missed</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: colors.card }]}>
              <Text style={[
                styles.statValue, 
                { color: lowAttendanceSubjects.length > 0 ? colors.warning : colors.success }
              ]}>
                {attendanceData.length - lowAttendanceSubjects.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>On Track</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  overallCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  overallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  overallIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overallInfo: {
    flex: 1,
    marginLeft: 12,
  },
  overallTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  overallSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  overallPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTextGood: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  statusTextBad: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  alertCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  alertText: {
    fontSize: 14,
    marginBottom: 8,
  },
  alertSubjects: {
    marginLeft: 8,
  },
  alertSubject: {
    fontSize: 14,
    marginBottom: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
    marginBottom: 12,
  },
  subjectIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  subjectInfo: {
    marginLeft: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
  },
  subjectDetails: {
    fontSize: 14,
    marginTop: 2,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
    minWidth: 40,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 12,
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
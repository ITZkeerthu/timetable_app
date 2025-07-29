import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Plus, CreditCard as Edit2, Trash2, Clock, User, MapPin, BookOpen, Coffee } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Period {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  startTime: string;
  endTime: string;
  color: string;
  isBreak: boolean;
}

interface DaySchedule {
  [key: string]: Period[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SUBJECT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16'];

export default function Timetable() {
  const { colors } = useTheme();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [schedule, setSchedule] = useState<DaySchedule>({
    Monday: [
      {
        id: '1',
        subject: 'Physics',
        faculty: 'Dr. Mehra',
        room: 'Lab 3B',
        startTime: '09:00',
        endTime: '10:00',
        color: '#3B82F6',
        isBreak: false,
      },
      {
        id: '2',
        subject: 'Break',
        faculty: '',
        room: '',
        startTime: '12:30',
        endTime: '13:30',
        color: '#6B7280',
        isBreak: true,
      },
    ],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const [formData, setFormData] = useState({
    subject: '',
    faculty: '',
    room: '',
    startTime: '',
    endTime: '',
    isBreak: false,
  });

  const resetForm = () => {
    setFormData({
      subject: '',
      faculty: '',
      room: '',
      startTime: '',
      endTime: '',
      isBreak: false,
    });
  };

  const handleAddPeriod = () => {
    if (!formData.isBreak && (!formData.subject || !formData.faculty || !formData.room)) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    if (!formData.startTime || !formData.endTime) {
      Alert.alert('Error', 'Please set start and end times');
      return;
    }

    const newPeriod: Period = {
      id: Date.now().toString(),
      subject: formData.isBreak ? 'Break' : formData.subject,
      faculty: formData.faculty,
      room: formData.room,
      startTime: formData.startTime,
      endTime: formData.endTime,
      color: formData.isBreak ? '#6B7280' : SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)],
      isBreak: formData.isBreak,
    };

    setSchedule(prev => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], newPeriod].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      ),
    }));

    resetForm();
    setShowAddModal(false);
  };

  const handleEditPeriod = () => {
    if (!editingPeriod) return;

    const updatedPeriod = {
      ...editingPeriod,
      subject: formData.isBreak ? 'Break' : formData.subject,
      faculty: formData.faculty,
      room: formData.room,
      startTime: formData.startTime,
      endTime: formData.endTime,
      isBreak: formData.isBreak,
    };

    setSchedule(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map(period =>
        period.id === editingPeriod.id ? updatedPeriod : period
      ).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }));

    resetForm();
    setEditingPeriod(null);
    setShowAddModal(false);
  };

  const openEditModal = (period: Period) => {
    setEditingPeriod(period);
    setFormData({
      subject: period.subject,
      faculty: period.faculty,
      room: period.room,
      startTime: period.startTime,
      endTime: period.endTime,
      isBreak: period.isBreak,
    });
    setShowAddModal(true);
  };

  const deletePeriod = (periodId: string) => {
    Alert.alert(
      'Delete Period',
      'Are you sure you want to delete this period?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSchedule(prev => ({
              ...prev,
              [selectedDay]: prev[selectedDay].filter(period => period.id !== periodId),
            }));
          },
        },
      ]
    );
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Timetable</Text>
      </View>

      {/* Day Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[styles.daySelector, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      >
        {DAYS.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayTab,
              selectedDay === day && { borderBottomColor: colors.primary },
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                { fontSize: 14, fontWeight: '500', color: selectedDay === day ? colors.primary : colors.textTertiary },
                selectedDay === day && { fontWeight: '600' },
              ]}
            >
              {day.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Schedule */}
      <ScrollView style={styles.scheduleContainer}>
        {schedule[selectedDay].length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No classes scheduled</Text>
            <Text style={[styles.emptyStateSubtext, { color: colors.textTertiary }]}>
              Tap the + button to add your first period
            </Text>
          </View>
        ) : (
          schedule[selectedDay].map((period) => (
            <View key={period.id} style={[styles.periodCard, { backgroundColor: colors.card }]}>
              <View 
                style={[styles.colorStrip, { backgroundColor: period.color }]}
              />
              
              <View style={styles.periodContent}>
                <View style={styles.periodHeader}>
                  <View 
                    style={[styles.subjectIcon, { backgroundColor: period.color }]}
                  >
                    {period.isBreak ? (
                      <Coffee size={20} color="#FFFFFF" />
                    ) : (
                      <BookOpen size={20} color="#FFFFFF" />
                    )}
                  </View>
                  
                  <View style={styles.periodInfo}>
                    <Text style={[styles.subjectName, { color: colors.text }]}>{period.subject}</Text>
                    {!period.isBreak && (
                      <>
                        <View style={styles.detailRow}>
                          <User size={14} color={colors.textTertiary} />
                          <Text style={[styles.detailText, { color: colors.textTertiary }]}>{period.faculty}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <MapPin size={14} color={colors.textTertiary} />
                          <Text style={[styles.detailText, { color: colors.textTertiary }]}>{period.room}</Text>
                        </View>
                      </>
                    )}
                    <View style={styles.detailRow}>
                      <Clock size={14} color={colors.textTertiary} />
                      <Text style={[styles.detailText, { color: colors.textTertiary }]}>
                        {formatTime(period.startTime)} - {formatTime(period.endTime)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.borderLight }]}
                      onPress={() => openEditModal(period)}
                    >
                      <Edit2 size={16} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.borderLight }]}
                      onPress={() => deletePeriod(period.id)}
                    >
                      <Trash2 size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => {
          resetForm();
          setEditingPeriod(null);
          setShowAddModal(true);
        }}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add/Edit Period Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={[styles.modalCancel, { color: colors.textTertiary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingPeriod ? 'Edit Period' : 'Add Period'}
            </Text>
            <TouchableOpacity
              onPress={editingPeriod ? handleEditPeriod : handleAddPeriod}
            >
              <Text style={[styles.modalSave, { color: colors.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Break Toggle */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Period Type</Text>
              <View style={[styles.toggleContainer, { backgroundColor: colors.borderLight }]}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !formData.isBreak && { backgroundColor: colors.surface },
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, isBreak: false }))}
                >
                  <Text
                    style={[
                      { fontSize: 14, fontWeight: '500', color: !formData.isBreak ? colors.textSecondary : colors.textTertiary },
                      !formData.isBreak && { fontWeight: '600' },
                    ]}
                  >
                    Class
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    formData.isBreak && { backgroundColor: colors.surface },
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, isBreak: true }))}
                >
                  <Text
                    style={[
                      { fontSize: 14, fontWeight: '500', color: formData.isBreak ? colors.textSecondary : colors.textTertiary },
                      formData.isBreak && { fontWeight: '600' },
                    ]}
                  >
                    Break
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {!formData.isBreak && (
              <>
                {/* Subject Name */}
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Subject Name *</Text>
                  <TextInput
                    style={[styles.textInput, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                    value={formData.subject}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
                    placeholder="Enter subject name"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                {/* Faculty Name */}
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Faculty Name *</Text>
                  <TextInput
                    style={[styles.textInput, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                    value={formData.faculty}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, faculty: text }))}
                    placeholder="Enter faculty name"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                {/* Room */}
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Room *</Text>
                  <TextInput
                    style={[styles.textInput, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                    value={formData.room}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, room: text }))}
                    placeholder="Enter room number"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </>
            )}

            {/* Time */}
            <View style={styles.timeRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Start Time *</Text>
                <TextInput
                  style={[styles.textInput, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                  value={formData.startTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, startTime: text }))}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>End Time *</Text>
                <TextInput
                  style={[styles.textInput, { borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }]}
                  value={formData.endTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, endTime: text }))}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  daySelector: {
    borderBottomWidth: 1,
  },
  dayTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  scheduleContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
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
    alignItems: 'flex-start',
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
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  modalCancel: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  timeRow: {
    flexDirection: 'row',
  },
});
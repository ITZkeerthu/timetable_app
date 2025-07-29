import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { User, GraduationCap, Building, Users, Save } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfileSetup() {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    class: '',
    section: '',
  });

  const handleSave = () => {
    if (!formData.name || !formData.college || !formData.class || !formData.section) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    Alert.alert(
      'Profile Saved',
      'Your profile has been saved successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const InputField = ({ 
    icon, 
    label, 
    placeholder, 
    value, 
    onChangeText 
  }: {
    icon: React.ReactNode;
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
  }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.inputIcon}>
          {icon}
        </View>
        <TextInput
          style={[styles.textInput, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={[styles.studentIconContainer, { backgroundColor: colors.primaryLight }]}>
          <GraduationCap size={32} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Setup Your Profile</Text>
        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
          Enter your academic information to get started
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <InputField
          icon={<User size={20} color={colors.textTertiary} />}
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
        />

        <InputField
          icon={<Building size={20} color={colors.textTertiary} />}
          label="College Name"
          placeholder="Enter your college name"
          value={formData.college}
          onChangeText={(text) => setFormData(prev => ({ ...prev, college: text }))}
        />

        <InputField
          icon={<GraduationCap size={20} color={colors.textTertiary} />}
          label="Class"
          placeholder="e.g., B.Tech CSE, 3rd Year"
          value={formData.class}
          onChangeText={(text) => setFormData(prev => ({ ...prev, class: text }))}
        />

        <InputField
          icon={<Users size={20} color={colors.textTertiary} />}
          label="Section"
          placeholder="e.g., A, B, C"
          value={formData.section}
          onChangeText={(text) => setFormData(prev => ({ ...prev, section: text }))}
        />

        {/* Preview Card */}
        <View style={[styles.previewCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.previewTitle, { color: colors.text }]}>Profile Preview</Text>
          <View style={styles.previewContent}>
            <Text style={[styles.previewName, { color: colors.text }]}>
              {formData.name || 'Your Name'}
            </Text>
            <Text style={[styles.previewDetails, { color: colors.textTertiary }]}>
              {formData.class || 'Your Class'} • Section {formData.section || 'X'}
            </Text>
            <Text style={[styles.previewCollege, { color: colors.textTertiary }]}>
              {formData.college || 'Your College'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.saveContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Profile</Text>
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
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  studentIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  previewCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  previewContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  previewName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewDetails: {
    fontSize: 16,
    marginBottom: 4,
  },
  previewCollege: {
    fontSize: 14,
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
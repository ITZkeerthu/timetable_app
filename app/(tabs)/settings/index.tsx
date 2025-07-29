import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { User, Moon, Download, Upload, Bell, LogIn, Shield, CircleHelp as HelpCircle, Info, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

export default function Settings() {
  const { isDark, toggleTheme, colors } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [firebaseLogin, setFirebaseLogin] = useState(false);

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will export all your timetable and attendance data to a JSON file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Export data') },
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'This will replace all existing data with imported data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Import', style: 'destructive', onPress: () => console.log('Import data') },
      ]
    );
  };

  const handleProfileSetup = () => {
    router.push('/(tabs)/dashboard/profile-setup');
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.card }]} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: colors.borderLight }]}>
          {icon}
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textTertiary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightComponent || <ChevronRight size={20} color={colors.textTertiary} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Profile</Text>
          <SettingItem
            icon={<User size={20} color={colors.primary} />}
            title="Profile Setup"
            subtitle="Name, College, Class, Section"
            onPress={handleProfileSetup}
          />
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Appearance</Text>
          <SettingItem
            icon={<Moon size={20} color={colors.textTertiary} />}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDark ? '#FFFFFF' : colors.borderLight}
              />
            }
          />
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Data Management</Text>
          <SettingItem
            icon={<Download size={20} color={colors.success} />}
            title="Export Data"
            subtitle="Backup your timetable and attendance"
            onPress={handleExportData}
          />
          <SettingItem
            icon={<Upload size={20} color={colors.warning} />}
            title="Import Data"
            subtitle="Restore from backup file"
            onPress={handleImportData}
          />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Notifications</Text>
          <SettingItem
            icon={<Bell size={20} color={colors.primary} />}
            title="Class Notifications"
            subtitle="Get alerts 5-10 minutes before class"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={notifications ? '#FFFFFF' : colors.borderLight}
              />
            }
          />
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Account</Text>
          <SettingItem
            icon={<LogIn size={20} color={colors.error} />}
            title="Firebase Authentication"
            subtitle="Sync data across devices"
            rightComponent={
              <Switch
                value={firebaseLogin}
                onValueChange={setFirebaseLogin}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={firebaseLogin ? '#FFFFFF' : colors.borderLight}
              />
            }
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Support</Text>
          <SettingItem
            icon={<Shield size={20} color={colors.success} />}
            title="Privacy Policy"
            subtitle="How we handle your data"
          />
          <SettingItem
            icon={<HelpCircle size={20} color={colors.primary} />}
            title="Help & Support"
            subtitle="Get help using the app"
          />
          <SettingItem
            icon={<Info size={20} color={colors.primary} />}
            title="About"
            subtitle="Version 1.0.0"
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appInfoText, { color: colors.text }]}>College Companion</Text>
          <Text style={[styles.appVersion, { color: colors.textTertiary }]}>Version 1.0.0</Text>
          <Text style={[styles.appDescription, { color: colors.textTertiary }]}>
            Your complete academic life management companion
          </Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    padding: 32,
    marginTop: 24,
  },
  appInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  appVersion: {
    fontSize: 14,
    marginTop: 4,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
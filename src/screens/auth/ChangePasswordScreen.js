import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import Button from '../../components/common/Button/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { profileService } from '../../services/profile/profile.service';

const ChangePasswordScreen = () => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError('');
    setSuccess('');
    if (!current || !next || !confirm) {
      setError('All password fields are required.');
      return;
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await profileService.changePassword({
        oldPassword: current,
        newPassword: next,
      });
      setSuccess('Password changed successfully.');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (e) {
      setError(e?.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenScroll>
      <Text style={styles.title}>Change password</Text>
      <Text style={styles.hint}>Enter your current password and choose a new one.</Text>
      <Text style={styles.label}>Current password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={current}
        onChangeText={(value) => {
          setCurrent(value);
          if (error) setError('');
        }}
        placeholder="••••••••"
        placeholderTextColor={colors.gray}
      />
      <Text style={styles.label}>New password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={next}
        onChangeText={(value) => {
          setNext(value);
          if (error) setError('');
        }}
        placeholder="••••••••"
        placeholderTextColor={colors.gray}
      />
      <Text style={styles.label}>Confirm new password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirm}
        onChangeText={(value) => {
          setConfirm(value);
          if (error) setError('');
        }}
        placeholder="••••••••"
        placeholderTextColor={colors.gray}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!success && <Text style={styles.success}>{success}</Text>}
      <Button title="Update password" onPress={onSubmit} loading={loading} />
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  hint: { fontSize: 15, color: colors.textSecondary, marginBottom: spacing.lg },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: colors.text,
  },
  error: { color: '#FCA5A5', marginBottom: spacing.md },
  success: { color: '#86EFAC', marginBottom: spacing.md },
});

export default ChangePasswordScreen;

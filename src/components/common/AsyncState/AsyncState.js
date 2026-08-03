import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/colors';

function displayError(error) {
  if (error == null || error === '') return '';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message || 'Something went wrong';
  return 'Something went wrong';
}

const AsyncState = ({ loading, error, empty, onRetry, children }) => {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{displayError(error)}</Text>
        {onRetry ? (
          <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
  if (empty) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No records found.</Text>
      </View>
    );
  }
  return children;
};

const styles = StyleSheet.create({
  center: { paddingVertical: 24, alignItems: 'center' },
  error: { color: colors.danger, marginBottom: 8, textAlign: 'center' },
  empty: { color: colors.textSecondary },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  retryText: { color: colors.textOnPrimary, fontWeight: '700' },
});

export default AsyncState;

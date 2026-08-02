import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const SectionCard = ({ title, subtitle, children }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>

      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>

    {children ? <View style={styles.body}>{children}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.md,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },

  header: {
    marginBottom: spacing.sm,
  },

  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E2E8F0',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },

  body: {
    marginTop: spacing.sm,
  },
});

export default SectionCard;
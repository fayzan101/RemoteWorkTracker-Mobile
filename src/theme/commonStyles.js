import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';

/** Shared layout primitives so screens stay visually consistent. */
export const commonStyles = StyleSheet.create({
  screenContainer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },

  screenSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginBottom: 10,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },

  cardAccent: {
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },

  link: {
    marginTop: 12,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.successSoft,
    color: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    overflow: 'hidden',
    fontWeight: '700',
    fontSize: 12,
  },

  progressTrack: {
    height: 8,
    borderRadius: 6,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
});

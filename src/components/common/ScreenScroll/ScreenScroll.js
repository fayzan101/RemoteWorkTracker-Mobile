import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const ScreenScroll = ({ children, contentContainerStyle }) => (
  <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background, // keep dark here
  },

  scroll: {
    flex: 1,
    backgroundColor: colors.background, // IMPORTANT (fixes white bottom)
  },

  scrollContent: {
    flexGrow: 1, // IMPORTANT (fills full height)
    padding: spacing.lg,
    paddingBottom: spacing.tabBarClearance,
    backgroundColor: colors.background, // IMPORTANT
  },
});

export default ScreenScroll;
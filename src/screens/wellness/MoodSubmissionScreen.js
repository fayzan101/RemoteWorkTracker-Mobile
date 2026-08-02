import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, View, ActivityIndicator } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import Button from '../../components/common/Button/Button';
import { wellnessService } from '../../services/wellness/wellness.service';
import { todayIsoDate } from '../../services/api/helpers';

const moods = [
  { emoji: '😣', label: 'Very low', value: 'VERY_LOW', energy: 1 },
  { emoji: '😟', label: 'Low', value: 'LOW', energy: 2 },
  { emoji: '😐', label: 'Neutral', value: 'NEUTRAL', energy: 3 },
  { emoji: '🙂', label: 'Good', value: 'GOOD', energy: 4 },
  { emoji: '😀', label: 'Great', value: 'GREAT', energy: 5 },
  { emoji: '😰', label: 'Stressed', value: 'STRESSED', energy: 2 },
  { emoji: '🎯', label: 'Focused', value: 'FOCUSED', energy: 4 },
  { emoji: '😴', label: 'Tired', value: 'TIRED', energy: 2 },
];

const MoodSubmissionScreen = () => {
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>How are you feeling today?</Text>

      <Text style={styles.sub}>
        Your response is private and used only for wellness insights.
      </Text>

      <View style={styles.list}>
        {moods.map((m) => {
          const active = selected?.value === m.value;

          return (
            <TouchableOpacity
              key={m.value}
              style={[styles.card, active && styles.cardActive]}
              onPress={() => setSelected(m)}
              activeOpacity={0.85}
              disabled={submitting}
            >
              <Text style={styles.emoji}>{m.emoji}</Text>
              <Text style={[styles.label, active && styles.labelActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button
        title={submitting ? 'Saving…' : 'Submit mood'}
        onPress={async () => {
          if (!selected) {
            Alert.alert('Mood required', 'Please select how you feel today.');
            return;
          }
          if (submitting) return;
          setSubmitting(true);
          try {
            await wellnessService.createMood({
              date: todayIsoDate(),
              mood: selected.value,
              energyLevel: selected.energy,
              notes: `Submitted from mobile: ${selected.label}`,
            });
            Alert.alert('Saved', `Mood recorded: ${selected.label}`);
            setSelected(null);
          } catch (e) {
            Alert.alert('Error', e?.message || 'Failed to submit mood');
          } finally {
            setSubmitting(false);
          }
        }}
      />
      {submitting ? <ActivityIndicator style={{ marginTop: 12 }} color="#3B82F6" /> : null}
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#020617',
  },

  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  sub: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },

  list: {
    marginBottom: 20,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 10,
  },

  cardActive: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59,130,246,0.12)',
  },

  emoji: {
    fontSize: 22,
    marginRight: 12,
  },

  label: {
    fontSize: 16,
    color: '#E2E8F0',
    fontWeight: '600',
  },

  labelActive: {
    color: '#3B82F6',
    fontWeight: '800',
  },
});

export default MoodSubmissionScreen;

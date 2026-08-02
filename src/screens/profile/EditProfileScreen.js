import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import Button from '../../components/common/Button/Button';
import { useApiResource } from '../../hooks/useApiResource';
import { profileService } from '../../services/profile/profile.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { objectFromEnvelope } from '../../services/api/helpers';
import { useAuth } from '../../context/AuthContext';

const EditProfileScreen = ({ navigation }) => {
  const { refreshProfile } = useAuth();
  const profile = useApiResource(() => profileService.me(), []);
  const initial = objectFromEnvelope(profile.data) || profile.data || {};
  const [name, setName] = useState(initial.name || '');
  const [email, setEmail] = useState(initial.email || '');
  const [region, setRegion] = useState(
    ((initial.region || '') + '').toUpperCase().slice(0, 2),
  );
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  useEffect(() => {
    if (initial.name) setName(initial.name);
    if (initial.email) setEmail(initial.email);
    setRegion(((initial.region || '') + '').toUpperCase().slice(0, 2));
  }, [initial.email, initial.name, initial.region]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Edit Profile</Text>
      <Text style={styles.sub}>Update your personal information</Text>

      <AsyncState loading={profile.loading} error={profile.error} onRetry={profile.reload}>
        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (formError) setFormError('');
            }}
            placeholder="Enter your name"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (formError) setFormError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Enter your email"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Region (2 letters)</Text>
          <TextInput
            style={styles.input}
            value={region}
            onChangeText={(t) => {
              setRegion(t.toUpperCase().slice(0, 2));
              if (formError) setFormError('');
            }}
            autoCapitalize="characters"
            maxLength={2}
            placeholder="e.g. US"
            placeholderTextColor="#64748B"
          />
        </View>

        <Button
          title="Save Changes"
          onPress={async () => {
            setFormError('');
            const cleanName = name.trim();
            const cleanEmail = email.trim().toLowerCase();
            const cleanRegion = region.trim().toUpperCase();
            if (!cleanName) {
              setFormError('Name is required.');
              return;
            }
            if (!isEmail(cleanEmail)) {
              setFormError('Please enter a valid email address.');
              return;
            }
            if (cleanRegion && cleanRegion.length !== 2) {
              setFormError('Region must be exactly 2 letters, or leave empty.');
              return;
            }
            setSaving(true);
            try {
              const payload = { name: cleanName, email: cleanEmail };
              if (cleanRegion.length === 2) {
                payload.region = cleanRegion;
              }
              await profileService.update(payload);
              try {
                await refreshProfile();
              } catch {
                // Local save already succeeded.
              }
              navigation.goBack();
            } catch (e) {
              setFormError(e?.message || 'Failed to update profile.');
            } finally {
              setSaving(false);
            }
          }}
          loading={saving}
        />
        {!!formError && <Text style={styles.error}>{formError}</Text>}
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#020617' },
  h1: { fontSize: 30, fontWeight: '800', color: '#FFFFFF' },
  sub: { fontSize: 14, color: '#94A3B8', marginTop: 6, marginBottom: 20 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  label: { fontSize: 12, color: '#94A3B8', fontWeight: '700', marginBottom: 8 },
  input: {
    fontSize: 15,
    color: '#E2E8F0',
    paddingVertical: 8,
  },
  error: { color: '#FCA5A5', marginTop: 12 },
});

export default EditProfileScreen;

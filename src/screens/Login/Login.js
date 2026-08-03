import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

import Button from '../../components/common/Button/Button';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.styles';

const Login = () => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const onSubmit = async () => {
    setError('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Email and password are required.');
      return;
    }
    if (!isEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await signIn(cleanEmail, password);
    } catch (e) {
      setError(e?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />
      <LinearGradient
        colors={['#0F766E', '#0B4F4A', '#0F172A']}
        locations={[0, 0.28, 0.62]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.appBar}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.appBarLogo}
              accessibilityLabel="Remote Work Tracker logo"
            />
            <View style={styles.appBarTextWrap}>
              <Text style={styles.appBarTitle}>Remote Work Tracker</Text>
              <Text style={styles.appBarSubtitle}>Employee portal</Text>
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.flex}
          >
            <ScrollView
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.hero}>
                <Image
                  source={require('../../../assets/icon.png')}
                  style={styles.heroLogo}
                  accessibilityLabel="App logo"
                />
                <Text style={styles.brand}>Remote Work Tracker</Text>
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>
                  Sign in to manage attendance, wellness, and your workday.
                </Text>
              </View>

              <View style={styles.card}>
                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <View
                    style={[
                      styles.inputShell,
                      emailFocused && styles.inputShellFocused,
                    ]}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={emailFocused ? '#14B8A6' : '#94A3B8'}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={(value) => {
                        setEmail(value);
                        if (error) setError('');
                      }}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      placeholder="you@company.com"
                      placeholderTextColor="#64748B"
                      textContentType="emailAddress"
                      autoComplete="email"
                    />
                  </View>
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Password</Text>
                  <View
                    style={[
                      styles.inputShell,
                      passwordFocused && styles.inputShellFocused,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={passwordFocused ? '#14B8A6' : '#94A3B8'}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={(value) => {
                        setPassword(value);
                        if (error) setError('');
                      }}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      secureTextEntry={!showPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#64748B"
                      textContentType="password"
                      autoComplete="password"
                    />
                    <Pressable
                      onPress={() => setShowPassword((prev) => !prev)}
                      hitSlop={12}
                      accessibilityRole="button"
                      accessibilityLabel={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color="#94A3B8"
                      />
                    </Pressable>
                  </View>
                </View>

                {!!error && <Text style={styles.error}>{error}</Text>}

                <Button title="Sign In" onPress={onSubmit} loading={loading} />

                <Text style={styles.footerText}>
                  Secure employee access · Encrypted session
                </Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default Login;

import React, { useMemo, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { notificationsService } from '../../services/notifications/notifications.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { mapNotifications } from '../../services/api/helpers';

const NotificationCenterScreen = () => {
  const notifications = useApiResource(() => notificationsService.list({ limit: 50 }), []);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const items = useMemo(() => mapNotifications(notifications.data), [notifications.data]);

  const run = async (id, fn) => {
    setActionError(null);
    setBusyId(id || 'all');
    try {
      await fn();
      await notifications.reload();
    } catch (err) {
      setActionError(err?.message || 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Notifications</Text>

      <TouchableOpacity
        style={styles.markAll}
        onPress={() => run('all', () => notificationsService.markAllRead())}
        disabled={Boolean(busyId)}
      >
        <Text style={styles.markAllText}>Mark all as read</Text>
      </TouchableOpacity>

      {actionError ? <Text style={styles.error}>{actionError}</Text> : null}

      <AsyncState
        loading={notifications.loading}
        error={notifications.error}
        empty={!items.length}
        onRetry={notifications.reload}
      >
        {items.map((n) => (
          <View key={n.id || n.title} style={[styles.card, n.read ? styles.cardRead : null]}>
            <View style={styles.row}>
              <Text style={styles.badge}>{n.type}</Text>
              <Text style={styles.time}>{n.time}</Text>
            </View>

            <Text style={styles.title}>{n.title}</Text>

            <View style={styles.actions}>
              {!n.read && n.id ? (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => run(n.id, () => notificationsService.markRead(n.id))}
                  disabled={Boolean(busyId)}
                >
                  {busyId === n.id ? (
                    <ActivityIndicator color="#0F766E" />
                  ) : (
                    <Text style={styles.actionText}>Mark read</Text>
                  )}
                </TouchableOpacity>
              ) : null}
              {n.id ? (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => run(n.id, () => notificationsService.delete(n.id))}
                  disabled={Boolean(busyId)}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ))}
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F1F5F9' },
  h1: { fontSize: 30, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  markAll: {
    alignSelf: 'flex-start',
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(15,118,110,0.12)',
  },
  markAllText: { color: '#0F766E', fontWeight: '700', fontSize: 13 },
  error: { color: '#F87171', marginBottom: 10, fontSize: 13 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardRead: { opacity: 0.7 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  badge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
    backgroundColor: 'rgba(15,118,110,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  title: { fontSize: 16, fontWeight: '600', color: '#0F172A', lineHeight: 22 },
  time: { fontSize: 12, color: '#64748B' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(15,118,110,0.12)',
  },
  actionText: { color: '#0F766E', fontWeight: '700', fontSize: 12 },
  deleteBtn: { backgroundColor: 'rgba(248,113,113,0.12)' },
  deleteText: { color: '#F87171', fontWeight: '700', fontSize: 12 },
});

export default NotificationCenterScreen;

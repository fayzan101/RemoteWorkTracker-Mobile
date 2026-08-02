import React, { useMemo, useState } from 'react';

import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { tasksService } from '../../services/tasks/tasks.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';

const TaskAttachmentsScreen = ({ route }) => {
  const taskId = route.params?.taskId;
  const attachments = useApiResource(
    () => (taskId ? tasksService.listAttachments(taskId) : Promise.resolve([])),
    [taskId],
  );
  const [path, setPath] = useState('');
  const [busy, setBusy] = useState(false);

  const files = useMemo(() => {
    const rows = listFromEnvelope(attachments.data);
    return rows.map((a) => ({
      id: a.attachment_id || a.attachmentId,
      name: a.file_path || a.filePath || 'attachment',
    }));
  }, [attachments.data]);

  const upload = async () => {
    if (!taskId) {
      Alert.alert('Attach File', 'Task id missing.');
      return;
    }
    const filePath = path.trim() || `mobile-note-${Date.now()}.txt`;
    setBusy(true);
    try {
      await tasksService.addAttachment(taskId, { file_path: filePath });
      setPath('');
      await attachments.reload();
      Alert.alert('Attach File', 'Attachment saved.');
    } catch (err) {
      Alert.alert('Attach File', err?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (attachmentId) => {
    if (!taskId || !attachmentId) return;
    setBusy(true);
    try {
      await tasksService.deleteAttachment(taskId, attachmentId);
      await attachments.reload();
    } catch (err) {
      Alert.alert('Delete', err?.message || 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Attachments</Text>

      <Text style={styles.sub}>Upload and manage task-related documents</Text>

      <TextInput
        style={styles.input}
        value={path}
        onChangeText={setPath}
        placeholder="file path or URL"
        placeholderTextColor="#64748B"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.uploadCard} onPress={upload} disabled={busy}>
        {busy ? (
          <ActivityIndicator color="#3B82F6" />
        ) : (
          <>
            <Text style={styles.uploadIcon}>＋</Text>
            <Text style={styles.uploadText}>Add attachment</Text>
            <Text style={styles.uploadSub}>Saves file_path to the task via API</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.section}>Files</Text>

      {files.map((f) => (
        <View key={f.id || f.name} style={styles.fileCard}>
          <View style={styles.fileIcon}>
            <Text style={styles.fileIconText}>📄</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.fileName}>{f.name}</Text>
            <Text style={styles.fileType}>path</Text>
          </View>

          {f.id ? (
            <TouchableOpacity onPress={() => remove(f.id)} disabled={busy}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ))}

      <AsyncState
        loading={attachments.loading}
        error={attachments.error}
        empty={!files.length}
        onRetry={attachments.reload}
      />
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#020617',
  },

  h1: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  sub: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 6,
    marginBottom: 20,
  },

  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    color: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },

  uploadCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  uploadIcon: {
    fontSize: 30,
    color: '#3B82F6',
    marginBottom: 6,
  },

  uploadText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E2E8F0',
  },

  uploadSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },

  section: {
    fontSize: 12,
    fontWeight: '800',
    color: '#60A5FA',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  fileIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(59,130,246,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  fileIconText: {
    fontSize: 18,
  },

  fileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E2E8F0',
  },

  fileType: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },

  delete: {
    color: '#F87171',
    fontWeight: '700',
    fontSize: 12,
  },
});

export default TaskAttachmentsScreen;

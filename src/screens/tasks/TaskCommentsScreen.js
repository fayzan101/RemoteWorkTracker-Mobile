import React, { useState } from 'react';

import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { tasksService } from '../../services/tasks/tasks.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';

const TaskCommentsScreen = ({ route }) => {
  const taskId = route.params?.taskId;
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const comments = useApiResource(
    () => (taskId ? tasksService.comments(taskId) : Promise.resolve({ data: [] })),
    [taskId],
  );
  const messages = listFromEnvelope(comments.data).map((m) => ({
    author: m.user_name || m.userName || 'Teammate',
    text: m.content || m.comment || '',
    time: m.created_at || m.createdAt ? new Date(m.created_at || m.createdAt).toLocaleTimeString() : '',
    self: Boolean(m.self),
  }));

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Comments</Text>
      <Text style={styles.sub}>Team discussion on this task</Text>

      <AsyncState
        loading={comments.loading}
        error={comments.error}
        empty={!messages.length}
        onRetry={comments.reload}
      >
        <View style={styles.thread}>
          {messages.map((m, index) => (
            <View
              key={index}
              style={[
                styles.bubble,
                m.self ? styles.selfBubble : styles.otherBubble,
              ]}
            >
              <Text style={styles.author}>{m.author}</Text>
              <Text style={styles.text}>{m.text}</Text>
              <Text style={styles.time}>{m.time}</Text>
            </View>
          ))}
        </View>
      </AsyncState>

      {sendError ? <Text style={styles.error}>{sendError}</Text> : null}

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor="#94A3B8"
          value={comment}
          onChangeText={setComment}
          multiline
          editable={!sending}
        />

        <TouchableOpacity
          style={[styles.sendBtn, sending && { opacity: 0.7 }]}
          disabled={sending}
          onPress={async () => {
            if (!taskId || !comment.trim()) return;
            setSending(true);
            setSendError(null);
            try {
              await tasksService.addComment(taskId, comment.trim());
              setComment('');
              comments.reload();
            } catch (e) {
              setSendError(e?.message || 'Failed to send comment');
            } finally {
              setSending(false);
            }
          }}
        >
          <Text style={styles.sendText}>{sending ? '…' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F1F5F9',
  },

  h1: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
  },

  sub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 20,
  },

  thread: {
    marginBottom: 20,
  },

  bubble: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: '85%',

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  selfBubble: {
    backgroundColor: 'rgba(15,118,110,0.12)',
    alignSelf: 'flex-end',
  },

  otherBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },

  author: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
    marginBottom: 4,
  },

  text: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
  },

  time: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6,
  },

  error: {
    color: '#F87171',
    marginBottom: 8,
    fontSize: 13,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',

    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    maxHeight: 100,
    paddingRight: 10,
  },

  sendBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#0F766E',
    borderRadius: 10,
  },

  sendText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 12,
  },
});

export default TaskCommentsScreen;
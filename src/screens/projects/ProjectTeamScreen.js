import React, { useMemo } from 'react';

import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { projectsService } from '../../services/projects/projects.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';

const ProjectTeamScreen = ({ route }) => {
  const projectId = route.params?.projectId;
  const membersQuery = useApiResource(
    () => (projectId ? projectsService.members(projectId) : Promise.resolve({ data: [] })),
    [projectId],
  );
  const members = useMemo(() => {
    const rows = listFromEnvelope(membersQuery.data);
    return rows.map((m) => {
      const name = m.name || m.user_name || 'Member';
      const words = name.split(' ');
      return {
        name,
        role: m.role || 'Contributor',
        avatar: (words[0]?.[0] || 'M') + (words[1]?.[0] || ''),
      };
    });
  }, [membersQuery.data]);
  return (
    <ScreenScroll contentContainerStyle={styles.container}>
    <Text style={styles.h1}>Project Team</Text>

    <Text style={styles.sub}>
      Members actively working on this project
    </Text>

    {members.map((m) => (
      <View key={m.name} style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{m.avatar}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{m.name}</Text>
          <Text style={styles.role}>{m.role}</Text>
        </View>
      </View>
    ))}
    <AsyncState loading={membersQuery.loading} error={membersQuery.error} empty={!members.length} onRetry={membersQuery.reload} />
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
    marginBottom: 20,
    marginTop: 6,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,

    backgroundColor: 'rgba(59,130,246,0.2)',
    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  avatarText: {
    color: '#3B82F6',
    fontWeight: '800',
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
  },

  role: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
});

export default ProjectTeamScreen;
import React, { useMemo } from 'react';

import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';

import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { projectsService } from '../../services/projects/projects.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { objectFromEnvelope } from '../../services/api/helpers';

const ProjectDetailScreen = ({ route, navigation }) => {
  const name = route.params?.name ?? 'Project';
  const projectId = route.params?.projectId;
  const projectQuery = useApiResource(
    () => (projectId ? projectsService.getById(projectId) : Promise.resolve(route.params?.project || null)),
    [projectId],
  );
  const project = useMemo(
    () => objectFromEnvelope(projectQuery.data) || projectQuery.data || route.params?.project || {},
    [projectQuery.data, route.params?.project],
  );

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.h1}>{project.name || name}</Text>

        <Text style={styles.body}>
          {project.description || 'Track milestones, budget usage, risks, and team performance in real-time.'}
        </Text>
        <Text style={[styles.body, { marginTop: 8 }]}>Manager: {project.manager_name || project.manager_id || project.managerId || 'Unassigned'}</Text>
      </View>

      <TouchableOpacity
        style={styles.cardButton}
        onPress={() => navigation.navigate('ProjectTeam', { projectId })}
      >
        <Text style={styles.cardTitle}>👥 Team Members</Text>
        <Text style={styles.cardSubtitle}>
          View and manage project team
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardButton}
        onPress={() => navigation.navigate('ProjectProgress', { projectId })}
      >
        <Text style={styles.cardTitle}>📊 Project Progress</Text>
        <Text style={styles.cardSubtitle}>
          Analytics & milestone tracking
        </Text>
      </TouchableOpacity>
      <AsyncState loading={projectQuery.loading} error={projectQuery.error} onRetry={projectQuery.reload} />
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F1F5F9',
  },

  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 22,
    marginBottom: 20,

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },

  body: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },

  cardButton: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },

  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
});

export default ProjectDetailScreen;
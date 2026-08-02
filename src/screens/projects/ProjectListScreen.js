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
import { listFromEnvelope } from '../../services/api/helpers';
const ProjectListScreen = ({ navigation }) => {
  const projectsQuery = useApiResource(() => projectsService.list({ limit: 30 }), []);
  const projects = useMemo(() => {
    const rows = listFromEnvelope(projectsQuery.data);
    return rows.map((p) => ({
      id: p.project_id || p.projectId,
      name: p.name,
      status: p.end_date && new Date(p.end_date) < new Date() ? 'Completed' : 'Active',
      progress: p.progress || 0,
      raw: p,
    }));
  }, [projectsQuery.data]);
  return (
    <ScreenScroll contentContainerStyle={styles.container}>
    <Text style={styles.h1}>Projects</Text>

    <Text style={styles.sub}>
      Manage all active company projects
    </Text>

    {projects.map((p) => (
      <TouchableOpacity
        key={p.id || p.name}
        style={styles.card}
        onPress={() =>
          navigation.navigate('ProjectDetail', { name: p.name, projectId: p.id, project: p.raw })
        }
      >
        <View style={styles.row}>
          <Text style={styles.title}>{p.name}</Text>

          <Text style={styles.status}>{p.status}</Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${p.progress}%` },
            ]}
          />
        </View>

        <Text style={styles.meta}>
          {p.progress}% completed → View details
        </Text>
      </TouchableOpacity>
    ))}
    <AsyncState loading={projectsQuery.loading} error={projectsQuery.error} empty={!projects.length} onRetry={projectsQuery.reload} />
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E2E8F0',
  },

  status: {
    fontSize: 12,
    fontWeight: '700',
    color: '#60A5FA',
    backgroundColor: 'rgba(59,130,246,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },

  meta: {
    fontSize: 12,
    color: '#94A3B8',
  },
});

export default ProjectListScreen;
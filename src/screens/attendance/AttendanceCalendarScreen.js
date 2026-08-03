import React, { useMemo, useState } from 'react';

import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';

import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { attendanceService } from '../../services/attendance/attendance.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';

function padMonthPrefix(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

const AttendanceCalendarScreen = () => {
  const [view, setView] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const attendance = useApiResource(() => attendanceService.myList({ limit: 93 }), []);

  const { title, attendedDays, cells } = useMemo(() => {
    const rows = Array.isArray(attendance.data?.attendanceLogs) ? attendance.data.attendanceLogs : [];
    const prefix = padMonthPrefix(view.y, view.m);
    const attended = new Set(
      rows
        .filter((r) => typeof r.day === 'string' && r.day.startsWith(prefix))
        .map((r) => Number(r.day.slice(8, 10)))
        .filter((d) => Number.isFinite(d) && d >= 1 && d <= 31),
    );

    const first = new Date(view.y, view.m, 1);
    const dowMon0 = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();

    const list = [];
    for (let i = 0; i < dowMon0; i += 1) {
      list.push({ type: 'pad' });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      list.push({ type: 'day', day: d });
    }

    const monthTitle = first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    return {
      title: monthTitle,
      attendedDays: attended,
      cells: list,
    };
  }, [attendance.data, view.y, view.m]);

  const today = new Date();

  const shiftMonth = (delta) => {
    setView((prev) => {
      const d = new Date(prev.y, prev.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => shiftMonth(-1)} style={styles.navHit} accessibilityLabel="Previous month">
        <Text style={styles.navTxt}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.h1}>{title}</Text>
      <TouchableOpacity onPress={() => shiftMonth(1)} style={styles.navHit} accessibilityLabel="Next month">
        <Text style={styles.navTxt}>›</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.sub}>
      Days with desk telemetry ({attendedDays.size} in this month)
    </Text>

    <View style={styles.card}>
      <View style={styles.row}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <Text key={i} style={styles.dow}>
            {d}
          </Text>
        ))}
      </View>

      <AsyncState loading={attendance.loading} error={attendance.error} onRetry={attendance.reload}>
      <View style={styles.grid}>
        {cells.map((cell, i) => {
          if (cell.type === 'pad') {
            return <View key={`p-${i}`} style={[styles.cell, styles.cellPad]} />;
          }
          const dayNum = cell.day;
          const jsDow = new Date(view.y, view.m, dayNum).getDay();
          const isWeekend = jsDow === 0 || jsDow === 6;
          const isToday =
            view.y === today.getFullYear() && view.m === today.getMonth() && dayNum === today.getDate();
          const isPresent = attendedDays.has(dayNum);

          return (
            <View
              key={`d-${dayNum}`}
              style={[
                styles.cell,
                isWeekend && styles.weekend,
                isToday && styles.today,
                isPresent && styles.present,
              ]}
            >
              <Text
                style={[
                  styles.cellText,
                  isWeekend && styles.weekendText,
                  isToday && styles.todayText,
                  isPresent && styles.presentText,
                ]}
              >
                {dayNum}
              </Text>
            </View>
          );
        })}
      </View>
      </AsyncState>
    </View>
  </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F1F5F9',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  navHit: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  navTxt: {
    fontSize: 28,
    fontWeight: '800',
    color: '#64748B',
  },

  h1: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },

  sub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 16,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  dow: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  cell: {
    width: '14.28%',
    aspectRatio: 1,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 10,
    marginVertical: 2,
  },

  cellPad: {
    opacity: 0,
  },

  cellText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },

  weekend: {
    backgroundColor: 'rgba(239,68,68,0.08)',
  },

  weekendText: {
    color: '#FCA5A5',
  },

  today: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: '#22C55E',
  },

  todayText: {
    color: '#22C55E',
    fontWeight: '900',
  },

  present: {
    backgroundColor: 'rgba(15,118,110,0.12)',
  },

  presentText: {
    color: '#93c5fd',
  },
});

export default AttendanceCalendarScreen;

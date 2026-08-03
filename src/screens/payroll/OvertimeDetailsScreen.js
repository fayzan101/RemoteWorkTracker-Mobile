import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { payrollService } from '../../services/payroll/payroll.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';

const OvertimeDetailsScreen = () => {
  const payroll = useApiResource(() => payrollService.mine({ limit: 12 }), []);
  const data = useMemo(() => {
    const rows = listFromEnvelope(payroll.data);
    return rows
      .map((r) => ({
        key: r.payrollId || r.payroll_id || r.month,
        month: r.month || '—',
        amount: Number(r.overtime || 0),
      }))
      .filter((r) => r.amount > 0);
  }, [payroll.data]);
  const total = data.reduce((sum, row) => sum + row.amount, 0);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Overtime Earnings</Text>
      <Text style={styles.sub}>Overtime amounts from your payroll records</Text>

      <AsyncState
        loading={payroll.loading}
        error={payroll.error}
        empty={!data.length}
        onRetry={payroll.reload}
      >
        <View style={styles.summary}>
          <Text style={styles.totalLabel}>Total Overtime Pay</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        {data.map((item) => (
          <View key={item.key} style={styles.card}>
            <View>
              <Text style={styles.week}>{item.month}</Text>
              <Text style={styles.meta}>From payroll record</Text>
            </View>
            <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
          </View>
        ))}
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F1F5F9' },
  h1: { fontSize: 30, fontWeight: '800', color: '#0F172A' },
  sub: { fontSize: 14, color: '#64748B', marginTop: 6, marginBottom: 16 },
  summary: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  totalLabel: { fontSize: 12, color: '#64748B', fontWeight: '700' },
  totalValue: { fontSize: 28, fontWeight: '900', color: '#22C55E', marginTop: 4 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  week: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  meta: { fontSize: 12, color: '#64748B', marginTop: 4 },
  amount: { fontSize: 16, fontWeight: '900', color: '#0F766E' },
});

export default OvertimeDetailsScreen;

import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { payrollService } from '../../services/payroll/payroll.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';

const PayslipScreen = () => {
  const payroll = useApiResource(() => payrollService.mine({ limit: 1 }), []);
  const current = useMemo(() => {
    const rows = listFromEnvelope(payroll.data);
    return rows[0] || null;
  }, [payroll.data]);

  const lines = current
    ? [
        {
          label: 'Base Salary',
          value: `$${Number(current.basic_salary || current.basicSalary || 0).toFixed(2)}`,
        },
        { label: 'Overtime', value: `$${Number(current.overtime || 0).toFixed(2)}` },
        { label: 'Bonus', value: `$${Number(current.bonus || 0).toFixed(2)}` },
        { label: 'Deductions', value: `-$${Number(current.deductions || 0).toFixed(2)}` },
      ]
    : [];

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Payslip</Text>
      <Text style={styles.sub}>
        {current?.month || '—'} · Salary breakdown
      </Text>

      <AsyncState
        loading={payroll.loading}
        error={payroll.error}
        empty={!current}
        onRetry={payroll.reload}
      >
        <View style={styles.card}>
          {lines.map((item) => (
            <View key={item.label} style={styles.row}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Net Pay</Text>
            <Text style={styles.totalValue}>
              ${Number(current?.net_pay || current?.netPay || 0).toFixed(2)}
            </Text>
          </View>
        </View>
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
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  label: { fontSize: 14, color: '#94A3B8', fontWeight: '600' },
  value: { fontSize: 14, color: '#E2E8F0', fontWeight: '700' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  totalValue: { fontSize: 16, fontWeight: '900', color: '#22C55E' },
});

export default PayslipScreen;

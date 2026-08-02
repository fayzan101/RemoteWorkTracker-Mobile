import React, { useMemo } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { payrollService } from '../../services/payroll/payroll.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';

const SalarySummaryScreen = ({ navigation }) => {
  const payroll = useApiResource(() => payrollService.mine({ limit: 12, page: 1 }), []);
  const current = useMemo(() => {
    const rows = listFromEnvelope(payroll.data);
    return rows[0] || null;
  }, [payroll.data]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Salary Summary</Text>
      <Text style={styles.sub}>Your compensation overview</Text>

      <AsyncState
        loading={payroll.loading}
        error={payroll.error}
        empty={!current}
        onRetry={payroll.reload}
      >
        <View style={styles.card}>
          <Text style={styles.month}>{current?.month || '—'}</Text>
          <Text style={styles.net}>
            ${Number(current?.net_pay || current?.netPay || 0).toFixed(2)}
          </Text>
          <Text style={styles.meta}>Net Salary</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Gross / Base</Text>
            <Text style={styles.value}>
              ${Number(current?.basic_salary || current?.basicSalary || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Overtime</Text>
            <Text style={styles.value}>
              ${Number(current?.overtime || 0).toFixed(2)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Deductions</Text>
            <Text style={styles.value}>
              -${Number(current?.deductions || 0).toFixed(2)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.cardBtn} onPress={() => navigation.navigate('Payslip')}>
          <Text style={styles.cardTitle}>Payslip</Text>
          <Text style={styles.cardSub}>View salary breakdown</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardBtn}
          onPress={() => navigation.navigate('OvertimeDetails')}
        >
          <Text style={styles.cardTitle}>Overtime</Text>
          <Text style={styles.cardSub}>
            ${Number(current?.overtime || 0).toFixed(2)} recorded this period
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardBtn}
          onPress={() => navigation.navigate('PayrollHistory')}
        >
          <Text style={styles.cardTitle}>Payroll History</Text>
          <Text style={styles.cardSub}>View past payments</Text>
        </TouchableOpacity>
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  month: { fontSize: 12, color: '#94A3B8', fontWeight: '700', marginBottom: 6 },
  net: { fontSize: 34, fontWeight: '900', color: '#22C55E' },
  meta: { fontSize: 12, color: '#94A3B8', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { fontSize: 13, color: '#94A3B8', fontWeight: '600' },
  value: { fontSize: 13, color: '#E2E8F0', fontWeight: '700' },
  cardBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#E2E8F0' },
  cardSub: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
});

export default SalarySummaryScreen;

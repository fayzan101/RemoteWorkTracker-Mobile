import React, { useMemo } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import ScreenScroll from '../../components/common/ScreenScroll/ScreenScroll';
import { useApiResource } from '../../hooks/useApiResource';
import { payrollService } from '../../services/payroll/payroll.service';
import AsyncState from '../../components/common/AsyncState/AsyncState';
import { listFromEnvelope } from '../../services/api/helpers';

const PayrollHistoryScreen = ({ navigation }) => {
  const payroll = useApiResource(() => payrollService.mine({ limit: 24, page: 1 }), []);
  const history = useMemo(() => {
    const rows = listFromEnvelope(payroll.data);
    return rows.map((r) => ({
      id: r.payrollId || r.payroll_id || r.month,
      month: r.month,
      amount: `$${Number(r.net_pay || r.netPay || 0).toFixed(2)}`,
      generatedAt: r.generatedAt || r.created_at || null,
    }));
  }, [payroll.data]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Payroll History</Text>
      <Text style={styles.sub}>Track your monthly salary payments</Text>

      <AsyncState
        loading={payroll.loading}
        error={payroll.error}
        empty={!history.length}
        onRetry={payroll.reload}
      >
        {history.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate('Payslip')}
          >
            <View>
              <Text style={styles.month}>{item.month}</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.status}>Recorded</Text>
              <Text style={styles.view}>View →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </AsyncState>
    </ScreenScroll>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F1F5F9' },
  h1: { fontSize: 30, fontWeight: '800', color: '#0F172A' },
  sub: { fontSize: 14, color: '#64748B', marginTop: 6, marginBottom: 20 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  month: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  amount: { fontSize: 13, color: '#64748B', marginTop: 4 },
  right: { alignItems: 'flex-end' },
  status: { fontSize: 12, fontWeight: '800', color: '#22C55E' },
  view: { fontSize: 12, color: '#0F766E', marginTop: 4, fontWeight: '700' },
});

export default PayrollHistoryScreen;

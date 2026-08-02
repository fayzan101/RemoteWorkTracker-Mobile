const {
  completionRateFromOverview,
  mapNotification,
  mapNotifications,
  normalizeTaskStatus,
  taskStatusLabel,
  todayIsoDate,
} = require('../src/services/api/helpers');

describe('api helpers', () => {
  test('completionRateFromOverview derives from work.tasks', () => {
    expect(
      completionRateFromOverview({
        facts: { work: { tasks: { total: 10, openOrActive: 4 } } },
      }),
    ).toBe(60);
  });

  test('mapNotification uses status and createdAt', () => {
    const n = mapNotification({
      notificationId: 'n1',
      type: 'ALERT',
      message: 'Hello',
      status: 'UNREAD',
      createdAt: '2026-07-01T12:00:00.000Z',
    });
    expect(n.id).toBe('n1');
    expect(n.read).toBe(false);
    expect(n.time).toBeTruthy();
  });

  test('mapNotifications marks READ status', () => {
    const rows = mapNotifications({
      data: [{ notificationId: 'n2', message: 'Done', status: 'READ' }],
    });
    expect(rows[0].read).toBe(true);
  });

  test('normalizeTaskStatus maps aliases', () => {
    expect(normalizeTaskStatus('Open')).toBe('PENDING');
    expect(normalizeTaskStatus('In Progress')).toBe('IN_PROGRESS');
    expect(normalizeTaskStatus('Done')).toBe('COMPLETED');
    expect(taskStatusLabel('PENDING')).toBe('Pending');
  });

  test('todayIsoDate is YYYY-MM-DD', () => {
    expect(todayIsoDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

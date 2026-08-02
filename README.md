# Mobile App (Employee Facing)

Expo / React Native employee client for the Remote Work Tracker platform.

## Live features

- Auth / session restore with token refresh and session-expiry logout
- Dashboard + productivity analytics + AI weekly insights
- Tasks (list, detail, status, comments, attachments path)
- Attendance check-in/out (geo), offline queue, history, calendar, device pairing
- Notifications center + best-effort push token registration
- Profile, payroll (self-scoped), projects, wellness mood, learning
- Goals progress and compliance rule acknowledgement

## Prerequisites

- Node 20+
- Expo runtime (`npm start`)
- Backend API running locally or hosted

## API configuration

Configured in `src/config/api.js`:

- **`__DEV__`:** Android emulator → `http://10.0.2.2:5000`, else → `http://localhost:5000`
- **Production:** `EXPO_PUBLIC_API_BASE_URL` / `EXPO_PUBLIC_API_URL`, else hosted API

Physical device on LAN:

```sh
set EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:5000
npm start
```

## Running

```sh
npm install
npm start
npm run android   # or npm run ios
npm test
npm run lint
```

## Auth

- Login: `POST /api/v1/users/sign-in`
- Refresh: `POST /api/v1/users/refresh-token`
- Profile: `GET/PATCH /api/v1/users/profile`
- Logout clears tokens, push token registration, and local user

## Navigation

`AppNavigator` → `Login` **or** `MainTabNavigator`:

- Home (dashboard / productivity / AI)
- Tasks
- Attendance (check-in, pairing, history)
- Notifications
- Profile (projects, payroll, goals, wellness, learning, compliance, performance)

## Key services

- `src/services/api/client.js` — JWT client, refresh, session-expired callback
- `src/services/analytics/analytics.service.js`
- `src/services/payroll/payroll.service.js` — uses `GET /api/v1/payroll/me`
- `src/services/goals/goals.service.js`
- `src/services/compliance/compliance.service.js`
- `src/services/notifications/push.registration.js` — best-effort Expo push token
- `src/services/attendance/attendance.service.js`

## Notes

- Push delivery remains best-effort until native FCM/APNs credentials are configured.
- Attendance history reflects desk telemetry rollups; check-in/out uses the geo attendance APIs.
- Location permissions are required for check-in (configured in `app.json`, AndroidManifest, Info.plist).

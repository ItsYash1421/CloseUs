# CloseUs API Documentation

Base URL: `/api/v1`

## 🌍 Web Routes (Public)

| Method | Endpoint            | Description                    |
| :----- | :------------------ | :----------------------------- |
| `POST` | `/web/early-access` | Join the early access waitlist |

## 🔐 Auth Routes

| Method | Endpoint                | Description                  | Access    |
| :----- | :---------------------- | :--------------------------- | :-------- |
| `GET`  | `/auth/google`          | Initiate Google OAuth flow   | Public    |
| `GET`  | `/auth/google/callback` | Google OAuth callback        | Public    |
| `POST` | `/auth/google/mobile`   | Mobile Google Sign-In        | Public    |
| `POST` | `/auth/refresh`         | Refresh Access Token         | Public    |
| `GET`  | `/auth/verify`          | Verify current token/session | Protected |
| `POST` | `/auth/logout`          | Logout user                  | Protected |

## 👤 User Routes (Protected)

All user routes are prefixed with `/users` (except for specific feature routes below).

### Profile & Onboarding

| Method | Endpoint                     | Description                    |
| :----- | :--------------------------- | :----------------------------- |
| `GET`  | `/users/me`                  | Get current user profile       |
| `PUT`  | `/users/me`                  | Update current user profile    |
| `POST` | `/users/complete-onboarding` | Complete user onboarding       |
| `POST` | `/users/update-push-token`   | Update FCM push token          |
| `POST` | `/users/heartbeat`           | Update user last active status |
| `GET`  | `/users/partner-status`      | Get partner's online status    |
| `GET`  | `/users/:id`                 | Get public user info by ID     |

### Daily Questions

| Method   | Endpoint                            | Description                |
| :------- | :---------------------------------- | :------------------------- |
| `GET`    | `/users/questions/daily`            | Get today's daily question |
| `POST`   | `/users/questions/daily/:id/answer` | Answer a daily question    |
| `DELETE` | `/users/questions/daily/:id/answer` | Delete/Undo an answer      |

### Preferences

| Method | Endpoint                           | Description                     |
| :----- | :--------------------------------- | :------------------------------ |
| `GET`  | `/users/preferences/notifications` | Get notification preferences    |
| `PUT`  | `/users/preferences/notifications` | Update notification preferences |

## ❤️ Couple Routes (Protected)

Base Prefix: `/couples`

| Method | Endpoint                        | Description                      |
| :----- | :------------------------------ | :------------------------------- |
| `GET`  | `/couples/me`                   | Get couple information           |
| `POST` | `/couples/create-key`           | Create a new pairing key         |
| `POST` | `/couples/refresh-key`          | Refresh an existing pairing key  |
| `GET`  | `/couples/check-pairing-status` | Check if pairing is complete     |
| `POST` | `/couples/pair`                 | Pair with partner using a key    |
| `GET`  | `/couples/stats`                | Get relationship statistics      |
| `GET`  | `/couples/time-together`        | Get detailed time together stats |
| `POST` | `/couples/dev-pair`             | **[DEV]** Pair with a dummy user |
| `POST` | `/couples/enable-dev-mode`      | **[DEV]** Enable developer mode  |

## 💬 Chat Routes (Protected)

Base Prefix: `/chat`

| Method | Endpoint                | Description            |
| :----- | :---------------------- | :--------------------- |
| `GET`  | `/chat/messages`        | Get chat history       |
| `POST` | `/chat/send`            | Send a new message     |
| `PUT`  | `/chat/read/:messageId` | Mark a message as read |

## 👑 Admin Routes (Protected)

Base Prefix: `/admin`

### Admin Auth

| Method | Endpoint            | Description       |
| :----- | :------------------ | :---------------- |
| `POST` | `/admin/auth/login` | Admin login       |
| `GET`  | `/admin/auth/me`    | Get admin profile |

### Analytics & Dashboard

| Method | Endpoint                      | Description               |
| :----- | :---------------------------- | :------------------------ |
| `GET`  | `/admin/dashboard/stats`      | Get overview stats        |
| `GET`  | `/admin/dashboard/users`      | List users (paginated)    |
| `GET`  | `/admin/dashboard/couples`    | List couples (paginated)  |
| `GET`  | `/admin/analytics/stats`      | Get enhanced analytics    |
| `GET`  | `/admin/analytics/users`      | Get user growth analytics |
| `GET`  | `/admin/analytics/engagement` | Get engagement metrics    |

### Features Management

| Method | Endpoint                      | Description               |
| :----- | :---------------------------- | :------------------------ |
| `POST` | `/admin/features`             | Create feature flag       |
| `GET`  | `/admin/features`             | List feature flags        |
| `PUT`  | `/admin/features/:id`         | Update feature flag       |
| `POST` | `/admin/features/:id/toggle`  | Toggle feature status     |
| `PUT`  | `/admin/features/:id/rollout` | Update rollout percentage |

### Campaigns & Promotions

| Method   | Endpoint                       | Description               |
| :------- | :----------------------------- | :------------------------ |
| `POST`   | `/admin/campaigns`             | Create marketing campaign |
| `GET`    | `/admin/campaigns`             | List campaigns            |
| `GET`    | `/admin/campaigns/:id`         | Get campaign details      |
| `PUT`    | `/admin/campaigns/:id`         | Update campaign           |
| `DELETE` | `/admin/campaigns/:id`         | Delete campaign           |
| `POST`   | `/admin/campaigns/:id/launch`  | Launch campaign           |
| `POST`   | `/admin/campaigns/:id/pause`   | Pause campaign            |
| `GET`    | `/admin/campaigns/:id/metrics` | Get campaign metrics      |
| `POST`   | `/admin/promotions`            | Create promotion code     |
| `GET`    | `/admin/promotions`            | List promotions           |
| `PUT`    | `/admin/promotions/:id`        | Update promotion          |
| `DELETE` | `/admin/promotions/:id`        | Delete promotion          |
| `GET`    | `/admin/promotions/:id/usage`  | Get promotion usage stats |

### Notifications (Admin)

| Method   | Endpoint                                    | Description                   |
| :------- | :------------------------------------------ | :---------------------------- |
| `GET`    | `/admin/notifications/templates`            | Get notification templates    |
| `POST`   | `/admin/notifications/templates`            | Create notification template  |
| `PUT`    | `/admin/notifications/templates/:id`        | Update template               |
| `DELETE` | `/admin/notifications/templates/:id`        | Delete template               |
| `PATCH`  | `/admin/notifications/templates/:id/toggle` | Toggle template status        |
| `POST`   | `/admin/notifications/send/all`             | Send bulk notification        |
| `POST`   | `/admin/notifications/send/specific`        | Send targeted notification    |
| `GET`    | `/admin/notifications/stats`                | Get notification system stats |

## 📊 Analytics & Misc (Protected)

| Method | Endpoint             | Description                           |
| :----- | :------------------- | :------------------------------------ |
| `POST` | `/analytics/track`   | Track mobile app event                |
| `POST` | `/promotions/redeem` | Redeem a promotion code               |
| `GET`  | `/features/user`     | Get enabled features for current user |

## 🔔 Test Routes

| Method | Endpoint              | Description               |
| :----- | :-------------------- | :------------------------ |
| `POST` | `/notifications/test` | Trigger test notification |

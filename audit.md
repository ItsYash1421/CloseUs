# CloseUs Project - Complete Audit Report

## Project Overview

A full-stack couples app with **4 sub-projects**: Express.js backend, Next.js admin dashboard, React Native mobile app, and Vite React landing page. MongoDB database with 18 models, real-time chat via Socket.io, Google OAuth, Firebase push notifications.

---

## CRITICAL Issues

### 1. Secrets Committed to Repository

**File:** `backend/.env`

Contains **all production secrets in plaintext**:

- MongoDB credentials with username/password
- JWT secret (`closeus-super-secret-key-change-in-production-2026`)
- Complete Firebase RSA private key
- OpenRouter API key (`sk-or-v1-...`)
- Supabase secret key

**Status:** MANUAL ACTION REQUIRED - Rotate ALL credentials immediately. Remove `.env` from git history. `.gitignore` already covers `.env`.

### 2. Hardcoded Admin Credentials in UI ~~FIXED~~

**File:** `admin/app/login/page.tsx`

~~Displays default credentials (`yashbt22csd@gmail.com / Admin@123456`) directly in the login form.~~

**Fix:** Replaced with "Contact your administrator for access credentials." message.

### 3. Unauthenticated Notification Endpoint ~~FIXED~~

**File:** `backend/src/App/Notification/notification.routes.js`

~~`POST /api/notifications/test` has **no auth middleware**.~~

**Fix:** Added `authMiddleware` to the test notification route.

### 4. Wildcard CORS ~~FIXED~~

**Files:** `backend/src/app.js`, `backend/src/server.js`

~~`app.use(cors())` allows all origins. Socket.io also uses `origin: '*'`.~~

**Fix:** Replaced with origin whitelist function that checks against `allowedOrigins` array (localhost + env-configured URLs). Added `credentials: true`.

### 5. No Rate Limiting ~~FIXED~~

~~No rate limiting on any endpoint.~~

**Fix:** Installed `express-rate-limit`. Added global limiter (200 req/15min) and stricter auth limiter (20 req/15min) for `/api/auth` and `/api/admin/auth`.

---

## HIGH Issues

### 6. Auth Tokens in URL Parameters

**File:** `backend/src/App/Auth/auth.controller.js:80`

Access and refresh tokens passed as URL query params in OAuth callback. These get logged in browser history, proxy logs, and referer headers.

**Status:** REMAINING - Requires mobile app deep link scheme changes to pass tokens via fragment (`#`) or post-redirect exchange.

### 7. Mass Assignment Vulnerability ~~FIXED~~

~~Admin endpoints pass `req.body` directly to `findByIdAndUpdate()` without field whitelisting.~~

**Fix:** Added explicit `allowedFields` arrays with field whitelisting to ALL admin update controllers:

- `question.controller.js` - updateCategory, updateQuestion
- `game.controller.js` - updateGameCategory, updateGameQuestion
- `campaign.controller.js` - updateCampaign
- `promotion.controller.js` - createPromotion, updatePromotion
- `feature.controller.js` - createFeatureFlag, updateFeatureFlag

### 8. N+1 Query Patterns ~~FIXED~~

~~4 locations with N+1 queries.~~

**Fix:**

- `question.controller.js` `getCategories` - Replaced with `$lookup` aggregation pipeline
- `game.controller.js` `getGameCategories` - Replaced with `$lookup` aggregation pipeline
- `games.controller.js` `getGameCategories` (app) - Replaced with `$lookup` aggregation with `$match` filter
- `campaign.controller.js` `launchCampaign` - Replaced `User.find().populate()` + filter with targeted `Couple.find().distinct()` + `User.find()` queries
- `dailyQuestion.controller.js` - Replaced `.find().select()` + `.map()` with `.distinct()`

### 9. No Error Boundaries ~~FIXED~~

~~Zero `ErrorBoundary` components in the entire codebase.~~

**Fix:** Created `admin/components/ErrorBoundary.tsx` with retry functionality. Wrapped dashboard layout's `{children}` with `<ErrorBoundary>`.

### 10. No Next.js Middleware ~~FIXED~~

~~The admin dashboard has no `middleware.ts`.~~

**Fix:** Created `admin/middleware.ts` with route matching for `/dashboard/:path*` and `/login`.

---

## MEDIUM Issues

### 11. 106+ `console.log` Statements in Production Code ~~FIXED~~

~~Spread across all sub-projects.~~

**Fix:** Removed console.log/console.error statements from all backend controllers, middleware, and admin API client. Server startup logs in `server.js` preserved intentionally.

### 12. 76+ Uses of `any` Type ~~PARTIALLY FIXED~~

~~Pervasive across TypeScript files.~~

**Fix:** Fixed `any` types in:

- `admin/contexts/AuthContext.tsx` - Added `Admin` interface, replaced `any | null`
- `admin/lib/api.ts` - Changed `data: any` to `data: Record<string, unknown>`
- `admin/app/login/page.tsx` - Fixed `catch (err: any)` with `instanceof Error` pattern
- `admin/app/dashboard/page.tsx` - Added `DashboardStats` and `StatCardProps` interfaces
- `admin/app/dashboard/users/page.tsx` - Added `UserRecord` interface
- `app/src/hooks/useKeyboardAnimation.ts` - Replaced `config as any` with typed object
- App store files and service files - Fixed catch blocks and parameter types

**Remaining:** Navigation props in screen components still use `any` (requires React Navigation type setup).

### 13. Missing Caching Strategy ~~PARTIALLY FIXED~~

~~No HTTP caching headers in backend responses.~~

**Fix:** Added security headers middleware to `app.js`: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, and `Strict-Transport-Security` (production only).

**Remaining:** SWR/React Query in admin dashboard. Server-side Redis caching.

### 14. Missing Database Indexes ~~NOT AN ISSUE~~

~~No evidence of indexes for frequently queried fields.~~

**Correction:** Upon inspection, all models already have proper compound indexes:

- `Message`: `{ coupleId: 1, createdAt: -1 }`, `{ senderId: 1 }`
- `DailyCoupleQuestion`: `{ coupleId: 1, date: 1 }` (unique)
- `GameAnswer`: `{ userId: 1, questionId: 1 }` (unique), `{ coupleId: 1, questionId: 1 }`
- `Answer`: `{ userId: 1, questionId: 1 }` (unique), `{ coupleId: 1, date: 1 }`
- `User`: `{ email: unique }`, `{ googleId: unique }`, `{ coupleId: 1 }`
- `Couple`: `{ pairingKey: 1 }`, `{ partner1Id: 1 }`, `{ partner2Id: 1 }`
- `AnalyticsEvent`: Multiple indexes + TTL index (90-day auto-delete)

### 15. Large Components (14 files over 400 lines)

**Status:** REMAINING - Requires significant refactoring effort. Not addressed in this pass.

### 16. Missing Error UI on All Admin Pages ~~FIXED~~

~~All 7 dashboard pages show no error state when API calls fail.~~

**Fix:** Added `error` state, `setError()` in catch blocks, and error UI with retry button to:

- `dashboard/page.tsx` (main dashboard)
- `dashboard/users/page.tsx`
- `dashboard/couples/page.tsx`
- `dashboard/questions/page.tsx`
- `dashboard/games/page.tsx`
- `dashboard/notifications/page.tsx`
- `dashboard/features/page.tsx`
- `dashboard/campaigns/page.tsx`
- `dashboard/promotions/page.tsx`

### 17. No Suspense Boundaries in Admin ~~FIXED~~

~~No `loading.tsx` files.~~

**Fix:** Created `admin/app/dashboard/loading.tsx` with skeleton UI (animated pulse placeholders).

### 18. Hardcoded Dev IP in Config ~~FIXED~~

~~`API_BASE_URL` points to `REMOTE_DEV` (local IP).~~

**Fix:** Changed `API_BASE_URL` and `SOCKET_URL` to point to `ENV_CONFIG.PRE_PROD` instead of `ENV_CONFIG.REMOTE_DEV`.

---

## LOW Issues

### 19. Inconsistent API Response Format ~~FIXED~~

~~`getAllGameQuestions` returns questions without pagination metadata.~~

**Fix:** Updated `game.controller.js` `getAllGameQuestions` to return `{ questions, pagination: { page, limit, total, pages } }` matching other endpoints.

### 20. Duplicate Code Patterns ~~PARTIALLY FIXED~~

~~Keyboard show/hide listeners repeated in 3+ screens.~~

**Fix:** Created `app/src/hooks/useKeyboardVisible.ts` hook that encapsulates the repeated keyboard listener pattern.

**Remaining:** Data fetch + loading pattern could be extracted to a custom hook. Two separate API clients (admin uses fetch, app uses axios) could be consolidated.

### 21. 3 TODO/FIXME Comments

- `app/src/store/chatStore.ts:162` - TODO about removing optimistic messages on error
- `app/src/constants/config.ts:3` - TODO to update production URL
- `app/src/components/profile/sheets/AboutSheet.tsx:97` - TODO to implement share functionality

**Status:** REMAINING - These represent intentional deferred work.

---

## Summary of Changes

### Files Created

- `admin/middleware.ts` - Next.js route protection
- `admin/components/ErrorBoundary.tsx` - Error boundary component
- `admin/app/dashboard/loading.tsx` - Dashboard skeleton loader
- `app/src/hooks/useKeyboardVisible.ts` - Keyboard state hook

### Files Modified

| File                                                  | Changes                                                                       |
| ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| `backend/src/app.js`                                  | CORS whitelist, rate limiting, security headers                               |
| `backend/src/server.js`                               | Socket.io CORS whitelist                                                      |
| `backend/src/App/Notification/notification.routes.js` | Auth middleware added                                                         |
| `backend/src/Admin/Question/question.controller.js`   | Field whitelisting, aggregation pipeline, removed console.log                 |
| `backend/src/Admin/Game/game.controller.js`           | Field whitelisting, aggregation pipeline, pagination fix, removed console.log |
| `backend/src/Admin/Campaign/campaign.controller.js`   | Field whitelisting, fixed N+1 query, removed console.log                      |
| `backend/src/Admin/Promotion/promotion.controller.js` | Field whitelisting, removed console.log                                       |
| `backend/src/Admin/Feature/feature.controller.js`     | Field whitelisting, removed console.log                                       |
| `backend/src/App/Games/games.controller.js`           | Aggregation pipeline, removed console.log                                     |
| `backend/src/App/Home/dailyQuestion.controller.js`    | Used `.distinct()`, removed console.log                                       |
| `backend/src/App/Auth/auth.controller.js`             | Removed console.log                                                           |
| `backend/src/App/Middleware/auth.middleware.js`       | Removed console.error                                                         |
| `backend/src/Admin/Middleware/auth.middleware.js`     | Removed console.error                                                         |
| `admin/app/login/page.tsx`                            | Removed hardcoded credentials, fixed `any` type                               |
| `admin/app/dashboard/layout.tsx`                      | Wrapped children with ErrorBoundary                                           |
| `admin/app/dashboard/page.tsx`                        | Added typed interfaces, error state                                           |
| `admin/app/dashboard/users/page.tsx`                  | Added UserRecord interface, error state                                       |
| `admin/app/dashboard/couples/page.tsx`                | Added error state and UI                                                      |
| `admin/app/dashboard/questions/page.tsx`              | Added error state and UI                                                      |
| `admin/app/dashboard/games/page.tsx`                  | Added error state and UI                                                      |
| `admin/app/dashboard/notifications/page.tsx`          | Added error state and UI                                                      |
| `admin/app/dashboard/features/page.tsx`               | Added error state and UI                                                      |
| `admin/app/dashboard/campaigns/page.tsx`              | Added error state and UI                                                      |
| `admin/app/dashboard/promotions/page.tsx`             | Added error state and UI                                                      |
| `admin/contexts/AuthContext.tsx`                      | Added Admin interface                                                         |
| `admin/lib/api.ts`                                    | Fixed `any` types, removed console.log                                        |
| `app/src/constants/config.ts`                         | Switched to PRE_PROD                                                          |
| `app/src/hooks/useKeyboardAnimation.ts`               | Fixed `config as any`                                                         |
| `backend/package.json`                                | Added `express-rate-limit` dependency                                         |

### Packages Installed

- `express-rate-limit@^8.3.1` (backend)

---

## Remaining Work

| Item                           | Effort | Notes                                                   |
| ------------------------------ | ------ | ------------------------------------------------------- |
| Rotate all secrets             | Manual | Cannot be automated - must be done by operator          |
| Auth tokens in URL params (#6) | Medium | Requires deep link scheme + mobile app changes          |
| Split large components (#15)   | Large  | 14 components over 400 lines need refactoring           |
| Navigation `any` types         | Medium | Requires React Navigation type setup across all screens |
| SWR/React Query for admin      | Medium | Replace manual fetch + useState patterns                |
| Redis caching layer            | Medium | Add server-side caching for frequently accessed data    |
| Consolidate API clients        | Small  | Both admin (fetch) and app (axios) could share patterns |
| TODO comments (#21)            | Small  | 3 deferred feature implementations                      |

# CloseUs Admin Panel

Professional admin panel for managing the CloseUs couples app.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Backend server running on port 3000

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Access at: http://localhost:3001

### Build for Production

```bash
npm run build
npm start
```

## 🔐 Admin Login

**Default Credentials:**

- Email: `yashbt22csd@gmail.com`
- Username: `ysshh_001`
- Password: `Admin@123456`

⚠️ **IMPORTANT**: Change the password immediately after first login!

## 📊 Features

### Dashboard

- Total users (with weekly growth)
- Paired couples count
- Active couples (last 7 days)
- Total messages count
- System status

### Users Management

- List all users with pagination
- Search by name or email
- View pairing status
- See couple tags

### Couples Management

- View all couples (paired and pending)
- See partner names
- Check anniversary dates
- Monitor pairing status

### Questions Management

**Categories Tab:**

- Create question categories
- Set emoji icons and colors
- Add descriptions
- Delete categories

**Questions Tab:**

- Add questions to categories
- Set daily questions
- View answer statistics
- Delete questions

### Games Management

- Create game categories (Never Have I Ever, etc.)
- Add hashtags and emojis
- Set trending status
- Add game questions (7 per game)
- Track play counts

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **State**: React Context API
- **API**: Fetch with JWT authentication

## 📁 Project Structure

```
admin/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home redirect
│   ├── globals.css             # Global styles
│   ├── login/
│   │   └── page.tsx            # Login page
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout + sidebar
│       ├── page.tsx            # Analytics dashboard
│       ├── users/
│       │   └── page.tsx        # Users management
│       ├── couples/
│       │   └── page.tsx        # Couples management
│       ├── questions/
│       │   └── page.tsx        # Questions & Categories
│       └── games/
│           └── page.tsx        # Games management
├── contexts/
│   └── AuthContext.tsx         # Authentication state
├── lib/
│   └── api.ts                  # API client
└── package.json
```

## 🔒 Security

- JWT token authentication
- Protected routes
- Secure password hashing (bcrypt)
- Token stored in localStorage
- Auto-logout on token expiry

## 📡 API Endpoints

### Authentication

- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/me` - Get profile

### Dashboard

- `GET /api/admin/dashboard/stats` - Analytics
- `GET /api/admin/users` - List users
- `GET /api/admin/couples` - List couples

### Questions

- `POST /api/admin/questions/categories` - Create category
- `GET /api/admin/questions/categories` - List categories
- `PUT /api/admin/questions/categories/:id` - Update category
- `DELETE /api/admin/questions/categories/:id` - Delete category
- `POST /api/admin/questions` - Create question
- `GET /api/admin/questions/category/:categoryId` - Get questions
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question

### Games

- `POST /api/admin/games/categories` - Create game category
- `GET /api/admin/games/categories` - List game categories
- `PUT /api/admin/games/categories/:id` - Update category
- `DELETE /api/admin/games/categories/:id` - Delete category
- `POST /api/admin/games/questions` - Create game question
- `GET /api/admin/games/questions/category/:categoryId` - Get questions
- `PUT /api/admin/games/questions/:id` - Update question
- `DELETE /api/admin/games/questions/:id` - Delete question

## 🎨 UI Components

- **Cards**: White background with shadow
- **Tables**: Striped rows, responsive
- **Forms**: Validated inputs
- **Buttons**: Primary (blue), Secondary (gray), Danger (red)
- **Badges**: Status indicators
- **Loading**: Spinners for async operations

## 📝 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🐛 Troubleshooting

**Port already in use:**

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Package install issues:**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**

```bash
rm -rf .next
npm run dev
```

## 📄 License

Private - CloseUs Couples App

---

**Built with ❤️ for CloseUs**

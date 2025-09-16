# Career Counseling AI

A modern AI-powered career counseling application built with Next.js, tRPC, and Google Gemini AI. Get personalized career guidance through intelligent conversations with an AI counselor.

## ✨ Features

- 🤖 **AI-Powered Counseling**: Professional career guidance using Google Gemini AI
- 💬 **Real-time Chat**: Seamless chat interface with typing indicators and message history
- 📝 **Draft Sessions**: Start conversations immediately - sessions only save when you send your first message
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 💾 **Persistent History**: All conversations are saved and can be resumed anytime
- 🎨 **Modern UI**: Clean, professional interface with dark/light mode support
- 🔄 **Session Management**: Create, rename, delete, and paginate through chat sessions
- 🏗️ **Sidebar Navigation**: Traditional AI chat app layout with full session management
- ⚡ **Real-time Indicators**: Typing detection and AI thinking phase indicators
- 🌙 **Default Dark Mode**: Beautiful dark theme as default with light mode option

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Backend**: tRPC, Prisma ORM, Neon PostgreSQL
- **AI**: Google Gemini AI (@ai-sdk/google)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Theme**: next-themes for dark/light mode
- **UI Components**: Radix UI primitives
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon PostgreSQL database
- Google AI Studio API key (for Gemini)
- NextAuth.js configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your-neon-database-url"

# AI Service (Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-api-key"

# Authentication (NextAuth.js)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Add your preferred OAuth providers
# GOOGLE_CLIENT_ID="your-google-client-id"
# GOOGLE_CLIENT_SECRET="your-google-client-secret"
# GITHUB_ID="your-github-client-id"
# GITHUB_SECRET="your-github-client-secret"
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd career-counseling-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Open Prisma Studio to manage data
npm run db:studio
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Usage

1. **Sign Up/Sign In**: Create an account or sign in to access the chat interface
2. **Start New Chat**: Click "New Chat" to create a draft session
3. **Begin Conversation**: Type your first message - the session will be automatically saved with a smart title
4. **Get AI Guidance**: Ask about career transitions, resume tips, interview prep, salary negotiation, and more
5. **Manage Sessions**:
   - Rename sessions by clicking the menu (⋯) next to each chat
   - Delete unwanted conversations
   - Browse all sessions with pagination
6. **Session Navigation**: Click any session in the sidebar to continue previous conversations
7. **Theme Toggle**: Switch between dark and light modes using the theme toggle in the sidebar

## 📡 API Routes

- `GET/POST /api/trpc/[trpc]` - tRPC API endpoints for all backend functionality
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints

## 🗃️ Database Schema

### Sessions Table
- `id` (String) - Primary key
- `title` (String) - Session title (auto-generated from first message)
- `userId` (String) - User identifier
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Messages Table
- `id` (String) - Primary key
- `sessionId` (String) - Foreign key to sessions
- `content` (String) - Message content
- `role` (String) - 'user' or 'assistant'
- `createdAt` (DateTime) - Creation timestamp

### Key Features
- **Draft Sessions**: Temporary sessions before first message
- **Auto Titles**: Session titles generated from first 4 words of user's message
- **Pagination**: Efficient session browsing with configurable page sizes
- **Real-time Updates**: Instant UI updates with optimistic updates

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 🚧 Development Features

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

### Key Components
- **ChatInterface**: Main chat component with markdown support
- **ChatSidebar**: Session management and navigation
- **UserMenu**: Simple authentication menu
- **ThemeToggle**: Dark/light mode switcher
- **TypingIndicator**: Real-time typing feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.
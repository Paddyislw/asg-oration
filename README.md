# Career Counseling AI

A modern AI-powered career counseling application built with Next.js, tRPC, and OpenAI. Get personalized career guidance through intelligent conversations with an AI counselor.

## Features

- 🤖 **AI-Powered Counseling**: Professional career guidance using OpenAI's GPT-4o model
- 💬 **Real-time Chat**: Seamless chat interface with message history
- 🔐 **Secure Authentication**: User authentication powered by Stack Auth
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 💾 **Persistent History**: All conversations are saved and can be resumed
- 🎨 **Modern UI**: Clean, professional interface with dark/light mode support

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Backend**: tRPC, Neon PostgreSQL
- **AI**: OpenAI GPT-4o
- **Authentication**: Stack Auth
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Neon database
- OpenAI API key
- Stack Auth project

### Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Database
DATABASE_URL="your-neon-database-url"

# AI Service
OPENAI_API_KEY="your-openai-api-key"

# Authentication (Stack Auth)
NEXT_PUBLIC_STACK_PROJECT_ID="your-stack-project-id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your-stack-publishable-key"
STACK_SECRET_SERVER_KEY="your-stack-secret-key"
\`\`\`

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd career-counseling-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up the database:
\`\`\`bash
# Run the database migration script
npm run db:setup
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up/Sign In**: Create an account or sign in to access the chat interface
2. **Start Chatting**: Begin a conversation with the AI career counselor
3. **Get Guidance**: Ask questions about career transitions, resume tips, interview preparation, salary negotiation, and more
4. **Manage Sessions**: Create multiple chat sessions for different topics
5. **Review History**: Access your previous conversations anytime

## API Routes

- `GET/POST /api/trpc/[trpc]` - tRPC API endpoints for all backend functionality

## Database Schema

### chat_sessions
- `id` (UUID) - Primary key
- `title` (VARCHAR) - Session title
- `user_id` (VARCHAR) - User identifier
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### messages
- `id` (UUID) - Primary key
- `session_id` (UUID) - Foreign key to chat_sessions
- `content` (TEXT) - Message content
- `role` (VARCHAR) - 'user' or 'assistant'
- `metadata` (JSONB) - Additional message data
- `created_at` (TIMESTAMP) - Creation timestamp

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Start the production server:
\`\`\`bash
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.
# asg-oration
# asg-oration

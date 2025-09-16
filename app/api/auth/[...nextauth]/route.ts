import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import { userQueries } from "@/lib/db"

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists in your existing users table
          const existingUser = await userQueries.getByEmail(user.email!)

          if (!existingUser) {
            // Create new user in your existing users table
            await userQueries.create(user.email!, user.name || undefined, "oauth_user")
          } else {
            // Update existing user's display name if needed
            await userQueries.update(existingUser.id, {
              displayName: user.name || undefined,
            })
          }
        } catch (error) {
          console.error("Error saving user to database:", error)
          // Don't fail the sign-in if database save fails
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        // Get the user ID from your existing users table
        try {
          const dbUser = await userQueries.getByEmail(session.user.email!)
          if (dbUser) {
            session.user.id = dbUser.id
          }
        } catch (error) {
          console.error("Error getting user ID:", error)
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
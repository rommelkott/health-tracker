import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { userAgent } from "next/server.js";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    },
  },
  events: {
    async signIn({ isNewUser, user }) {
      // Default user profile for new users
      const userProfile = {
        description: "Hi, I'm a new user.",
      };

      // If the user is new, update the user's profile
      if (isNewUser) {
        const addProfile = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            profile: {
              create: {
                ...userProfile,
              }
            }
          }
        });
      }
    },
  },

  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);

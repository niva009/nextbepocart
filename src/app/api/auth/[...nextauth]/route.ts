import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        token.id = profile?.sub; // Use Google's unique user ID
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // Attach token ID to the session
      return session;
    },
  },
});

export { handler as GET, handler as POST };

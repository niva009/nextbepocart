// src/auth.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Add the access token to the JWT token
            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token; // Include ID token if available
            }
            return token;
        },
        async session({ session, token }) {
            // Add access and ID tokens to the session object
            session.accessToken = token.accessToken;
            session.idToken = token.idToken;
            return session;
        },
    },
};

// Export NextAuth handlers for GET and POST requests
const authHandler = NextAuth(options);
export { authHandler as GET, authHandler as POST };
export default authHandler;
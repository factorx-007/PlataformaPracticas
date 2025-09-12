import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "17516254924-cr12m25jo6bg8q88h3mm5h13fl3vtt6u.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
      authorization: {
        params: {
          scope: "openid email profile"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        // Solo almacenar los datos de Google, no enviar al backend aún
        user.googleData = {
          email: user.email,
          name: user.name,
          image: user.image,
          googleId: user.id,
          credential: account.id_token
        };
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user?.googleData) {
        token.googleData = user.googleData;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.googleData) {
        session.user.googleData = token.googleData;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || "protalent-nextauth-secret-key-2025-muy-larga-y-segura",
})

export { handler as GET, handler as POST }

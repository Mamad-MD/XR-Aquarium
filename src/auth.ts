// DESTINATION: src/auth.ts (replace the whole file)
import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";


// خطای اختصاصی برای کاربر مسدود‌شده — کد "banned" توی query string صفحه لاگین
// به‌صورت ?error=banned ظاهر می‌شود تا بتوان پیام اختصاصی نشان داد
class BannedUserError extends CredentialsSignin {
  code = "banned";
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Student ID", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) return null;

        // کاربر مسدود شده حق ورود ندارد — خطای اختصاصی throw می‌شود
        // تا صفحه لاگین بتواند پیام «دسترسی شما محدود شده» را نشان دهد
        if (user.isBanned) {
          console.log("try for enter by role:", user.email);
          throw new BannedUserError();
        }

        console.log("user loged in with role of", user.role);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string; // Add role here
  }

  interface Session {
    user: User; // Ensure session.user has the correct type
  }

  interface JWT {
    id: string;
    role: string;
  }
}

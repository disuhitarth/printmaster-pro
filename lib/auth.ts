import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
// Define UserRole as string union type since SQLite doesn't support enums
type UserRole = 'ADMIN' | 'CSR' | 'PRODUCTION_LEAD' | 'PRINTER' | 'PACKER' | 'QC' | 'VIEWER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          })
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login?error=true',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Helper functions for role-based access control
export const PERMISSIONS = {
  'create-job': ['ADMIN', 'CSR'],
  'edit-job': ['ADMIN', 'CSR', 'PRODUCTION_LEAD'],
  'delete-job': ['ADMIN'],
  'approve-proof': ['ADMIN', 'CSR'],
  'start-press': ['ADMIN', 'PRODUCTION_LEAD', 'PRINTER'],
  'qc-pass': ['ADMIN', 'QC', 'PRODUCTION_LEAD'],
  'ship-job': ['ADMIN', 'PACKER'],
  'view-reports': ['ADMIN', 'PRODUCTION_LEAD'],
  'admin-panel': ['ADMIN'],
  'manage-users': ['ADMIN'],
} as const;

export function hasPermission(userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(userRole);
}

export function getUserPermissions(role: UserRole) {
  const permissions: string[] = [];
  Object.entries(PERMISSIONS).forEach(([permission, roles]) => {
    if (roles.includes(role)) {
      permissions.push(permission);
    }
  });
  return permissions;
}
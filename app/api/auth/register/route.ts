import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
// Define UserRole as string union type since SQLite doesn't support enums
type UserRole = 'ADMIN' | 'CSR' | 'PRODUCTION_LEAD' | 'PRINTER' | 'PACKER' | 'QC' | 'VIEWER';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company, role } = await request.json();

    if (!name || !email || !password || !company || !role) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const validRoles: UserRole[] = ['ADMIN', 'CSR', 'PRODUCTION_LEAD', 'PRINTER', 'PACKER', 'QC', 'VIEWER'];
    if (!validRoles.includes(role as UserRole)) {
      return NextResponse.json(
        { message: 'Invalid role specified' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        hashedPassword,
        role,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
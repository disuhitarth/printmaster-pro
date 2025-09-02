import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'sarah.m@company.com' },
      update: {},
      create: {
        email: 'sarah.m@company.com',
        name: 'Sarah M.',
        role: 'CSR',
      },
    }),
    prisma.user.upsert({
      where: { email: 'john.d@company.com' },
      update: {},
      create: {
        email: 'john.d@company.com',
        name: 'John D.',
        role: 'CSR',
      },
    }),
    prisma.user.upsert({
      where: { email: 'mike.r@company.com' },
      update: {},
      create: {
        email: 'mike.r@company.com',
        name: 'Mike R.',
        role: 'PRINTER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@company.com' },
      update: {},
      create: {
        email: 'admin@company.com',
        name: 'Admin User',
        role: 'ADMIN',
      },
    }),
  ]);

  console.log('👥 Created users');

  // Create clients
  const clients = await Promise.all([
    prisma.client.upsert({
      where: { id: 'client-1' },
      update: {},
      create: {
        id: 'client-1',
        name: 'Acme Corp',
        contacts: [
          { name: 'John Smith', email: 'john@acme.com', phone: '555-0101' },
        ],
      },
    }),
    prisma.client.upsert({
      where: { id: 'client-2' },
      update: {},
      create: {
        id: 'client-2',
        name: 'Tech Startup Inc',
        contacts: [
          { name: 'Jane Doe', email: 'jane@techstartup.com', phone: '555-0102' },
        ],
      },
    }),
    prisma.client.upsert({
      where: { id: 'client-3' },
      update: {},
      create: {
        id: 'client-3',
        name: 'Local Brewery',
        contacts: [
          { name: 'Bob Miller', email: 'bob@localbrewery.com', phone: '555-0103' },
        ],
      },
    }),
    prisma.client.upsert({
      where: { id: 'client-4' },
      update: {},
      create: {
        id: 'client-4',
        name: 'University Bookstore',
        contacts: [
          { name: 'Dr. Wilson', email: 'wilson@university.edu', phone: '555-0104' },
        ],
      },
    }),
    prisma.client.upsert({
      where: { id: 'client-5' },
      update: {},
      create: {
        id: 'client-5',
        name: 'Event Organizers LLC',
        contacts: [
          { name: 'Lisa Chen', email: 'lisa@events.com', phone: '555-0105' },
        ],
      },
    }),
  ]);

  console.log('🏢 Created clients');

  // Create jobs with various statuses
  const jobs = await Promise.all([
    // Rush job with pending proof
    prisma.job.upsert({
      where: { jobCode: 'JOB-001001' },
      update: {},
      create: {
        jobCode: 'JOB-001001',
        oeNumber: 'OE-1029',
        clientId: clients[0].id,
        csrId: users[0].id,
        shipDate: new Date('2024-12-20'),
        rush24hr: true,
        needPhoto: false,
        productId: 'G500 Black',
        qtyTotal: 120,
        courier: 'UPS Ground',
        notes: 'Client requested exact Pantone match for brand colors. Rush order - prioritize for tomorrow morning shipment.',
        status: 'NEW',
        sizeBreakdown: { S: 20, M: 40, L: 40, XL: 20 },
        locations: {
          create: [
            {
              name: 'Front',
              widthIn: 12,
              heightIn: 10,
              colors: 3,
              pms: ['186C', 'Black', 'Cool Gray 6C'],
              underbase: true,
              halftoneLpi: 55,
              printOrder: 1,
              placementNote: 'Center, 2" below collar',
            },
          ],
        },
        proofs: {
          create: [
            {
              version: 1,
              status: 'PENDING',
              fileUrl: '/mockups/job-1001-v1.pdf',
              imageUrl: '/mockups/job-1001-v1-thumb.png',
            },
          ],
        },
      },
    }),

    // Regular job needing photo
    prisma.job.upsert({
      where: { jobCode: 'JOB-001002' },
      update: {},
      create: {
        jobCode: 'JOB-001002',
        oeNumber: 'OE-1030',
        clientId: clients[1].id,
        csrId: users[1].id,
        shipDate: new Date('2024-12-23'),
        rush24hr: false,
        needPhoto: true,
        productId: 'Next Level 3600',
        qtyTotal: 250,
        courier: 'FedEx',
        status: 'NEW',
        sizeBreakdown: { S: 50, M: 100, L: 75, XL: 25 },
        locations: {
          create: [
            {
              name: 'Front',
              widthIn: 8,
              heightIn: 6,
              colors: 1,
              pms: ['306C'],
              underbase: false,
              halftoneLpi: 65,
              printOrder: 1,
              placementNote: 'Left chest, 4" from shoulder seam',
            },
          ],
        },
      },
    }),

    // Late job with approved proof
    prisma.job.upsert({
      where: { jobCode: 'JOB-001003' },
      update: {},
      create: {
        jobCode: 'JOB-001003',
        oeNumber: 'OE-1028',
        clientId: clients[2].id,
        csrId: users[0].id,
        shipDate: new Date('2024-12-18'), // Late
        rush24hr: false,
        needPhoto: false,
        productId: 'Bella Canvas 3001',
        qtyTotal: 75,
        status: 'NEW',
        sizeBreakdown: { S: 15, M: 30, L: 20, XL: 10 },
        locations: {
          create: [
            {
              name: 'Front',
              widthIn: 10,
              heightIn: 8,
              colors: 2,
              pms: ['Black', 'White'],
              underbase: false,
              halftoneLpi: 55,
              printOrder: 1,
              placementNote: 'Center chest',
            },
          ],
        },
        proofs: {
          create: [
            {
              version: 1,
              status: 'APPROVED',
              approvedAt: new Date('2024-12-15'),
              approvedBy: 'Client Contact',
              approverEmail: 'bob@localbrewery.com',
              fileUrl: '/mockups/job-1003-v1.pdf',
              imageUrl: '/mockups/job-1003-v1-thumb.png',
            },
          ],
        },
      },
    }),

    // Job waiting for artwork
    prisma.job.upsert({
      where: { jobCode: 'JOB-001004' },
      update: {},
      create: {
        jobCode: 'JOB-001004',
        oeNumber: 'OE-1031',
        clientId: clients[4].id,
        csrId: users[1].id,
        shipDate: new Date('2024-12-27'),
        rush24hr: false,
        needPhoto: false,
        productId: 'Tank Tops',
        qtyTotal: 50,
        status: 'WAITING_ARTWORK',
        sizeBreakdown: { S: 10, M: 20, L: 15, XL: 5 },
        locations: {
          create: [
            {
              name: 'Front',
              widthIn: 12,
              heightIn: 14,
              colors: 4,
              pms: ['Black', 'White', 'Red', 'Blue'],
              underbase: true,
              halftoneLpi: 55,
              printOrder: 1,
              placementNote: 'Full front print',
            },
          ],
        },
      },
    }),

    // Job ready for press
    prisma.job.upsert({
      where: { jobCode: 'JOB-001005' },
      update: {},
      create: {
        jobCode: 'JOB-001005',
        oeNumber: 'OE-1025',
        clientId: clients[3].id,
        csrId: users[0].id,
        shipDate: new Date('2024-12-22'),
        rush24hr: false,
        needPhoto: false,
        productId: 'Gildan 5000',
        qtyTotal: 500,
        status: 'READY_FOR_PRESS',
        sizeBreakdown: { S: 75, M: 200, L: 175, XL: 50 },
        locations: {
          create: [
            {
              name: 'Front',
              widthIn: 10,
              heightIn: 6,
              colors: 2,
              pms: ['Navy', 'White'],
              underbase: false,
              halftoneLpi: 65,
              printOrder: 1,
              placementNote: 'Center, 3" below collar',
            },
          ],
        },
        proofs: {
          create: [
            {
              version: 1,
              status: 'APPROVED',
              approvedAt: new Date('2024-12-19'),
              approvedBy: 'Dr. Wilson',
              approverEmail: 'wilson@university.edu',
              fileUrl: '/mockups/job-1005-v1.pdf',
              imageUrl: '/mockups/job-1005-v1-thumb.png',
            },
          ],
        },
        screens: {
          create: [
            {
              screenId: 'SCR-156-001',
              mesh: 156,
              tensionN: 25.0,
              emulsion: 'Dual Cure',
              exposureSec: 180,
              reclaimStatus: 'READY',
            },
            {
              screenId: 'SCR-156-002',
              mesh: 156,
              tensionN: 24.5,
              emulsion: 'Dual Cure',
              exposureSec: 180,
              reclaimStatus: 'READY',
            },
          ],
        },
        inks: {
          create: [
            {
              name: 'Navy',
              pms: 'Navy',
              type: 'plastisol',
              flashTempF: 260,
              cureTempF: 320,
            },
            {
              name: 'White',
              pms: 'White',
              type: 'plastisol',
              flashTempF: 240,
              cureTempF: 300,
            },
          ],
        },
      },
    }),

    // Job in press
    prisma.job.upsert({
      where: { jobCode: 'JOB-001006' },
      update: {},
      create: {
        jobCode: 'JOB-001006',
        oeNumber: 'OE-1024',
        clientId: clients[4].id,
        csrId: users[2].id,
        shipDate: new Date('2024-12-21'),
        rush24hr: false,
        needPhoto: false,
        productId: 'Aprons',
        qtyTotal: 300,
        status: 'IN_PRESS',
        sizeBreakdown: { 'One Size': 300 },
        locations: {
          create: [
            {
              name: 'Front',
              widthIn: 8,
              heightIn: 8,
              colors: 1,
              pms: ['Black'],
              underbase: false,
              halftoneLpi: 65,
              printOrder: 1,
              placementNote: 'Center chest area',
            },
          ],
        },
        proofs: {
          create: [
            {
              version: 1,
              status: 'APPROVED',
              approvedAt: new Date('2024-12-18'),
              approvedBy: 'Lisa Chen',
              approverEmail: 'lisa@events.com',
              fileUrl: '/mockups/job-1006-v1.pdf',
              imageUrl: '/mockups/job-1006-v1-thumb.png',
            },
          ],
        },
        pressSetup: {
          create: {
            pressId: 'Manual-1',
            platen: '16x20',
            squeegeeDurometer: 70,
            strokes: 2,
            offContact: 0.125,
            flashTimeMs: 3000,
            testPrintPass: true,
          },
        },
      },
    }),

    // Job packed and ready to ship
    prisma.job.upsert({
      where: { jobCode: 'JOB-001007' },
      update: {},
      create: {
        jobCode: 'JOB-001007',
        oeNumber: 'OE-1023',
        clientId: clients[4].id,
        csrId: users[0].id,
        shipDate: new Date('2024-12-20'),
        rush24hr: false,
        needPhoto: false,
        productId: 'Hoodies',
        qtyTotal: 150,
        courier: 'UPS Ground',
        status: 'PACKED',
        sizeBreakdown: { S: 25, M: 50, L: 50, XL: 25 },
        locations: {
          create: [
            {
              name: 'Front',
              widthIn: 12,
              heightIn: 10,
              colors: 3,
              pms: ['Black', 'White', 'Gold'],
              underbase: true,
              halftoneLpi: 55,
              printOrder: 1,
              placementNote: 'Center, 4" below collar',
            },
          ],
        },
        proofs: {
          create: [
            {
              version: 1,
              status: 'APPROVED',
              approvedAt: new Date('2024-12-16'),
              approvedBy: 'Lisa Chen',
              approverEmail: 'lisa@events.com',
              fileUrl: '/mockups/job-1007-v1.pdf',
              imageUrl: '/mockups/job-1007-v1-thumb.png',
            },
          ],
        },
        qcRecords: {
          create: [
            {
              exitTempF: 315,
              passed: true,
              defects: 1,
              reasons: ['Minor ink smudge'],
              photoUrl: '/qc-photos/job-1007-qc.jpg',
            },
          ],
        },
      },
    }),
  ]);

  console.log('📋 Created jobs');

  // Create some activities
  for (const job of jobs) {
    await prisma.activity.create({
      data: {
        jobId: job.id,
        userId: job.csrId,
        action: 'JOB_CREATED',
        meta: { jobCode: job.jobCode },
      },
    });
  }

  console.log('📝 Created activities');

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const stockLevel = searchParams.get('stockLevel');
    const search = searchParams.get('search');

    const where: any = {};
    
    // Status filter
    if (status && status !== 'all') {
      where.status = status;
    }
    
    // Category filter
    if (category && category !== 'all') {
      where.categoryId = category;
    }
    
    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ];
    }

    let items = await prisma.inventoryItem.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: {
            transactions: true,
            usageRecords: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Apply stock level filter after fetching (since it's computed)
    if (stockLevel && stockLevel !== 'all') {
      if (stockLevel === 'low') {
        items = items.filter(item => item.currentStock <= item.minStock && item.currentStock > 0);
      } else if (stockLevel === 'out') {
        items = items.filter(item => item.currentStock === 0);
      } else if (stockLevel === 'good') {
        items = items.filter(item => item.currentStock > item.minStock);
      }
    }

    // Calculate inventory statistics
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
    const lowStockItems = items.filter(item => item.currentStock <= item.minStock && item.currentStock > 0).length;
    const outOfStockItems = items.filter(item => item.currentStock === 0).length;
    
    // Get categories count
    const categories = await prisma.inventoryCategory.count();

    const stats = {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      categories
    };

    return NextResponse.json({ 
      items: items.map(item => ({
        ...item,
        tags: item.tags ? JSON.parse(item.tags) : []
      })), 
      stats 
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.sku || !body.categoryId) {
      return NextResponse.json(
        { error: 'Name, SKU, and category are required' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { sku: body.sku }
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Item with this SKU already exists' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.inventoryCategory.findUnique({
      where: { id: body.categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const item = await prisma.inventoryItem.create({
      data: {
        sku: body.sku,
        name: body.name,
        description: body.description || null,
        categoryId: body.categoryId,
        currentStock: parseInt(body.currentStock) || 0,
        minStock: parseInt(body.minStock) || 0,
        maxStock: body.maxStock ? parseInt(body.maxStock) : null,
        reorderPoint: parseInt(body.reorderPoint) || 0,
        unitCost: parseFloat(body.unitCost) || 0,
        unitPrice: body.unitPrice ? parseFloat(body.unitPrice) : null,
        unit: body.unit,
        size: body.size || null,
        color: body.color || null,
        brand: body.brand || null,
        supplier: body.supplier || null,
        location: body.location || null,
        barcode: body.barcode || null,
        status: body.status || 'active',
        tags: body.tags ? JSON.stringify(body.tags) : null,
        notes: body.notes || null,
        image: body.image || null,
      },
      include: {
        category: true
      }
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}
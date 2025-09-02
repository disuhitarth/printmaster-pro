import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        transactions: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Latest 10 transactions
        },
        usageRecords: {
          include: {
            user: {
              select: { name: true, email: true }
            },
            job: {
              select: { jobCode: true, oeNumber: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Latest 10 usage records
        }
      }
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Parse tags if they exist
    const itemWithParsedTags = {
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : []
    };

    return NextResponse.json({ item: itemWithParsedTags });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Check if item exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id: params.id }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if SKU is being changed and if it's already taken by another item
    if (body.sku && body.sku !== existingItem.sku) {
      const skuTaken = await prisma.inventoryItem.findFirst({
        where: { 
          sku: body.sku,
          id: { not: params.id }
        }
      });

      if (skuTaken) {
        return NextResponse.json(
          { error: 'SKU already exists for another item' },
          { status: 400 }
        );
      }
    }

    // Verify category exists if being changed
    if (body.categoryId && body.categoryId !== existingItem.categoryId) {
      const category = await prisma.inventoryCategory.findUnique({
        where: { id: body.categoryId }
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Invalid category ID' },
          { status: 400 }
        );
      }
    }

    const item = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        sku: body.sku || existingItem.sku,
        name: body.name || existingItem.name,
        description: body.description !== undefined ? body.description : existingItem.description,
        categoryId: body.categoryId || existingItem.categoryId,
        currentStock: body.currentStock !== undefined ? parseInt(body.currentStock) : existingItem.currentStock,
        minStock: body.minStock !== undefined ? parseInt(body.minStock) : existingItem.minStock,
        maxStock: body.maxStock !== undefined ? (body.maxStock ? parseInt(body.maxStock) : null) : existingItem.maxStock,
        reorderPoint: body.reorderPoint !== undefined ? parseInt(body.reorderPoint) : existingItem.reorderPoint,
        unitCost: body.unitCost !== undefined ? parseFloat(body.unitCost) : existingItem.unitCost,
        unitPrice: body.unitPrice !== undefined ? (body.unitPrice ? parseFloat(body.unitPrice) : null) : existingItem.unitPrice,
        unit: body.unit || existingItem.unit,
        size: body.size !== undefined ? body.size : existingItem.size,
        color: body.color !== undefined ? body.color : existingItem.color,
        brand: body.brand !== undefined ? body.brand : existingItem.brand,
        supplier: body.supplier !== undefined ? body.supplier : existingItem.supplier,
        location: body.location !== undefined ? body.location : existingItem.location,
        barcode: body.barcode !== undefined ? body.barcode : existingItem.barcode,
        status: body.status || existingItem.status,
        tags: body.tags !== undefined ? (body.tags ? JSON.stringify(body.tags) : null) : existingItem.tags,
        notes: body.notes !== undefined ? body.notes : existingItem.notes,
        image: body.image !== undefined ? body.image : existingItem.image,
      },
      include: {
        category: true
      }
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if item exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id: params.id },
      include: {
        transactions: true,
        usageRecords: true
      }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if item has transactions or usage records
    if (existingItem.transactions.length > 0 || existingItem.usageRecords.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete item with transaction history. Consider marking it as discontinued instead.' },
        { status: 400 }
      );
    }

    await prisma.inventoryItem.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to delete inventory item' },
      { status: 500 }
    );
  }
}
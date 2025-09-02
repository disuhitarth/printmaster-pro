import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedInventory() {
  console.log('Seeding inventory data...');

  try {
    // Create inventory categories
    const categories = [
      {
        name: 'Garments',
        description: 'T-shirts, hoodies, and other apparel for printing',
        color: '#3B82F6',
        icon: 'Package'
      },
      {
        name: 'Inks',
        description: 'Plastisol, water-based, and specialty inks',
        color: '#EF4444',
        icon: 'Palette'
      },
      {
        name: 'Screens',
        description: 'Aluminum frames with various mesh counts',
        color: '#8B5CF6',
        icon: 'Grid3X3'
      },
      {
        name: 'Tools',
        description: 'Squeegees, spatulas, and printing tools',
        color: '#F59E0B',
        icon: 'Wrench'
      },
      {
        name: 'Supplies',
        description: 'Tape, cleaners, and consumable materials',
        color: '#10B981',
        icon: 'Box'
      },
      {
        name: 'Equipment',
        description: 'Presses, dryers, and machinery',
        color: '#6366F1',
        icon: 'Settings'
      }
    ];

    const createdCategories = await Promise.all(
      categories.map(category => 
        prisma.inventoryCategory.upsert({
          where: { name: category.name },
          update: {},
          create: category
        })
      )
    );

    console.log(`Created ${createdCategories.length} categories`);

    // Create sample inventory items
    const garmentCategory = createdCategories.find(c => c.name === 'Garments');
    const inkCategory = createdCategories.find(c => c.name === 'Inks');
    const screenCategory = createdCategories.find(c => c.name === 'Screens');
    const toolCategory = createdCategories.find(c => c.name === 'Tools');
    const suppliesCategory = createdCategories.find(c => c.name === 'Supplies');

    if (!garmentCategory || !inkCategory || !screenCategory || !toolCategory || !suppliesCategory) {
      throw new Error('Failed to create required categories');
    }

    const items = [
      // Garments
      {
        sku: 'TSHIRT-BLK-S',
        name: 'Black T-Shirt Small',
        description: 'Premium cotton t-shirt for screen printing',
        categoryId: garmentCategory.id,
        currentStock: 200,
        minStock: 50,
        maxStock: 500,
        reorderPoint: 75,
        unitCost: 4.50,
        unitPrice: 12.99,
        unit: 'pcs',
        size: 'S',
        color: 'Black',
        brand: 'Gildan',
        supplier: 'Textile Wholesale Inc',
        location: 'A-1-01',
        status: 'active'
      },
      {
        sku: 'TSHIRT-BLK-M',
        name: 'Black T-Shirt Medium',
        description: 'Premium cotton t-shirt for screen printing',
        categoryId: garmentCategory.id,
        currentStock: 150,
        minStock: 50,
        maxStock: 500,
        reorderPoint: 75,
        unitCost: 4.99,
        unitPrice: 12.99,
        unit: 'pcs',
        size: 'M',
        color: 'Black',
        brand: 'Gildan',
        supplier: 'Textile Wholesale Inc',
        location: 'A-1-01',
        status: 'active'
      },
      {
        sku: 'TSHIRT-WHT-L',
        name: 'White T-Shirt Large',
        description: 'Premium cotton t-shirt for screen printing',
        categoryId: garmentCategory.id,
        currentStock: 75,
        minStock: 50,
        maxStock: 500,
        reorderPoint: 75,
        unitCost: 4.99,
        unitPrice: 12.99,
        unit: 'pcs',
        size: 'L',
        color: 'White',
        brand: 'Gildan',
        supplier: 'Textile Wholesale Inc',
        location: 'A-1-02',
        status: 'active'
      },
      {
        sku: 'HOODIE-GRY-XL',
        name: 'Gray Hoodie Extra Large',
        description: 'Premium cotton blend hoodie',
        categoryId: garmentCategory.id,
        currentStock: 30,
        minStock: 20,
        maxStock: 100,
        reorderPoint: 30,
        unitCost: 18.99,
        unitPrice: 39.99,
        unit: 'pcs',
        size: 'XL',
        color: 'Gray',
        brand: 'Independent Trading Co',
        supplier: 'Apparel Distributors',
        location: 'A-2-01',
        status: 'active'
      },

      // Inks
      {
        sku: 'INK-PLAST-RED',
        name: 'Red Plastisol Ink',
        description: 'High-quality red plastisol ink for screen printing',
        categoryId: inkCategory.id,
        currentStock: 25,
        minStock: 30,
        maxStock: 100,
        reorderPoint: 40,
        unitCost: 18.50,
        unit: 'lbs',
        color: 'Red',
        supplier: 'Ink Solutions Ltd',
        location: 'B-2-03',
        status: 'active'
      },
      {
        sku: 'INK-PLAST-BLU',
        name: 'Blue Plastisol Ink',
        description: 'High-quality blue plastisol ink for screen printing',
        categoryId: inkCategory.id,
        currentStock: 40,
        minStock: 30,
        maxStock: 100,
        reorderPoint: 40,
        unitCost: 18.50,
        unit: 'lbs',
        color: 'Blue',
        supplier: 'Ink Solutions Ltd',
        location: 'B-2-04',
        status: 'active'
      },
      {
        sku: 'INK-WB-BLACK',
        name: 'Black Water-Based Ink',
        description: 'Eco-friendly water-based black ink',
        categoryId: inkCategory.id,
        currentStock: 15,
        minStock: 20,
        maxStock: 80,
        reorderPoint: 25,
        unitCost: 22.00,
        unit: 'lbs',
        color: 'Black',
        supplier: 'Green Ink Co',
        location: 'B-1-01',
        status: 'active'
      },

      // Screens
      {
        sku: 'SCREEN-156',
        name: '156 Mesh Screen',
        description: '20" x 24" aluminum screen with 156 mesh',
        categoryId: screenCategory.id,
        currentStock: 8,
        minStock: 10,
        maxStock: 50,
        reorderPoint: 15,
        unitCost: 35.00,
        unit: 'pcs',
        supplier: 'Screen Supply Co',
        location: 'C-1-05',
        status: 'active'
      },
      {
        sku: 'SCREEN-230',
        name: '230 Mesh Screen',
        description: '20" x 24" aluminum screen with 230 mesh',
        categoryId: screenCategory.id,
        currentStock: 12,
        minStock: 8,
        maxStock: 40,
        reorderPoint: 12,
        unitCost: 35.00,
        unit: 'pcs',
        supplier: 'Screen Supply Co',
        location: 'C-1-06',
        status: 'active'
      },

      // Tools
      {
        sku: 'SQUEEGEE-70D',
        name: '70 Durometer Squeegee',
        description: 'Professional grade squeegee blade',
        categoryId: toolCategory.id,
        currentStock: 0,
        minStock: 5,
        maxStock: 25,
        reorderPoint: 8,
        unitCost: 12.75,
        unit: 'pcs',
        supplier: 'Tool Masters',
        location: 'D-3-02',
        status: 'active'
      },
      {
        sku: 'SQUEEGEE-60D',
        name: '60 Durometer Squeegee',
        description: 'Soft squeegee for delicate prints',
        categoryId: toolCategory.id,
        currentStock: 3,
        minStock: 5,
        maxStock: 25,
        reorderPoint: 8,
        unitCost: 12.75,
        unit: 'pcs',
        supplier: 'Tool Masters',
        location: 'D-3-01',
        status: 'active'
      },

      // Supplies
      {
        sku: 'TAPE-SCREEN',
        name: 'Screen Printing Tape',
        description: 'Professional grade screen tape',
        categoryId: suppliesCategory.id,
        currentStock: 24,
        minStock: 12,
        maxStock: 60,
        reorderPoint: 18,
        unitCost: 8.99,
        unit: 'rolls',
        supplier: 'Supply Pro',
        location: 'E-1-01',
        status: 'active'
      },
      {
        sku: 'CLEANER-EMU',
        name: 'Emulsion Remover',
        description: 'Screen cleaning chemical for emulsion removal',
        categoryId: suppliesCategory.id,
        currentStock: 6,
        minStock: 8,
        maxStock: 30,
        reorderPoint: 12,
        unitCost: 24.50,
        unit: 'gallons',
        supplier: 'Chemical Solutions',
        location: 'E-3-01',
        status: 'active'
      }
    ];

    const createdItems = await Promise.all(
      items.map(item => 
        prisma.inventoryItem.upsert({
          where: { sku: item.sku },
          update: {},
          create: item
        })
      )
    );

    console.log(`Created ${createdItems.length} inventory items`);

    console.log('Inventory seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding inventory data:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedInventory()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedInventory;
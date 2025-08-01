import { NextRequest, NextResponse } from 'next/server';
import { UpdateProductCategoryRequest } from '@/data/adminTypes';

// Demo data for testing
const demoCategories = [
  {
    id: '1',
    name: 'Truck Seats',
    description: 'High-quality seats for trucks and commercial vehicles',
    slug: 'truck-seats',
    isActive: true,
    sortOrder: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    children: [
      {
        id: '2',
        name: 'Heavy Duty',
        description: 'Heavy duty truck seats for long-haul operations',
        slug: 'heavy-duty',
        parentId: '1',
        isActive: true,
        sortOrder: 1,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: '3',
        name: 'Medium Duty',
        description: 'Medium duty truck seats for local deliveries',
        slug: 'medium-duty',
        parentId: '1',
        isActive: true,
        sortOrder: 2,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    ],
  },
  {
    id: '4',
    name: 'Accessories',
    description: 'Seat accessories and replacement parts',
    slug: 'accessories',
    isActive: true,
    sortOrder: 2,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '5',
    name: 'Custom Seats',
    description: 'Custom designed seats for special applications',
    slug: 'custom-seats',
    isActive: true,
    sortOrder: 3,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

// Flatten categories for easier searching
const flattenedCategories = demoCategories.reduce((acc: any[], category) => {
  acc.push(category);
  if (category.children) {
    acc.push(...category.children);
  }
  return acc;
}, []);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    
    // TODO: Replace with your actual database query
    // Example: const category = await prisma.productCategory.findUnique({ where: { id }, include: { children: true } });
    
    const category = demoCategories.find(cat => cat.id === id) || flattenedCategories.find(cat => cat.id === id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateProductCategoryRequest = await request.json();
    
    // TODO: Replace with your actual database update
    // Example: const updatedCategory = await prisma.productCategory.update({ where: { id }, data: body });
    
    const categoryIndex = flattenedCategories.findIndex(cat => cat.id === id);
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Validate slug format if provided
    if (body.slug) {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(body.slug)) {
        return NextResponse.json(
          { success: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
          { status: 400 }
        );
      }

      // Check if slug already exists (excluding current category)
      const existingCategory = flattenedCategories.find(cat => cat.slug === body.slug && cat.id !== id);
      if (existingCategory) {
        return NextResponse.json(
          { success: false, error: 'A category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const updatedCategory = {
      ...flattenedCategories[categoryIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    console.log('Updating category:', updatedCategory);

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // TODO: Replace with your actual database deletion
    // Example: await prisma.productCategory.delete({ where: { id } });
    
    const categoryIndex = flattenedCategories.findIndex(cat => cat.id === id);
    
    if (categoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    console.log('Deleting category:', flattenedCategories[categoryIndex]);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 
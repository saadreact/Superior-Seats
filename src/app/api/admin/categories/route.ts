import { NextRequest, NextResponse } from 'next/server';
import { ProductCategory, CreateProductCategoryRequest } from '@/data/adminTypes';

// Demo data for testing
const demoCategories: ProductCategory[] = [
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

export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with your actual database query
    // Example: const categories = await prisma.productCategory.findMany({ include: { children: true } });
    
    // For demo purposes, return demo data
    return NextResponse.json({
      success: true,
      data: demoCategories,
      message: 'Categories retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateProductCategoryRequest = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Name, description, and slug are required' },
        { status: 400 }
      );
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(body.slug)) {
      return NextResponse.json(
        { success: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = demoCategories.find(cat => cat.slug === body.slug);
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    // TODO: Replace with your actual database creation
    // Example: const newCategory = await prisma.productCategory.create({ data: body });
    
    const newCategory: ProductCategory = {
      id: Date.now().toString(),
      ...body,
      isActive: true,
      sortOrder: body.sortOrder ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Creating category:', newCategory);

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Category created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 
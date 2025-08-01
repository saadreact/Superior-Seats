import { NextRequest, NextResponse } from 'next/server';
import { PriceTier, CreatePriceTierRequest } from '@/data/adminTypes';

// Demo data for testing
const demoPriceTiers: PriceTier[] = [
  {
    id: '1',
    name: 'Wholesale',
    description: 'Wholesale pricing for bulk orders',
    discountPercentage: 25,
    minimumOrderAmount: 1000,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Retail',
    description: 'Standard retail pricing',
    discountPercentage: 0,
    minimumOrderAmount: 0,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    name: 'VIP Customer',
    description: 'Special pricing for VIP customers',
    discountPercentage: 15,
    minimumOrderAmount: 500,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with your actual database query
    // Example: const priceTiers = await prisma.priceTier.findMany();
    
    // For demo purposes, return demo data
    return NextResponse.json({
      success: true,
      data: demoPriceTiers,
      message: 'Price tiers retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching price tiers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price tiers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePriceTierRequest = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      );
    }

    if (body.discountPercentage < 0 || body.discountPercentage > 100) {
      return NextResponse.json(
        { success: false, error: 'Discount percentage must be between 0 and 100' },
        { status: 400 }
      );
    }

    // TODO: Replace with your actual database creation
    // Example: const newPriceTier = await prisma.priceTier.create({ data: body });
    
    const newPriceTier: PriceTier = {
      id: Date.now().toString(),
      ...body,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Creating price tier:', newPriceTier);

    return NextResponse.json({
      success: true,
      data: newPriceTier,
      message: 'Price tier created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating price tier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create price tier' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { UpdatePriceTierRequest } from '@/data/adminTypes';

// Demo data for testing
const demoPriceTiers = [
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // TODO: Replace with your actual database query
    // Example: const priceTier = await prisma.priceTier.findUnique({ where: { id } });
    
    const priceTier = demoPriceTiers.find(tier => tier.id === id);
    
    if (!priceTier) {
      return NextResponse.json(
        { success: false, error: 'Price tier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: priceTier,
      message: 'Price tier retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching price tier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price tier' },
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
    const body: UpdatePriceTierRequest = await request.json();
    
    // TODO: Replace with your actual database update
    // Example: const updatedPriceTier = await prisma.priceTier.update({ where: { id }, data: body });
    
    const priceTierIndex = demoPriceTiers.findIndex(tier => tier.id === id);
    
    if (priceTierIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Price tier not found' },
        { status: 404 }
      );
    }

    // Validate discount percentage if provided
    if (body.discountPercentage !== undefined && (body.discountPercentage < 0 || body.discountPercentage > 100)) {
      return NextResponse.json(
        { success: false, error: 'Discount percentage must be between 0 and 100' },
        { status: 400 }
      );
    }

    const updatedPriceTier = {
      ...demoPriceTiers[priceTierIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    console.log('Updating price tier:', updatedPriceTier);

    return NextResponse.json({
      success: true,
      data: updatedPriceTier,
      message: 'Price tier updated successfully',
    });
  } catch (error) {
    console.error('Error updating price tier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update price tier' },
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
    // Example: await prisma.priceTier.delete({ where: { id } });
    
    const priceTierIndex = demoPriceTiers.findIndex(tier => tier.id === id);
    
    if (priceTierIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Price tier not found' },
        { status: 404 }
      );
    }

    console.log('Deleting price tier:', demoPriceTiers[priceTierIndex]);

    return NextResponse.json({
      success: true,
      message: 'Price tier deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting price tier:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete price tier' },
      { status: 500 }
    );
  }
} 
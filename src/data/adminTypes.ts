export interface PriceTier {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  minimumOrderAmount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  children?: ProductCategory[];
}

export interface CreatePriceTierRequest {
  name: string;
  description: string;
  discountPercentage: number;
  minimumOrderAmount?: number;
}

export interface UpdatePriceTierRequest extends Partial<CreatePriceTierRequest> {
  isActive?: boolean;
}

export interface CreateProductCategoryRequest {
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface UpdateProductCategoryRequest extends Partial<CreateProductCategoryRequest> {
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 
import { apiService } from '@/utils/api';

const api = apiService.api;

// ========== SEAT BASE API SERVICE ==========

export interface SeatBaseImage {
  id: number;
  seat_base_id: number;
  image_path: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_url: string;
}

export interface SeatBase {
  id: number;
  name: string;
  description: string | null;
  color_ids: number[];
  price_tier_ids: number[];
  price_adjustments: Record<string, number>;
  images?: SeatBaseImage[];
  image?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSeatBaseData {
  name: string;
  description?: string;
  color_ids?: number[];
  price_tier_ids?: number[];
  price_adjustments?: Record<string, number>;
}

export interface UpdateSeatBaseData {
  name?: string;
  description?: string;
  color_ids?: number[];
  price_tier_ids?: number[];
  price_adjustments?: Record<string, number>;
}

class SeatBaseApi {
  // Get all seat bases with pagination, search, and sorting
  async getSeatBases(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }) {
    try {
      const response = await api.get('/seat-bases', { params });
      
      // Handle different response structures
      if (response.data && response.data.data) {
        return response.data;
      } else if (response.data) {
        return { data: response.data, meta: response.data.meta || {} };
      }
      return { data: [], meta: {} };
    } catch (error: any) {
      console.error('Error fetching seat bases:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch seat bases');
    }
  }

  // Get single seat base by ID
  async getSeatBase(id: number) {
    try {
      const response = await api.get(`/seat-bases/${id}`);
      return response.data?.data?.seat_base || response.data?.seat_base || response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error fetching seat base:', error);
      if (error.response?.status === 404) {
        throw new Error('Seat base not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch seat base');
    }
  }

  // Create seat base
  async createSeatBase(data: CreateSeatBaseData) {
    try {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        color_ids: data.color_ids || [],
        price_tier_ids: data.price_tier_ids || [],
        price_adjustments: data.price_adjustments || {},
      };

      const response = await api.post('/seat-bases', payload);
      // Return the full response data to handle nested structure properly
      // Response structure: { status, message, data: { message, seat_base: { id, ... } } }
      return response.data;
    } catch (error: any) {
      console.error('Error creating seat base:', error);
      throw new Error(error.response?.data?.message || 'Failed to create seat base');
    }
  }

  // Update seat base
  async updateSeatBase(id: number, data: UpdateSeatBaseData) {
    try {
      const payload: any = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.description !== undefined) payload.description = data.description;
      if (data.color_ids !== undefined) payload.color_ids = data.color_ids;
      if (data.price_tier_ids !== undefined) payload.price_tier_ids = data.price_tier_ids;
      if (data.price_adjustments !== undefined) payload.price_adjustments = data.price_adjustments;

      const response = await api.put(`/seat-bases/${id}`, payload);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error updating seat base:', error);
      if (error.response?.status === 404) {
        throw new Error('Seat base not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update seat base');
    }
  }

  // Delete seat base
  async deleteSeatBase(id: number) {
    try {
      const response = await api.delete(`/seat-bases/${id}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error deleting seat base:', error);
      if (error.response?.status === 404) {
        throw new Error('Seat base not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete seat base');
    }
  }

  // ========== SEAT BASE IMAGES MANAGEMENT ==========

  // Get images for a seat base
  async getSeatBaseImages(seatBaseId: number) {
    try {
      const response = await api.get(`/seat-bases/${seatBaseId}/images`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error fetching seat base images:', error);
      if (error.response?.status === 404) {
        throw new Error('Seat base not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch seat base images');
    }
  }

  // Upload images for a seat base
  async uploadSeatBaseImages(seatBaseId: number, data: {
    images: File[];
    alt_texts?: string[];
    captions?: string[];
    set_primary?: number;
  }) {
    try {
      const formData = new FormData();
      
      // Append images array
      data.images.forEach((image) => {
        formData.append('images[]', image);
      });
      
      // Append alt_texts array if provided
      if (data.alt_texts && data.alt_texts.length > 0) {
        data.alt_texts.forEach((altText) => {
          formData.append('alt_texts[]', altText);
        });
      }
      
      // Append captions array if provided
      if (data.captions && data.captions.length > 0) {
        data.captions.forEach((caption) => {
          formData.append('captions[]', caption);
        });
      }
      
      // Append set_primary if provided
      if (data.set_primary !== undefined) {
        formData.append('set_primary', data.set_primary.toString());
      }
      
      const response = await api.post(`/seat-bases/${seatBaseId}/images`, formData, {
        headers: {
          'Content-Type': undefined,
        },
      });
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error uploading seat base images:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload images');
    }
  }

  // Update a specific image
  async updateSeatBaseImage(seatBaseId: number, imageId: number, data: {
    alt_text?: string;
    caption?: string;
  }) {
    try {
      const formData = new FormData();
      if (data.alt_text !== undefined) formData.append('alt_text', data.alt_text);
      if (data.caption !== undefined) formData.append('caption', data.caption);
      
      const response = await api.put(`/seat-bases/${seatBaseId}/images/${imageId}`, formData, {
        headers: {
          'Content-Type': undefined,
        },
      });
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error updating seat base image:', error);
      if (error.response?.status === 404) {
        throw new Error('Image not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update image');
    }
  }

  // Delete a specific image
  async deleteSeatBaseImage(seatBaseId: number, imageId: number) {
    try {
      const response = await api.delete(`/seat-bases/${seatBaseId}/images/${imageId}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error deleting seat base image:', error);
      if (error.response?.status === 404) {
        throw new Error('Image not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete image');
    }
  }

  // Set primary image
  async setPrimarySeatBaseImage(seatBaseId: number, imageId: number) {
    try {
      const response = await api.put(`/seat-bases/${seatBaseId}/images/${imageId}/set-primary`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error setting primary seat base image:', error);
      if (error.response?.status === 404) {
        throw new Error('Image not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to set primary image');
    }
  }
}

export const seatBaseApi = new SeatBaseApi();

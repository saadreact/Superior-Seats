import api from '../utils/axios';

// Seat Stitch Pattern API Service
class SeatStitchPatternService {
  // Get seat stitch patterns
  async getSeatStitchPatterns(params?: Record<string, any>) {
    try {
      const response = await api.get('/seat-stitch-patterns', { params });
      
      // Handle different response structures similar to Products API
      if (response.data && response.data.data) {
        return response.data;
      } else if (response.data) {
        return { data: response.data, meta: response.data.meta || {} };
      }
      return { data: [], meta: {} };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch seat stitch patterns');
    }
  }

  // Get single seat stitch pattern
  async getSeatStitchPattern(id: number) {
    try {
      const response = await api.get(`/seat-stitch-patterns/${id}`);
      return response.data?.data?.seat_stitch_pattern || response.data?.seat_stitch_pattern || response.data?.data || response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Seat stitch pattern not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch seat stitch pattern');
    }
  }

  // Create seat stitch pattern
  async createSeatStitchPattern(data: {
    name: string;
    description?: string;
    static_pattern_id: string; // Format: "modelId-patternNum" (e.g., "1-2")
    image: File;
    cost: number;
    price: number;
    price_tier_ids: number[];
    price_adjustments?: Record<string, number>;
    color_ids?: number[];
  }) {
    try {
      // Check if we have an image file to determine if we need FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        formData.append('static_pattern_id', data.static_pattern_id);
        formData.append('cost', data.cost.toString());
        formData.append('price', data.price.toString());
        
        // Append single image (not as array) - seat stitch patterns have only one image
        formData.append('image', data.image);
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }

        // Append price adjustments
        if (data.price_adjustments) {
          Object.entries(data.price_adjustments).forEach(([tierId, adjustment]) => {
            formData.append(`price_adjustments[${tierId}]`, adjustment.toString());
          });
        }

        // Append color IDs as array
        if (data.color_ids && Array.isArray(data.color_ids)) {
          data.color_ids.forEach(id => {
            formData.append('color_ids[]', id.toString());
          });
        }

        const response = await api.post('/seat-stitch-patterns', formData, {
          headers: {
            // Don't set Content-Type for FormData - let browser set it with boundary
            'Content-Type': undefined, // Explicitly remove Content-Type to let browser set it
          },
        });
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else if (response.data) {
          return response.data;
        }
        return response.data;
      } else {
        // Fallback to JSON if no image
        const jsonData = {
          name: data.name,
          description: data.description,
          cost: data.cost,
          price: data.price,
          price_tier_ids: data.price_tier_ids,
          price_adjustments: data.price_adjustments,
          color_ids: data.color_ids
        };
        const response = await api.post('/seat-stitch-patterns', jsonData);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create seat stitch pattern');
    }
  }

  // Update seat stitch pattern
  async updateSeatStitchPattern(id: number, data: {
    name?: string;
    description?: string;
    static_pattern_id?: string; // Format: "modelId-patternNum" (e.g., "1-2")
    image?: File | null;
    cost?: number;
    price?: number;
    price_tier_ids?: number[];
    price_adjustments?: Record<string, number>;
    color_ids?: number[];
  }) {
    try {
      // Check if we have an image file to determine if we need FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.static_pattern_id) formData.append('static_pattern_id', data.static_pattern_id);
        if (data.cost !== undefined) formData.append('cost', data.cost.toString());
        if (data.price !== undefined) formData.append('price', data.price.toString());
        
        // Append single image (not as array) - seat stitch patterns have only one image
        formData.append('image', data.image);
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }

        // Append price adjustments
        if (data.price_adjustments) {
          Object.entries(data.price_adjustments).forEach(([tierId, adjustment]) => {
            formData.append(`price_adjustments[${tierId}]`, adjustment.toString());
          });
        }

        // Append color IDs as array
        if (data.color_ids && Array.isArray(data.color_ids)) {
          data.color_ids.forEach(id => {
            formData.append('color_ids[]', id.toString());
          });
        }

        // Use POST with _method: PUT for FormData (Laravel convention)
        formData.append('_method', 'PUT');
        
        const response = await api.post(`/seat-stitch-patterns/${id}`, formData, {
          headers: {
            // Don't set Content-Type for FormData - let browser set it with boundary
            'Content-Type': undefined, // Explicitly remove Content-Type to let browser set it
          },
        });
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else if (response.data) {
          return response.data;
        }
        return response.data;
      } else {
        // Fallback to JSON if no image
        const jsonData: any = {
          name: data.name,
          description: data.description,
          cost: data.cost,
          price: data.price,
          price_tier_ids: data.price_tier_ids,
          price_adjustments: data.price_adjustments,
          color_ids: data.color_ids
        };
        if (data.static_pattern_id) {
          jsonData.static_pattern_id = data.static_pattern_id;
        }
        const response = await api.put(`/seat-stitch-patterns/${id}`, jsonData);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Seat stitch pattern not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update seat stitch pattern');
    }
  }

  // Delete seat stitch pattern
  async deleteSeatStitchPattern(id: number) {
    try {
      const response = await api.delete(`/seat-stitch-patterns/${id}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Seat stitch pattern not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete seat stitch pattern');
    }
  }

  // Get price tiers (used by seat stitch pattern forms)
  async getPriceTiers(params?: Record<string, any>) {
    try {
      const response = await api.get('/price-tiers', { params });
      return response.data?.data || response.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch price tiers');
    }
  }
}

// Export singleton instance
export const seatStitchPatternService = new SeatStitchPatternService();
export default seatStitchPatternService;

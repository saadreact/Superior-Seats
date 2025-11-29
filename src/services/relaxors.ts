import api from '../utils/axios';

// Relaxors API Service
class RelaxorsService {
  // Get relaxors
  async getRelaxors(params?: Record<string, any>) {
    try {
      const response = await api.get('/relaxors', { params });
      
      // Handle different response structures similar to Products API
      if (response.data && response.data.data) {
        return response.data;
      } else if (response.data) {
        return { data: response.data, meta: response.data.meta || {} };
      }
      return { data: [], meta: {} };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch relaxors');
    }
  }

  // Get single relaxor
  async getRelaxor(id: number) {
    try {
      const response = await api.get(`/relaxors/${id}`);
      return response.data?.data?.relaxor || response.data?.relaxor || response.data?.data || response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Relaxor not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch relaxor');
    }
  }

  // Create relaxor
  async createRelaxor(data: {
    name: string;
    description?: string;
    image?: File | null;
    cost: number;
    price: number;
    price_tier_ids: number[];
    price_adjustments?: Record<string, number>;
  }) {
    try {
      // Check if we have an image file to determine if we need FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        formData.append('cost', data.cost.toString());
        formData.append('price', data.price.toString());
        
        // Append single image (not as array) - relaxors have only one image
        formData.append('image', data.image);
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }
        
        // Append price adjustments
        if (data.price_adjustments && typeof data.price_adjustments === 'object') {
          Object.entries(data.price_adjustments).forEach(([tierId, price]) => {
            formData.append(`price_adjustments[${tierId}]`, price.toString());
          });
        }

        const response = await api.post('/relaxors', formData, {
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
          price_adjustments: data.price_adjustments
        };
        const response = await api.post('/relaxors', jsonData);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create relaxor');
    }
  }

  // Update relaxor
  async updateRelaxor(id: number, data: {
    name?: string;
    description?: string;
    image?: File | null;
    cost?: number;
    price?: number;
    price_tier_ids?: number[];
    price_adjustments?: Record<string, number>;
    current_image?: string;
  }) {
    try {
      // Check if we have an image file to determine if we need FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        if (data.cost !== undefined) formData.append('cost', data.cost.toString());
        if (data.price !== undefined) formData.append('price', data.price.toString());
        
        // Append single image (not as array) - relaxors have only one image
        formData.append('image', data.image);
        
        // Include current image path if no new image is selected
        if (data.current_image) formData.append('current_image', data.current_image);
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }
        
        // Append price adjustments
        if (data.price_adjustments && typeof data.price_adjustments === 'object') {
          Object.entries(data.price_adjustments).forEach(([tierId, price]) => {
            formData.append(`price_adjustments[${tierId}]`, price.toString());
          });
        }

        // Use POST with _method: PUT for FormData (Laravel convention)
        formData.append('_method', 'PUT');
        
        const response = await api.post(`/relaxors/${id}`, formData, {
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
          current_image: data.current_image
        };
        const response = await api.put(`/relaxors/${id}`, jsonData);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Relaxor not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update relaxor');
    }
  }

  // Delete relaxor
  async deleteRelaxor(id: number) {
    try {
      const response = await api.delete(`/relaxors/${id}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Relaxor not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete relaxor');
    }
  }

  // Get price tiers (used by relaxor forms)
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
export const relaxorsService = new RelaxorsService();
export default relaxorsService;


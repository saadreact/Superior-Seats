import api from '../utils/axios';

// Recline Types API Service
class ReclineTypesService {
  // Get recline types
  async getReclineTypes(params?: Record<string, any>) {
    try {
      const response = await api.get('/recline-types', { params });
      
      // Handle different response structures similar to Products API
      if (response.data && response.data.data) {
        return response.data;
      } else if (response.data) {
        return { data: response.data, meta: response.data.meta || {} };
      }
      return { data: [], meta: {} };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recline types');
    }
  }

  // Get single recline type
  async getReclineType(id: number) {
    try {
      const response = await api.get(`/recline-types/${id}`);
      return response.data?.data?.recline_type || response.data?.recline_type || response.data?.data || response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Recline type not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch recline type');
    }
  }

  // Create recline type
  async createReclineType(data: {
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
        
        // Append single image (not as array) - recline types have only one image
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

        const response = await api.post('/recline-types', formData, {
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
        const response = await api.post('/recline-types', jsonData);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create recline type');
    }
  }

  // Update recline type
  async updateReclineType(id: number, data: {
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
        
        // Append single image (not as array) - recline types have only one image
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
        
        const response = await api.post(`/recline-types/${id}`, formData, {
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
        const response = await api.put(`/recline-types/${id}`, jsonData);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Recline type not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update recline type');
    }
  }

  // Delete recline type
  async deleteReclineType(id: number) {
    try {
      const response = await api.delete(`/recline-types/${id}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Recline type not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete recline type');
    }
  }

  // Get price tiers (used by recline type forms)
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
export const reclineTypesService = new ReclineTypesService();
export default reclineTypesService;

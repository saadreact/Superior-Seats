import api from '../utils/axios';

// Recline Types API Service
class ReclineTypesService {
  // Get recline types
  async getReclineTypes(params?: Record<string, any>) {
    try {
      const response = await api.get('/recline-types', { params });
      // Handle nested data structure: response.data.data.data
      return response.data?.data?.data || response.data?.data || response.data || [];
    } catch (error: any) {
      console.error('Error fetching recline types:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch recline types');
    }
  }

  // Get single recline type
  async getReclineType(id: number) {
    try {
      const response = await api.get(`/recline-types/${id}`);
      return response.data?.data?.recline_type || response.data?.recline_type || response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error fetching recline type:', error);
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
    price_tier_ids: number[];
  }) {
    try {
      // Check if we have an image file to determine if we need FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        
        // Append single image (not as array) - recline types have only one image
        formData.append('image', data.image);
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }

        // Debug: Log FormData contents
        console.log('Recline Type FormData being sent:');
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`${key}: ${value}`);
          }
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
        const response = await api.post('/recline-types', data);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      console.error('Error creating recline type:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(error.response?.data?.message || 'Failed to create recline type');
    }
  }

  // Update recline type
  async updateReclineType(id: number, data: {
    name?: string;
    description?: string;
    image?: File | null;
    price_tier_ids?: number[];
  }) {
    try {
      // Check if we have an image file to determine if we need FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        
        // Append single image (not as array) - recline types have only one image
        formData.append('image', data.image);
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }

        // Use POST with _method: PUT for FormData (Laravel convention)
        formData.append('_method', 'PUT');
        
        // Debug: Log FormData contents
        console.log('Recline Type Update FormData being sent:');
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
        
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
        const response = await api.put(`/recline-types/${id}`, data);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      console.error('Error updating recline type:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
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
      console.error('Error deleting recline type:', error);
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
      console.error('Error fetching price tiers:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch price tiers');
    }
  }
}

// Export singleton instance
export const reclineTypesService = new ReclineTypesService();
export default reclineTypesService;

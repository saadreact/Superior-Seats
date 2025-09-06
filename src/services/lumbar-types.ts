import api from '../utils/axios';

// Lumbar Types API Service
class LumbarTypesService {
  // Get lumbar types
  async getLumbarTypes(params?: Record<string, any>) {
    try {
      const response = await api.get('/lumbar-types', { params });
      // Handle nested data structure: response.data.data.data
      return response.data?.data?.data || response.data?.data || response.data || [];
    } catch (error: any) {
      console.error('Error fetching lumbar types:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch lumbar types');
    }
  }

  // Get single lumbar type
  async getLumbarType(id: number) {
    try {
      const response = await api.get(`/lumbar-types/${id}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error fetching lumbar type:', error);
      if (error.response?.status === 404) {
        throw new Error('Lumbar type not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch lumbar type');
    }
  }

  // Create lumbar type
  async createLumbarType(data: {
    name: string;
    description?: string;
    image: File;
    price_tier_ids: number[];
  }) {
    try {
      // Check if we have an image file to determine if we need FormData
      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) formData.append('description', data.description);
        
        // Append single image (not as array) - lumbar types have only one image
        formData.append('image', data.image);
        
        // Append price tier IDs as array
        if (data.price_tier_ids && Array.isArray(data.price_tier_ids)) {
          data.price_tier_ids.forEach(id => {
            formData.append('price_tier_ids[]', id.toString());
          });
        }

        // Debug: Log FormData contents
        console.log('Lumbar Type FormData being sent:');
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
        
        const response = await api.post('/lumbar-types', formData, {
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
        const response = await api.post('/lumbar-types', data);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      console.error('Error creating lumbar type:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(error.response?.data?.message || 'Failed to create lumbar type');
    }
  }

  // Update lumbar type
  async updateLumbarType(id: number, data: {
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
        
        // Append single image (not as array) - lumbar types have only one image
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
        console.log('Lumbar Type Update FormData being sent:');
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
        
        const response = await api.post(`/lumbar-types/${id}`, formData, {
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
        const response = await api.put(`/lumbar-types/${id}`, data);
        return response.data?.data || response.data;
      }
    } catch (error: any) {
      console.error('Error updating lumbar type:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      if (error.response?.status === 404) {
        throw new Error('Lumbar type not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to update lumbar type');
    }
  }

  // Delete lumbar type
  async deleteLumbarType(id: number) {
    try {
      const response = await api.delete(`/lumbar-types/${id}`);
      return response.data?.data || response.data;
    } catch (error: any) {
      console.error('Error deleting lumbar type:', error);
      if (error.response?.status === 404) {
        throw new Error('Lumbar type not found');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete lumbar type');
    }
  }

  // Get price tiers (used by lumbar type forms)
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
export const lumbarTypesService = new LumbarTypesService();
export default lumbarTypesService;
